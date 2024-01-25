import { Client } from '@hashgraph/sdk';

export type MintTokenType = {
  client: Client;
  tokenId: string;
  amount: number;
  buffer: number;
  metaData: string;
  supplyKey: string;
};
