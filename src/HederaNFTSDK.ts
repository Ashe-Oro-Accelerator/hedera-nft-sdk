import { Client, NftId, PrivateKey } from '@hashgraph/sdk';
import { NetworkName } from '@hashgraph/sdk/lib/client/Client';
import { createCollectionFunction } from './functions/createCollection';
import { createJsonMetadataFromCSV } from './functions/createJsonMetadataFromCSV';
import { increaseNFTSupply } from './functions/increaseNFTSupply';
import { logIn } from './functions/logIn';
import { mintSharedMetadataFunction } from './functions/mintSharedMetadataFunction';
import { mintUniqueMetadataFunction } from './functions/mintUniqueMetadataFunction';
import { CreateCollectionKeysType } from './types/createCollection';
import { JsonMetadataFromCSVInterface } from './types/jsonMetadataFromCSV';

export class HederaNFTSDK {
  accountId: string;
  privateKey: string;
  client: Client;
  network: NetworkName;

  constructor(accountId: string, privateKey: string, network: NetworkName) {
    this.accountId = accountId;
    this.privateKey = privateKey;
    this.client = logIn({ myAccountId: accountId, myPrivateKey: privateKey, network: network });
    this.network = network;
  }

  createCollection({
    collectionName,
    collectionSymbol,
    treasuryAccountPrivateKey,
    treasuryAccount,
    keys,
    maxSupply,
  }: {
    collectionName: string;
    collectionSymbol: string;
    treasuryAccountPrivateKey?: string;
    treasuryAccount?: string;
    keys?: CreateCollectionKeysType;
    maxSupply?: number;
  }) {
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

  createJsonMetadataFromCSV({
    savedJsonFilesLocation,
    csvFilePath,
    nftsLimit,
  }: {
    savedJsonFilesLocation: string;
    csvFilePath: string;
    nftsLimit?: number;
  }): Promise<JsonMetadataFromCSVInterface> {
    return createJsonMetadataFromCSV({
      savedJsonFilesLocation,
      csvFilePath,
      nftsLimit,
    });
  }

  mintSharedMetadata({
    tokenId,
    amount,
    batchSize = 5,
    metaData,
    supplyKey,
  }: {
    tokenId: string;
    amount: number;
    batchSize?: number;
    metaData: string;
    supplyKey?: PrivateKey;
  }) {
    return mintSharedMetadataFunction({
      client: this.client,
      tokenId,
      amount,
      batchSize,
      metaData,
      supplyKey: supplyKey || PrivateKey.fromString(this.privateKey),
    });
  }

  mintUniqueMetadata({
    tokenId,
    batchSize = 5,
    supplyKey,
    pathToMetadataURIsFile,
    metadata,
  }: {
    tokenId: string;
    batchSize?: number;
    supplyKey: PrivateKey;
    pathToMetadataURIsFile?: string;
    metadata?: string[];
  }) {
    return mintUniqueMetadataFunction({
      client: this.client,
      tokenId,
      batchSize,
      supplyKey,
      pathToMetadataURIsFile,
      metadataArray: metadata,
    });
  }

  increaseNFTSupply({
    nftId,
    amount,
    batchSize = 5,
    supplyKey,
    mirrorNodeUrl,
  }: {
    nftId: NftId;
    amount: number;
    batchSize?: number;
    supplyKey?: PrivateKey;
    mirrorNodeUrl?: string;
  }) {
    return increaseNFTSupply({
      client: this.client,
      network: this.network,
      nftId,
      amount,
      batchSize,
      supplyKey: supplyKey || PrivateKey.fromString(this.privateKey),
      mirrorNodeUrl,
    });
  }
}
