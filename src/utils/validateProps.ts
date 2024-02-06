import { PropsType } from '../types/validateProps';
import { dictionary } from './constants/dictionary';

export const validateProps = (props: PropsType) => {
  validateSupplyKey(props);
  validateBatchSize(props);
  validateTokenId(props);
  validateAmount(props);
  validateMetaData(props);
};

export const validatePropsForUniqueNFTMinting = (props: PropsType) => {
  validateMetadataForUnique(props);
  validateMetadataArray(props);
  validatePathToMetadataURIsFile(props);
  validateProps(props);
};

const validateSupplyKey = (props: PropsType) => {
  if (Object.prototype.hasOwnProperty.call(props, 'supplyKey')) {
    if (!props.supplyKey) throw new Error(dictionary.hederaActions.supplyKeyRequired);
  }
};

const validateBatchSize = (props: PropsType) => {
  if (Object.prototype.hasOwnProperty.call(props, 'batchSize')) {
    if (!props.batchSize) throw new Error(dictionary.mintToken.batchSizeUndefined);
    if (props.batchSize > 10) throw new Error(dictionary.hederaActions.maxBatchSize);
    if (props.batchSize < 1) throw new Error(dictionary.hederaActions.minBatchSize);
  }
};

const validateTokenId = (props: PropsType) => {
  if (Object.prototype.hasOwnProperty.call(props, 'tokenId')) {
    if (!props.tokenId) throw new Error(dictionary.hederaActions.tokenIdRequired);
  }
};

const validateAmount = (props: PropsType) => {
  if (Object.prototype.hasOwnProperty.call(props, 'amount')) {
    if (!props.amount || props.amount < 1) throw new Error(dictionary.hederaActions.minAmount);
  }
};

const validateMetaData = (props: PropsType) => {
  if (Object.prototype.hasOwnProperty.call(props, 'metaData')) {
    if (!props.metaData) throw new Error(dictionary.hederaActions.metadataRequired);
  }
};

const validateMetadataArray = (props: PropsType) => {
  if (Object.prototype.hasOwnProperty.call(props, 'metadataArray')) {
    if (!props.metadataArray) throw new Error(dictionary.hederaActions.metadataRequired);
  }
};

const validatePathToMetadataURIsFile = (props: PropsType) => {
  if (Object.prototype.hasOwnProperty.call(props, 'pathToMetadataURIsFile')) {
    if (!props.pathToMetadataURIsFile) throw new Error(dictionary.mintToken.pathRequired);
  }
};

const validateMetadataForUnique = (props: PropsType) => {
  if (
    (!Object.prototype.hasOwnProperty.call(props, 'metadataArray') || !props.metadataArray) &&
    (!Object.prototype.hasOwnProperty.call(props, 'pathToMetadataURIsFile') ||
      !props.pathToMetadataURIsFile)
  ) {
    throw new Error(dictionary.mintToken.csvOrArrayRequired);
  }
};
