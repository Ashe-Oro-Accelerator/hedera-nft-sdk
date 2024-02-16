import { HederaNFTSDK } from '../../src/HederaNFTSDK';
import 'dotenv/config';
import { FeeFactory } from '../../src/FeeFactory';

export const operatorAccountId = process.env.FIRST_ACCOUNT_ID!;
export const operatorPrivateKey = process.env.FIRST_PRIVATE_KEY!;

export const secondAccountId = process.env.SECOND_ACCOUNT_ID!;
export const secondPrivateKey = process.env.SECOND_PRIVATE_KEY!;

export const nftSDK = new HederaNFTSDK(operatorAccountId, operatorPrivateKey, 'testnet');

export const feeFactoryInstance = new FeeFactory();

export const NETWORK = 'testnet';
export const IPFS_GATEWAY = 'https://cloudflare-ipfs.com/ipfs/';

export const LINK_TO_JSON_OBJECT_WITHOUT_ERRORS =
  'https://violet-written-whale-308.mypinata.cloud/ipfs/QmVbS1sbVWKe13RYUiwPkzG5cCESM2NHTx3CuhssYUvcRn';

export const LINK_TO_JSON_OBJECT_WITH_MISSING_FIELDS =
  'https://violet-written-whale-308.mypinata.cloud/ipfs/QmWC8VUgSkPM62mBznXqwqSvsCMSad1bxDzzqcwwYWueuf';

export const AMOUNT_OF_NFTS_TO_MINT = 35;
export const BATCH_SIZE = 5;
