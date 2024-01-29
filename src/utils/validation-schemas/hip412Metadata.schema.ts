import { isImageFile } from '../helpers/isImageFile';
import type { BufferFile } from '../../types/bufferFile';
import isString from 'lodash/isString';
import omit from 'lodash/omit';
import { type ZodTypeAny, z } from 'zod';

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
  description: z.string().min(1),
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
        // TODO: move message to dictionary
        message:
          'Image for NFT not found. Please make sure the image is included in the "data/media" directory.  The name of the image file should match its corresponding metadata file name (ex: 1.jpg with 1.json) or specify directly the "image" property.',
      });
      return false;
    }

    if (!isString(value) && value.filePath && !isImageFile(value.name, value.mimeType)) {
      ctx.addIssue({
        fatal: true,
        code: z.ZodIssueCode.custom,
        // TODO: move message to dictionary
        message: 'Media file is not supported.',
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
