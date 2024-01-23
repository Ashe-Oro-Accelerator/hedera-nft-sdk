import { HederaNFTSDK } from './HederaNFTSDK';
import 'dotenv/config';

const myPrivateKey = process.env.MY_PRIVATE_KEY!;
const myAccountId = process.env.MY_ACCOUNT_ID!;

const nftSDK = new HederaNFTSDK(myAccountId, myPrivateKey);

(async () => {
  const tokenId = await nftSDK.createCollection('test', 'test2');

  console.log(tokenId);
})();
