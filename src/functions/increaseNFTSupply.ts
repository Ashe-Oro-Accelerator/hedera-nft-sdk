import { getMetaDataFromMirrorNode } from '../api/mirrorNode';
import { IncreaseNFTSupplyType } from '../types/mintToken';
import { validatePropsForIncreaseNFTSupply } from '../utils/validateProps';
import { mintSharedMetadataFunction } from './mintSharedMetadataFunction';

export const increaseNFTSupply = async ({
  client,
  network,
  nftId,
  amount,
  batchSize,
  supplyKey,
  mirrorNodeUrl,
}: IncreaseNFTSupplyType) => {
  validatePropsForIncreaseNFTSupply({ nftId, amount, supplyKey, batchSize });
  return getMetaDataFromMirrorNode(network, nftId, mirrorNodeUrl).then((metaData: string) =>
    mintSharedMetadataFunction({
      client,
      tokenId: nftId.tokenId.toString(),
      amount,
      batchSize,
      metaData,
      supplyKey,
    })
  );
};
