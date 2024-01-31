import { MintTokenType } from '../types/mintToken';
import { tokenMinter } from './tokenMinter';
import errors from '../dictionary/errors.json';
import { validateProps } from '../utils/validateProps';

export const mintSharedMetadataFunction = async ({
  client,
  tokenId,
  amount,
  buffer = 5,
  metaData,
  supplyKey,
}: MintTokenType) => {
  validateProps({ buffer, tokenId, amount, metaData, supplyKey });

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
