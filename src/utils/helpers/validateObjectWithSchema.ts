import { dictionary } from '../constants/dictionary';
import filter from 'lodash/filter';
import keys from 'lodash/keys';
import { type z } from 'zod';
import type { ErrorMessageOptions } from 'zod-error';
import { generateErrorMessage } from 'zod-error';

export const noPropertiesErrorOptions: ErrorMessageOptions = {
  prefix: '',
  delimiter: {
    error: '\n',
  },
  message: {
    enabled: true,
    transform: ({ value }) => value,
  },
  path: {
    enabled: false,
  },
  transform: ({ messageComponent }) => messageComponent,
};

export const propertiesErrorOptions: ErrorMessageOptions = {
  prefix: '',
  path: {
    type: 'breadcrumbs',
    enabled: true,
    label: 'Invalid',
    transform: ({ label, value }) => `${label} "${value}".`,
  },
  code: {
    enabled: false,
  },
  delimiter: {
    component: ' ',
    error: '',
  },
  transform: ({ errorMessage }) => `${errorMessage}\n`,
};

export const validateObjectWithSchema = <T extends { [key: string]: string | unknown }>(
  Schema: z.ZodSchema<T>,
  object: z.infer<z.ZodSchema<T | unknown>>,
  errorMessageOptions = noPropertiesErrorOptions
): T => {
  const validation = Schema.safeParse(object);
  if (!validation.success) {
    const errorMessage = generateErrorMessage(validation.error.issues, errorMessageOptions);
    throw new Error(errorMessage);
  }

  const parsedObjectWithSchema = Schema.parse(object);
  const overPropertiesFromObjectWhichAreNotInSchema = filter(
    keys(object),
    (key) => !keys(parsedObjectWithSchema).includes(key)
  );

  if (overPropertiesFromObjectWhichAreNotInSchema.length > 0) {
    throw new Error(dictionary.csvToJson.tooManyValuesForValidationSchema);
  }

  return object as z.infer<z.ZodSchema<T>>;
};
