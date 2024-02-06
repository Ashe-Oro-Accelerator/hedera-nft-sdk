import { Client } from '@hashgraph/sdk';
import { LogInType } from '../types/logIn';
import { dictionary } from '../utils/constants/dictionary';

export const logIn = ({ myAccountId, myPrivateKey }: LogInType): Client => {
  if (!myAccountId) throw new Error(dictionary.createCollection.myAccountIdRequired);
  if (!myPrivateKey) throw new Error(dictionary.createCollection.myPrivateKeyRequired);
  return Client.forTestnet().setOperator(myAccountId, myPrivateKey);
};
