import errors from '../dictionary/errors.json';
import { PrivateKey } from '@hashgraph/sdk';

export const validateProps = ({
  batchSize = null,
  tokenId = null,
  amount = null,
  metaData = null,
  supplyKey = null,
  pathToCSV = null,
}: {
  batchSize?: number | null;
  tokenId?: string | null;
  amount?: number | null;
  metaData?: string | null;
  supplyKey?: PrivateKey | null;
  pathToCSV?: string | null;
}) => {
  if (batchSize !== null && batchSize > 10) throw new Error(errors.maxBatchSize);
  if (batchSize !== null && batchSize < 1) throw new Error(errors.minBatchSize);
  if (tokenId !== null && !tokenId) throw new Error(errors.tokenIdRequired);
  if (amount !== null && (!amount || amount < 1)) throw new Error(errors.minAmount);
  if (metaData !== null && !metaData) throw new Error(errors.metadataRequired);
  if (supplyKey !== null && !supplyKey) throw new Error(errors.supplyKeyRequired);
  if (pathToCSV !== null && !pathToCSV) throw new Error(errors.pathRequired);
};
