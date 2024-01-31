import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { Hip412MetadataCommonSchema } from '../../src/utils/validation-schemas/hip412Metadata.schema';
import { createJsonMetadataFromCsv } from '../../src/functions/createJsonMetadataFromCsv';

const HEADERS_COUNT = 2;

describe('createJsonMetadataFromCsv Integration Test', () => {
  const jsonMetadataOutputFolderPath = 'test/integration/output';
  let files: string[];

  beforeAll(() => {
    if (!fs.existsSync(jsonMetadataOutputFolderPath)) {
      fs.mkdirSync(jsonMetadataOutputFolderPath, { recursive: true });
    }
  });

  afterAll(() => {
    fs.rmSync(jsonMetadataOutputFolderPath, { recursive: true, force: true });
  });

  test('createJsonMetadataFromCsv should complete without errors', async () => {
    const csvFilePath = 'test/__mocks__/csvExampleWithImages.csv';
    const result = await createJsonMetadataFromCsv({
      jsonMetadataOutputFolderPath,
      csvFilePath,
    });

    expect(result.errors).toHaveLength(0);
  });

  test('createJsonMetadataFromCsv should create correct number of JSON files based on the CSV file', () => {
    const csvFilePath = 'test/__mocks__/csvExampleWithImages.csv';

    files = fs.readdirSync(jsonMetadataOutputFolderPath);
    const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
    const csvRows = csvContent.trim().split('\n').length;
    const expectedJsonFilesCount = csvRows - HEADERS_COUNT;

    expect(files.length).toBe(expectedJsonFilesCount);
  }, 10000);

  test('Each file should match Hip412MetadataSchema', () => {
    const Hip412MetadataSchema = z.object(Hip412MetadataCommonSchema);

    files.forEach((file) => {
      const filePath = path.join(jsonMetadataOutputFolderPath, file);
      const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      expect(() => Hip412MetadataSchema.parse(jsonData)).not.toThrow();
    });
  });

  test('createJsonMetadataFromCsv should create a limited number of JSON files when nftsLimit is set', async () => {
    const csvFilePath = 'test/__mocks__/csvExampleWithImages.csv';
    const nftsLimit = 2;

    await createJsonMetadataFromCsv({
      jsonMetadataOutputFolderPath,
      csvFilePath,
      nftsLimit,
    });

    const generatedFiles = fs.readdirSync(jsonMetadataOutputFolderPath);
    expect(generatedFiles.length).toBe(nftsLimit);
  });

  test('createJsonMetadataFromCsv should complete without errors using CSV with only required fields filled', async () => {
    const csvFilePath = 'test/__mocks__/csvExampleOnlyRequiredFields.csv';

    const result = await createJsonMetadataFromCsv({
      jsonMetadataOutputFolderPath,
      csvFilePath,
    });

    expect(result.errors).toHaveLength(0);
  });

  test('createJsonMetadataFromCsv should return errors for missing required fields in CSV', async () => {
    const csvFilePath = 'test/__mocks__/csvExampleWithMissingRequiredFields.csv';

    const result = await createJsonMetadataFromCsv({
      jsonMetadataOutputFolderPath,
      csvFilePath,
    });

    expect(result.errors).toHaveLength(6);
  });
});
