import {
  noPropertiesErrorOptions,
  validateObjectWithSchema,
} from '../helpers/validateObjectWithSchema';
import type { BufferFile } from '../../types/bufferFile';
import type { Directory } from '../../types/directory';
import type { CSVRowAsObject } from '../../types/csv';
import type { NFTMetadata } from '../../types/nftMetadata';
import { Hip412MetadataCSVSchema } from '../validation-schemas/hip412Metadata.schema';
import isString from 'lodash/isString';
import omit from 'lodash/omitBy';
import isNil from 'lodash/isNil';

interface UploadedFile<T> {
  bufferFile: BufferFile;
  uploadData: T | null;
}
export class Hip412Metadata implements Partial<NFTMetadata> {
  public name;
  public creator;
  public creatorDID;
  public description;
  public image;
  public type;
  public files;
  public format;
  public properties;
  public attributes;
  public localization;
  public directory: Directory | null = null;
  public metadataUri: string | null = null;
  public previewImageFromDirectory: UploadedFile<string> | null = null;

  constructor(props: Partial<NFTMetadata> | string) {
    if (isString(props)) {
      this.metadataUri = props;
      return;
    }

    this.name = props.name;
    this.creator = props.creator;
    this.creatorDID = props.creatorDID;
    this.description = props.description;
    this.image = props.image;
    this.type = props.type;
    this.format = props?.format ?? 'HIP412@2.0.0';
    this.files = props.files;
    this.properties = props.properties;
    this.attributes = props.attributes;
    this.localization = props.localization;
  }

  public toObject(): Partial<NFTMetadata> {
    return omit(
      {
        name: this.name,
        image: this.image,
        description: this.description,
        creator: this.creator,
        creatorDID: this.creatorDID,
        type: this.type,
        format: this.format,
        files: this.files,
        attributes: this.attributes,
        properties: this.properties,
        localization: this.localization,
      },
      isNil
    );
  }

  static validateMetadataFromCsv(metadata: Partial<CSVRowAsObject>): boolean {
    validateObjectWithSchema(Hip412MetadataCSVSchema, metadata, noPropertiesErrorOptions);
    return true;
  }
}
