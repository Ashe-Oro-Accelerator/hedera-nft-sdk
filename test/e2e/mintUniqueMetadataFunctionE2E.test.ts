import { nftSDK } from './e2eConsts';
import { beforeEach } from 'node:test';
import { HederaNFTSDK } from '../../src/HederaNFTSDK';
import { myAccountId, myPrivateKey } from '../__mocks__/consts';
import errors from '../../src/dictionary/errors.json';
import { PrivateKey } from '@hashgraph/sdk';

beforeEach(async () => {
  new HederaNFTSDK(myAccountId, myPrivateKey);
});

afterAll(async () => {
  nftSDK.client.close();
});

describe('mintUniqueMetadata function e2e', () => {
  it('Mints unique metadata from csv with one line and commas', async () => {
    const tokenId = await nftSDK.createCollection('test_name', 'test_symbol');
    const transactionStatus = await nftSDK.mintUniqueMetadata(
      tokenId,
      2,
      'test/__mocks__/testOneLine.csv',
      PrivateKey.fromString(myPrivateKey)
    );

    expect(tokenId).toBeDefined();
    expect(transactionStatus).toBeDefined();
    expect(transactionStatus).toEqual(['https://www.youtube.com1', 'https://www.youtube.com2']);
  }, 25000);

  it('Mints unique metadata from csv with rows', async () => {
    const tokenId = await nftSDK.createCollection('test_name', 'test_symbol');
    const transactionStatus = await nftSDK.mintUniqueMetadata(
      tokenId,
      2,
      'test/__mocks__/testRows.csv',
      PrivateKey.fromString(myPrivateKey)
    );

    expect(tokenId).toBeDefined();
    expect(transactionStatus).toBeDefined();
    expect(transactionStatus).toEqual(['https://www.youtube.com1', 'https://www.youtube.com2']);
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

  it('throws an error when invalid private key is provided', async () => {
    const tokenId = await nftSDK.createCollection('test_name', 'test_symbol');

    await expect(
      nftSDK.mintUniqueMetadata(
        tokenId,
        2,
        'test/__mocks__/testRows.csv',
        PrivateKey.fromString('invalidPrivateKey')
      )
    ).rejects.toThrow(errors.mintingError);
  });
});
