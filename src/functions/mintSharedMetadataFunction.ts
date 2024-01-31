import { MintTokenType } from '../types/mintToken';
import { mintToken } from './mintToken';
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

  const mintedNFTs = [];
  // Example if amount = 8 and batchSize = 5. NumberOfCalls should be 2. So 8/5 = 1.6. Math.ceil(1.6) = 2. Because Math.ceil rounds up to the next largest integer.
  const numberOfCalls = Math.ceil(amount / batchSize);

  try {
    for (let i = 0; i < numberOfCalls; i++) {
      const metadataBatchArray = new Array(Math.min(batchSize, amount)).fill(metaData);
      amount -= batchSize;
      const mintTokenReceipt = await mintToken(metadataBatchArray, tokenId, supplyKey, client);

      const result = mintTokenReceipt?.serials.map((longValue) => {
        return {
          content: metaData,
          serialNumber: longValue.toNumber(),
        };
      });

      if (result) {
        mintedNFTs.push(...result);
      }
    }

    return mintedNFTs.flat();
  } catch (error) {
    throw new Error(`${errors.mintingError}${JSON.stringify(mintedNFTs.flat())}`);
  }
};
