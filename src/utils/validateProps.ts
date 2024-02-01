import errors from '../dictionary/errors.json';
import { PrivateKey } from '@hashgraph/sdk';

export const validateProps = ({
  batchSize = null,
  tokenId = null,
  amount = null,
  metaData = null,
  supplyKey = null,
  pathToMetadataURIsFile = null,
  metadataArray = null,
}: {
  batchSize?: number | null;
  tokenId?: string | null;
  amount?: number | null;
  metaData?: string | null;
  supplyKey?: PrivateKey | null;
  pathToMetadataURIsFile?: string | null;
  metadataArray?: string[] | null;
}) => {
  if (batchSize !== null && batchSize > 10) throw new Error(errors.maxBatchSize);
  if (batchSize !== null && batchSize < 1) throw new Error(errors.minBatchSize);
  if (tokenId !== null && !tokenId) throw new Error(errors.tokenIdRequired);
  if (amount !== null && (!amount || amount < 1)) throw new Error(errors.minAmount);
  if (metaData !== null && !metaData) throw new Error(errors.metadataRequired);
  if (supplyKey !== null && !supplyKey) throw new Error(errors.supplyKeyRequired);
  if (pathToMetadataURIsFile !== null && !pathToMetadataURIsFile)
    throw new Error(errors.pathRequired);
  if (
    metadataArray !== null &&
    pathToMetadataURIsFile !== null &&
    !metadataArray &&
    !pathToMetadataURIsFile
  )
    throw new Error(errors.csvOrArrayRequired);
};
