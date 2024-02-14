import { NFTDetails, DecodedMetadata } from '../../types/nfts';
import { dictionary } from '../constants/dictionary';
import { errorToMessage } from './errorToMessage';

export const nftMetadataDecoder = (nfts: NFTDetails[], ipfsGateway?: string): DecodedMetadata[] => {
  const decodedMetadataArray: DecodedMetadata[] = nfts.map((nft: NFTDetails) => {
    // console.log('metadata BEFORE atob', nft.metadata);
    let decodedNFTMetadata: string;

    try {
      decodedNFTMetadata = atob(nft.metadata);
      // console.log('metadata AFTER atob:', decodedNFTMetadata);
    } catch (error) {
      throw new Error(errorToMessage(error));
    }

    if (decodedNFTMetadata.startsWith('ipfs://') && ipfsGateway) {
      decodedNFTMetadata = decodedNFTMetadata.replace('ipfs://', ipfsGateway);
    } else if (!decodedNFTMetadata.startsWith('ipfs://') && ipfsGateway) {
      decodedNFTMetadata = `${ipfsGateway}${decodedNFTMetadata}`;
    } else if (!ipfsGateway && decodedNFTMetadata.startsWith('ipfs://')) {
      throw new Error(dictionary.errors.ipfsGatewayRequired);
    }

    return {
      metadata: decodedNFTMetadata,
      serialNumber: nft.serial_number,
    };
  });

  return decodedMetadataArray;
};
