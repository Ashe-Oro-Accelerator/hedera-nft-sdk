import fs from 'fs';
import path from 'path';
import {
  Hip412MetadataCSVSchema,
  Hip412MetadataSchema,
} from '../validation-schemas/hip412Metadata.schema';
import {
  validateObjectWithSchema,
  noPropertiesErrorOptions,
  validationMetadataErrorOptions,
} from '../helpers/validateObjectWithSchema';
import { errorToMessage } from '../helpers/errorToMessage';
import type { NFTMetadata } from '../../types/nftMetadata';
import { CSVRowAsObject } from '../../types/csv';
import { dictionary } from '../constants/dictionary';

interface FileValidationResult {
  isValid: boolean;
  fileName?: string;
  errors: ValidationErrorsInterface;
}

interface ValidationErrorsInterface {
  general: string[];
  missingAttributes: string[];
}

interface DirectoryValidationResult {
  isValid: boolean;
  errors: MetadataError[];
}

interface MetadataError {
  fileName?: string;
  general: string[];
  missingAttributes: string[];
}

export class Hip412Validator {
  static validateSingleObject(object: NFTMetadata): FileValidationResult {
    const errors: ValidationErrorsInterface = { general: [], missingAttributes: [] };

    try {
      validateObjectWithSchema(Hip412MetadataSchema, object, validationMetadataErrorOptions);
    } catch (error) {
      errors.general.push(errorToMessage(error));
    }

    if (!object.attributes || object.attributes.length === 0) {
      errors.missingAttributes.push(dictionary.validation.missingAttributes);
    }

    return {
      isValid: errors.general.length === 0 && errors.general.length === 0,
      errors,
    };
  }

  static validateArrayOfObjects = (
    metadataObjects: CSVRowAsObject[],
    filePath: string
  ): FileValidationResult => {
    let allObjectsValid = true;
    const errors: ValidationErrorsInterface = { general: [], missingAttributes: [] };

    for (const [index, metadataObject] of metadataObjects.entries()) {
      try {
        validateObjectWithSchema(Hip412MetadataCSVSchema, metadataObject, noPropertiesErrorOptions);
      } catch (e) {
        errors.general.push(
          dictionary.validation.errorInRow(filePath, index + 1, errorToMessage(e))
        );
      }

      if (!metadataObject.attributes) {
        errors.missingAttributes.push(
          dictionary.validation.missingAttributesInRowWithFilePath(filePath, index + 1)
        );
      }

      if (errors.general.length > 0 || errors.missingAttributes.length > 0) {
        allObjectsValid = false;
      }
    }

    return { isValid: allObjectsValid, errors };
  };

  static validateLocalFile(filePath: string): FileValidationResult {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const object: NFTMetadata = JSON.parse(fileContent);
    return this.validateSingleObject(object);
  }

  static validateLocalDirectory(directoryPath: string): DirectoryValidationResult {
    let allFilesValid = true;
    const errors: MetadataError[] = [];

    const jsonFiles = fs
      .readdirSync(directoryPath)
      .filter((file) => path.extname(file) === '.json')
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] ?? '0', 10);
        const numB = parseInt(b.match(/\d+/)?.[0] ?? '0', 10);
        return numA - numB;
      });

    for (const file of jsonFiles) {
      const filePath = path.join(directoryPath, file);
      const validationResult = this.validateLocalFile(filePath);

      if (!validationResult.isValid) {
        allFilesValid = false;
        errors.push({
          fileName: file,
          general: validationResult.errors.general,
          missingAttributes: validationResult.errors.missingAttributes,
        });
      }
    }

    return { isValid: allFilesValid, errors };
  }
}
