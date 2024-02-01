import { Client, PrivateKey } from '@hashgraph/sdk';

export type MintUniqueTokenType = {
  client: Client;
  tokenId: string;
  batchSize?: number;
  pathToCSV: string;
  supplyKey: PrivateKey;
};

export type MintTokenType = {
  client: Client;
  tokenId: string;
  amount: number;
  batchSize: number;
  metaData: string;
  supplyKey: PrivateKey;
};

export type MintedNFTType = { serialNumber: number; content: string };
