import { dictionary } from '../utils/constants/dictionary';
import { Hip412Metadata } from '../utils/hedera/hip412-metadata';
import { errorToMessage } from '../utils/helpers/errorToMessage';
import { CSVFileReader } from '../CSVFileReader';
import { JsonMetadataFromCSVConverter } from '../utils/services/JsonMetadataFromCSVConverter';
import { CSVRowAsObject } from '../types/csv';
import { JsonMetadataFromCSVInterface } from '../types/jsonMetadataFromCSV';

const validateMetadataObjects = (
  metadataObjectsFromCSVRows: CSVRowAsObject[],
  csvFilePath: string
): { metadataObjectsValidationErrors: string[]; missingAttributesErrors: string[] } => {
  const metadataObjectsValidationErrors: string[] = [];
  const missingAttributesErrors: string[] = [];

  for (const [index, metadataObject] of metadataObjectsFromCSVRows.entries()) {
    try {
      Hip412Metadata.validateMetadataFromCSV(metadataObject);
    } catch (e) {
      metadataObjectsValidationErrors.push(
        dictionary.csvToJson.errorInRow(index + 1, errorToMessage(e))
      );
    }

    if (!metadataObject.attributes) {
      missingAttributesErrors.push(
        dictionary.csvToJson.missingAttributesInRow(csvFilePath, index + 1)
      );
    }
  }

  return { metadataObjectsValidationErrors, missingAttributesErrors };
};

export const createJsonMetadataFromCSV = async ({
  savedJsonFilesLocation,
  csvFilePath,
  nftsLimit,
}: {
  savedJsonFilesLocation: string;
  csvFilePath: string;
  nftsLimit?: number;
}): Promise<JsonMetadataFromCSVInterface> => {
  const csvParsedRows = await CSVFileReader.readCSVFile(csvFilePath, {
    limit: nftsLimit,
  });

  const metadataObjectsFromCSVRows = JsonMetadataFromCSVConverter.parseCSVRowsToMetadataObjects({
    csvParsedRows,
    csvFilePath,
    headerAttributes: CSVFileReader.ATTRIBUTES,
    headerProperties: CSVFileReader.PROPERTIES,
  });

  const { metadataObjectsValidationErrors, missingAttributesErrors } = validateMetadataObjects(
    metadataObjectsFromCSVRows,
    csvFilePath
  );

  JsonMetadataFromCSVConverter.saveCSVRowsAsJsonFiles(
    metadataObjectsFromCSVRows,
    savedJsonFilesLocation
  );

  return {
    errors: {
      metadataObjectsValidationErrors,
      missingAttributesErrors,
    },
    savedJsonFilesLocation,
  };
};
