import { myAccountId } from '../__mocks__/consts';
import { createRoyaltyFeeFunction } from '../../src/functions/createRoyaltyFeeFunction';
import { RoyaltyFeeType } from '../../src/types/fees';

describe('createRoyaltyFeeFunction', () => {
  it('should return the correct numerator and denominator', () => {
    const royaltyFeeType: RoyaltyFeeType = {
      collectorAccountId: myAccountId,
      numerator: 1,
      denominator: 2,
      allCollectorsAreExempt: true,
    };

    const result = createRoyaltyFeeFunction(royaltyFeeType);

    expect(result._numerator.toInt()).toEqual(royaltyFeeType.numerator);
    expect(result._denominator.toInt()).toEqual(royaltyFeeType.denominator);
  });

  it('should return the correct fallbackFee when provided', () => {
    const royaltyFeeType: RoyaltyFeeType = {
      collectorAccountId: myAccountId,
      numerator: 1,
      denominator: 2,
      fallbackFee: {
        collectorAccountId: myAccountId,
        amount: 100,
        denominatingTokenId: myAccountId,
        allCollectorsAreExempt: true,
      },
      allCollectorsAreExempt: true,
    };

    const result = createRoyaltyFeeFunction(royaltyFeeType);

    expect(result.fallbackFee?._amount.toInt()).toEqual(royaltyFeeType.fallbackFee?.amount);
  });
});
