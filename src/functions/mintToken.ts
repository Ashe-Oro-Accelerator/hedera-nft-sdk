import { Client, Hbar, PrivateKey, TokenMintTransaction } from '@hashgraph/sdk';
import { mintingMaxTransactionFee } from '../utils/const';
import { dictionary } from '../utils/constants/dictionary';

export async function mintToken(
  metaData: string[],
  tokenId: string,
  supplyKey: PrivateKey,
  client: Client
) {
  const CIDs = metaData.map((metaData) => Buffer.from(metaData));

  if (CIDs.some((cid) => cid.toString().length > 100)) {
    throw new Error(dictionary.mintToken.tooLongCID);
  }

  const transaction = new TokenMintTransaction()
    .setTokenId(tokenId)
    .setMaxTransactionFee(new Hbar(mintingMaxTransactionFee))
    .setMetadata(CIDs)
    .freezeWith(client);

  const signTx = await transaction.sign(supplyKey);

  const txResponse = await signTx.execute(client);

  return await txResponse.getReceipt(client);
}
