import type { NFTMetadata } from './nftMetadata';

export interface NFTDetails {
  account_id: string;
  created_timestamp: string;
  deleted: boolean;
  metadata: string;
  modified_timestamp: string;
  serial_number: number;
  token_id: string;
  meta?: NFTMetadata;
  spender: null | string;
}

interface Links {
  next: string | null;
}

export interface NFTS {
  nfts: NFTDetails[];
  links: Links;
}

export interface DecodedMetadata {
  metadata: string;
  serialNumber: number;
}

export interface ParsedNFTS {
  decodedMetadata: DecodedMetadata[];
  links: Links;
}
