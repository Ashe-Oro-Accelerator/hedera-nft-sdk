import { NftId } from '@hashgraph/sdk';
import axios from 'axios';
import { NFTDetails, NFTS } from '../types/nfts';
import { MetadataObject } from '../types/csv';
import { dictionary } from '../utils/constants/dictionary';
import { errorToMessage } from '../utils/helpers/errorToMessage';
import { NetworkName } from '@hashgraph/sdk/lib/client/Client';

const getMirrorNodeUrlForNetwork = (network: NetworkName): string => {
  return `https://${network === 'mainnet' ? 'mainnet-public' : network}.mirrornode.hedera.com/api/v1`;
};

export async function getMetaDataFromMirrorNode(
  network: NetworkName,
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
  network: NetworkName,
  tokenId: string
): Promise<NFTDetails[]> {
  const baseUrl = getMirrorNodeUrlForNetwork(network);
  let nextLink: string = `${baseUrl}/tokens/${tokenId}/nfts`;
  let allNFTs: NFTDetails[] = [];

  do {
    try {
      const response = await axios.get<NFTS>(nextLink);
      allNFTs = allNFTs.concat(response.data.nfts);
      nextLink = response.data.links.next ? new URL(response.data.links.next, baseUrl).href : '';
    } catch (error) {
      throw new Error(errorToMessage(error));
    }
  } while (nextLink);
  return allNFTs;
}

export async function getSingleNFTMetadata(
  network: NetworkName,
  tokenId: string,
  serialNumber: number
): Promise<NFTDetails> {
  const baseUrl = getMirrorNodeUrlForNetwork(network);
  const url = `${baseUrl}/tokens/${tokenId}/nfts/${serialNumber}`;

  try {
    const { data } = await axios.get<NFTDetails>(url);
    return data;
  } catch (error) {
    throw new Error(`${dictionary.errors.unknownErrorWhileFetching(serialNumber)},
    ${errorToMessage(error)}`);
  }
}

export async function getMetadataObjectsForValidation(
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
        errorMessage = dictionary.errors.tooManyRequests(
          error.response.statusText,
          error.response.status
        );
      } else {
        console.log(dictionary.errors.unknownErrorWhileFetching(serialNumber));
      }
    }

    return {
      serialNumber,
      error: errorMessage,
    };
  }
}
