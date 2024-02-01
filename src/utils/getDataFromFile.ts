import fs from 'fs';
import csv from 'csv-parser';

export const getDataFromFile = async (pathToMetadataURIsFile: string): Promise<string[]> => {
  const results: string[] = [];
  try {
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(pathToMetadataURIsFile)
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
        .on('end', resolve)
        .on('error', (error) => reject(error));
    });
  } catch (error) {
    throw new Error(String(error));
  }
  return results;
};
