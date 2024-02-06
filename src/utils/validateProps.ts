import { PrivateKey } from '@hashgraph/sdk';
import { dictionary } from './constants/dictionary';

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
  if (buffer !== null && buffer > 10) throw new Error(dictionary.hederaActions.maxBatchSize);
  if (buffer !== null && buffer < 1) throw new Error(dictionary.hederaActions.minBatchSize);
  if (tokenId !== null && !tokenId) throw new Error(dictionary.hederaActions.tokenIdRequired);
  if (amount !== null && (!amount || amount < 1))
    throw new Error(dictionary.hederaActions.minAmount);
  if (metaData !== null && !metaData) throw new Error(dictionary.hederaActions.metadataRequired);
  if (supplyKey !== null && !supplyKey) throw new Error(dictionary.hederaActions.supplyKeyRequired);
};
