import type { BufferFile } from './bufferFile';

export interface CSVRow {
  [key: string]: string;
}

export type AttributeObjectFromCSVFile = Record<string, string | number | boolean | undefined>[];
export type PropertyFromCSVFile = Record<string, string>;

export interface CSVRowAsObject {
  [key: string]: string | AttributeObjectFromCSVFile | PropertyFromCSVFile | undefined | BufferFile;
}

export interface RedundantCell {
  cell: string;
  index: number;
}
