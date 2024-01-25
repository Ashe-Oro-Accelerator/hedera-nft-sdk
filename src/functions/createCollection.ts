import { CreateCollectionType } from '../types/createCollection';
import {
  AccountId,
  PrivateKey,
  TokenCreateTransaction,
  TokenSupplyType,
  TokenType,
} from '@hashgraph/sdk';
import errors from '../dictionary/errors.json';

export const createCollectionFunction = async ({
  client,
  myPrivateKey,
  collectionName,
  collectionSymbol,
  keys,
  treasuryAccount,
  treasuryAccountPrivateKey,
  maxSupply,
  customFees,
}: CreateCollectionType): Promise<string> => {
  if (!client) throw new Error(errors.clientRequired);
  if (!collectionName) throw new Error(errors.collectionNameRequired);
  if (!collectionSymbol) throw new Error(errors.collectionSymbolRequired);

  if (
    (treasuryAccount && !treasuryAccountPrivateKey) ||
    (!treasuryAccount && treasuryAccountPrivateKey)
  ) {
    throw new Error(errors.treasuryAccountPrivateKeySignRequired);
  }

  const treasuryAccountId = treasuryAccount
    ? AccountId.fromString(treasuryAccount)
    : client.getOperator()!.accountId;
  const treasuryAccountPrivateKeyId = treasuryAccountPrivateKey
    ? PrivateKey.fromString(treasuryAccountPrivateKey)
    : PrivateKey.fromString(myPrivateKey);

  let transaction = new TokenCreateTransaction()
    .setTokenName(collectionName)
    .setTokenSymbol(collectionSymbol)
    .setTokenType(TokenType.NonFungibleUnique)
    .setSupplyKey(keys?.supply || PrivateKey.fromString(myPrivateKey))
    .setTreasuryAccountId(treasuryAccountId);

  if (keys?.admin) {
    transaction = transaction.setAdminKey(keys?.admin);
  }

  if (keys?.KYC) {
    transaction = transaction.setKycKey(keys?.KYC);
  }

  if (keys?.freeze) {
    transaction = transaction.setFreezeKey(keys?.freeze);
  }

  if (keys?.wipe) {
    transaction = transaction.setWipeKey(keys?.wipe);
  }

  if (keys?.feeSchedule) {
    transaction = transaction.setFeeScheduleKey(keys?.feeSchedule);
  }

  if (keys?.pause) {
    transaction = transaction.setPauseKey(keys?.pause);
  }

  if (maxSupply) {
    transaction = transaction.setSupplyType(TokenSupplyType.Finite);
    transaction = transaction.setMaxSupply(maxSupply);
  }

  if (customFees) {
    transaction = transaction.setCustomFees(customFees);
  }

  transaction = transaction.freezeWith(client);

  let signTx = await transaction.sign(<PrivateKey>treasuryAccountPrivateKeyId);

  if (keys?.admin) {
    signTx = await transaction.sign(<PrivateKey>keys?.admin);
  }

  const txResponse = await signTx.execute(client);

  const receipt = await txResponse.getReceipt(client);

  if (!receipt.tokenId) {
    throw new Error(errors.collectionNotCreated);
  }

  return receipt.tokenId.toString();
};
