import fs from 'fs';
import { NFTS_LIMIT_ERROR } from './utils/constants/nftsLimitError';
import { dictionary } from './utils/constants/dictionary';
import type { CSVRow } from './types/csv';
import csvParser from 'csv-parser';

type CSVReaderErrorId = 'invalid-headers';

export class CSVReaderError extends Error {
  id: CSVReaderErrorId;

  constructor(message: string, id: CSVReaderErrorId) {
    super(message);
    this.id = id;
  }
}

export class CSVFileReader {
  static attributes = 'attributes' as const;
  static properties = 'properties' as const;
  static AMOUNT_OF_HEADERS = 2;

  static async readCSVFile(
    fullPath: string,
    config?: {
      limit?: number;
    }
  ): Promise<CSVRow[]> {
    let separator = ',';

    if (!!process.env?.CSV_SEPARATOR && process.env?.CSV_SEPARATOR === 'semicolon') {
      separator = ';';
    }

    const rows: CSVRow[] = [];

    const readStream = fs.createReadStream(fullPath);

    const headersErrors: string[] = [];
    const extraSecondHeaderRow = 1;

    try {
      await new Promise((resolve, reject) => {
        readStream
          .pipe(
            csvParser({
              separator,
              mapHeaders: this.mapHeadersForCSV(headersErrors),
            })
          )
          .on('data', (row: CSVRow) => {
            if (headersErrors.length) {
              reject(new CSVReaderError(headersErrors[0], 'invalid-headers'));
            }

            if (
              Number(config?.limit) + extraSecondHeaderRow &&
              rows.length >= Number(config?.limit) + extraSecondHeaderRow
            ) {
              return reject(new Error(NFTS_LIMIT_ERROR));
            }

            rows.push(row);
          })
          .on('end', () => resolve(readStream.read()))
          .on('error', (e) => {
            return reject(e);
          });
      });
    } catch (e) {
      if (e instanceof CSVReaderError) {
        throw e;
      }

      return rows;
    }

    return rows;
  }

  private static mapHeadersForCSV(
    refToErrorArray: string[]
  ): (header: { header: string; index: number }) => string | null {
    let propertyIndex = 0;
    let attributesIndex = 0;

    let currentType: typeof this.attributes | typeof this.properties | null = null;

    return (header: { header: string; index: number }): string | null => {
      let result: string | null = null;

      if (header.header === this.attributes) {
        currentType = 'attributes';
        attributesIndex++;
      }

      if (header.header === this.properties) {
        currentType = 'properties';
        propertyIndex = 1;
      }

      if (!currentType) {
        return header.header;
      }

      if (
        currentType &&
        header.header !== '' &&
        header.header !== this.attributes &&
        header.header !== this.properties
      ) {
        refToErrorArray.push(dictionary.csvToJson.errorInCellWithHeader(1, header.index + 1));
      }

      if (
        (propertyIndex > 1 && header.header === this.properties) ||
        (attributesIndex > 1 && header.header === this.attributes)
      ) {
        refToErrorArray.push(dictionary.csvToJson.errorInCellWithHeader(1, header.index + 1));
      }

      if (currentType === 'properties') {
        result = `${this.properties}_${propertyIndex}`;
        propertyIndex++;
      }

      if (currentType === 'attributes') {
        result = `${this.attributes}_${attributesIndex}`;
        attributesIndex++;
      }

      return result;
    };
  }
}
