import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { Hip412MetadataCommonSchema } from '../../src/utils/validation-schemas/hip412Metadata.schema';
import { createJsonMetadataFromCsv } from '../../src/functions/createJsonMetadataFromCsv';
import {
  JSON_METADATA_TESTS_OUTPUT_FOLDER_PATH,
  CSV_EXAMPLE_WITH_IMAGES,
  CSV_EXAMPLE_ONLY_REQUIRED_FIELDS,
  CSV_EXAMPLE_WITH_MISSING_REQUIRED_FIELDS,
  TIME_FOR_LONG_TEST,
} from '../__mocks__/consts';

const HEADERS_COUNT = 2;

describe('createJsonMetadataFromCsv Integration Test', () => {
  let files: string[];

  beforeAll(() => {
    if (!fs.existsSync(JSON_METADATA_TESTS_OUTPUT_FOLDER_PATH)) {
      fs.mkdirSync(JSON_METADATA_TESTS_OUTPUT_FOLDER_PATH, { recursive: true });
    }
  });

  afterAll(() => {
    fs.rmSync(JSON_METADATA_TESTS_OUTPUT_FOLDER_PATH, { recursive: true, force: true });
  });

  test('createJsonMetadataFromCsv should complete without errors', async () => {
    const result = await createJsonMetadataFromCsv({
      jsonMetadataOutputFolderPath: JSON_METADATA_TESTS_OUTPUT_FOLDER_PATH,
      csvFilePath: CSV_EXAMPLE_WITH_IMAGES,
    });

    expect(result.errors).toHaveLength(0);
  });

  test(
    'createJsonMetadataFromCsv should create correct number of JSON files based on the CSV file',
    () => {
      files = fs.readdirSync(JSON_METADATA_TESTS_OUTPUT_FOLDER_PATH);
      const csvContent = fs.readFileSync(CSV_EXAMPLE_WITH_IMAGES, 'utf-8');
      const csvRows = csvContent.trim().split('\n').length;
      const expectedJsonFilesCount = csvRows - HEADERS_COUNT;

      expect(files.length).toBe(expectedJsonFilesCount);
    },
    TIME_FOR_LONG_TEST
  );

  test('Each file should match Hip412MetadataSchema', () => {
    const Hip412MetadataSchema = z.object(Hip412MetadataCommonSchema);

    files.forEach((file) => {
      const filePath = path.join(JSON_METADATA_TESTS_OUTPUT_FOLDER_PATH, file);
      const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      expect(() => Hip412MetadataSchema.parse(jsonData)).not.toThrow();
    });
  });

  test('createJsonMetadataFromCsv should create a limited number of JSON files when nftsLimit is set', async () => {
    const nftsLimit = 2;

    await createJsonMetadataFromCsv({
      jsonMetadataOutputFolderPath: JSON_METADATA_TESTS_OUTPUT_FOLDER_PATH,
      csvFilePath: CSV_EXAMPLE_WITH_IMAGES,
      nftsLimit,
    });

    const generatedFiles = fs.readdirSync(JSON_METADATA_TESTS_OUTPUT_FOLDER_PATH);
    expect(generatedFiles.length).toBe(nftsLimit);
  });

  test('createJsonMetadataFromCsv should complete without errors using CSV with only required fields filled', async () => {
    const result = await createJsonMetadataFromCsv({
      jsonMetadataOutputFolderPath: JSON_METADATA_TESTS_OUTPUT_FOLDER_PATH,
      csvFilePath: CSV_EXAMPLE_ONLY_REQUIRED_FIELDS,
    });

    expect(result.errors).toHaveLength(0);
  });

  test('createJsonMetadataFromCsv should return errors for missing required fields in CSV', async () => {
    const result = await createJsonMetadataFromCsv({
      jsonMetadataOutputFolderPath: JSON_METADATA_TESTS_OUTPUT_FOLDER_PATH,
      csvFilePath: CSV_EXAMPLE_WITH_MISSING_REQUIRED_FIELDS,
    });

    expect(result.errors).toHaveLength(6);
  });
});
