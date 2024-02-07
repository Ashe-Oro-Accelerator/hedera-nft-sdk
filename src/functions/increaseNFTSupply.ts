import { NftId } from '@hashgraph/sdk';
import axios from 'axios';
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
  mirrorNodeUrl
}: IncreaseNFTSupplyType) => {
  validatePropsForIncreaseNFTSupply({ nftId, amount, supplyKey, batchSize });
  return getMetaDataFromMirrorNode(network, nftId, mirrorNodeUrl)
    .then((metaData) => mintSharedMetadataFunction({ client, tokenId: nftId.tokenId.toString(), amount, batchSize, metaData, supplyKey }));

};

async function getMetaDataFromMirrorNode(network: string, nftId: NftId, mirrorNodeUrl?: string): Promise<string> {
  const url = mirrorNodeUrl || getMirrorNodeUrlForNetwork(network);
  return axios.get(`${url}/tokens/${nftId.tokenId.toString()}/nfts/${nftId.serial.toString()}`)
    .then((response) => {
      //atob is used to decode the base64 encoded metadata
      return atob(response.data.metadata);
    })
};

function getMirrorNodeUrlForNetwork(network: string): string {
  return `https://${network === 'mainnet' ? 'mainnet-public' : network}.mirrornode.hedera.com/api/v1`;
};