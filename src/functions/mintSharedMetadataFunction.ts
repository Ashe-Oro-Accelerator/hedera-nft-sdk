import { MintTokenType } from '../types/mintToken';
import { tokenMinter } from './tokenMinter';
import errors from '../dictionary/errors.json';
import { validateProps } from '../utils/validateProps';

export const mintSharedMetadataFunction = async ({
  client,
  tokenId,
  amount,
  batchSize,
  metaData,
  supplyKey,
}: MintTokenType) => {
  validateProps({ tokenId, amount, metaData, supplyKey, buffer: batchSize });

  const successMetadata = [];
  // Example if amount = 8 and batchSize = 5. NumberOfCalls should be 2. So 8/5 = 1.6. Math.ceil(1.6) = 2. Because Math.ceil rounds up to the next largest integer.
  const numberOfCalls = Math.ceil(amount / batchSize);

  try {
    for (let i = 0; i < numberOfCalls; i++) {
      const metadataBatchArray = new Array(Math.min(batchSize, amount)).fill(metaData);
      amount -= batchSize;
      await tokenMinter(metadataBatchArray, tokenId, supplyKey, client);
      successMetadata.push(metadataBatchArray);
    }

    return successMetadata.flat();
  } catch (error) {
    throw new Error(`${errors.mintingError} ${successMetadata.flat().join(' ')}`);
  }
};
