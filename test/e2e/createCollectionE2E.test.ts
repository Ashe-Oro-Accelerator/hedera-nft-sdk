import { PrivateKey, TokenId, TokenInfoQuery } from "@hashgraph/sdk";
import { nftSDK, secondAccountId, secondPrivateKey } from "./e2eConsts";

afterAll(async () => {
  nftSDK.client.close();
});

describe('createCollectionFunction e2e', () => {
  it('creates a collection', async () => {
    const tokenId = await nftSDK.createCollection('test', 'test2');

    expect(tokenId).toBeDefined();
  });

  it('creates a collection with Admin Key', async () => {
    const adminKey = PrivateKey.generateED25519();
    const tokenId = await nftSDK.createCollection('test', 'test2', undefined, undefined, { admin: adminKey });

    const tokenInfo = await getTokenInfo(tokenId);

    expect(tokenId).toBeDefined();
    expect(tokenInfo.adminKey?.toString()).toEqual(adminKey.publicKey.toStringDer());
  });

  it('creates a collection with different treasury account', async () => {
    const tokenId = await nftSDK.createCollection('test', 'test2', secondPrivateKey, secondAccountId);

    const tokenInfo = await getTokenInfo(tokenId);

    expect(tokenId).toBeDefined();
    expect(tokenInfo.treasuryAccountId?.toString()).toEqual(secondAccountId);
  });
});

async function getTokenInfo(tokenId: string) {
  const query = new TokenInfoQuery()
    .setTokenId(TokenId.fromString(tokenId));

  return await query.execute(nftSDK.client);
}

