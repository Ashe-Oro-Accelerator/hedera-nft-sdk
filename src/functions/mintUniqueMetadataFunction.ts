import { MintUniqueTokenType } from '../types/mintToken';
import errors from '../dictionary/errors.json';
import * as fs from 'fs';
import csv from 'csv-parser';
import { mintToken } from './mintToken';
import { validateProps } from '../utils/validateProps';

export const mintUniqueMetadataFunction = async ({
  client,
  tokenId,
  batchSize = 5,
  pathToCSV,
  supplyKey,
}: MintUniqueTokenType) => {
  validateProps({ batchSize, tokenId, pathToCSV, supplyKey });

  if (!pathToCSV) throw new Error(errors.pathRequired);
  const successMetadata = [];
  const results: string[] = [];

  const metaData = await new Promise<string[]>((resolve, reject) => {
    fs.createReadStream(pathToCSV)
      .pipe(csv({ separator: ',', quote: ',', headers: false }))
      .on('data', (data) => {
        const chunk = Object.values(data)[0];
        if (typeof chunk === 'string') {
          const urls = chunk
            .split(',')
            .map((url) => url.trim())
            .filter((i) => i);
          results.push(...urls);
        } else {
          reject(new Error(`Invalid data: ${chunk}`));
        }
      })
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });

  try {
    const numberOfCalls = Math.ceil(metaData.length / batchSize);
    for (let i = 0; i < numberOfCalls; i++) {
      const batch = metaData.slice(i * batchSize, (i + 1) * batchSize);
      await mintToken(batch, tokenId, supplyKey, client);
      successMetadata.push(batch);
    }
  } catch (error) {
    throw new Error(`${errors.mintingError} ${successMetadata.flat(1).join(' ')}`);
  }

  return successMetadata.flat(1);
};