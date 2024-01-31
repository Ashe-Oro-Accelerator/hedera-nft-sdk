import * as fs from 'fs';
import { MintUniqueTokenType } from '../../src/types/mintToken';
import { mintUniqueMetadataFunction } from '../../src/functions/mintUniqueMetadataFunction';
import { Client } from '@hashgraph/sdk';
import { tokenMinter } from '../../src/functions/tokenMinter';

jest.mock('fs');
jest.mock('csv-parser');
jest.mock('../../src/functions/tokenMinter');

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
    (tokenMinter as jest.Mock).mockImplementation((batch) => Promise.resolve(batch));

    const input: MintUniqueTokenType = {
      client: mockClient,
      tokenId: 'mockTokenId',
      buffer: 5,
      pathToCSV: 'mockPath',
      supplyKey: 'mockSupplyKey',
    };

    const result = await mintUniqueMetadataFunction(input);

    expect(result).toEqual(['url1', 'url2']);
    expect(fs.createReadStream).toHaveBeenCalledWith('mockPath');
    expect(tokenMinter).toHaveBeenCalledTimes(1);
    expect(tokenMinter).toHaveBeenNthCalledWith(
      1,
      ['url1', 'url2'],
      'mockTokenId',
      'mockSupplyKey',
      {}
    );
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
      pathToCSV: 'mockPath',
      supplyKey: 'mockSupplyKey',
    };

    await expect(mintUniqueMetadataFunction(input)).rejects.toThrow('Invalid data: 123');
    expect(fs.createReadStream).toHaveBeenCalledWith('mockPath');
  });
});
