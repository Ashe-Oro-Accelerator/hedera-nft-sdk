import { FixedFeeType } from '../types/fees';
import { CustomFixedFee, Hbar } from '@hashgraph/sdk';
import { validatePropsForFixedFeeFunction } from '../utils/validateProps';

export const createFixedFeeFunction = ({
  collectorAccountId,
  hbarAmount,
  amount,
  denominatingTokenId,
  allCollectorsAreExempt,
}: FixedFeeType): CustomFixedFee => {
  validatePropsForFixedFeeFunction({ collectorAccountId, hbarAmount, amount, denominatingTokenId });
  const fixedFee = new CustomFixedFee().setFeeCollectorAccountId(collectorAccountId);

  if (hbarAmount) {
    fixedFee.setHbarAmount(Hbar.fromString(hbarAmount.toString()));
  }

  if (amount) {
    fixedFee.setAmount(amount);
  }

  if (denominatingTokenId) {
    fixedFee.setDenominatingTokenId(denominatingTokenId);
  }

  if (allCollectorsAreExempt) {
    fixedFee.setAllCollectorsAreExempt(allCollectorsAreExempt);
  }

  return fixedFee;
};
