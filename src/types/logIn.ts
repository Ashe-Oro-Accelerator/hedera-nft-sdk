import { NetworkName } from '@hashgraph/sdk/lib/client/Client';

export type LogInType = {
  myAccountId: string;
  myPrivateKey: string;
  network: NetworkName;
};
