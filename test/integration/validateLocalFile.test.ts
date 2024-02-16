import { dictionary } from '../../src/utils/constants/dictionary';
import { Hip412Validator } from '../../src/utils/services/Hip412Validator';
import { EMPTY_JSON_EXAMPLE_PATH, CORRECT_EXAMPLE_PATH } from '../__mocks__/consts';

describe('Hip412Validator.validateLocalFile integration tests', () => {
  it('should return an error if the file is empty', () => {
    const validationResult = Hip412Validator.validateLocalFile(EMPTY_JSON_EXAMPLE_PATH);
    expect(validationResult.isValid).toBe(false);
    expect(validationResult.errors).toContain(dictionary.validation.fileEmptyOrFormattingError);
  });

  it('should validate correctly structured JSON file', () => {
    const validationResult = Hip412Validator.validateLocalFile(CORRECT_EXAMPLE_PATH);
    expect(validationResult.isValid).toBe(true);
    expect(validationResult.errors.length).toBe(0);
  });
});
