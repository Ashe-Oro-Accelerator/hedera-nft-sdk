import { MintedNFTType, MintUniqueTokenType } from '../types/mintToken';
import { mintToken } from './mintToken';
import { validatePropsForUniqueNFTMinting } from '../utils/validateProps';
import { MintingError } from '../utils/mintingError';
import { getDataFromFile } from '../utils/getDataFromFile';
import { dictionary } from '../utils/constants/dictionary';

export const mintUniqueMetadataFunction = async ({
  client,
  tokenId,
  batchSize = 5,
  supplyKey,
  pathToMetadataURIsFile,
  metadataArray,
}: MintUniqueTokenType) => {
  validatePropsForUniqueNFTMinting({
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
  if (!metaData.length) throw new Error(dictionary.hederaActions.metadataRequired);

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
    throw new MintingError(`${dictionary.hederaActions.mintingError} ${error}`, mintedNFTs.flat());
  }

  return mintedNFTs.flat();
};
