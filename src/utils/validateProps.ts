import {
  sharedMintingValidationProps,
  validateCreateCollectionProps,
  uniqueMintingValidationProps,
  increaseNFTSupplyValidationProps,
} from '../types/validateProps';
import { dictionary } from './constants/dictionary';

export const validatePropsForSharedNFTMinting = (props: sharedMintingValidationProps) => {
  validateSupplyKey(props);
  validateBatchSize(props);
  validateTokenId(props);
  validateAmount(props);
  validateMetaData(props);
};

export const validatePropsForUniqueNFTMinting = (props: uniqueMintingValidationProps) => {
  validateMetadataForUnique(props);
  validateBatchSize(props);
  validateTokenId(props);
  validateSupplyKey(props);
};

export const validatePropsForCreateCollection = (props: validateCreateCollectionProps) => {
  validateAccountAndPrivateKey(props);
  validateCollectionSymbol(props);
  validateCollectionName(props);
  validateClient(props);
};

export const validatePropsForIncreaseNFTSupply = (props: increaseNFTSupplyValidationProps) => {
  validateSupplyKey(props);
  validateBatchSize(props);
  validateNFTId(props);
  validateAmount(props);
}

const validateAccountAndPrivateKey = (props: validateCreateCollectionProps) => {
  if (
    Object.prototype.hasOwnProperty.call(props, 'treasuryAccount') ||
    Object.prototype.hasOwnProperty.call(props, 'treasuryAccountPrivateKey')
  ) {
    if (
      (props.treasuryAccount && !props.treasuryAccountPrivateKey) ||
      (!props.treasuryAccount && props.treasuryAccountPrivateKey)
    ) {
      throw new Error(dictionary.createCollection.treasuryAccountPrivateKeySignRequired);
    }
  }
};

const validateCollectionSymbol = (props: validateCreateCollectionProps) => {
  if (Object.prototype.hasOwnProperty.call(props, 'collectionSymbol')) {
    if (!props.collectionSymbol)
      throw new Error(dictionary.createCollection.collectionSymbolRequired);
  }
};

const validateCollectionName = (props: validateCreateCollectionProps) => {
  if (Object.prototype.hasOwnProperty.call(props, 'collectionName')) {
    if (!props.collectionName) throw new Error(dictionary.createCollection.collectionNameRequired);
  }
};

const validateClient = (props: validateCreateCollectionProps) => {
  if (Object.prototype.hasOwnProperty.call(props, 'client')) {
    if (!props.client) throw new Error(dictionary.createCollection.clientRequired);
  }
};

const validateSupplyKey = (props: sharedMintingValidationProps) => {
  if (Object.prototype.hasOwnProperty.call(props, 'supplyKey')) {
    if (!props.supplyKey) throw new Error(dictionary.hederaActions.supplyKeyRequired);
  }
};

const validateBatchSize = (props: sharedMintingValidationProps) => {
  if (Object.prototype.hasOwnProperty.call(props, 'batchSize')) {
    if (!props.batchSize) throw new Error(dictionary.mintToken.batchSizeUndefined);
    if (props.batchSize > 10) throw new Error(dictionary.hederaActions.maxBatchSize);
    if (props.batchSize < 1) throw new Error(dictionary.hederaActions.minBatchSize);
  }
};

const validateTokenId = (props: sharedMintingValidationProps) => {
  if (Object.prototype.hasOwnProperty.call(props, 'tokenId')) {
    if (!props.tokenId) throw new Error(dictionary.hederaActions.tokenIdRequired);
  }
};

const validateNFTId = (props: increaseNFTSupplyValidationProps) => {
  if (Object.prototype.hasOwnProperty.call(props, 'nftId')) {
    if (!props.nftId) throw new Error(dictionary.hederaActions.nftIdRequired);
  }
};

const validateAmount = (props: sharedMintingValidationProps) => {
  if (Object.prototype.hasOwnProperty.call(props, 'amount')) {
    if (!props.amount || props.amount < 1) throw new Error(dictionary.hederaActions.minAmount);
  }
};

const validateMetaData = (props: sharedMintingValidationProps) => {
  if (Object.prototype.hasOwnProperty.call(props, 'metaData')) {
    if (!props.metaData) throw new Error(dictionary.hederaActions.metadataRequired);
  }
};

const validateMetadataForUnique = (props: uniqueMintingValidationProps) => {
  if (
    (!Object.prototype.hasOwnProperty.call(props, 'metadataArray') || !props.metadataArray) &&
    (!Object.prototype.hasOwnProperty.call(props, 'pathToMetadataURIsFile') ||
      !props.pathToMetadataURIsFile)
  ) {
    throw new Error(dictionary.mintToken.csvOrArrayRequired);
  }
};
