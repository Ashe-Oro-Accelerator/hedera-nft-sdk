import fs from 'fs';
import { Hip412Validator } from '../../src/utils/services/Hip412Validator';
import { dictionary } from '../../src/utils/constants/dictionary';

jest.mock('fs');
const mockReadFileSync = fs.readFileSync as jest.Mock;

describe('Hip412Validator.validateLocalFile', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should throw errors during file reading without permissions', () => {
    mockReadFileSync.mockImplementation(() => {
      throw new Error(dictionary.validation.filePermissionDenied);
    });
    const validationResult = Hip412Validator.validateLocalFile('mockPath.json');
    expect(validationResult.isValid).toBe(false);
    expect(validationResult.errors).toContain(dictionary.validation.filePermissionDenied);
  });

  it('should handle JSON files with formatting errors', () => {
    mockReadFileSync.mockImplementation(() => {
      throw new Error(dictionary.validation.fileEmptyOrFormattingError);
    });
    const validationResult = Hip412Validator.validateLocalFile('mockPath.json');
    expect(validationResult.isValid).toBe(false);
    expect(validationResult.errors).toEqual([dictionary.validation.fileEmptyOrFormattingError]);
  });

  it('should handle empty or non-existent JSON files', () => {
    mockReadFileSync.mockReturnValue('');
    const validationResult = Hip412Validator.validateLocalFile('path/to/empty.json');
    expect(validationResult.isValid).toBe(false);
    expect(validationResult.errors).toEqual([dictionary.validation.fileEmptyOrFormattingError]);
  });

  it('should validate correctly structured JSON file', () => {
    const validJson = JSON.stringify({
      name: 'Example NFT',
      image: 'https://example.com/nft.jpg',
      type: 'image/jpeg',
    });
    mockReadFileSync.mockReturnValue(validJson);
    const validationResult = Hip412Validator.validateLocalFile('path/to/valid.json');
    expect(validationResult.isValid).toBe(true);
    expect(validationResult.errors).toHaveLength(0);
  });
});
