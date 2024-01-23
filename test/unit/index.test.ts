import 'dotenv/config';

describe('sum', () => {
  const testValue = Number(process.env.TEST_VALUE);
  it('adds two numbers together', () => {
    expect(1 + 1).toEqual(testValue);
  });
});
