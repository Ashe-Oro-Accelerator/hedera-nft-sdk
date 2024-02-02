import errors from '../dictionary/errors.json';
import { PropsType } from '../types/validateProps';

export const validateProps = (props: PropsType) => {
  validateSupplyKey(props);
  validateBatchSize(props);
  validateTokenId(props);
  validateAmount(props);
  validateMetaData(props);
  validateMetadataArray(props);
  validatePathToMetadataURIsFile(props);
  validateIsUnique(props);
};

const validateSupplyKey = (props: PropsType) => {
  if (Object.prototype.hasOwnProperty.call(props, 'supplyKey')) {
    if (!props.supplyKey) throw new Error(errors.supplyKeyRequired);
  }
};

const validateBatchSize = (props: PropsType) => {
  if (Object.prototype.hasOwnProperty.call(props, 'batchSize')) {
    if (!props.batchSize) throw new Error(errors.batchSizeUndefined);
    if (props.batchSize > 10) throw new Error(errors.maxBatchSize);
    if (props.batchSize < 1) throw new Error(errors.minBatchSize);
  }
};

const validateTokenId = (props: PropsType) => {
  if (Object.prototype.hasOwnProperty.call(props, 'tokenId')) {
    if (!props.tokenId) throw new Error(errors.tokenIdRequired);
  }
};

const validateAmount = (props: PropsType) => {
  if (Object.prototype.hasOwnProperty.call(props, 'amount')) {
    if (!props.amount || props.amount < 1) throw new Error(errors.minAmount);
  }
};

const validateMetaData = (props: PropsType) => {
  if (Object.prototype.hasOwnProperty.call(props, 'metaData')) {
    if (!props.metaData) throw new Error(errors.metadataRequired);
  }
};

const validateMetadataArray = (props: PropsType) => {
  if (!props.isUnique && Object.prototype.hasOwnProperty.call(props, 'metadataArray')) {
    if (!props.metadataArray) throw new Error(errors.metadataRequired);
  }
};

const validatePathToMetadataURIsFile = (props: PropsType) => {
  if (!props.isUnique && Object.prototype.hasOwnProperty.call(props, 'pathToMetadataURIsFile')) {
    if (!props.pathToMetadataURIsFile) throw new Error(errors.pathRequired);
  }
};

const validateIsUnique = (props: PropsType) => {
  if (props.isUnique) {
    if (
      (!Object.prototype.hasOwnProperty.call(props, 'metadataArray') || !props.metadataArray) &&
      (!Object.prototype.hasOwnProperty.call(props, 'pathToMetadataURIsFile') ||
        !props.pathToMetadataURIsFile)
    ) {
      throw new Error(errors.csvOrArrayRequired);
    }
  }
};
