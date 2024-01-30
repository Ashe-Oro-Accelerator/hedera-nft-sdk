import { MintTokenType } from '../types/mintToken';
import { tokenMinter } from './tokenMinter';
import errors from '../dictionary/errors.json';

export const mintSharedMetadataFunction = async ({
  client,
  tokenId,
  amount,
  buffer = 5,
  metaData,
  supplyKey,
}: MintTokenType) => {
  if (buffer > 10) throw new Error(errors.maxBuffer);
  if (buffer < 1) throw new Error(errors.minBuffer);
  if (!tokenId) throw new Error(errors.tokenIdRequired);
  if (!amount || amount < 1) throw new Error(errors.minAmount);
  if (!metaData) throw new Error(errors.metadataRequired);
  if (!supplyKey) throw new Error(errors.supplyKeyRequired);

  const successMetadata = [];
  const numberOfCalls = Math.ceil(amount / buffer);

  try {
    for (let i = 0; i < numberOfCalls; i++) {
      const optionsHelper = new Array(Math.min(buffer, amount)).fill(metaData);
      amount -= buffer;
      await tokenMinter(optionsHelper, tokenId, supplyKey, client);
      successMetadata.push(optionsHelper);
    }

    return successMetadata.flat(1);
  } catch (error) {
    throw new Error(`${errors.mintingError} ${successMetadata.flat(1).join(' ')}`);
  }
};
