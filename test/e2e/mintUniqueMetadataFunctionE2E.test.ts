import { nftSDK, operatorPrivateKey } from './e2eConsts';
import { longE2ETimeout, pathToOneLineCSV, pathToRowCSV } from '../__mocks__/consts';
import { NftId, PrivateKey, TokenId, TokenNftInfoQuery } from '@hashgraph/sdk';
import { dictionary } from '../../src/utils/constants/dictionary';

afterAll(async () => {
  nftSDK.client.close();
});

describe('mintUniqueMetadata function e2e', () => {
  it(
    'Mints unique metadata from csv with one line and commas',
    async () => {
      const tokenId = await nftSDK.createCollection({
        collectionName: 'test_name',
        collectionSymbol: 'test_symbol',
      });
      const mintedMetadata = await nftSDK.mintUniqueMetadata({
        tokenId,
        batchSize: 2,
        supplyKey: PrivateKey.fromString(operatorPrivateKey),
        pathToMetadataURIsFile: pathToOneLineCSV,
      });

      expect(tokenId).toBeDefined();
      expect(mintedMetadata).toBeDefined();
      expect(mintedMetadata).toEqual([
        { content: 'https://www.youtube.com1', serialNumber: expect.any(Number) },
        { content: 'https://www.youtube.com2', serialNumber: expect.any(Number) },
      ]);

      for (const [index, metaData] of mintedMetadata.entries()) {
        const nftInfos = await new TokenNftInfoQuery()
          .setNftId(new NftId(TokenId.fromString(tokenId), metaData.serialNumber))
          .execute(nftSDK.client);

        expect(nftInfos[0].metadata!.toString()).toEqual(`https://www.youtube.com${index + 1}`);
      }
    },
    longE2ETimeout
  );

  it(
    'Mints unique metadata from csv with rows',
    async () => {
      const tokenId = await nftSDK.createCollection({
        collectionName: 'test_name',
        collectionSymbol: 'test_symbol',
      });
      const mintedMetadata = await nftSDK.mintUniqueMetadata({
        tokenId,
        batchSize: 2,
        supplyKey: PrivateKey.fromString(operatorPrivateKey),
        pathToMetadataURIsFile: pathToRowCSV,
      });

      expect(tokenId).toBeDefined();
      expect(mintedMetadata).toBeDefined();
      expect(mintedMetadata).toEqual([
        { content: 'https://www.youtube.com1', serialNumber: expect.any(Number) },
        { content: 'https://www.youtube.com2', serialNumber: expect.any(Number) },
      ]);
      for (const [index, metaData] of mintedMetadata.entries()) {
        const nftInfos = await new TokenNftInfoQuery()
          .setNftId(new NftId(TokenId.fromString(tokenId), metaData.serialNumber))
          .execute(nftSDK.client);

        expect(nftInfos[0].metadata!.toString()).toEqual(`https://www.youtube.com${index + 1}`);
      }
    },
    longE2ETimeout
  );

  it(
    'Mints unique metadata from metadata array props',
    async () => {
      const tokenId = await nftSDK.createCollection({
        collectionName: 'test_name',
        collectionSymbol: 'test_symbol',
      });
      const mintedMetadata = await nftSDK.mintUniqueMetadata({
        tokenId,
        batchSize: 2,
        supplyKey: PrivateKey.fromString(operatorPrivateKey),
        metadata: ['https://www.youtube.com1', 'https://www.youtube.com2'],
      });

      expect(tokenId).toBeDefined();
      expect(mintedMetadata).toBeDefined();
      expect(mintedMetadata).toEqual([
        { content: 'https://www.youtube.com1', serialNumber: expect.any(Number) },
        { content: 'https://www.youtube.com2', serialNumber: expect.any(Number) },
      ]);
      for (const [index, metaData] of mintedMetadata.entries()) {
        const nftInfos = await new TokenNftInfoQuery()
          .setNftId(new NftId(TokenId.fromString(tokenId), metaData.serialNumber))
          .execute(nftSDK.client);

        expect(nftInfos[0].metadata!.toString()).toEqual(`https://www.youtube.com${index + 1}`);
      }
    },
    longE2ETimeout
  );

  it('throws an error when invalid token ID is provided', async () => {
    const invalidTokenId = 'invalidTokenId';

    await expect(
      nftSDK.mintUniqueMetadata({
        tokenId: invalidTokenId,
        batchSize: 2,
        supplyKey: PrivateKey.fromString(operatorPrivateKey),
        pathToMetadataURIsFile: pathToRowCSV,
      })
    ).rejects.toThrow(dictionary.hederaActions.mintingError);
  });
});
