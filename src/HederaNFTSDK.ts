import { Client } from '@hashgraph/sdk';
import { CreateCollectionKeys } from './types/createCollection';
import { createCollectionFunction } from './functions/createCollection';
import { logIn } from './functions/logIn';

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
    treasuryAccount: string,
    keys: CreateCollectionKeys,
    maxSupply?: number
  ) {
    return createCollectionFunction({
      client: this.client,
      collectionName: collectionName,
      collectionSymbol: collectionSymbol,
      keys: keys,
      myPrivateKey: this.privateKey,
      treasuryAccount: treasuryAccount,
      maxSupply: maxSupply || undefined,
    });
  }
}
