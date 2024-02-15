import fs from 'fs';
import path from 'path';
import { NetworkName } from '@hashgraph/sdk/lib/client/Client';
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
import { MetadataObject } from '../../types/csv';
import { dictionary } from '../constants/dictionary';
import { getMetadataObjectsForValidation, getNFTsFromToken } from '../../api/mirrorNode';
import { nftMetadataDecoder } from '../helpers/nftMetadataDecoder';

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

interface MetadataOnChainObjects {
  metadata?: MetadataObject;
  serialNumber: number;
  error?: string;
}

export class Hip412Validator {
  static validateSingleMetadataObject(object: MetadataObject): FileValidationResult {
    const errors: ValidationErrorsInterface = { general: [], missingAttributes: [] };

    try {
      validateObjectWithSchema(Hip412MetadataSchema, object, validationMetadataErrorOptions);
    } catch (error) {
      errors.general.push(errorToMessage(error));
    }

    if (!object.attributes) {
      errors.missingAttributes.push(dictionary.validation.missingAttributes);
    }

    return {
      isValid: errors.general.length === 0,
      errors,
    };
  }

  static validateArrayOfObjects = (
    metadataObjects: MetadataObject[],
    filePath: string
  ): FileValidationResult => {
    const errors: ValidationErrorsInterface = { general: [], missingAttributes: [] };

    for (const [index, metadataObject] of metadataObjects.entries()) {
      try {
        validateObjectWithSchema(Hip412MetadataCSVSchema, metadataObject, noPropertiesErrorOptions);
      } catch (e) {
        errors.general.push(
          dictionary.validation.errorInRow(
            filePath,
            index + 1,
            errorToMessage(
              errorToMessage(e) === 'Required' ? dictionary.validation.requiredFieldMissing : e
            )
          )
        );
      }

      if (!metadataObject.attributes) {
        errors.missingAttributes.push(
          dictionary.validation.missingAttributesInRowWithFilePath(filePath, index + 1)
        );
      }
    }
    return { isValid: errors.general.length === 0, errors };
  };

  static validateLocalFile(filePath: string): FileValidationResult {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const object: MetadataObject = JSON.parse(fileContent);
      return this.validateSingleMetadataObject(object);
    } catch (error) {
      return {
        isValid: false,
        errors: {
          general: [errorToMessage(error)],
          missingAttributes: [],
        },
      };
    }
  }

  static validateLocalDirectory(directoryPath: string): DirectoryValidationResult {
    const errors: MetadataError[] = [];

    const jsonFiles = fs
      .readdirSync(directoryPath)
      // .gitkeep file is needed inside empty-json-directory to keep it in the repository that's why we filter it out
      .filter((file) => file !== '.gitkeep')
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] ?? '0', 10);
        const numB = parseInt(b.match(/\d+/)?.[0] ?? '0', 10);
        return numA - numB;
      });

    if (jsonFiles.length === 0) {
      return {
        isValid: false,
        errors: [
          {
            general: [dictionary.validation.directoryIsEmpty],
            missingAttributes: [],
          },
        ],
      };
    }

    let allFilesValid = true;

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

  static validateOnChainArrayOfObjects = (
    metadataObjects: MetadataOnChainObjects[]
  ): { isValid: boolean; errors: Array<{ serialNumber: number; message: string[] }> } => {
    const errors: Array<{ serialNumber: number; message: string[] }> = [];

    metadataObjects.forEach((obj) => {
      if (obj.error) {
        errors.push({
          serialNumber: obj.serialNumber,
          message: [obj.error],
        });
      } else if (obj.metadata) {
        try {
          validateObjectWithSchema(Hip412MetadataCSVSchema, obj.metadata, noPropertiesErrorOptions);
        } catch (e) {
          errors.push({
            serialNumber: obj.serialNumber,
            message: [errorToMessage(e)],
          });
        }
      }
    });

    return { isValid: errors.length === 0, errors };
  };

  static async validateMetadataFromOnChainCollection(
    network: NetworkName,
    tokenId: string,
    ipfsGateway?: string,
    mirrorNodeUrl?: string
  ) {
    const nfts = await getNFTsFromToken(network, tokenId, mirrorNodeUrl);
    const decodedMetadataArray = nftMetadataDecoder(nfts, ipfsGateway);

    const metadataObjects = await Promise.all(
      decodedMetadataArray.map(async ({ metadata, serialNumber }) => {
        return await getMetadataObjectsForValidation(metadata, serialNumber);
      })
    );

    const validationResponse = Hip412Validator.validateOnChainArrayOfObjects(metadataObjects);
    return validationResponse;
  }
}
