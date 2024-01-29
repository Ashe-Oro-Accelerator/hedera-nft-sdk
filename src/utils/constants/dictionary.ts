import { getFullSystemPath } from '../helpers/getFullSystemPath';

export const dictionary = {
  general: {
    unhandledError: 'Unknown error.',
  },
  createCollection: {
    clientRequired: 'client is required. You need to log in first.',
    myPrivateKeyRequired: 'myPrivateKey is required',
    collectionNameRequired: 'collectionName is required',
    collectionSymbolRequired: 'collectionSymbol is required',
    myAccountIdRequired: 'myAccountId is required',
    treasuryAccountPrivateKeySignRequired:
      'If you want to use treasuryAccount to sign, you need to pass the treasuryAccountPrivateKey also',
    collectionNotCreated: 'Something went wrong while creating the collection',
  },
  csvToJson: {
    errorInCellWithHeader: (line: number, column: number) =>
      `Error in line number ${line}, column number ${column}. Check if your CSV file is well prepared.`,
    tooManyValuesForValidationSchema: 'Too many values provided for the validation schema.',
    csvFileIsEmpty: (path: string) => `No metadata found in CSV file "${getFullSystemPath(path)}".`,
    errorInRow: (line: number | string, error: string) =>
      `Error at: line number ${typeof line === 'number' ? line + 1 : line} in ${getFullSystemPath(
        'metadata.csv'
      )}\n${error}`,
    missingAttributesInRow: (csvFilePath: string, row: number) =>
      ` - "${getFullSystemPath(csvFilePath)}" in row ${row}`,
    imageForNftNotFound:
      'Image for NFT not found. Please make sure the image is included in the "data/media" directory.  The name of the image file should match its corresponding metadata file name (ex: 1.jpg with 1.json) or specify directly the "image" property.',
    mediaFileNotSupported: 'Media file is not supported.',
  },
} as const;
