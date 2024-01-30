import { mintSharedMetadataFunction } from '../../src/functions/mintSharedMetadataFunction';
import { tokenMinter } from '../../src/functions/tokenMinter';
import { Client } from '@hashgraph/sdk';
import errors from '../../src/dictionary/errors.json';

jest.mock('../../src/functions/tokenMinter', () => ({
  tokenMinter: jest.fn(),
}));

describe('mintSharedMetadataFunction', () => {
  it('should return correct metadata', async () => {
    const mockClient = {} as Client;
    const mockMetaData = 'meta1';
    const mockTokenId = 'tokenId';
    const mockSupplyKey = 'supplyKey';
    const mockAmount = 10;
    const mockBatchSize = 2;

    (tokenMinter as jest.Mock).mockResolvedValueOnce(undefined);

    const result = await mintSharedMetadataFunction({
      client: mockClient,
      metaData: mockMetaData,
      tokenId: mockTokenId,
      supplyKey: mockSupplyKey,
      amount: mockAmount,
      batchSize: mockBatchSize,
    });

    expect(result).toEqual(expect.arrayContaining([mockMetaData]));
  });

  it('should handle amount less than batchSize correctly', async () => {
    const mockClient = {} as Client;
    const mockMetaData = 'meta1';
    const mockTokenId = 'tokenId';
    const mockSupplyKey = 'supplyKey';
    const mockAmount = 1;
    const mockBatchSize = 2;

    (tokenMinter as jest.Mock).mockResolvedValueOnce(undefined);

    const result = await mintSharedMetadataFunction({
      client: mockClient,
      metaData: mockMetaData,
      tokenId: mockTokenId,
      supplyKey: mockSupplyKey,
      amount: mockAmount,
      batchSize: mockBatchSize,
    });

    expect(result).toEqual(expect.arrayContaining([mockMetaData]));
  });

  it('should handle batchSize of 1 correctly', async () => {
    const mockClient = {} as Client;
    const mockMetaData = 'meta1';
    const mockTokenId = 'tokenId';
    const mockSupplyKey = 'supplyKey';
    const mockAmount = 1;
    const mockBatchSize = 1;

    (tokenMinter as jest.Mock).mockResolvedValueOnce(undefined);

    const result = await mintSharedMetadataFunction({
      client: mockClient,
      metaData: mockMetaData,
      tokenId: mockTokenId,
      supplyKey: mockSupplyKey,
      amount: mockAmount,
      batchSize: mockBatchSize,
    });

    expect(result).toEqual(expect.arrayContaining([mockMetaData]));
  });

  it('should handle batchSize of 10 correctly', async () => {
    const mockClient = {} as Client;
    const mockMetaData = 'meta1';
    const mockTokenId = 'tokenId';
    const mockSupplyKey = 'supplyKey';
    const mockAmount = 10;
    const mockBatchSize = 10;

    (tokenMinter as jest.Mock).mockResolvedValueOnce(undefined);

    const result = await mintSharedMetadataFunction({
      client: mockClient,
      metaData: mockMetaData,
      tokenId: mockTokenId,
      supplyKey: mockSupplyKey,
      amount: mockAmount,
      batchSize: mockBatchSize,
    });

    expect(result).toEqual(expect.arrayContaining([mockMetaData]));
  });

  it('should handle error when batchSize is lower than 0', async () => {
    const mockClient = {} as Client;
    const mockMetaData = 'meta1';
    const mockTokenId = 'tokenId';
    const mockSupplyKey = 'supplyKey';
    const mockAmount = 1;
    const mockBatchSize = 0;

    (tokenMinter as jest.Mock).mockResolvedValueOnce(undefined);

    await expect(
      mintSharedMetadataFunction({
        client: mockClient,
        metaData: mockMetaData,
        tokenId: mockTokenId,
        supplyKey: mockSupplyKey,
        amount: mockAmount,
        batchSize: mockBatchSize,
      })
    ).rejects.toThrow(errors.minBatchSize);
  });

  it('should handle error when batchSize is higher than 10', async () => {
    const mockClient = {} as Client;
    const mockMetaData = 'meta1';
    const mockTokenId = 'tokenId';
    const mockSupplyKey = 'supplyKey';
    const mockAmount = 1;
    const mockBatchSize = 11;

    (tokenMinter as jest.Mock).mockResolvedValueOnce(undefined);

    await expect(
      mintSharedMetadataFunction({
        client: mockClient,
        metaData: mockMetaData,
        tokenId: mockTokenId,
        supplyKey: mockSupplyKey,
        amount: mockAmount,
        batchSize: mockBatchSize,
      })
    ).rejects.toThrow(errors.maxBatchSize);
  });

  it('should handle error when metaData is not passed', async () => {
    const mockClient = {} as Client;
    const mockMetaData = '';
    const mockTokenId = 'tokenId';
    const mockSupplyKey = 'supplyKey';
    const mockAmount = 1;
    const mockBatchSize = 10;

    (tokenMinter as jest.Mock).mockResolvedValueOnce(undefined);

    await expect(
      mintSharedMetadataFunction({
        client: mockClient,
        metaData: mockMetaData,
        tokenId: mockTokenId,
        supplyKey: mockSupplyKey,
        amount: mockAmount,
        batchSize: mockBatchSize,
      })
    ).rejects.toThrow(errors.metadataRequired);
  });

  it('should handle error when tokenId is not passed', async () => {
    const mockClient = {} as Client;
    const mockMetaData = 'meta1';
    const mockTokenId = '';
    const mockSupplyKey = 'supplyKey';
    const mockAmount = 1;
    const mockBatchSize = 10;

    (tokenMinter as jest.Mock).mockResolvedValueOnce(undefined);

    await expect(
      mintSharedMetadataFunction({
        client: mockClient,
        metaData: mockMetaData,
        tokenId: mockTokenId,
        supplyKey: mockSupplyKey,
        amount: mockAmount,
        batchSize: mockBatchSize,
      })
    ).rejects.toThrow(errors.tokenIdRequired);
  });

  it('should handle error when amount is not passed', async () => {
    const mockClient = {} as Client;
    const mockMetaData = 'meta1';
    const mockTokenId = 'tokenId';
    const mockSupplyKey = 'supplyKey';
    const mockAmount = 0;
    const mockBatchSize = 10;

    (tokenMinter as jest.Mock).mockResolvedValueOnce(undefined);

    await expect(
      mintSharedMetadataFunction({
        client: mockClient,
        metaData: mockMetaData,
        tokenId: mockTokenId,
        supplyKey: mockSupplyKey,
        amount: mockAmount,
        batchSize: mockBatchSize,
      })
    ).rejects.toThrow(errors.minAmount);
  });
});
