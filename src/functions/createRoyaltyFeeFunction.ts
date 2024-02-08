import { CustomFixedFee, CustomRoyaltyFee } from '@hashgraph/sdk';
import { RoyaltyFeeType } from '../types/fees';
import { createFixedFeeFunction } from './createFixedFeeFunction';
import { validatePropsForRoyaltyFeeFunction } from '../utils/validateProps';

export const createRoyaltyFeeFunction = ({
  collectorAccountId,
  numerator,
  denominator,
  fallbackFee,
  allCollectorsAreExempt,
}: RoyaltyFeeType) => {
  validatePropsForRoyaltyFeeFunction({ collectorAccountId, numerator, denominator });

  const royaltyFee = new CustomRoyaltyFee()
    .setFeeCollectorAccountId(collectorAccountId)
    .setNumerator(numerator)
    .setDenominator(denominator);

  if (allCollectorsAreExempt) {
    royaltyFee.setAllCollectorsAreExempt(allCollectorsAreExempt);
  }

  if (fallbackFee) {
    royaltyFee.setFallbackFee(
      createFixedFeeFunction({
        collectorAccountId: fallbackFee.collectorAccountId,
        hbarAmount: fallbackFee.hbarAmount,
        amount: fallbackFee.amount,
        denominatingTokenId: fallbackFee.denominatingTokenId,
        allCollectorsAreExempt: fallbackFee.allCollectorsAreExempt,
      })
    );
  }

  return royaltyFee;
};
