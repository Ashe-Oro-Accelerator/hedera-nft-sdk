import { Client, Hbar, PrivateKey, TokenMintTransaction } from '@hashgraph/sdk';

export async function tokenMinter(
  metaData: string[],
  tokenId: string,
  supplyKey: string,
  client: Client
) {
  const CIDs = metaData.map((metaData) => Buffer.from(metaData));

  const transaction = new TokenMintTransaction()
    .setTokenId(tokenId)
    .setMaxTransactionFee(new Hbar(20))
    .setMetadata(CIDs)
    .freezeWith(client);

  const signTx = await transaction.sign(PrivateKey.fromString(supplyKey));

  const txResponse = await signTx.execute(client);

  const receipt = await txResponse.getReceipt(client);

  return receipt.status;
}
