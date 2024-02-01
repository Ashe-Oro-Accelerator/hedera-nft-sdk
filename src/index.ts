require('dotenv').config();
import { HederaNFTSDK } from './HederaNFTSDK';
import { PrivateKey } from '@hashgraph/sdk';

const myPrivateKey = process.env.FIRST_PRIVATE_KEY!;
const myAccountId = process.env.FIRST_ACCOUNT_ID!;

console.log('myAccountIdwnv', process.env.FIRST_ACCOUNT_ID);

const nftSDK = new HederaNFTSDK(myAccountId, myPrivateKey);

(async () => {
  const transactionStatus = await nftSDK.mintUniqueMetadata({
    tokenId: '0.0.7693793',
    batchSize: 5,
    metadata: [
      'https://www.youtube.com1',
      'https://www.youtube.com2',
      'https://www.youtube.com3',
      'https://www.youtube.com4',
      'https://www.youtube.com5',
    ],
    supplyKey: PrivateKey.fromString(myPrivateKey),
  });

  console.log(transactionStatus);
})();

// // TODO: function fetchForTesting needs to be deleted after we agree that our testing flow is correct
// export const fetchForTesting = async () => {
//   const API_URL = 'https://testnet.mirrornode.hedera.com/api/v1/accounts';
//   const response = await axios.get(API_URL);
//   return response;
// };
