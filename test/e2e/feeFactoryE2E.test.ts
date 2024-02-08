import { feeFactoryInstance, nftSDK } from './e2eConsts';
import { myAccountId, mySecondAccountId } from '../__mocks__/consts';
import { dictionary } from '../../src/utils/constants/dictionary';
import { CustomFixedFee, CustomRoyaltyFee, TokenInfoQuery } from '@hashgraph/sdk';

afterAll(async () => {
  nftSDK.client.close();
});

describe('feeFactory', () => {
  it('creates a collection with fixedFee', async () => {
    const fixedFee = feeFactoryInstance.fixedFee({
      allCollectorsAreExempt: false,
      collectorAccountId: myAccountId,
      hbarAmount: 100,
      amount: 100,
    });

    const tokenId = await nftSDK.createCollection({
      collectionName: 'test_name',
      collectionSymbol: 'test_symbol',
      customFees: [fixedFee],
    });

    const query = new TokenInfoQuery().setTokenId(tokenId);
    const tokenInfo = await query.execute(nftSDK.client);
    const customFees = tokenInfo.customFees;
    let customFeeAmount = undefined;
    let customFeeAccId = undefined;

    if (customFees.length > 0 && customFees[0] instanceof CustomFixedFee) {
      customFeeAmount = customFees[0]._amount.toInt();
      customFeeAccId = customFees[0]._feeCollectorAccountId!.toString();
    }

    expect(customFeeAccId).toEqual(myAccountId);
    expect(customFeeAmount).toEqual(fixedFee.amount.toInt());
    expect(tokenId).toBeDefined();
  });

  it('creates a collection with royaltyFee', async () => {
    const royaltyFee = feeFactoryInstance.royaltyFee({
      collectorAccountId: myAccountId,
      numerator: 1,
      denominator: 100,
      allCollectorsAreExempt: false,
      fallbackFee: {
        allCollectorsAreExempt: false,
        collectorAccountId: mySecondAccountId,
        hbarAmount: 100,
        amount: 100,
      },
    });

    const tokenId = await nftSDK.createCollection({
      collectionName: 'test_name',
      collectionSymbol: 'test_symbol',
      customFees: [royaltyFee],
    });

    const query = new TokenInfoQuery().setTokenId(tokenId);
    const tokenInfo = await query.execute(nftSDK.client);
    const customFees = tokenInfo.customFees;
    let customFeeDenominator = undefined;
    let customFeeNumenator = undefined;

    if (customFees.length > 0 && customFees[0] instanceof CustomRoyaltyFee) {
      customFeeDenominator = customFees[0]._denominator.toInt();
      customFeeNumenator = customFees[0]._numerator.toString();
    }

    expect(Number(customFeeNumenator)).toEqual(royaltyFee.numerator.toInt());
    expect(customFeeDenominator).toEqual(royaltyFee.denominator.toInt());
    expect(tokenId).toBeDefined();
  });

  it('throws error when more than 10 customFees', async () => {
    const fixedFee = feeFactoryInstance.fixedFee({
      allCollectorsAreExempt: false,
      collectorAccountId: myAccountId,
      hbarAmount: 100,
      amount: 100,
      denominatingTokenId: myAccountId,
    });

    await expect(
      nftSDK.createCollection({
        collectionName: 'test_name',
        collectionSymbol: 'test_symbol',
        customFees: [
          fixedFee,
          fixedFee,
          fixedFee,
          fixedFee,
          fixedFee,
          fixedFee,
          fixedFee,
          fixedFee,
          fixedFee,
          fixedFee,
          fixedFee,
        ],
      })
    ).rejects.toThrow(dictionary.createCollection.tooManyCustomFees);
  });
});
