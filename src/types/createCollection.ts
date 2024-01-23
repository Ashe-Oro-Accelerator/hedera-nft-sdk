import { Client, CustomFee, Key } from '@hashgraph/sdk';

export type CreateCollectionKeys = {
  admin?: Key;
  KYC?: Key;
  freeze?: Key;
  wipe?: Key;
  supply?: Key;
  feeSchedule?: Key;
  pause?: Key;
};

export type CreateCollectionType = {
  client: Client;
  myPrivateKey: string;
  collectionName: string;
  collectionSymbol: string;
  keys?: CreateCollectionKeys;
  treasuryAccount?: string;
  treasuryAccountPrivateKey?: string;
  maxSupply?: number;
  customFees?: CustomFee[];
};
