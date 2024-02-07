import axios from 'axios';
import { increaseNFTSupply } from '../../src/functions/increaseNFTSupply';
import { IncreaseNFTSupplyType } from '../../src/types/mintToken';
import { Client, LedgerId, PrivateKey, TokenId } from '@hashgraph/sdk';
import { validatePropsForIncreaseNFTSupply } from '../../src/utils/validateProps';


jest.mock('axios');
jest.mock('../../src/functions/mintSharedMetadataFunction', () => ({
  mintSharedMetadataFunction: jest.fn(),
}));
jest.mock('../../src/utils/validateProps', () => ({
  validatePropsForIncreaseNFTSupply: jest.fn(),
}));
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('increaseNFTSupply', () => {
  const mockMetaData = {
    // mock metadata object
  };

  const mockNftId = {
    tokenId: TokenId.fromString('0.0.453'),
    serial: 1,
    _toProtobuf: jest.fn(),
    toBytes: jest.fn(),
  };

  const generatedSupplyKey = PrivateKey.generate();
  const mockIncreaseNFTSupplyType: IncreaseNFTSupplyType = {
    client: {ledgerId: LedgerId.TESTNET} as Client,
    network: 'testnet',
    nftId: mockNftId,
    amount: 10,
    batchSize: 5,
    supplyKey: generatedSupplyKey,
    mirrorNodeUrl: 'mirrorNodeUrl',
  };

  it('should validate props before increasing NFT supply', async () => {
    const mockResponse = {
        metadata: "testMetadata"
    };
    mockedAxios.get.mockResolvedValue({
      data: mockResponse
    });

    await increaseNFTSupply(mockIncreaseNFTSupplyType);

    expect((validatePropsForIncreaseNFTSupply as jest.Mock)).toHaveBeenCalledWith({
      nftId: mockNftId,
      amount: 10,
      supplyKey: generatedSupplyKey,
      batchSize: 5,
    });
  });
});