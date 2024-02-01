import fs from 'fs';
import { NFTS_LIMIT_ERROR } from './utils/constants/nftsLimitError';
import { dictionary } from './utils/constants/dictionary';
import type { CSVRow } from './types/csv';
import csvParser from 'csv-parser';
import { selectSeparator } from './utils/helpers/selectSeparator';

const EXTRA_SECOND_HEADER_ROW_COUNT = 1;

type CSVReaderErrorId = 'invalid-headers';

type CurrentType = 'attributes' | 'properties' | null;

export class CSVReaderError extends Error {
  id: CSVReaderErrorId;

  constructor(message: string, id: CSVReaderErrorId) {
    super(message);
    this.id = id;
  }
}

export class CSVFileReader {
  static ATTRIBUTES = 'attributes' as const;
  static PROPERTIES = 'properties' as const;
  static AMOUNT_OF_HEADERS = 2;

  private static checkForErrorsAndLimit({
    headersErrors,
    limit,
    currentRowCount,
  }: {
    headersErrors: string[];
    limit?: number;
    currentRowCount: number;
  }): void {
    if (headersErrors.length) {
      throw new CSVReaderError(headersErrors[0], 'invalid-headers');
    }

    const effectiveLimit = Number(limit) + EXTRA_SECOND_HEADER_ROW_COUNT;
    if (limit && currentRowCount >= effectiveLimit) {
      throw new Error(NFTS_LIMIT_ERROR);
    }
  }

  private static processHeader(
    header: { header: string; index: number },
    currentType: CurrentType,
    propertyIndex: number,
    attributesIndex: number,
    refToErrorArray: string[]
  ): {
    result: string | null;
    currentType: CurrentType;
    propertyIndex: number;
    attributesIndex: number;
  } {
    let result: string | null = null;

    // TODO: try to simplyfy this
    if (header.header === this.ATTRIBUTES) {
      currentType = 'attributes';
      attributesIndex++;
    } else if (header.header === this.PROPERTIES) {
      currentType = 'properties';
      propertyIndex = 1;
    } else if (!currentType) {
      return { result: header.header, currentType, propertyIndex, attributesIndex };
    }

    if (
      header.header !== '' &&
      header.header !== this.ATTRIBUTES &&
      header.header !== this.PROPERTIES
    ) {
      refToErrorArray.push(dictionary.csvToJson.errorInCellWithHeader(1, header.index + 1));
    }

    if (
      (propertyIndex > 1 && header.header === this.PROPERTIES) ||
      (attributesIndex > 1 && header.header === this.ATTRIBUTES)
    ) {
      refToErrorArray.push(dictionary.csvToJson.errorInCellWithHeader(1, header.index + 1));
    }

    if (currentType === 'properties') {
      result = `${this.PROPERTIES}_${propertyIndex}`;
      propertyIndex++;
    }

    if (currentType === 'attributes') {
      result = `${this.ATTRIBUTES}_${attributesIndex}`;
      attributesIndex++;
    }

    return { result, currentType, propertyIndex, attributesIndex };
  }

  static async readCSVFile(
    fullPath: string,
    config?: {
      limit?: number;
    }
  ): Promise<CSVRow[]> {
    const separator = selectSeparator();
    const rows: CSVRow[] = [];
    const readStream = fs.createReadStream(fullPath);
    const headersErrors: string[] = [];

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
            try {
              this.checkForErrorsAndLimit({
                headersErrors,
                limit: config?.limit,
                currentRowCount: rows.length,
              });

              rows.push(row);
            } catch (e) {
              return reject(e);
            }
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
    }

    return rows;
  }

  private static mapHeadersForCSV(
    refToErrorArray: string[]
  ): (header: { header: string; index: number }) => string | null {
    let propertyIndex = 0;
    let attributesIndex = 0;
    let currentType: CurrentType = null;

    return (header: { header: string; index: number }): string | null => {
      const {
        result,
        currentType: updatedType,
        propertyIndex: updatedPropertyIndex,
        attributesIndex: updatedAttributesIndex,
      } = this.processHeader(header, currentType, propertyIndex, attributesIndex, refToErrorArray);

      currentType = updatedType;
      propertyIndex = updatedPropertyIndex;
      attributesIndex = updatedAttributesIndex;

      return result;
    };
  }
}
