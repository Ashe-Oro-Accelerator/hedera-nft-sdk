import { NftId, PrivateKey, TokenId, TokenNftInfoQuery } from '@hashgraph/sdk';
import { nftSDK, operatorPrivateKey } from './e2eConsts';
import { LONG_E2E_TIMEOUT } from '../__mocks__/consts';

afterAll(async () => {
  nftSDK.client.close();
});

describe('mintSharedMetadata function e2e', () => {
  const testCases = [{ amount: 1 }, { amount: 3 }, { amount: 10 }];

  testCases.forEach(({ amount }) => {
    it(
      `Creating a token and minting ${amount} NFTs into it`,
      async () => {
        const tokenId = await nftSDK.createCollection({
          collectionName: 'test_name',
          collectionSymbol: 'test_symbol',
        });
        const mintedMetadata = await nftSDK.mintSharedMetadata({
          tokenId,
          amount,
          batchSize: 2,
          metaData: 'www.youtube.com',
          supplyKey: PrivateKey.fromString(operatorPrivateKey),
        });

        expect(tokenId).toBeDefined();
        expect(mintedMetadata).toBeDefined();
        expect(mintedMetadata).toHaveLength(amount);
        expect(mintedMetadata).toEqual(
          expect.arrayContaining(
            Array(amount).fill({
              content: 'www.youtube.com',
              serialNumber: expect.any(Number),
            })
          )
        );

        for (const metaData of mintedMetadata) {
          const nftInfos = await new TokenNftInfoQuery()
            .setNftId(new NftId(TokenId.fromString(tokenId), metaData.serialNumber))
            .execute(nftSDK.client);

          expect(nftInfos[0].metadata!.toString()).toEqual('www.youtube.com');
        }
      },
      LONG_E2E_TIMEOUT
    );
  });

  it(
    `Creating a token and minting 1 NFTs into it with default supplyKey`,
    async () => {
      const tokenId = await nftSDK.createCollection({
        collectionName: 'test_name',
        collectionSymbol: 'test_symbol',
      });
      const mintedMetadata = await nftSDK.mintSharedMetadata({
        tokenId,
        amount: 1,
        batchSize: 2,
        metaData: 'www.youtube.com',
      });

      expect(tokenId).toBeDefined();
      expect(mintedMetadata).toBeDefined();
      expect(mintedMetadata).toHaveLength(1);
      expect(mintedMetadata).toEqual(
        expect.arrayContaining(
          Array(1).fill({
            content: 'www.youtube.com',
            serialNumber: expect.any(Number),
          })
        )
      );

      for (const metaData of mintedMetadata) {
        const nftInfos = await new TokenNftInfoQuery()
          .setNftId(new NftId(TokenId.fromString(tokenId), metaData.serialNumber))
          .execute(nftSDK.client);

        expect(nftInfos[0].metadata!.toString()).toEqual('www.youtube.com');
      }
    },
    LONG_E2E_TIMEOUT
  );

  it(
    `Creating a token and minting 8 NFTs into it with batchSize 5`,
    async () => {
      const tokenId = await nftSDK.createCollection({
        collectionName: 'test_name',
        collectionSymbol: 'test_symbol',
      });
      const mintedMetadata = await nftSDK.mintSharedMetadata({
        tokenId,
        amount: 1,
        batchSize: 5,
        metaData: 'www.youtube.com',
      });

      expect(tokenId).toBeDefined();
      expect(mintedMetadata).toBeDefined();
      expect(mintedMetadata).toHaveLength(1);
      expect(mintedMetadata).toEqual(
        expect.arrayContaining(
          Array(1).fill({
            content: 'www.youtube.com',
            serialNumber: expect.any(Number),
          })
        )
      );

      for (const metaData of mintedMetadata) {
        const nftInfos = await new TokenNftInfoQuery()
          .setNftId(new NftId(TokenId.fromString(tokenId), metaData.serialNumber))
          .execute(nftSDK.client);

        expect(nftInfos[0].metadata!.toString()).toEqual('www.youtube.com');
      }
    },
    LONG_E2E_TIMEOUT
  );
});
