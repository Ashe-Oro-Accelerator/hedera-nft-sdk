import { dictionary } from '../utils/constants/dictionary';
import { Hip412Metadata } from '../utils/hedera/hip412-metadata';
import { errorToMessage } from '../utils/helpers/errorToMessage';
import { CSVFileReader } from '../CsvFileReader';
import { CsvTransformer } from '../utils/services/csvTransformer';
import type { RedundantCell } from '../types/csv';
import forEach from 'lodash/forEach';

export const createJsonMetadataFromCsv = async ({
  jsonMetadataOutputFolderPath,
  csvFilePath,
  nftsLimit,
}: {
  jsonMetadataOutputFolderPath: string;
  csvFilePath: string;
  nftsLimit?: number;
}): Promise<
  {
    errors: string[];
    redundantCells: RedundantCell[];
    noAttributesFileLocation: string[];
    savedJsonFilesLocation: string;
  } & {
    redundantCells: RedundantCell[];
  }
> => {
  const csvFile = await CSVFileReader.readCSVFile(csvFilePath, {
    limit: nftsLimit,
  });

  const { objectsFromCsvRows, redundantCells } = CsvTransformer.metadataObjectsFromRows({
    csvRows: csvFile,
    path: csvFilePath,
    headerAttributes: CSVFileReader.ATTRIBUTES,
    headerProperties: CSVFileReader.PROPERTIES,
  });

  const csvValidationErrors: string[] = [];

  forEach(objectsFromCsvRows, (metadata, index) => {
    try {
      Hip412Metadata.validateMetadataFromCsv({ ...metadata });
    } catch (e) {
      csvValidationErrors.push(dictionary.csvToJson.errorInRow(index + 1, errorToMessage(e)));
    }
  });

  CsvTransformer.saveCsvRowsAsJsonFiles(objectsFromCsvRows, jsonMetadataOutputFolderPath);

  const noAttributesRowsLocations = objectsFromCsvRows.reduce<string[]>((acc, row, index) => {
    if (!row.attributes) {
      acc.push(dictionary.csvToJson.missingAttributesInRow(csvFilePath, index + 1));
    }
    return acc;
  }, []);

  return {
    errors: [...csvValidationErrors],
    redundantCells,
    noAttributesFileLocation: noAttributesRowsLocations,
    savedJsonFilesLocation: jsonMetadataOutputFolderPath,
  };
};
