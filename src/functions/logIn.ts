import { Client } from '@hashgraph/sdk';
import { LogInType } from '../types/logIn';
import errors from '../dictionary/errors.json';

export const logIn = ({ myAccountId, myPrivateKey }: LogInType) => {
  if (!myAccountId) throw new Error(errors.myAccountIdRequired);
  if (!myPrivateKey) throw new Error(errors.myPrivateKeyRequired);
  return Client.forTestnet().setOperator(myAccountId, myPrivateKey);
};
