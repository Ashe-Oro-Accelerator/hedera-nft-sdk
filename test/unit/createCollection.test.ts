import { Client, PrivateKey } from '@hashgraph/sdk';
import { createCollectionFunction } from '../../src/functions/createCollection';
import { myPrivateKey } from '../__mocks__/consts';
jest.mock('@hashgraph/sdk', () => {
  return {
    Client: {
      forTestnet: jest.fn().mockImplementation(() => ({
        setOperator: jest.fn(),
        _maxExecutionTime: jest.fn(),
        setMaxExecutionTime: jest.fn(),
        _setNetworkFromName: jest.fn(),
        setMirrorNetwork: jest.fn(),
      })),
    },
    AccountId: {
      fromString: jest.fn().mockReturnThis(),
    },
    PrivateKey: {
      fromString: jest.fn().mockReturnThis(),
    },
    TokenCreateTransaction: jest.fn(() => ({
      setTokenName: jest.fn().mockReturnThis(),
      setTokenSymbol: jest.fn().mockReturnThis(),
      setTokenType: jest.fn().mockReturnThis(),
      setSupplyKey: jest.fn().mockReturnThis(),
      setTreasuryAccountId: jest.fn().mockReturnThis(),
      setAdminKey: jest.fn().mockReturnThis(),
      setKycKey: jest.fn().mockReturnThis(),
      setFreezeKey: jest.fn().mockReturnThis(),
      setWipeKey: jest.fn().mockReturnThis(),
      setFeeScheduleKey: jest.fn().mockReturnThis(),
      setPauseKey: jest.fn().mockReturnThis(),
      setMaxSupply: jest.fn().mockReturnThis(),
      setCustomFees: jest.fn().mockReturnThis(),
      freezeWith: jest.fn().mockReturnThis(),
      sign: jest.fn().mockResolvedValue({
        sign: jest.fn().mockResolvedValue({
          execute: jest.fn().mockResolvedValue({
            getReceipt: jest.fn().mockResolvedValue({
              tokenId: {
                toString: jest.fn().mockReturnValue('0.0.1234'),
              },
            }),
          }),
        }),
      }),
    })),
    TokenType: {
      NonFungibleUnique: 'NonFungibleUnique',
    },
  };
});

describe('createCollectionFunction', () => {
  it('should create a collection and return a tokenId', async () => {
    const client = Client.forTestnet();
    const collectionName = 'test';
    const collectionSymbol = 'test2';
    const keys = {
      admin: PrivateKey.fromString(myPrivateKey),
      supply: PrivateKey.fromString(myPrivateKey),
    };
    const treasuryAccount = '0.0.1234';

    const tokenId = await createCollectionFunction({
      client,
      myPrivateKey,
      collectionName,
      collectionSymbol,
      keys,
      treasuryAccount,
    });

    expect(tokenId).toEqual('0.0.1234');
  });

  it('should throw an error if myPrivateKey is not provided', async () => {
    const client = Client.forTestnet();
    const collectionName = 'test';
    const collectionSymbol = 'test2';
    const keys = {
      admin: PrivateKey.fromString(''),
      supply: PrivateKey.fromString(''),
    };
    const treasuryAccount = '0.0.1234';

    await expect(
      createCollectionFunction({
        client,
        myPrivateKey: '',
        collectionName,
        collectionSymbol,
        keys,
        treasuryAccount,
      })
    ).rejects.toThrow();
  });

  it('should throw an error if collectionName is not provided', async () => {
    const client = Client.forTestnet();
    const collectionSymbol = 'test2';
    const keys = {
      admin: PrivateKey.fromString(myPrivateKey),
      supply: PrivateKey.fromString(myPrivateKey),
    };
    const treasuryAccount = '0.0.1234';

    await expect(
      createCollectionFunction({
        client,
        myPrivateKey,
        collectionName: '',
        collectionSymbol,
        keys,
        treasuryAccount,
      })
    ).rejects.toThrow();
  });
});
