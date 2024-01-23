import { PrivateKey, TokenId, TokenInfoQuery } from "@hashgraph/sdk";
import { HederaNFTSDK } from "../../src/HederaNFTSDK";

const operatorAccountId = '0.0.417710';
const operatorPrivateKey = '302e020100300506032b6570042204200bdb5e21eb1be64d06cfb7a027bb2e4101d708b106e0cdcb0b1d4dd6bb5eadc9';

const secondAccountId = '0.0.417718';
const secondPrivateKey = '3030020100300706052b8104000a042204202ea61e091da90d0307f1bdfdaebc76ca890cdcab5d6852966ef39200c6e289bd';

const API_URL = 'https://testnet.mirrornode.hedera.com/api/v1/tokens/';
const nftSDK = new HederaNFTSDK(operatorAccountId, operatorPrivateKey);

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
    const adminKey = PrivateKey.generateED25519();
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

