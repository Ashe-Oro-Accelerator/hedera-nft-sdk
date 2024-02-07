import { Client } from '@hashgraph/sdk';
import { LogInType } from '../types/logIn';
import { dictionary } from '../utils/constants/dictionary';

export const logIn = ({ myAccountId, myPrivateKey, network }: LogInType): Client => {
  if (!myAccountId) throw new Error(dictionary.createCollection.myAccountIdRequired);
  if (!myPrivateKey) throw new Error(dictionary.createCollection.myPrivateKeyRequired);
  return Client.forName(network).setOperator(myAccountId, myPrivateKey);
};
