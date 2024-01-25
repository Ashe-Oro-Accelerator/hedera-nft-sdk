import { MintUniqueTokenType } from '../types/mintToken';
import { mintSharedMetadataFunction } from './mintSharedMetadataFunction';

export const mintUniqueMetadataFunction = async ({
  client,
  tokenId,
  amount,
  buffer,
  metaData,
  supplyKey,
}: MintUniqueTokenType) => {
  const successMetadata = [];

  for (const metaDataItem of metaData) {
    successMetadata.push(
      await mintSharedMetadataFunction({
        client,
        tokenId,
        amount,
        buffer,
        metaData: metaDataItem,
        supplyKey,
      })
    );
  }

  return successMetadata.flat(1);
};
