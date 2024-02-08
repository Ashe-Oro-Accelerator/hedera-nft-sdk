import { HederaNFTSDK } from '../../src/HederaNFTSDK';
import 'dotenv/config';
import { FeeFactory } from '../../src/FeeFactory';

export const operatorAccountId = process.env.FIRST_ACCOUNT_ID!;
export const operatorPrivateKey = process.env.FIRST_PRIVATE_KEY!;

export const secondAccountId = process.env.SECOND_ACCOUNT_ID!;
export const secondPrivateKey = process.env.SECOND_PRIVATE_KEY!;

export const nftSDK = new HederaNFTSDK(operatorAccountId, operatorPrivateKey, 'testnet');

export const feeFactoryInstance = new FeeFactory();
