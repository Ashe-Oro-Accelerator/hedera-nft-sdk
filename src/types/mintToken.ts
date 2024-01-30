import { Client } from '@hashgraph/sdk';

export type MintTokenType = {
  client: Client;
  tokenId: string;
  amount: number;
  batchSize: number;
  metaData: string;
  supplyKey: string;
};
