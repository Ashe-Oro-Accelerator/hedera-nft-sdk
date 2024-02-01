import { nftSDK } from './e2eConsts';
import { beforeEach } from 'node:test';
import { HederaNFTSDK } from '../../src/HederaNFTSDK';
import { myAccountId, myPrivateKey } from '../__mocks__/consts';
import errors from '../../src/dictionary/errors.json';
import { NftId, PrivateKey, TokenId, TokenNftInfoQuery } from '@hashgraph/sdk';

beforeEach(async () => {
  new HederaNFTSDK(myAccountId, myPrivateKey);
});

afterAll(async () => {
  nftSDK.client.close();
});

describe('mintUniqueMetadata function e2e', () => {
  it('Mints unique metadata from csv with one line and commas', async () => {
    const tokenId = await nftSDK.createCollection('test_name', 'test_symbol');
    const mintedMetadata = await nftSDK.mintUniqueMetadata(
      tokenId,
      2,
      'test/__mocks__/testOneLine.csv',
      PrivateKey.fromString(myPrivateKey)
    );

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
  }, 25000);

  it('Mints unique metadata from csv with rows', async () => {
    const tokenId = await nftSDK.createCollection('test_name', 'test_symbol');
    const mintedMetadata = await nftSDK.mintUniqueMetadata(
      tokenId,
      2,
      'test/__mocks__/testRows.csv',
      PrivateKey.fromString(myPrivateKey)
    );

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
  }, 25000);

  it('throws an error when invalid token ID is provided', async () => {
    const invalidTokenId = 'invalidTokenId';

    await expect(
      nftSDK.mintUniqueMetadata(
        invalidTokenId,
        2,
        'test/__mocks__/testRows.csv',
        PrivateKey.fromString(myPrivateKey)
      )
    ).rejects.toThrow(errors.mintingError);
  });
});
