import { Hip412Validator } from '../../src/utils/services/Hip412Validator';
import { dictionary } from '../../src/utils/constants/dictionary';
import {
  EMPTY_JSON_DIRECTORY_PATH,
  NON_EMPTY_JSON_DIRECTORY_PATH,
  FILES_WITH_MIXED_EXTENSION_PATH,
} from '../__mocks__/consts';

describe('Hip412Validator.validateLocalDirectory integration tests', () => {
  it('should return an error if the directory is empty', () => {
    const validationResult = Hip412Validator.validateLocalDirectory(EMPTY_JSON_DIRECTORY_PATH);
    expect(validationResult.isValid).toBe(false);
    expect(validationResult.errors.length).toBeGreaterThan(0);
    expect(validationResult.errors[0].general).toContain(dictionary.validation.directoryIsEmpty);
  });

  it('should not return any errors if the directory contains valid JSON files', () => {
    const validationResult = Hip412Validator.validateLocalDirectory(NON_EMPTY_JSON_DIRECTORY_PATH);
    expect(validationResult.isValid).toBe(true);
    expect(validationResult.errors.length).toBe(0);
  });

  it('should not return any errors if the directory contains valid text files with extensions other than JSON', () => {
    const validationResult = Hip412Validator.validateLocalDirectory(
      FILES_WITH_MIXED_EXTENSION_PATH
    );

    expect(validationResult.isValid).toBe(true);
    expect(validationResult.errors.length).toBe(0);
  });
});
