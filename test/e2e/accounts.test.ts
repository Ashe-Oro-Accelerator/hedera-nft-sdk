// TODO: this test needs to be deleted after we agree that our testing flow is correct

import { fetchForTesting } from '../../src/index';

describe('fetch', () => {
  it('returns a response with status code 200', async () => {
    const response = await fetchForTesting();
    expect(response.status).toEqual(200);
  });
});
