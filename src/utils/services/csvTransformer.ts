import fs from 'fs';
import { dictionary } from '../constants/dictionary';
import { CSVFileReader } from '../../CsvFileReader';
import type { CSVRow, CSVRowAsObject, RedundantCell } from '../../types/csv';

const OMITTED_HEADER_COUNT = 1;

export class CsvTransformer {
  static saveCsvRowsAsJsonFiles = (metadataFromCsv: CSVRowAsObject[], folderPath: string): void => {
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
    }

    fs.mkdirSync(folderPath, { recursive: true });

    metadataFromCsv.forEach((fileContent, index) => {
      const fileName = `${folderPath}/${index + 1}.json`;
      fs.writeFileSync(fileName, JSON.stringify(fileContent), { encoding: 'utf-8' });
    });
  };

  private static processCsvRowEntry(
    csvRowAsObject: CSVRowAsObject,
    header: string,
    cell: string,
    index: number,
    secondHeader: CSVRow,
    headerAttributes: string,
    headerProperties: string,
    attributes: Record<string, string>[],
    properties: Record<string, string>,
    redundantCells: RedundantCell[]
  ): CSVRowAsObject {
    // in csv-parser cells without corresponding headers start with "_"
    if (header.startsWith('_')) {
      redundantCells.push({ cell, index });
    } else if (cell && header.includes(headerAttributes)) {
      attributes.push({ trait_type: secondHeader[header], value: cell });
    } else if (cell && header.includes(headerProperties)) {
      properties[secondHeader[header]] = cell;
    } else if (cell) {
      csvRowAsObject[header] = cell;
    }

    return csvRowAsObject;
  }

  static metadataObjectsFromRows({
    csvRows,
    path,
    headerAttributes,
    headerProperties,
  }: {
    csvRows: CSVRow[];
    path: string;
    headerAttributes: string;
    headerProperties: string;
  }): {
    objectsFromCsvRows: CSVRowAsObject[];
    redundantCells: RedundantCell[];
  } {
    if (csvRows.length <= CSVFileReader.AMOUNT_OF_HEADERS - OMITTED_HEADER_COUNT) {
      throw new Error(dictionary.csvToJson.csvFileIsEmpty(path));
    }
    const redundantCells: { cell: string; index: number }[] = [];
    const secondHeader = csvRows[0];
    csvRows.shift();

    const transformedRows = csvRows.map((csvRow, index): CSVRowAsObject => {
      const csvRowAsEntries = Object.entries(csvRow);
      const properties: Record<string, string> = {};
      const attributes: Record<string, string>[] = [];

      const result = csvRowAsEntries.reduce<CSVRowAsObject>((acc, [header, cell]) => {
        return this.processCsvRowEntry(
          acc,
          header,
          cell,
          index,
          secondHeader,
          headerAttributes,
          headerProperties,
          attributes,
          properties,
          redundantCells
        );
      }, {});

      if (Object.keys(properties).length) {
        result.properties = properties;
      }

      if (attributes.length) {
        result.attributes = attributes;
      }

      return result;
    });

    return { objectsFromCsvRows: transformedRows, redundantCells };
  }
}
