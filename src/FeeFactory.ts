import { FixedFeeType, RoyaltyFeeType } from './types/fees';
import { createFixedFeeFunction } from './functions/createFixedFeeFunction';
import { CustomFixedFee, CustomRoyaltyFee } from '@hashgraph/sdk';
import { createRoyaltyFeeFunction } from './functions/createRoyaltyFeeFunction';

export class FeeFactory {
  fixedFee({
    collectorAccountId,
    hbarAmount,
    amount,
    denominatingTokenId,
    allCollectorsAreExempt,
  }: FixedFeeType): CustomFixedFee {
    return createFixedFeeFunction({
      collectorAccountId,
      hbarAmount,
      amount,
      denominatingTokenId,
      allCollectorsAreExempt,
    });
  }

  royaltyFee({
    collectorAccountId,
    numerator,
    denominator,
    fallbackFee,
    allCollectorsAreExempt,
  }: RoyaltyFeeType): CustomRoyaltyFee {
    return createRoyaltyFeeFunction({
      collectorAccountId,
      numerator,
      denominator,
      fallbackFee,
      allCollectorsAreExempt,
    });
  }
}
