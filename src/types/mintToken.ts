import { Client, NftId, PrivateKey } from '@hashgraph/sdk';

export type MintUniqueTokenType = {
  client: Client;
  tokenId: string;
  batchSize?: number;
  supplyKey: PrivateKey;
  pathToMetadataURIsFile?: string;
  metadataArray?: string[];
};

export type MintTokenType = {
  client: Client;
  tokenId: string;
  amount: number;
  batchSize: number;
  metaData: string;
  supplyKey: PrivateKey;
};

export type IncreaseNFTSupplyType = {
  client: Client;
  network: string;
  nftId: NftId;
  amount: number;
  batchSize: number;
  supplyKey: PrivateKey;
  mirrorNodeUrl?: string;
};

export type MintedNFTType = { serialNumber: number; content: string };
