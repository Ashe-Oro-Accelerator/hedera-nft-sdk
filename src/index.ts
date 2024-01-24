import axios from 'axios';
import 'dotenv/config';
import { HederaNFTSDK } from './HederaNFTSDK';

const myPrivateKey = process.env.FIRST_PRIVATE_KEY!;
const myAccountId = process.env.FIRST_ACCOUNT_ID!;

const nftSDK = new HederaNFTSDK(myAccountId, myPrivateKey);

(async () => {
  const tokenId = await nftSDK.createCollection('test', 'test2');

  console.log(tokenId);
})();

// // TODO: function fetchForTesting needs to be deleted after we agree that our testing flow is correct
// export const fetchForTesting = async () => {
//   const API_URL = 'https://testnet.mirrornode.hedera.com/api/v1/accounts';
//   const response = await axios.get(API_URL);
//   return response;
// };
