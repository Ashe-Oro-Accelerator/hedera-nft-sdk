import { HederaNFTSDK } from './HederaNFTSDK';
import { PrivateKey } from '@hashgraph/sdk';

const myPrivateKey =
  '3030020100300706052b8104000a042204206fc9f9a2aa45924d617effa5778afd2a617cef8f1b527fe50d96042731df6b42';
const myAccountId = '0.0.7652262';

const nftSDK = new HederaNFTSDK(myAccountId, myPrivateKey);

(async () => {
  const tokenId = await nftSDK.createCollection(
    'test',
    'test2',
    myAccountId,
    {
      admin: PrivateKey.generate(),
      supply: PrivateKey.generate(),
    },
    1
  );

  console.log(tokenId);
})();
