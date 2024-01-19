import { Client } from '@hashgraph/sdk';
import { LogInType } from '../types/logIn';

export const logIn = ({ myAccountId, myPrivateKey }: LogInType) => {
  if (!myAccountId) throw new Error('myAccountId is required');
  if (!myPrivateKey) throw new Error('myPrivateKey is required');
  return Client.forTestnet().setOperator(myAccountId, myPrivateKey);
};
