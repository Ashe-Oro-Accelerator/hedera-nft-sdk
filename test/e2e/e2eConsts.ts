import { HederaNFTSDK } from '../../src/HederaNFTSDK';
import 'dotenv/config';

export const operatorAccountId = process.env.FIRST_ACCOUNT_ID!;
export const operatorPrivateKey = process.env.FIRST_PRIVATE_KEY!;

export const secondAccountId = process.env.SECOND_ACCOUNT_ID!;
export const secondPrivateKey = process.env.SECOND_PRIVATE_KEY!;

export const nftSDK = new HederaNFTSDK(operatorAccountId, operatorPrivateKey, 'testnet');
