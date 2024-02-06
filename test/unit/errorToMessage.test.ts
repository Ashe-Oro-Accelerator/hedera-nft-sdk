import { dictionary } from '../../src/utils/constants/dictionary';
import { errorToMessage } from '../../src/utils/helpers/errorToMessage';

describe('errorToMessage', () => {
  it('error is instance of Error', () => {
    const message = errorToMessage(new Error('test error'));
    expect(message).toBe('test error');
  });

  it('error is instance of string', () => {
    const message = errorToMessage('test error');

    expect(message).toBe('test error');
  });

  it('unhandled error', () => {
    const message = errorToMessage(undefined);

    expect(message).toBe(dictionary.errors.unhandledError);
  });

  it('error is null', () => {
    const message = errorToMessage(null);

    expect(message).toBe(dictionary.errors.unhandledError);
  });

  it('error is undefined', () => {
    const message = errorToMessage(undefined);

    expect(message).toBe(dictionary.errors.unhandledError);
  });

  it('error is not instance of Error or string', () => {
    const message = errorToMessage(123);

    expect(message).toBe(dictionary.errors.unhandledError);
  });
});
