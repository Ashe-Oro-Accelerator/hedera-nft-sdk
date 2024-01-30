import * as fs from 'fs';
import { mintSharedMetadataFunction } from '../../src/functions/mintSharedMetadataFunction';
import { MintUniqueTokenType } from '../../src/types/mintToken';
import { mintUniqueMetadataFunction } from '../../src/functions/mintUniqueMetadataFunction';
import { Client } from '@hashgraph/sdk';

jest.mock('fs');
jest.mock('csv-parser');
jest.mock('../../src/functions/mintSharedMetadataFunction');

describe('mintUniqueMetadataFunction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return success metadata when given valid input', async () => {
    const mockClient = {} as Client;

    const mockReadStream = {
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn().mockImplementation(function (event, handler) {
        if (event === 'data') {
          handler({ '0': 'url1,url2' });
        }
        if (event === 'end') {
          handler();
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return this;
      }),
    };
    (fs.createReadStream as jest.Mock).mockReturnValue(mockReadStream);
    (mintSharedMetadataFunction as jest.Mock).mockResolvedValue('mockMetadata');

    const input: MintUniqueTokenType = {
      client: mockClient,
      tokenId: 'mockTokenId',
      amount: 8,
      buffer: 5,
      pathToCSV: 'mockPath',
      supplyKey: 'mockSupplyKey',
    };

    const result = await mintUniqueMetadataFunction(input);

    expect(result).toEqual(['mockMetadata', 'mockMetadata']);
    expect(fs.createReadStream).toHaveBeenCalledWith('mockPath');
    expect(mintSharedMetadataFunction).toHaveBeenCalledTimes(2);
    expect(mintSharedMetadataFunction).toHaveBeenNthCalledWith(1, {
      amount: 8,
      buffer: 5,
      client: mockClient,
      metaData: 'url1',
      supplyKey: 'mockSupplyKey',
      tokenId: 'mockTokenId',
    });

    expect(mintSharedMetadataFunction).toHaveBeenNthCalledWith(2, {
      amount: 8,
      buffer: 5,
      client: mockClient,
      metaData: 'url2',
      supplyKey: 'mockSupplyKey',
      tokenId: 'mockTokenId',
    });
  });

  it('should throw an error when the CSV contains invalid data', async () => {
    const mockClient = {} as Client;

    const mockReadStream = {
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn().mockImplementation(function (event, handler) {
        if (event === 'data') {
          handler({ '0': 123 });
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return this;
      }),
    };
    (fs.createReadStream as jest.Mock).mockReturnValue(mockReadStream);

    const input: MintUniqueTokenType = {
      client: mockClient,
      tokenId: 'mockTokenId',
      amount: 1,
      pathToCSV: 'mockPath',
      supplyKey: 'mockSupplyKey',
    };

    await expect(mintUniqueMetadataFunction(input)).rejects.toThrow('Invalid data: 123');
    expect(fs.createReadStream).toHaveBeenCalledWith('mockPath');
  });
});
