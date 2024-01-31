import { Client, Hbar, PrivateKey, TokenMintTransaction } from '@hashgraph/sdk';
import { mintingMaxTransactionFee } from '../utils/const';

export async function tokenMinter(
  metaData: string[],
  tokenId: string,
  supplyKey: PrivateKey,
  client: Client
) {
  const CIDs = metaData.map((metaData) => Buffer.from(metaData));

  const transaction = new TokenMintTransaction()
    .setTokenId(tokenId)
    .setMaxTransactionFee(new Hbar(mintingMaxTransactionFee))
    .setMetadata(CIDs)
    .freezeWith(client);

  const signTx = await transaction.sign(supplyKey);

  const txResponse = await signTx.execute(client);

  const receipt = await txResponse.getReceipt(client);

  return receipt.status;
}
