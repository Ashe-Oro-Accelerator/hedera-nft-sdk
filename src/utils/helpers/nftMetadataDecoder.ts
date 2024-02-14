import { NFTDetails, DecodedMetadata } from '../../types/nfts';
import { dictionary } from '../constants/dictionary';
import { errorToMessage } from './errorToMessage';

export const nftMetadataDecoder = (nfts: NFTDetails[], ipfsGateway?: string): DecodedMetadata[] => {
  const decodedMetadata: DecodedMetadata[] = nfts.map((nft: NFTDetails) => {
    let decodedMetadata: string;

    try {
      decodedMetadata = atob(nft.metadata);
    } catch (error) {
      throw new Error(errorToMessage(error));
    }

    if (decodedMetadata.startsWith('ipfs://')) {
      if (!ipfsGateway) {
        throw new Error(dictionary.errors.ipfsGatewayRequired);
      } else {
        decodedMetadata = decodedMetadata.replace('ipfs://', ipfsGateway);
      }
    }

    return {
      metadata: decodedMetadata,
      serialNumber: nft.serial_number,
    };
  });

  return decodedMetadata;
};
