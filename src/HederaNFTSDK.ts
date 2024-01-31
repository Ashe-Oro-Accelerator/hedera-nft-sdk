import { Client } from '@hashgraph/sdk';
import { CreateCollectionKeysType } from './types/createCollection';
import { createCollectionFunction } from './functions/createCollection';
import { logIn } from './functions/logIn';
import { createJsonMetadataFromCsv } from './functions/createJsonMetadataFromCsv';

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

  createJsonMetadataFromCsv(
    jsonMetadataOutputFolderPath: string,
    csvFilePath: string,
    nftsLimit?: number
  ) {
    return createJsonMetadataFromCsv({
      jsonMetadataOutputFolderPath,
      csvFilePath,
      nftsLimit,
    });
  }
}
