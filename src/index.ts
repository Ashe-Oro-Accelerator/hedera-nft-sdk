import axios from 'axios';
import { HederaNFTSDK } from './HederaNFTSDK';
import 'dotenv/config';

// const myPrivateKey = process.env.MY_PRIVATE_KEY!;
// const myAccountId = process.env.MY_ACCOUNT_ID!;

// const nftSDK = new HederaNFTSDK(myAccountId, myPrivateKey);
//
// (async () => {
//   const tokenId = await nftSDK.createCollection('test', 'test2');
//
//   console.log(tokenId);
// })();

// TODO: function fetchForTesting needs to be deleted after we agree that our testing flow is correct
export const fetchForTesting = async () => {
  const API_URL = 'https://testnet.mirrornode.hedera.com/api/v1/accounts';
  const response = await axios.get(API_URL);
  return response;
};
