import { CreateCollectionType } from '../types/createCollection';
import { AccountId, PrivateKey, TokenCreateTransaction, TokenType } from '@hashgraph/sdk';
import errors from '../dictionary/errors.json';

export const createCollectionFunction = async ({
  client,
  myPrivateKey,
  collectionName,
  collectionSymbol,
  keys,
  treasuryAccount,
  maxSupply,
  customFees,
}: CreateCollectionType): Promise<string | undefined> => {
  if (!client) throw new Error(errors.clientRequired);
  if (!myPrivateKey) throw new Error(errors.myPrivateKeyRequired);
  if (!collectionName) throw new Error(errors.collectionNameRequired);
  if (!collectionSymbol) throw new Error(errors.collectionSymbolRequired);

  const treasuryAccountId = AccountId.fromString(treasuryAccount);
  const treasuryKey = PrivateKey.fromString(myPrivateKey);

  let transaction = new TokenCreateTransaction()
    .setTokenName(collectionName)
    .setTokenSymbol(collectionSymbol)
    .setTokenType(TokenType.NonFungibleUnique)
    .setSupplyKey(keys.supply)
    .setTreasuryAccountId(treasuryAccountId);

  if (keys.admin) {
    transaction = transaction.setAdminKey(keys.admin);
  }

  if (keys.KYC) {
    transaction = transaction.setKycKey(keys.KYC);
  }

  if (keys.freeze) {
    transaction = transaction.setFreezeKey(keys.freeze);
  }

  if (keys.wipe) {
    transaction = transaction.setWipeKey(keys.wipe);
  }

  if (keys.feeSchedule) {
    transaction = transaction.setFeeScheduleKey(keys.feeSchedule);
  }

  if (keys.pause) {
    transaction = transaction.setPauseKey(keys.pause);
  }

  if (maxSupply) {
    transaction = transaction.setMaxSupply(maxSupply);
  }

  if (customFees) {
    transaction = transaction.setCustomFees(customFees);
  }

  transaction = transaction.freezeWith(client);

  const signTx = await (await transaction.sign(<PrivateKey>keys.admin)).sign(treasuryKey);
  const txResponse = await signTx.execute(client);

  const receipt = await txResponse.getReceipt(client);

  return receipt.tokenId?.toString() || undefined;
};
