import * as fs from 'fs';
import csvParser from 'csv-parser';
import * as path from 'path';

interface NftMetadata {
  name: string;
  creator: string;
  creatorDID: string;
  description: string;
  image: string;
  type: string;
  properties: Record<string, unknown>;
  attributes: Array<Record<string, unknown>>;
}

export const csvToJson = (
  csvFilePath: string,
  targetDirectory: string = './json-metadata/'
): Promise<string | string[]> => {
  return new Promise((resolve, reject) => {
    const results: NftMetadata[] = [];
    let lineCount = 0;

    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (data) => {
        lineCount++;
        // Skip the first two lines of the CSV file
        if (lineCount > 1) results.push(data);
      })
      .on('end', () => {
        try {
          if (!fs.existsSync(targetDirectory)) {
            fs.mkdirSync(targetDirectory, { recursive: true });
          }

          results.forEach((metadata, index) => {
            if (Object.keys(metadata).length > 0) {
              const jsonFilePath = path.join(targetDirectory, `${index + 1}.json`);
              fs.writeFileSync(jsonFilePath, JSON.stringify(metadata));
            }
          });

          resolve(targetDirectory);
        } catch (error: unknown) {
          const errorMessage = (error as Error).message;
          reject(['Could not write JSON files', errorMessage]);
        }
      });
  });
};
