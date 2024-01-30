import { MintTokenType } from '../types/mintToken';
import { tokenMinter } from './tokenMinter';
import errors from '../dictionary/errors.json';

export const mintSharedMetadataFunction = async ({
  client,
  tokenId,
  amount,
  batchSize,
  metaData,
  supplyKey,
}: MintTokenType) => {
  if (batchSize > 10) throw new Error(errors.maxBatchSize);
  if (batchSize < 1) throw new Error(errors.minBatchSize);
  if (!tokenId) throw new Error(errors.tokenIdRequired);
  if (!amount) throw new Error(errors.minAmount);
  if (!metaData) throw new Error(errors.metadataRequired);

  const successMetadata = [];
  // Example if amount = 8 and batchSize = 5. NumberOfCalls should be 2. So 8/5 = 1.6. Math.ceil(1.6) = 2. Because Math.ceil rounds up to the next largest integer.
  const numberOfCalls = Math.ceil(amount / batchSize);

  try {
    for (let i = 0; i < numberOfCalls; i++) {
      const optionsHelper = new Array(Math.min(batchSize, amount)).fill(metaData);
      amount -= batchSize;
      await tokenMinter(optionsHelper, tokenId, supplyKey, client);
      successMetadata.push(optionsHelper);
    }

    return successMetadata.flat(1);
  } catch (error) {
    throw new Error(`${errors.mintingError} ${successMetadata.flat(1).join(' ')}`);
  }
};
