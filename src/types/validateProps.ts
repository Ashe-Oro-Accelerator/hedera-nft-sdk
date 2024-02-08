import { Client, CustomFee, PrivateKey } from '@hashgraph/sdk';

export type PropsType = {
  batchSize?: number;
  tokenId?: string;
  amount?: number;
  metaData?: string;
  supplyKey?: PrivateKey;
};

export type uniqueMintingValidationProps = {
  batchSize?: number;
  tokenId?: string;
  supplyKey?: PrivateKey;
  pathToMetadataURIsFile?: string;
  metadataArray?: string[];
};

export type validateCreateCollectionProps = {
  client?: Client;
  collectionName?: string;
  collectionSymbol?: string;
  treasuryAccountPrivateKey?: string;
  treasuryAccount?: string;
  customFees?: CustomFee[];
};

export type fixedFeeValidationProps = {
  collectorAccountId?: string;
  hbarAmount?: number;
  amount?: number;
  denominatingTokenId?: string;
};

export type royaltyFeeValidationProps = {
  collectorAccountId?: string;
  numerator: number;
  denominator: number;
};
