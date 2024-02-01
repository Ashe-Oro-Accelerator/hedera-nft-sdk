import errors from '../dictionary/errors.json';
import { PrivateKey } from '@hashgraph/sdk';

export const validateProps = ({
  buffer = null,
  tokenId = null,
  amount = null,
  metaData = null,
  supplyKey = null,
}: {
  buffer?: number | null;
  tokenId?: string | null;
  amount?: number | null;
  metaData?: string | null;
  supplyKey?: PrivateKey | null;
}) => {
  if (buffer !== null && buffer > 10) throw new Error(errors.maxBatchSize);
  if (buffer !== null && buffer < 1) throw new Error(errors.minBatchSize);
  if (tokenId !== null && !tokenId) throw new Error(errors.tokenIdRequired);
  if (amount !== null && (!amount || amount < 1)) throw new Error(errors.minAmount);
  if (metaData !== null && !metaData) throw new Error(errors.metadataRequired);
  if (supplyKey !== null && !supplyKey) throw new Error(errors.supplyKeyRequired);
};
