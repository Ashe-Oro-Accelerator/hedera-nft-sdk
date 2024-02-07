import { myAccountId } from '../__mocks__/consts';
import { createFixedFeeFunction } from '../../src/functions/createFixedFeeFunction';
import { FixedFeeType } from '../../src/types/fees';
import { dictionary } from '../../src/utils/constants/dictionary';

describe('createFixedFeeFunction', () => {
  it('should create a CustomFixedFee with all properties', () => {
    const fixedFeeType: FixedFeeType = {
      collectorAccountId: myAccountId,
      hbarAmount: 100,
      amount: 100,
      denominatingTokenId: myAccountId,
      allCollectorsAreExempt: true,
    };

    const result = createFixedFeeFunction(fixedFeeType);

    expect(result).toBeDefined();
    expect(result._amount.toInt()).toEqual(fixedFeeType.amount);
    expect(result._allCollectorsAreExempt).toEqual(fixedFeeType.allCollectorsAreExempt);
  });

  it('should throw an error when FixedFeeType is not provided', () => {
    expect(() =>
      createFixedFeeFunction({
        collectorAccountId: '',
        hbarAmount: 100,
        amount: 100,
      })
    ).toThrow(dictionary.createCollection.collectorAccountIdRequired);
  });
});
