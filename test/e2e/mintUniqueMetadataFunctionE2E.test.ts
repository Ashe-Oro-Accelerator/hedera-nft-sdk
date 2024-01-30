import { nftSDK } from './e2eConsts';
import { beforeEach } from 'node:test';
import { HederaNFTSDK } from '../../src/HederaNFTSDK';
import { myAccountId, myPrivateKey } from '../__mocks__/consts';
import errors from '../../src/dictionary/errors.json';

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
      3,
      2,
      'test/__mocks__/testOneLine.csv',
      myPrivateKey
    );

    expect(tokenId).toBeDefined();
    expect(transactionStatus).toBeDefined();
    expect(transactionStatus).toEqual([
      'https://www.youtube.com1',
      'https://www.youtube.com1',
      'https://www.youtube.com1',
      'https://www.youtube.com2',
      'https://www.youtube.com2',
      'https://www.youtube.com2',
    ]);
  }, 25000);

  it('Mints unique metadata from csv with rows', async () => {
    const tokenId = await nftSDK.createCollection('test_name', 'test_symbol');
    const transactionStatus = await nftSDK.mintUniqueMetadata(
      tokenId,
      3,
      2,
      'test/__mocks__/testRows.csv',
      myPrivateKey
    );

    expect(tokenId).toBeDefined();
    expect(transactionStatus).toBeDefined();
    expect(transactionStatus).toEqual([
      'https://www.youtube.com1',
      'https://www.youtube.com1',
      'https://www.youtube.com1',
      'https://www.youtube.com2',
      'https://www.youtube.com2',
      'https://www.youtube.com2',
    ]);
  }, 25000);

  it('throws an error when invalid token ID is provided', async () => {
    const invalidTokenId = 'invalidTokenId';

    await expect(
      nftSDK.mintUniqueMetadata(invalidTokenId, 3, 2, 'test/__mocks__/testRows.csv', myPrivateKey)
    ).rejects.toThrow(errors.mintingError);
  });

  it('throws an error when invalid private key is provided', async () => {
    const tokenId = await nftSDK.createCollection('test_name', 'test_symbol');

    await expect(
      nftSDK.mintUniqueMetadata(tokenId, 3, 2, 'test/__mocks__/testRows.csv', 'invalidPrivateKey')
    ).rejects.toThrow(errors.mintingError);
  });

  it('throws an error when invalid metadata parameters are provided', async () => {
    const tokenId = await nftSDK.createCollection('test_name', 'test_symbol');
    await expect(
      nftSDK.mintUniqueMetadata(
        tokenId,
        -1, // Invalid metadata parameter
        2,
        'test/__mocks__/testRows.csv',
        myPrivateKey
      )
    ).rejects.toThrow(errors.minAmount);

    await expect(
      nftSDK.mintUniqueMetadata(
        tokenId,
        3,
        -1, // Invalid metadata parameter
        'test/__mocks__/testRows.csv',
        myPrivateKey
      )
    ).rejects.toThrow(errors.minBuffer);
  });
});
