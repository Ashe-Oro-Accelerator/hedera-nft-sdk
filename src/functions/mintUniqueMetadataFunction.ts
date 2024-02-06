import { MintedNFTType, MintUniqueTokenType } from '../types/mintToken';
import errors from '../dictionary/errors.json';
import { mintToken } from './mintToken';
import { validateProps } from '../utils/validateProps';
import { MintingError } from '../utils/mintingError';
import { getDataFromFile } from '../utils/getDataFromFile';

export const mintUniqueMetadataFunction = async ({
  client,
  tokenId,
  batchSize = 5,
  supplyKey,
  pathToMetadataURIsFile,
  metadataArray,
}: MintUniqueTokenType) => {
  validateProps({
    batchSize,
    tokenId,
    pathToMetadataURIsFile,
    supplyKey,
    metadataArray,
  });
  const mintedNFTs: MintedNFTType[] = [];

  const metaData = pathToMetadataURIsFile
    ? await getDataFromFile(pathToMetadataURIsFile)
    : metadataArray || [];
  if (!metaData.length) throw new Error(errors.metadataRequired);

  try {
    const numberOfCalls = Math.ceil(metaData.length / batchSize);
    for (let i = 0; i < numberOfCalls; i++) {
      const batch = metaData.slice(i * batchSize, (i + 1) * batchSize);
      const mintTokenReceipt = await mintToken(batch, tokenId, supplyKey, client);

      const result: MintedNFTType[] = mintTokenReceipt?.serials.map((longValue, index) => {
        return {
          content: batch[index],
          serialNumber: longValue.toNumber(),
        };
      });

      if (result) {
        mintedNFTs.push(...result);
      }
    }
  } catch (error) {
    throw new MintingError(`${errors.mintingError} ${error}`, mintedNFTs.flat());
  }

  return mintedNFTs.flat();
};
