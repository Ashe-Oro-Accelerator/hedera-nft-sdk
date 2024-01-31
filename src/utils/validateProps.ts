import errors from '../dictionary/errors.json';

export const validateProps = ({
  buffer = null,
  tokenId = null,
  amount = null,
  metaData = null,
  supplyKey = null,
  pathToCSV = null,
}: {
  buffer?: number | null;
  tokenId?: string | null;
  amount?: number | null;
  metaData?: string | null;
  supplyKey?: string | null;
  pathToCSV?: string | null;
}) => {
  if (buffer !== null && buffer > 10) throw new Error(errors.maxBuffer);
  if (buffer !== null && buffer < 1) throw new Error(errors.minBuffer);
  if (tokenId !== null && !tokenId) throw new Error(errors.tokenIdRequired);
  if (amount !== null && (!amount || amount < 1)) throw new Error(errors.minAmount);
  if (metaData !== null && !metaData) throw new Error(errors.metadataRequired);
  if (supplyKey !== null && !supplyKey) throw new Error(errors.supplyKeyRequired);
  if (pathToCSV !== null && !pathToCSV) throw new Error(errors.pathRequired);
};
