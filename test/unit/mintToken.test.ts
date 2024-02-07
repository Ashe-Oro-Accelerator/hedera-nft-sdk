import { mintToken } from '../../src/functions/mintToken';
import { Client, PrivateKey, Status } from '@hashgraph/sdk';
import { myPrivateKey } from '../__mocks__/consts';
import { dictionary } from '../../src/utils/constants/dictionary';

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

  it('should return Success status when metadata is 99 characters long', async () => {
    const mockClient = {} as Client;
    const mockMetaData = ['a'.repeat(99)]; // 99 characters
    const mockTokenId = 'tokenId';
    const mockSupplyKey = PrivateKey.fromString(myPrivateKey);

    const result = await mintToken(mockMetaData, mockTokenId, mockSupplyKey, mockClient);

    expect(result).toEqual({ status: Status.Success });
  });

  it('should return Success status when metadata is 100 characters long', async () => {
    const mockClient = {} as Client;
    const mockMetaData = ['a'.repeat(100)]; // 100 characters
    const mockTokenId = 'tokenId';
    const mockSupplyKey = PrivateKey.fromString(myPrivateKey);

    const result = await mintToken(mockMetaData, mockTokenId, mockSupplyKey, mockClient);

    expect(result).toEqual({ status: Status.Success });
  });

  it('should throw error when metadata is 101 characters long', async () => {
    const mockClient = {} as Client;
    const mockMetaData = ['a'.repeat(101)]; // 101 characters
    const mockTokenId = 'tokenId';
    const mockSupplyKey = PrivateKey.fromString(myPrivateKey);

    await expect(mintToken(mockMetaData, mockTokenId, mockSupplyKey, mockClient)).rejects.toThrow(
      dictionary.mintToken.tooLongCID
    );
  });
});
