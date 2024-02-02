import { PrivateKey } from '@hashgraph/sdk';
import errors from '../../src/dictionary/errors.json';
import { validateProps, validatePropsForUniqueNFTMinting } from '../../src/utils/validateProps';
describe('validateProps_Value_Errors', () => {
  it('should throw an error if batchSize is greater than 10', () => {
    expect(() => validateProps({ batchSize: 11 })).toThrow(errors.maxBatchSize);
  });

  it('should throw an error if batchSize is less than 1', () => {
    expect(() => validateProps({ batchSize: -1 })).toThrow(errors.minBatchSize);
  });

  it('should throw an error if tokenId is not provided', () => {
    expect(() => validateProps({ tokenId: '' })).toThrow(errors.tokenIdRequired);
  });

  it('should throw an error if metaData is not provided', () => {
    expect(() => validateProps({ metaData: '' })).toThrow(errors.metadataRequired);
  });

  it('should throw an error if supplyKey is not provided', () => {
    expect(() => validateProps({ supplyKey: undefined })).toThrow(errors.supplyKeyRequired);
  });

  it('should throw an error if pathToMetadataURIsFile is not provided', () => {
    expect(() => validateProps({ pathToMetadataURIsFile: '' })).toThrow(errors.pathRequired);
  });
});

describe('validateProps_MultipleProps_Errors', () => {
  it('should throw an error if batchSize is undefined and tokenId is valid', () => {
    expect(() => validateProps({ batchSize: undefined, tokenId: 'token123' })).toThrow(
      errors.batchSizeUndefined
    );
  });

  it('should throw an error if amount is undefined and metaData is valid', () => {
    expect(() => validateProps({ amount: undefined, metaData: 'metadata123' })).toThrow(
      errors.minAmount
    );
  });

  it('should throw an error if supplyKey is undefined and pathToMetadataURIsFile is valid', () => {
    expect(() =>
      validateProps({
        supplyKey: undefined,
        pathToMetadataURIsFile: 'path/to/file',
      })
    ).toThrow(errors.supplyKeyRequired);
  });

  it('should throw an error if metadataArray is undefined and pathToMetadataURIsFile is valid', () => {
    expect(() =>
      validateProps({ metadataArray: undefined, pathToMetadataURIsFile: 'path/to/file' })
    ).toThrow(errors.metadataRequired);
  });

  it('should not throw an error if metadataArray is defined and has a value, but pathToMetadataURIsFile is not defined', () => {
    expect(() => validateProps({ metadataArray: ['metadata1', 'metadata2'] })).not.toThrow();
  });

  it('should not throw an error if pathToMetadataURIsFile is defined and has a value, but metadataArray is not defined', () => {
    expect(() => validateProps({ pathToMetadataURIsFile: 'path/to/file' })).not.toThrow();
  });
});

describe('validateProps_For_Unique', () => {
  it('should not throw an error if isUnique is true and metadataArray is passed', () => {
    expect(() =>
      validatePropsForUniqueNFTMinting({
        metadataArray: ['metadata1', 'metadata2'],
        isUnique: true,
      })
    ).not.toThrow();
  });

  it('should not throw an error if isUnique is true and pathToMetadataURIsFile is passed', () => {
    expect(() =>
      validatePropsForUniqueNFTMinting({
        pathToMetadataURIsFile: 'path/to/file',
        isUnique: true,
      })
    ).not.toThrow();
  });

  it('should throw an error if isUnique is false and metadataArray is undefined', () => {
    expect(() =>
      validatePropsForUniqueNFTMinting({
        metadataArray: undefined,
        isUnique: false,
      })
    ).toThrow(errors.metadataRequired);
  });

  it('should throw an error if isUnique is false and pathToMetadataURIsFile is undefined', () => {
    expect(() =>
      validatePropsForUniqueNFTMinting({
        pathToMetadataURIsFile: undefined,
        isUnique: false,
      })
    ).toThrow(errors.pathRequired);
  });

  it('should throw an error if isUnique is true and metadataArray and pathToMetadataURIsFile are undefined', () => {
    expect(() =>
      validatePropsForUniqueNFTMinting({
        pathToMetadataURIsFile: undefined,
        metadataArray: undefined,
        isUnique: true,
      })
    ).toThrow(errors.csvOrArrayRequired);
  });

  it('should throw an error if isUnique is true and metadataArray is undefined', () => {
    expect(() =>
      validatePropsForUniqueNFTMinting({
        metadataArray: undefined,
        isUnique: true,
      })
    ).toThrow(errors.csvOrArrayRequired);
  });

  it('should throw an error if isUnique is true and pathToMetadataURIsFile is undefined', () => {
    expect(() =>
      validatePropsForUniqueNFTMinting({
        pathToMetadataURIsFile: undefined,
        isUnique: true,
      })
    ).toThrow(errors.csvOrArrayRequired);
  });
});

describe('validateProps_Success', () => {
  it('should not throw an error if batchSize is a number between 1 and 10', () => {
    expect(() => validateProps({ batchSize: 5 })).not.toThrow();
  });

  it('should not throw an error if tokenId is a string', () => {
    expect(() => validateProps({ tokenId: 'token123' })).not.toThrow();
  });

  it('should not throw an error if amount is a number greater than 0', () => {
    expect(() => validateProps({ amount: 5 })).not.toThrow();
  });

  it('should not throw an error if metaData is a string', () => {
    expect(() => validateProps({ metaData: 'metadata123' })).not.toThrow();
  });

  it('should not throw an error if supplyKey is a PrivateKey', () => {
    const privateKey = PrivateKey.generate();
    expect(() => validateProps({ supplyKey: privateKey })).not.toThrow();
  });

  it('should not throw an error if pathToMetadataURIsFile is a string', () => {
    expect(() => validateProps({ pathToMetadataURIsFile: 'path/to/file' })).not.toThrow();
  });

  it('should not throw an error if metadataArray is an array', () => {
    expect(() => validateProps({ metadataArray: ['metadata1', 'metadata2'] })).not.toThrow();
  });
});
