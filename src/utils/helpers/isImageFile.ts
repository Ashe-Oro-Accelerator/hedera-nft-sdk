import some from 'lodash/some';
import {
  KNOWN_IMAGE_EXTENSIONS,
  KNOWN_IMAGE_MIME_TYPES,
} from '../constants/mimeTypesAndExtensions';

export const isImageFile = (
  fileName: string | undefined,
  mimeType: string | undefined
): boolean => {
  if (!mimeType || !fileName) return false;

  const bufferFileExtension = fileName.split('.')[fileName.split('.').length - 1];
  const isKnownExtension = some(KNOWN_IMAGE_EXTENSIONS, (el) => el === bufferFileExtension);

  const isKnownMimeType = some(KNOWN_IMAGE_MIME_TYPES, (knownMimeType) =>
    mimeType.includes(knownMimeType)
  );

  return isKnownMimeType || isKnownExtension;
};
