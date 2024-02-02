import fs from 'fs';
import { CSVFileReader } from '../../src/CsvFileReader';
import { CSVRow } from '../../src/types/csv';
import { Readable } from 'stream';

jest.mock('fs');

describe('CSVFileReader', () => {
  const filePath = 'example.csv';

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should read a CSV file correctly', async () => {
    const mockData: CSVRow[] = [
      { header1: 'value1', header2: 'value2' },
      { header1: 'value3', header2: 'value4' },
    ];

    const mockStream = new Readable({
      read() {
        this.push('header1,header2\nvalue1,value2\nvalue3,value4');
        this.push(null);
      },
    });

    (fs.createReadStream as jest.Mock).mockReturnValue(mockStream);

    const result = await CSVFileReader.readCSVFile(filePath);
    expect(result).toEqual(mockData);
  });
});
