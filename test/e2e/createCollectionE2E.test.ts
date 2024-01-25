import { PrivateKey } from '@hashgraph/sdk';
import { nftSDK, secondAccountId, secondPrivateKey } from './e2eConsts';
import { beforeEach } from 'node:test';
import { HederaNFTSDK } from '../../src/HederaNFTSDK';
import { myAccountId, myPrivateKey } from '../__mocks__/consts';
import { getTokenInfo } from '../../src/utils/hedera/utils';

beforeEach(async () => {
  new HederaNFTSDK(myAccountId, myPrivateKey);
});

afterAll(async () => {
  nftSDK.client.close();
});

describe('createCollectionFunction e2e', () => {
  it('creates a collection', async () => {
    const tokenId = await nftSDK.createCollection('test_name', 'test_symbol');

    expect(tokenId).toBeDefined();
  });

  it('creates a collection with Admin Key', async () => {
    const adminKey = PrivateKey.generateED25519();
    const tokenId = await nftSDK.createCollection('test_name_admin', 'test_symbol_admin', undefined, undefined, {
      admin: adminKey,
    });

    const tokenInfo = await getTokenInfo(tokenId, nftSDK.client);

    expect(tokenId).toBeDefined();
    expect(tokenInfo.adminKey?.toString()).toEqual(adminKey.publicKey.toStringDer());
  });

  it('creates a collection with different treasury account', async () => {
    const tokenId = await nftSDK.createCollection(
      'test_name_treasury',
      'test_symbol_treasury',
      secondPrivateKey,
      secondAccountId
    );

    const tokenInfo = await getTokenInfo(tokenId, nftSDK.client);

    expect(tokenId).toBeDefined();
    expect(tokenInfo.treasuryAccountId?.toString()).toEqual(secondAccountId);
  });
});
