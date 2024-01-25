import { Client } from '@hashgraph/sdk';
import { CreateCollectionKeysType } from './types/createCollection';
import { createCollectionFunction } from './functions/createCollection';
import { logIn } from './functions/logIn';
import { mintSharedMetadataFunction } from './functions/mintSharedMetadataFunction';
import { mintUniqueMetadataFunction } from './functions/mintUniqueMetadataFunction';

export class HederaNFTSDK {
  accountId: string;
  privateKey: string;
  client: Client;

  constructor(accountId: string, privateKey: string) {
    this.accountId = accountId;
    this.privateKey = privateKey;
    this.client = logIn({ myAccountId: accountId, myPrivateKey: privateKey });
  }

  createCollection(
    collectionName: string,
    collectionSymbol: string,
    treasuryAccountPrivateKey?: string,
    treasuryAccount?: string,
    keys?: CreateCollectionKeysType,
    maxSupply?: number
  ) {
    return createCollectionFunction({
      client: this.client,
      collectionName,
      collectionSymbol,
      keys,
      myPrivateKey: this.privateKey,
      treasuryAccount,
      treasuryAccountPrivateKey,
      maxSupply,
    });
  }

  mintSharedMetadata(
    tokenId: string,
    amount: number,
    buffer: number = 5,
    metaData: string,
    supplyKey: string
  ) {
    return mintSharedMetadataFunction({
      client: this.client,
      tokenId,
      amount,
      buffer,
      metaData,
      supplyKey,
    });
  }

  mintUniqueMetadata(
    tokenId: string,
    amount: number,
    buffer: number = 5,
    metaData: string[],
    supplyKey: string
  ) {
    return mintUniqueMetadataFunction({
      client: this.client,
      tokenId,
      amount,
      buffer,
      metaData,
      supplyKey,
    });
  }
}
