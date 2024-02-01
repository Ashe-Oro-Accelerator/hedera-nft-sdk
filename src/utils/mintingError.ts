import { MintedNFTType } from '../types/mintToken';

export class MintingError extends Error {
  mintedNFTs: MintedNFTType[];

  constructor(message: string, successfulStates: MintedNFTType[]) {
    super(message);
    this.mintedNFTs = successfulStates;
  }
}
