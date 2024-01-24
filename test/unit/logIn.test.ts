import { logIn } from '../../src/functions/logIn';
import { Client } from '@hashgraph/sdk';
import { myAccountId, myPrivateKey } from '../__mocks__/consts';
import errors from '../../src/dictionary/errors.json';

jest.mock('@hashgraph/sdk', () => {
  return {
    Client: {
      forTestnet: jest.fn().mockReturnThis(),
      setOperator: jest.fn(),
    },
  };
});

describe('logIn', () => {
  it('should call setOperator with correct parameters', () => {
    logIn({ myAccountId, myPrivateKey });

    expect(Client.forTestnet).toHaveBeenCalled();
    expect(Client.forTestnet().setOperator).toHaveBeenCalledWith(myAccountId, myPrivateKey);
  });

  it('should throw an error if myAccountId is not provided', () => {
    expect(() => logIn({ myAccountId: '', myPrivateKey })).toThrow(errors.myAccountIdRequired);
  });

  it('should throw an error if myPrivateKey is not provided', () => {
    expect(() => logIn({ myAccountId, myPrivateKey: '' })).toThrow(errors.myPrivateKeyRequired);
  });
});
