import type { BufferFile } from './bufferFile';

export interface CSVRow {
  [key: string]: string;
}

export type AttributeObjectFromCSVFile = Record<string, string | number | boolean | undefined>[];
export type PropertyFromCSVFile = Record<string, string>;

export interface MetadataObject {
  [key: string]: string | AttributeObjectFromCSVFile | PropertyFromCSVFile | undefined | BufferFile;
}
