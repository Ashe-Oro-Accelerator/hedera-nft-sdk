import { PrivateKey } from '@hashgraph/sdk';
import { getTokenInfo } from '../../src/utils/hedera/getTokenInfo';
import { LONG_E2E_TIMEOUT } from '../__mocks__/consts';
import { nftSDK, secondAccountId, secondPrivateKey } from './e2eConsts';

afterAll(async () => {
  nftSDK.client.close();
});

describe('createCollectionFunction e2e', () => {
  it('creates a collection', async () => {
    const tokenId = await nftSDK.createCollection({
      collectionName: 'test_name',
      collectionSymbol: 'test_symbol',
    });

    expect(tokenId).toBeDefined();
  });

  it(
    'creates a collection with Admin Key',
    async () => {
      const adminKey = PrivateKey.generateED25519();
      const tokenId = await nftSDK.createCollection({
        collectionName: 'test_name_admin',
        collectionSymbol: 'test_symbol_admin',
        keys: {
          admin: adminKey,
        },
      });

      const tokenInfo = await getTokenInfo(tokenId, nftSDK.client);

      expect(tokenId).toBeDefined();
      expect(tokenInfo.adminKey?.toString()).toEqual(adminKey.publicKey.toStringDer());
    },
    LONG_E2E_TIMEOUT
  );

  it('creates a collection with different treasury account', async () => {
    const tokenId = await nftSDK.createCollection({
      collectionName: 'test_name_treasury',
      collectionSymbol: 'test_symbol_treasury',
      treasuryAccountPrivateKey: secondPrivateKey,
      treasuryAccount: secondAccountId,
    });

    const tokenInfo = await getTokenInfo(tokenId, nftSDK.client);

    expect(tokenId).toBeDefined();
    expect(tokenInfo.treasuryAccountId?.toString()).toEqual(secondAccountId);
  });
});
