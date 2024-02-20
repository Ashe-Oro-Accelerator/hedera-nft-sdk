import fs from 'fs';
import path from 'path';
import { NetworkName } from '@hashgraph/sdk/lib/client/Client';
import {
  Hip412MetadataCSVSchema,
  Hip412MetadataSchema,
} from '../validation-schemas/hip412Metadata.schema';
import {
  validateObjectWithSchema,
  validationMetadataErrorOptions,
} from '../helpers/validateObjectWithSchema';
import { errorToMessage } from '../helpers/errorToMessage';
import { MetadataObject } from '../../types/csv';
import { dictionary } from '../constants/dictionary';
import { REQUIRED } from '../constants/nftsLimitError';
import {
  getMetadataObjectsForValidation,
  getNFTsFromToken,
  getSingleNFTMetadata,
} from '../../api/mirrorNode';
import { uriDecoder } from '../helpers/uriDecoder';
import { ValidationError } from '../validationError';

interface FileValidationResult {
  isValid: boolean;
  fileName?: string;
  errors: string[];
}

interface DirectoryValidationResult {
  isValid: boolean;
  errors: MetadataError[];
}

interface MetadataError {
  fileName?: string;
  general: string[];
}

interface MetadataOnChainObjects {
  metadata?: MetadataObject;
  serialNumber: number;
  error?: string;
}

export class Hip412Validator {
  static validateSingleMetadataObject(object: MetadataObject): FileValidationResult {
    const errors: string[] = [];

    try {
      validateObjectWithSchema(Hip412MetadataSchema, object, validationMetadataErrorOptions);
    } catch (err) {
      if (err instanceof ValidationError) {
        errors.push(...err.errors);
      } else {
        errors.push(errorToMessage(err));
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateArrayOfObjects = (
    metadataObjects: MetadataObject[],
    filePath?: string
  ): FileValidationResult => {
    const errors: string[] = [];

    for (const [index, metadataObject] of metadataObjects.entries()) {
      try {
        validateObjectWithSchema(
          Hip412MetadataCSVSchema,
          metadataObject,
          validationMetadataErrorOptions
        );
      } catch (e) {
        errors.push(
          dictionary.validation.arrayOfObjectsValidationError(
            filePath || `object ${index + 1}`,
            errorToMessage(
              errorToMessage(e) === REQUIRED ? dictionary.validation.requiredFieldMissing : e
            )
          )
        );
      }
    }
    return { isValid: errors.length === 0, errors };
  };

  static validateLocalFile(filePath: string): FileValidationResult {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const object: MetadataObject = JSON.parse(fileContent);
      return this.validateSingleMetadataObject(object);
    } catch (error) {
      return {
        isValid: false,
        errors: [errorToMessage(error)],
      };
    }
  }

  static validateLocalDirectory(directoryPath: string): DirectoryValidationResult {
    const errors: MetadataError[] = [];

    const filesForValidation = fs
      .readdirSync(directoryPath)
      .filter((file) => file.endsWith('.json') || file.endsWith('.txt'))
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] ?? '0', 10);
        const numB = parseInt(b.match(/\d+/)?.[0] ?? '0', 10);
        return numA - numB;
        // Sorts the file names numerically ensuring that files are ordered naturally (e.g., '1', '2', '10' instead of '1', '10', '2').
      });
    if (filesForValidation.length === 0) {
      return {
        isValid: false,
        errors: [
          {
            general: [dictionary.validation.directoryIsEmpty],
          },
        ],
      };
    }

    let allFilesValid = true;

    for (const file of filesForValidation) {
      const filePath = path.join(directoryPath, file);
      const validationResult = this.validateLocalFile(filePath);

      if (!validationResult.isValid) {
        allFilesValid = false;
        errors.push({
          fileName: file,
          general: validationResult.errors,
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
          validateObjectWithSchema(
            Hip412MetadataCSVSchema,
            obj.metadata,
            validationMetadataErrorOptions
          );
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
    limit: number = 100
  ) {
    const nfts = await getNFTsFromToken(network, tokenId, limit);
    const decodedMetadataArray = uriDecoder(nfts, ipfsGateway);

    const metadataObjects = await Promise.all(
      decodedMetadataArray.map(async ({ metadata, serialNumber }) => {
        return await getMetadataObjectsForValidation(metadata, serialNumber);
      })
    );

    const validationResponse = Hip412Validator.validateOnChainArrayOfObjects(metadataObjects);
    return validationResponse;
  }

  static async validateSingleOnChainNFTMetadata(
    network: NetworkName,
    tokenId: string,
    serialNumber: number,
    ipfsGateway?: string
  ) {
    const nft = await getSingleNFTMetadata(network, tokenId, serialNumber);
    const decodedNFTMetadataURL = uriDecoder(nft, ipfsGateway);

    const metadataObject = await getMetadataObjectsForValidation(
      decodedNFTMetadataURL[0].metadata,
      decodedNFTMetadataURL[0].serialNumber
    );

    if (!metadataObject.metadata) {
      return {
        isValid: false,
        errors: {
          general: [metadataObject.error],
          missingAttributes: [],
        },
      };
    }
    const validationResponse = Hip412Validator.validateSingleMetadataObject(
      metadataObject.metadata
    );

    return validationResponse;
  }
}
