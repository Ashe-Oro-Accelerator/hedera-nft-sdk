import axios from 'axios';
import { getNFTsFromToken } from '../../src/api/mirrorNode';
import { NFT_FROM_TOKEN_EXAMPLE_BASE_URL } from '../__mocks__/consts';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockResponsePage1 = {
  data: {
    nfts: [
      { id: 1, name: 'NFT 1' },
      { id: 2, name: 'NFT 2' },
    ],
    links: { next: NFT_FROM_TOKEN_EXAMPLE_BASE_URL },
  },
};

const mockResponsePage2 = {
  data: {
    nfts: [{ id: 3, name: 'NFT 3' }],
    links: { next: null },
  },
};

describe('getNFTsFromToken', () => {
  beforeEach(() => {
    mockedAxios.get.mockReset();
  });

  it('fetches all pages of NFTs collection correctly', async () => {
    mockedAxios.get
      .mockResolvedValueOnce(mockResponsePage1)
      .mockResolvedValueOnce(mockResponsePage2);

    const result = await getNFTsFromToken('testnet', '1', NFT_FROM_TOKEN_EXAMPLE_BASE_URL);
    expect(result.length).toBe(3);
    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
  });

  it('properly handles HTTP errors', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network error'));
    await expect(getNFTsFromToken('testnet', '1', NFT_FROM_TOKEN_EXAMPLE_BASE_URL)).rejects.toThrow(
      'Network error'
    );
  });
});
