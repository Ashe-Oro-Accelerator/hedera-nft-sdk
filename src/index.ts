import axios from 'axios';
import { csvToJson } from './csvToJson';
import { CSV_FILE_PATH } from './utils/const';

export const sum = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log('dev only output');
  }
  return a + b;
};

// TODO: function fetchForTesting needs to be deleted after we agree that our testing flow is correct
export const fetchForTesting = async () => {
  const API_URL = 'https://testnet.mirrornode.hedera.com/api/v1/accounts';
  const response = await axios.get(API_URL);
  return response;
};

csvToJson(CSV_FILE_PATH)
  .then((targetDirectory) => {
    console.log(`JSON files have been saved in directory: ${targetDirectory}`);
  })
  .catch((errors) => {
    console.error('An error occurred:', errors);
  });
