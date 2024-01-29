import type { MimeType } from 'file-type';

export interface BufferFile {
  name: string;
  mimeType: MimeType | 'text/json' | 'application/octet-stream';
  filePath: string;
  isFileEmpty: boolean;
}

export interface BufferFileWithSerial extends BufferFile {
  serial: number;
}

export interface Directory {
  name: string;
  fullPath: string;
}

// TODO: check if we need the rest of the directory-reader logic from mintbox, if not those interfaces can be moved to types folder
