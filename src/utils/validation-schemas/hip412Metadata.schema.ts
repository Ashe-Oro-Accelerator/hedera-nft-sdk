import { isImageFile } from '../helpers/isImageFile';
import type { BufferFile } from '../../types/bufferFile';
import isString from 'lodash/isString';
import omit from 'lodash/omit';
import { type ZodTypeAny, z } from 'zod';
import { dictionary } from '../constants/dictionary';

const AttributeSchema = z.object({
  trait_type: z.string(),
  display_type: z.string().optional(),
  value: z.union([z.string().min(1), z.number(), z.boolean()]),
  max_value: z.union([z.string(), z.number()]).optional(),
});

const LocalizationSchema = z.object({
  uri: z.string(),
  default: z.string(),
  locales: z.array(z.string()),
});

const FileSchema = z.object({
  uri: z.string(),
  type: z.string(),
  metadata: recursiveSchema(),
  checksum: z.string().optional(),
  is_default_file: z.boolean().optional(),
  metadata_uri: z.string().optional(),
});

export const Hip412MetadataCommonSchema = {
  name: z.string().min(1),
  description: z.string().optional(),
  creator: z.string().optional(),
  creatorDID: z.string().optional(),
  checksum: z.string().optional(),
  type: z.string().optional(),
  files: z.array(FileSchema).optional(),
  format: z.optional(z.string()),
  properties: z.record(z.unknown()).optional(),
  attributes: z.array(AttributeSchema).optional(),
  localization: LocalizationSchema.optional(),
};

export const imageForHip412MetadataSchema = z
  .custom<string | BufferFile | undefined>()
  .superRefine((value, ctx) => {
    if (!value || (isString(value) && !value.length)) {
      ctx.addIssue({
        fatal: true,
        code: z.ZodIssueCode.custom,
        message: dictionary.validation.imageForNftNotFound,
      });
      return false;
    }

    if (!isString(value) && value.filePath && !isImageFile(value.name, value.mimeType)) {
      ctx.addIssue({
        fatal: true,
        code: z.ZodIssueCode.custom,
        message: dictionary.validation.mediaFileNotSupported,
      });
      return false;
    }

    return true;
  });

function recursiveSchema(): ZodTypeAny {
  return z.lazy(() => z.object(Hip412MetadataCommonSchema));
}

export const Hip412MetadataSchema = z.object({
  ...Hip412MetadataCommonSchema,
  image: imageForHip412MetadataSchema,
});

export const Hip412MetadataCSVSchema = z.object({
  ...omit(Hip412MetadataCommonSchema, ['format']),
  image: imageForHip412MetadataSchema,
});
