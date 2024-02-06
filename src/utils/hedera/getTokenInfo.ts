import { Client, TokenId, TokenInfoQuery } from '@hashgraph/sdk';

export async function getTokenInfo(tokenId: string, client: Client) {
  const query = new TokenInfoQuery().setTokenId(TokenId.fromString(tokenId));

  return await query.execute(client);
}
