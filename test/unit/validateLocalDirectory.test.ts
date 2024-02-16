import fs from 'fs';
import path from 'path';

import { Hip412Validator } from '../../src/utils/services/Hip412Validator';
import { dictionary } from '../../src/utils/constants/dictionary';

jest.mock('fs');
const mockReadDirSync = fs.readdirSync as jest.Mock;
const mockReadFileSync = fs.readFileSync as jest.Mock;

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

  it('should validate only .txt and .json files', () => {
    const mockFiles = ['valid_file.json', 'another_valid_file.txt', 'ignore_this.md', '.gitkeep'];
    mockReadDirSync.mockReturnValue(mockFiles);

    const mockContent = JSON.stringify({
      name: 'Test NFT',
      image: 'https://nft.com/mycollection/1.jpg',
      type: 'image/jpeg',
    });

    mockReadFileSync.mockImplementation((filePath) => {
      if (filePath.includes('.json') || filePath.includes('.txt')) {
        return mockContent;
      }
      return null;
    });

    const directoryPath = 'mock/directory';
    const validationResult = Hip412Validator.validateLocalDirectory(directoryPath);

    expect(mockReadFileSync).toHaveBeenCalledTimes(2);
    mockFiles.forEach((file) => {
      if (file.endsWith('.json') || file.endsWith('.txt')) {
        expect(mockReadFileSync).toHaveBeenCalledWith(path.join(directoryPath, file), 'utf8');
      }
    });

    expect(validationResult.isValid).toBe(true);
  });
});
