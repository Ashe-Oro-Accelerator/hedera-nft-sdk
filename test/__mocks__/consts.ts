import { HederaNFTSDK } from "../../src/HederaNFTSDK";

export const myAccountId = '0.0.12345';
export const myPrivateKey =
  '123e020100300506032b657004220420f8e9f8de8f7e06f7e9f8de8f7e06f7e9f8de8f7e06f7e9f8de8f7e06f7e9f8de';

export const operatorAccountId = '0.0.417710';
export const operatorPrivateKey = '302e020100300506032b6570042204200bdb5e21eb1be64d06cfb7a027bb2e4101d708b106e0cdcb0b1d4dd6bb5eadc9';

export const secondAccountId = '0.0.417718';
export const secondPrivateKey = '3030020100300706052b8104000a042204202ea61e091da90d0307f1bdfdaebc76ca890cdcab5d6852966ef39200c6e289bd';

export const nftSDK = new HederaNFTSDK(operatorAccountId, operatorPrivateKey);