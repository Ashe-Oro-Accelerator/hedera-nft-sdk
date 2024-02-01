import { CSVFileReader, CSVReaderError } from '../../src/CsvFileReader';
import { CSV_EXAMPLE_INVALID_HEADERS } from '../__mocks__/consts';

describe('CSVFileReader', () => {
  test('should throw error if invalid headers', async () => {
    await expect(() => CSVFileReader.readCSVFile(CSV_EXAMPLE_INVALID_HEADERS)).rejects.toThrow(
      CSVReaderError
    );
  });
});
