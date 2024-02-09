export interface JsonMetadataFromCSVInterface {
  isValid: boolean;
  errors: {
    general: string[];
    missingAttributes: string[];
  };
  savedJsonFilesLocation: string;
}
