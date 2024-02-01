import { CSVFileReader, CSVReaderError } from '../../src/CsvFileReader';

describe('CSVFileReader', () => {
  const invalidHeadersFilePath = 'test/__mocks__/csvFileReader/invalidHeaders.csv';

  test('should throw error if invalid headers', async () => {
    await expect(() => CSVFileReader.readCSVFile(invalidHeadersFilePath)).rejects.toThrow(
      CSVReaderError
    );
  });
});
