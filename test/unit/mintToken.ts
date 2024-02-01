import { mintToken } from '../../src/functions/mintToken';
import { Client, PrivateKey, Status } from '@hashgraph/sdk';
import { myPrivateKey } from '../__mocks__/consts';

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

    expect(result).toEqual(Status.Success);
  });
});
