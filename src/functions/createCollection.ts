import { CreateCollectionType } from '../types/createCollection';
import {
  AccountId,
  PrivateKey,
  TokenCreateTransaction,
  TokenSupplyType,
  TokenType,
} from '@hashgraph/sdk';
import { dictionary } from '../utils/constants/dictionary';
import { validatePropsForCreateCollection } from '../utils/validateProps';

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
  validatePropsForCreateCollection({
    client,
    collectionName,
    collectionSymbol,
    treasuryAccount,
    treasuryAccountPrivateKey,
    customFees,
  });

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
    throw new Error(dictionary.createCollection.collectionNotCreated);
  }

  return receipt.tokenId.toString();
};
