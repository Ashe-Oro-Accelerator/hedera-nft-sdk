import { NftId, PrivateKey, TokenId, TokenNftInfoQuery } from '@hashgraph/sdk';
import { nftSDK, operatorPrivateKey } from './e2eConsts';
import { LONG_E2E_TIMEOUT, MIRROR_NODE_DELAY } from '../__mocks__/consts';

afterAll(async () => {
  nftSDK.client.close();
});

describe('increaseNFTSupply function e2e', () => {
  const testCases = [{ amount: 1 }, { amount: 3 }, { amount: 10 }];

  testCases.forEach(({ amount }) => {
    it(
      `Increasing a token supply by ${amount}`,
      async () => {
        const tokenId = await nftSDK.createCollection({
          collectionName: 'test_name',
          collectionSymbol: 'test_symbol',
        });
        const baseNFT = await nftSDK.mintUniqueMetadata({
          tokenId,
          batchSize: 10,
          metadata: ['www.youtube.com'],
          supplyKey: PrivateKey.fromString(operatorPrivateKey),
        });
        const nftInfo = await new TokenNftInfoQuery()
            .setNftId(new NftId(TokenId.fromString(tokenId), baseNFT[0].serialNumber))
            .execute(nftSDK.client);

        //wait for the collection and nfts to be available on mirror node
        await new Promise((r) => setTimeout(r, MIRROR_NODE_DELAY));

        const increaseSupplyResult = await nftSDK.increaseNFTSupply({
          nftId: nftInfo[0].nftId,
          amount,
          batchSize: 10,
          supplyKey: PrivateKey.fromString(operatorPrivateKey),
        });

        for (const mintedNft of increaseSupplyResult) {
          const nftInfos = await new TokenNftInfoQuery()
            .setNftId(new NftId(TokenId.fromString(tokenId), mintedNft.serialNumber))
            .execute(nftSDK.client);

          expect(nftInfos[0].metadata!.toString()).toEqual(baseNFT[0].content);
        }
        
      },
      LONG_E2E_TIMEOUT
    );
  });
});
