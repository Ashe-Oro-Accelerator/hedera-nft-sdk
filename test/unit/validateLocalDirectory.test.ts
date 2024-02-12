import fs from 'fs';
import { Hip412Validator } from '../../src/utils/services/Hip412Validator';
import { dictionary } from '../../src/utils/constants/dictionary';

jest.mock('fs');
const mockReadDirSync = fs.readdirSync as jest.Mock;

describe('Hip412Validator.validateLocalDirectory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return an error if the directory is empty', () => {
    mockReadDirSync.mockReturnValue([]);

    const validationResult = Hip412Validator.validateLocalDirectory('mock/empty/directory');
    expect(validationResult.isValid).toBe(false);
    expect(validationResult.errors[0].general).toContain(dictionary.validation.directoryIsEmpty);
  });
});
