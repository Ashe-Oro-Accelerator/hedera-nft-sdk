import { feeFactoryInstance, nftSDK } from './e2eConsts';
import { beforeEach } from 'node:test';
import { HederaNFTSDK } from '../../src/HederaNFTSDK';
import { myAccountId, myPrivateKey, mySecondAccountId } from '../__mocks__/consts';
import { dictionary } from '../../src/utils/constants/dictionary';

beforeEach(async () => {
  new HederaNFTSDK(myAccountId, myPrivateKey);
});

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
