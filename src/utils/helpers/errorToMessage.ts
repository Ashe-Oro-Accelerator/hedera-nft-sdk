import { dictionary } from '../constants/dictionary';

export const errorToMessage = (e: unknown): string => {
  let error: string | null = null;

  if (e instanceof Error) error = e.message;
  if (typeof e === 'string') error = e;
  if (!error) error = dictionary.errors.unhandledError;

  return error;
};
