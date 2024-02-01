import { mintToken } from '../../src/functions/mintToken';
import { Client, PrivateKey, Status } from '@hashgraph/sdk';
import { myPrivateKey } from '../__mocks__/consts';
import errors from '../../src/dictionary/errors.json';

jest.mock('@hashgraph/sdk', () => ({
  Client: jest.fn(),
  Status: {
    Success: 'Success',
  },
  Hbar: jest.fn(),
  PrivateKey: {
    fromString: jest.fn(),
  },
  TokenMintTransaction: jest.fn(() => ({
    setTokenId: jest.fn().mockReturnThis(),
    setMaxTransactionFee: jest.fn().mockReturnThis(),
    setMetadata: jest.fn().mockReturnThis(),
    freezeWith: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue({
      execute: jest.fn().mockResolvedValue({
        getReceipt: jest.fn().mockResolvedValue({
          status: 'Success',
        }),
      }),
    }),
  })),
}));

describe('mintToken', () => {
  it('should return Success status', async () => {
    const mockClient = {} as Client;
    const mockMetaData = ['meta1'];
    const mockTokenId = 'tokenId';
    const mockSupplyKey = PrivateKey.fromString(myPrivateKey);

    const result = await mintToken(mockMetaData, mockTokenId, mockSupplyKey, mockClient);

    expect(result).toEqual({ status: Status.Success });
  });

  it('should throw error when CID is longer than 100', async () => {
    const mockClient = {} as Client;
    const mockMetaData = [
      'http://example.com/longer-than-100-characters-long-string',
      'http://example.com/longer-than-100-characters-long-string-1-2-3-4-5-6-7-8-9-10-11-12-13-14-15-16-1-2-3-4-5-6-7-8-9-10-11-12-13-14-15-16',
    ];
    const mockTokenId = 'tokenId';
    const mockSupplyKey = PrivateKey.fromString(myPrivateKey);

    await expect(mintToken(mockMetaData, mockTokenId, mockSupplyKey, mockClient)).rejects.toThrow(
      errors.tooLongCID
    );
  });
});
