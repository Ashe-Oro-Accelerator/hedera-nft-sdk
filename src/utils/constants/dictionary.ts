import { getFullSystemPath } from '../helpers/getFullSystemPath';

export const dictionary = {
  errors: {
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
    tooManyCustomFees: 'You can only have 10 custom fees',
    collectorAccountIdRequired: 'collectorAccountId is required',
    numeratorRequired: 'numerator is required',
    denominatorRequired: 'denominator is required',
    hbarAmountOrAmountAndDenominatingToken:
      'Either hbarAmount should be set and both amount and denominatingTokenId should not be set, or amount and denominatingTokenId should be set and hbarAmount should not be set.',
  },
  csvToJson: {
    errorInCellWithHeader: (line: number, column: number) =>
      `Error in line number ${line}, column number ${column}. Check if your CSV file is well prepared.`,
    tooManyValuesForValidationSchema: 'Too many values provided for the validation schema.',
    csvFileIsEmpty: (path: string) => `No metadata found in CSV file "${getFullSystemPath(path)}".`,
    errorInRow: (line: number | string, error: string) =>
      `Error at: line number ${typeof line === 'number' ? line + 1 : line} in ${getFullSystemPath(
        'exampleCSV.csv'
      )}\n${error}`,
    missingAttributesInRow: (csvFilePath: string, row: number) =>
      ` - "${getFullSystemPath(csvFilePath)}" in row ${row}`,
    imageForNftNotFound:
      'Image for NFT not found. The name of the image file should match its corresponding metadata file name (ex: 1.jpg with 1.json) or specify directly the "image" property.',
    mediaFileNotSupported: 'Media file is not supported.',
  },
  hederaActions: {
    clientRequired: 'client is required. You need to log in first.',
    myPrivateKeyRequired: 'myPrivateKey is required',
    collectionNameRequired: 'collectionName is required',
    collectionSymbolRequired: 'collectionSymbol is required',
    myAccountIdRequired: 'myAccountId is required',
    treasuryAccountPrivateKeySignRequired:
      'If you want to use treasuryAccount to sign, you need to pass the treasuryAccountPrivateKey also',
    collectionNotCreated: 'Something went wrong while creating the collection',
    mintingError: 'There was an error while minting the NFT.',
    maxBatchSize: 'Max Buffer exceeded. Use batchSize smaller of equal to 10',
    minBatchSize: 'Min Buffer exceeded. Use batchSize greater than 0',
    tokenIdRequired: 'tokenId is required',
    nftIdRequired: 'nftId is required',
    minAmount: 'Amount needs to be greater than 0',
    metadataRequired: 'metadata is required',
    supplyKeyRequired: 'supplyKey is required',
  },
  mintToken: {
    pathRequired: 'Path to File required',
    batchSizeUndefined: "batchSize can't be undefined",
    csvOrArrayRequired:
      'Either pass a path to file(pathToMetadataURIsFile) or an array of strings(metadata)',
    tooLongCID: 'One of the CIDs is longer than 100 characters',
  },
} as const;
