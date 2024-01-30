import { MintUniqueTokenType } from '../types/mintToken';
import { mintSharedMetadataFunction } from './mintSharedMetadataFunction';
import errors from '../dictionary/errors.json';
import * as fs from 'fs';
import csv from 'csv-parser';

export const mintUniqueMetadataFunction = async ({
  client,
  tokenId,
  amount,
  buffer,
  pathToCSV,
  supplyKey,
}: MintUniqueTokenType) => {
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
          for (const url of urls) {
            results.push(url);
          }
        } else {
          reject(new Error(`Invalid data: ${chunk}`));
        }
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => reject(error));
  });

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
