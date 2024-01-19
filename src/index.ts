import axios from 'axios';

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
