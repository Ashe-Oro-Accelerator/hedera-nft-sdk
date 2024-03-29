import { MintedNFTType, MintTokenType } from '../types/mintToken';
import { dictionary } from '../utils/constants/dictionary';
import { MintingError } from '../utils/mintingError';
import { validatePropsForSharedNFTMinting } from '../utils/validateProps';
import { mintToken } from './mintToken';

export const mintSharedMetadataFunction = async ({
  client,
  tokenId,
  amount,
  batchSize,
  metaData,
  supplyKey,
}: MintTokenType) => {
  validatePropsForSharedNFTMinting({ tokenId, amount, metaData, supplyKey, batchSize });

  const mintedNFTs: MintedNFTType[] = [];
  // Example if amount = 8 and batchSize = 5. NumberOfCalls should be 2. So 8/5 = 1.6. Math.ceil(1.6) = 2. Because Math.ceil rounds up to the next largest integer.
  const numberOfCalls = Math.ceil(amount / batchSize);

  try {
    for (let i = 0; i < numberOfCalls; i++) {
      const metadataBatchArray = new Array(Math.min(batchSize, amount)).fill(metaData);
      amount -= batchSize;
      const mintTokenReceipt = await mintToken(metadataBatchArray, tokenId, supplyKey, client);

      const result: MintedNFTType[] = mintTokenReceipt?.serials.map((longValue) => {
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
    throw new MintingError(`${dictionary.hederaActions.mintingError} ${error}`, mintedNFTs.flat());
  }
};
