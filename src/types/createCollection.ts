import { Client, CustomFee, Key, PrivateKey } from '@hashgraph/sdk';

export type CreateCollectionKeysType = {
  admin?: PrivateKey;
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
  keys?: CreateCollectionKeysType;
  treasuryAccount?: string;
  treasuryAccountPrivateKey?: string;
  maxSupply?: number;
  customFees?: CustomFee[];
};
