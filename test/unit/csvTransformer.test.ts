import fs from 'fs';
import cloneDeep from 'lodash/cloneDeep';
import { CSVRow, CSVRowAsObject, RedundantCell } from '../../src/types/csv';
import { CsvTransformer } from '../../src/utils/services/csvTransformer';
import {
  JSON_METADATA_UNIT_TESTS_OUTPUT_METADATA_FOLDER_PATH,
  JSON_METADATA_UNIT_TESTS_OUTPUT_NEW_METADATA_FOLDER_PATH,
} from '../__mocks__/consts';

const csvRows: CSVRow[] = [
  {
    name: '',
    creator: '',
    description: '',
    properties_1: 'url',
    properties_2: 'url',
    attributes_1: 'color',
    attributes_2: 'color',
    attributes_3: '',
  },
  {
    name: 'Example NFT 1',
    creator: 'Hedera',
    description: 'This is an example NFT 2',
    properties_1: 'Cool collection',
    properties_2: 'https://nft.com/mycollection/1',
    attributes_1: 'red',
    attributes_2: 'long',
    attributes_3: '',
  },
  {
    name: 'Example NFT 2',
    creator: 'Hedera',
    description: 'This is an example NFT 2',
    properties_1: 'Cool collection',
    properties_2: 'https://nft.com/mycollection/2',
    attributes_1: 'black',
    attributes_2: 'short',
    attributes_3: '',
  },
];

const csvRowsWithRedundantCells: CSVRow[] = [
  {
    name: '',
    creator: '',
    description: '',
    properties_1: 'url',
    properties_2: 'url',
    attributes_1: 'color',
    attributes_2: 'color',
    attributes_3: '',
  },
  {
    name: 'Example NFT 1',
    creator: 'Hedera',
    description: 'This is an example NFT 2',
    properties_1: 'Cool collection',
    properties_2: 'https://nft.com/mycollection/1',
    attributes_1: 'red',
    attributes_2: 'long',
    attributes_3: '',
    attributes_4: '',
    attributes_5: '',
    attributes_6: '',
    attributes_7: '',
    attributes_8: '',
    attributes_9: '',
    attributes_10: '',
    attributes_11: '',
    attributes_12: '',
    attributes_13: '',
    attributes_14: '',
    attributes_15: '',
    _20: '',
    _21: '',
    _22: '',
    _23: '',
    _24: '',
    _25: '',
    _26: 'adasd',
    _27: '',
  },
  {
    name: 'Example NFT 2',
    creator: 'Hedera',
    description: 'This is an example NFT 2',
    properties_1: 'Cool collection',
    properties_2: 'https://nft.com/mycollection/2',
    attributes_1: 'black',
    attributes_2: 'short',
    attributes_3: '',
  },
];

const objectsFromCsvRows = [
  {
    name: 'Example NFT 1',
    creator: 'Hedera',
    description: 'This is an example NFT 2',
    properties: { url: 'https://nft.com/mycollection/1' },
    attributes: [
      { trait_type: 'color', value: 'red' },
      { trait_type: 'color', value: 'long' },
    ],
  },
  {
    name: 'Example NFT 2',
    creator: 'Hedera',
    description: 'This is an example NFT 2',
    properties: { url: 'https://nft.com/mycollection/2' },
    attributes: [
      { trait_type: 'color', value: 'black' },
      { trait_type: 'color', value: 'short' },
    ],
  },
];

describe('csvTransformer', () => {
  describe('saveCsvRowsAsJsonFiles', () => {
    it('should save content of CSVRowAsObject[] to json files', () => {
      const csvRowAsObjects: {
        objectsFromCsvRows: CSVRowAsObject[];
        redundantCells: RedundantCell[];
      } = CsvTransformer.metadataObjectsFromRows({
        csvRows: cloneDeep(csvRows),
        path: 'csvFilePath',
        headerAttributes: 'attributes',
        headerProperties: 'properties',
      });

      CsvTransformer.saveCsvRowsAsJsonFiles(
        csvRowAsObjects.objectsFromCsvRows,
        JSON_METADATA_UNIT_TESTS_OUTPUT_METADATA_FOLDER_PATH
      );

      const firstJson = JSON.parse(
        fs.readFileSync(`${JSON_METADATA_UNIT_TESTS_OUTPUT_METADATA_FOLDER_PATH}/1.json`).toString()
      );
      const secondJson = JSON.parse(
        fs.readFileSync(`${JSON_METADATA_UNIT_TESTS_OUTPUT_METADATA_FOLDER_PATH}/2.json`).toString()
      );

      fs.rmSync(JSON_METADATA_UNIT_TESTS_OUTPUT_METADATA_FOLDER_PATH, {
        recursive: true,
        force: true,
      });
      fs.mkdirSync(JSON_METADATA_UNIT_TESTS_OUTPUT_METADATA_FOLDER_PATH, { recursive: true });

      expect([firstJson, secondJson]).toStrictEqual(objectsFromCsvRows);
    });

    it('should create directory if path do not point to directory save content of CSVRowAsObject[] to json files', () => {
      const csvRowAsObjects: {
        objectsFromCsvRows: CSVRowAsObject[];
        redundantCells: RedundantCell[];
      } = CsvTransformer.metadataObjectsFromRows({
        csvRows: cloneDeep(csvRows),
        path: 'csvFilePath',
        headerAttributes: 'attributes',
        headerProperties: 'properties',
      });

      CsvTransformer.saveCsvRowsAsJsonFiles(
        csvRowAsObjects.objectsFromCsvRows,
        JSON_METADATA_UNIT_TESTS_OUTPUT_NEW_METADATA_FOLDER_PATH
      );

      const firstJson = JSON.parse(
        fs
          .readFileSync(`${JSON_METADATA_UNIT_TESTS_OUTPUT_NEW_METADATA_FOLDER_PATH}/1.json`)
          .toString()
      );
      const secondJson = JSON.parse(
        fs
          .readFileSync(`${JSON_METADATA_UNIT_TESTS_OUTPUT_NEW_METADATA_FOLDER_PATH}/2.json`)
          .toString()
      );

      fs.rmSync(JSON_METADATA_UNIT_TESTS_OUTPUT_NEW_METADATA_FOLDER_PATH, {
        recursive: true,
        force: true,
      });
      fs.mkdirSync(JSON_METADATA_UNIT_TESTS_OUTPUT_NEW_METADATA_FOLDER_PATH, { recursive: true });

      expect([firstJson, secondJson]).toStrictEqual(objectsFromCsvRows);
    });
  });

  describe('metadataObjectsFromRows', () => {
    it('should transform CSV rows into metadata objects', () => {
      const result = CsvTransformer.metadataObjectsFromRows({
        csvRows: csvRows,
        path: 'csvFilePath',
        headerAttributes: 'attributes',
        headerProperties: 'properties',
      });
      expect(result).toEqual({
        objectsFromCsvRows,
        redundantCells: [],
      });
    });

    it('should throw an error when the CSV rows are empty', () => {
      expect(() =>
        CsvTransformer.metadataObjectsFromRows({
          csvRows: [],
          path: 'csvFilePath',
          headerAttributes: 'attributes',
          headerProperties: 'properties',
        })
      ).toThrow();
    });
    it('should transform CSV rows into metadata objects and redundant cells', () => {
      const result = CsvTransformer.metadataObjectsFromRows({
        csvRows: csvRowsWithRedundantCells,
        path: 'csvFilePath',
        headerAttributes: 'attributes',
        headerProperties: 'properties',
      });
      expect(result).toEqual({
        objectsFromCsvRows,
        redundantCells: [
          { cell: '', index: 0 },
          { cell: '', index: 0 },
          { cell: '', index: 0 },
          { cell: '', index: 0 },
          { cell: '', index: 0 },
          { cell: '', index: 0 },
          { cell: 'adasd', index: 0 },
          { cell: '', index: 0 },
        ],
      });
    });
  });
});
