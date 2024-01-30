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

describe('mintSharedMetadata function e2e', () => {
  it('Creating a token and minting 1 NFT into it', async () => {
    const tokenId = await nftSDK.createCollection('test_name', 'test_symbol');
    const transactionStatus = await nftSDK.mintSharedMetadata(tokenId, 3, 2, 'www.youtube.com');

    expect(tokenId).toBeDefined();
    expect(transactionStatus).toBeDefined();
    expect(transactionStatus).toEqual(['www.youtube.com', 'www.youtube.com', 'www.youtube.com']);
  }, 25000);

  it('Creating a token with a different supply key and minting 1 NFT into it', async () => {
    const tokenId = await nftSDK.createCollection('test_name', 'test_symbol');
    const transactionStatus = await nftSDK.mintSharedMetadata(
      tokenId,
      1,
      2,
      'www.youtube.com',
      myPrivateKey
    );

    expect(tokenId).toBeDefined();
    expect(transactionStatus).toBeDefined();
    expect(transactionStatus).toEqual(['www.youtube.com']);
  }, 25000);

  it('Creating a token and minting 10 NFTs into it', async () => {
    const tokenId = await nftSDK.createCollection('test_name', 'test_symbol');
    const transactionStatus = await nftSDK.mintSharedMetadata(
      tokenId,
      10,
      5,
      'www.youtube.com',
      myPrivateKey
    );

    expect(tokenId).toBeDefined();
    expect(transactionStatus).toBeDefined();
    expect(transactionStatus).toEqual([
      'www.youtube.com',
      'www.youtube.com',
      'www.youtube.com',
      'www.youtube.com',
      'www.youtube.com',
      'www.youtube.com',
      'www.youtube.com',
      'www.youtube.com',
      'www.youtube.com',
      'www.youtube.com',
    ]);
  }, 25000);

  it('Creating a token and minting 3 NFTs with buffer set to 1', async () => {
    const tokenId = await nftSDK.createCollection('test_name', 'test_symbol');
    const transactionStatus = await nftSDK.mintSharedMetadata(
      tokenId,
      3,
      1,
      'www.youtube.com',
      myPrivateKey
    );

    expect(tokenId).toBeDefined();
    expect(transactionStatus).toBeDefined();
    expect(transactionStatus).toEqual(['www.youtube.com', 'www.youtube.com', 'www.youtube.com']);
  }, 25000);

  it('throws an error when invalid token ID is provided', async () => {
    const tokenId = await nftSDK.createCollection('test_name', 'test_symbol');

    await expect(
      nftSDK.mintSharedMetadata(tokenId, 11, 11, 'www.youtube.com', myPrivateKey)
    ).rejects.toThrow(errors.maxBatchSize);
  });
});
