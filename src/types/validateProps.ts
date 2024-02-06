import { Client, PrivateKey } from '@hashgraph/sdk';

export type PropsType = {
  client?: Client;
  batchSize?: number;
  tokenId?: string;
  amount?: number;
  metaData?: string;
  supplyKey?: PrivateKey;
  pathToMetadataURIsFile?: string;
  metadataArray?: string[];
  collectionName?: string;
  collectionSymbol?: string;
  treasuryAccountPrivateKey?: string;
  treasuryAccount?: string;
};
