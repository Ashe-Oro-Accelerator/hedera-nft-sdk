import { dictionary } from '../constants/dictionary';
import filter from 'lodash/filter';
import keys from 'lodash/keys';
import { type z } from 'zod';
import type { ErrorMessageOptions } from 'zod-error';
import { generateErrorMessage } from 'zod-error';
import { ValidationError } from '../validationError';

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

export const validationMetadataErrorOptions: ErrorMessageOptions = {
  prefix: '',
  path: {
    type: 'breadcrumbs',
    enabled: true,
    label: 'The required',
    transform: ({ label, value }) => `${label} "${value}" field is missing.`,
  },
  code: {
    enabled: false,
  },
  delimiter: {
    component: ' ',
    error: '',
  },
  message: { enabled: false },
  transform: ({ errorMessage }) => errorMessage,
};

export const validateObjectWithSchema = <T extends { [key: string]: string | unknown }>(
  Schema: z.ZodSchema<T>,
  object: z.infer<z.ZodSchema<T | unknown>>,
  errorMessageOptions = noPropertiesErrorOptions
): T => {
  const validation = Schema.safeParse(object);
  if (!validation.success) {
    const errorMessages = validation.error.issues.map((issue) =>
      generateErrorMessage([issue], errorMessageOptions)
    );

    throw new ValidationError(errorMessages);
  }

  const parsedObjectWithSchema = Schema.parse(object);
  const overPropertiesFromObjectWhichAreNotInSchema = filter(
    keys(object),
    (key) => !keys(parsedObjectWithSchema).includes(key)
  );

  if (overPropertiesFromObjectWhichAreNotInSchema.length > 0) {
    throw new Error(
      dictionary.validation.invalidKeysDetected(overPropertiesFromObjectWhichAreNotInSchema)
    );
  }

  return object as z.infer<z.ZodSchema<T>>;
};
