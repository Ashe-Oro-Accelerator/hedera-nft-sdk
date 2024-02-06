export interface JsonMetadataFromCSVInterface {
  errors: {
    metadataObjectsValidationErrors: string[];
    missingAttributesErrors: string[];
  };
  savedJsonFilesLocation: string;
}
