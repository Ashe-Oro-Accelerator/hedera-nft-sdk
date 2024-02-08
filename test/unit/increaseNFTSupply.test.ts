import { Client, PrivateKey, TokenId } from '@hashgraph/sdk';
import axios from 'axios';
import { increaseNFTSupply } from '../../src/functions/increaseNFTSupply';
import { IncreaseNFTSupplyType } from '../../src/types/mintToken';
import { validatePropsForIncreaseNFTSupply } from '../../src/utils/validateProps';


jest.mock('axios');
jest.mock('../../src/functions/mintSharedMetadataFunction', () => ({
  mintSharedMetadataFunction: jest.fn(),
}));
jest.mock('../../src/utils/validateProps', () => ({
  validatePropsForIncreaseNFTSupply: jest.fn(),
}));
const mockedAxios = axios as jest.Mocked<typeof axios>;
const metadata = 'testMetadata';
const mockResponse = {
  //encoding 'testMetadata' as base64 encoded string
  metadata: btoa(metadata),
};
beforeAll(() => {
  mockedAxios.get.mockResolvedValue({
    data: mockResponse
  });
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('increaseNFTSupply', () => {
  const mockNftId = {
    tokenId: TokenId.fromString('0.0.453'),
    serial: 1,
    _toProtobuf: jest.fn(),
    toBytes: jest.fn(),
  };

  const generatedSupplyKey = PrivateKey.generate();
  const mockIncreaseNFTSupplyType: IncreaseNFTSupplyType = {
    client: {} as Client,
    network: 'testnet',
    nftId: mockNftId,
    amount: 10,
    batchSize: 5,
    supplyKey: generatedSupplyKey,
    mirrorNodeUrl: 'mirrorNodeUrl',
  };

  it('should validate props before increasing NFT supply', async () => {
    await increaseNFTSupply(mockIncreaseNFTSupplyType);

    expect((validatePropsForIncreaseNFTSupply as jest.Mock)).toHaveBeenCalledWith({
      nftId: mockNftId,
      amount: 10,
      supplyKey: generatedSupplyKey,
      batchSize: 5,
    });
  });

  it('should increase supply when called with valid props', async () => {
    await increaseNFTSupply(mockIncreaseNFTSupplyType);

    expect(mockedAxios.get).toHaveBeenCalledWith('mirrorNodeUrl/tokens/0.0.453/nfts/1');
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect((require('../../src/functions/mintSharedMetadataFunction').mintSharedMetadataFunction as jest.Mock)).toHaveBeenCalledTimes(1);
  });

  it('should call mintSharedMetadataFunction with the correct parameters', async () => {
    await increaseNFTSupply(mockIncreaseNFTSupplyType);

    expect((require('../../src/functions/mintSharedMetadataFunction').mintSharedMetadataFunction as jest.Mock)).toHaveBeenCalledWith({
      client: mockIncreaseNFTSupplyType.client,
      tokenId: mockIncreaseNFTSupplyType.nftId.tokenId.toString(),
      amount: mockIncreaseNFTSupplyType.amount,
      batchSize: mockIncreaseNFTSupplyType.batchSize,
      metaData: metadata,
      supplyKey: mockIncreaseNFTSupplyType.supplyKey,
    });
  });

  it('should call passed mirrorNodeUrl when provided', async () => {
    await increaseNFTSupply(mockIncreaseNFTSupplyType);

    expect(mockedAxios.get).toHaveBeenCalledWith('mirrorNodeUrl/tokens/0.0.453/nfts/1');
  });

  it('should get correct mirror node url for mainnet', async () => {
    const mockIncreaseNFTSupplyTypeMainnet = {
      ...mockIncreaseNFTSupplyType,
      network: 'mainnet',
      mirrorNodeUrl: undefined,
    };

    await increaseNFTSupply(mockIncreaseNFTSupplyTypeMainnet);

    expect(mockedAxios.get).toHaveBeenCalledWith('https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/0.0.453/nfts/1');
  });

  it('should get correct mirror node url for testnet', async () => {
    const mockIncreaseNFTSupplyTypeTestnet = {
      ...mockIncreaseNFTSupplyType,
      network: 'testnet',
      mirrorNodeUrl: undefined,
    };

    await increaseNFTSupply(mockIncreaseNFTSupplyTypeTestnet);

    expect(mockedAxios.get).toHaveBeenCalledWith('https://testnet.mirrornode.hedera.com/api/v1/tokens/0.0.453/nfts/1');
  });
});