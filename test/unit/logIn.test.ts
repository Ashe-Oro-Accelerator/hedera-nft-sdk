import { logIn } from '../../src/functions/logIn';
import { Client } from '@hashgraph/sdk';
import { myAccountId, myPrivateKey } from '../__mocks__/consts';
import { dictionary } from '../../src/utils/constants/dictionary';

jest.mock('@hashgraph/sdk', () => {
  return {
    Client: {
      forName: jest.fn().mockReturnThis(),
      setOperator: jest.fn(),
    },
  };
});

describe('logIn', () => {
  it('should call setOperator with correct parameters', () => {
    logIn({ myAccountId, myPrivateKey, network: 'testnet' });

    expect(Client.forName).toHaveBeenCalled();
    expect(Client.forName('testnet').setOperator).toHaveBeenCalledWith(myAccountId, myPrivateKey);
  });

  it('should throw an error if myAccountId is not provided', () => {
    expect(() => logIn({ myAccountId: '', myPrivateKey, network: 'testnet' })).toThrow(
      dictionary.createCollection.myAccountIdRequired
    );
  });

  it('should throw an error if myPrivateKey is not provided', () => {
    expect(() => logIn({ myAccountId, myPrivateKey: '', network: 'testnet' })).toThrow(
      dictionary.createCollection.myPrivateKeyRequired
    );
  });
});
