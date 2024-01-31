import { Client } from '@hashgraph/sdk';

export type MintUniqueTokenType = {
  client: Client;
  tokenId: string;
  buffer?: number;
  pathToCSV: string;
  supplyKey: string;
};

export type MintTokenType = {
  client: Client;
  tokenId: string;
  amount: number;
  buffer?: number;
  metaData: string;
  supplyKey: string;
};
