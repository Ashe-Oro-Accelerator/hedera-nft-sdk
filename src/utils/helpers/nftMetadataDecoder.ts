import { NFTDetails, DecodedMetadata } from '../../types/nfts';
import { dictionary } from '../constants/dictionary';
import { errorToMessage } from './errorToMessage';

export const nftMetadataDecoder = (
  nfts: NFTDetails | NFTDetails[],
  ipfsGateway?: string
): DecodedMetadata[] => {
  const nftsArray = Array.isArray(nfts) ? nfts : [nfts];
  const decodedMetadataArray: DecodedMetadata[] = nftsArray.map((nft: NFTDetails) => {
    let decodedNFTMetadata: string;

    try {
      decodedNFTMetadata = atob(nft.metadata);
    } catch (error) {
      throw new Error(errorToMessage(error));
    }

    if (
      !decodedNFTMetadata.startsWith('https://') &&
      !decodedNFTMetadata.startsWith('http://') &&
      !ipfsGateway
    ) {
      throw new Error(dictionary.errors.ipfsGatewayRequired);
    }

    if (decodedNFTMetadata.startsWith('ipfs://') && ipfsGateway) {
      decodedNFTMetadata = decodedNFTMetadata.replace('ipfs://', ipfsGateway);
    } else if (
      !decodedNFTMetadata.startsWith('https://') &&
      !decodedNFTMetadata.startsWith('http://') &&
      ipfsGateway
    ) {
      decodedNFTMetadata = `${ipfsGateway}${decodedNFTMetadata}`;
    }

    return {
      metadata: decodedNFTMetadata,
      serialNumber: nft.serial_number,
    };
  });

  return decodedMetadataArray;
};
