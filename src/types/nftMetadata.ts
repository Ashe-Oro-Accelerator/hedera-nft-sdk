export interface FileMetadata {
  uri: string;
  type: string;
  metadata?: NFTMetadata;
  checksum?: string;
  is_default_file?: boolean;
  metadata_uri?: string;
}

export interface Property {
  [k: string]: string | number | boolean | object;
}

export type DisplayType =
  | 'text'
  | 'boolean'
  | 'percentage'
  | 'boost'
  | 'datetime'
  | 'date'
  | 'color';

export interface Attribute {
  trait_type: string;
  display_type?: DisplayType;
  value: string;
  max_value?: string | number;
}

export interface Localization {
  uri: string;
  default: string;
  locales: string[];
}

export interface NFTMetadata {
  name: string;
  image?: string;
  description: string;
  creator?: string;
  creatorDID?: string;
  type?: string;
  files?: FileMetadata[];
  format?: 'HIP412@2.0.0';
  properties?: Property;
  attributes?: Attribute[];
  localization?: Localization;
}
