import { NftId } from '@hashgraph/sdk';
import axios from 'axios';
import { NFTDetails } from '../types/nfts';
import { MetadataObject } from '../types/csv';
import { dictionary } from '../utils/constants/dictionary';

const getMirrorNodeUrlForNetwork = (network: string): string => {
  return `https://${network === 'mainnet' ? 'mainnet-public' : network}.mirrornode.hedera.com/api/v1`;
};

export async function getMetaDataFromMirrorNode(
  network: string,
  nftId: NftId,
  mirrorNodeUrl?: string
): Promise<string> {
  const url = mirrorNodeUrl || getMirrorNodeUrlForNetwork(network);
  return axios
    .get(`${url}/tokens/${nftId.tokenId.toString()}/nfts/${nftId.serial.toString()}`)
    .then((response) => {
      //atob is used to decode the base64 encoded metadata
      return atob(response.data.metadata);
    });
}

export async function getNFTsFromToken(
  network: string,
  tokenId: string,
  mirrorNodeUrl?: string
): Promise<NFTDetails[]> {
  const url = mirrorNodeUrl || getMirrorNodeUrlForNetwork(network);

  const response = await axios.get(`${url}/tokens/${tokenId.toString()}/nfts`);
  return response.data.nfts;
}

export async function getMetadataObjects(
  url: string,
  serialNumber: number
): Promise<{ metadata?: MetadataObject; serialNumber: number; error?: string }> {
  try {
    const response = await axios.get(url);
    return {
      metadata: response.data,
      serialNumber,
    };
  } catch (error) {
    let errorMessage = dictionary.errors.ipfsFailedToFetch as string;
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        errorMessage = dictionary.errors.tooManyRequests as string;
      } else {
        console.error(dictionary.errors.unknownErrorWhileFetching(serialNumber, errorMessage));
      }
    }

    return {
      serialNumber,
      error: errorMessage,
    };
  }
}
