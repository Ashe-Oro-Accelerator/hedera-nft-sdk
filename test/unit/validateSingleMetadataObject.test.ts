import { Hip412Validator } from '../../src/utils/services/Hip412Validator';

const METADATA_OBJECT_WITH_ONLY_REQUIRED_FIELDS = {
  name: 'Example NFT 1',
  image: 'https://nft.com/mycollection/1.jpg',
};

const METADATA_OBJECT_WITH_IMAGE_FIELD_MISSING = {
  name: 'Example NFT 1',
};

describe('Hip412Validator.validateSingleObject', () => {
  it('should not return any errors for an object with only required fields filled', () => {
    const validationResult = Hip412Validator.validateSingleMetadataObject(
      METADATA_OBJECT_WITH_ONLY_REQUIRED_FIELDS
    );

    expect(validationResult.isValid).toBe(true);
    expect(validationResult.errors.general).toHaveLength(0);
  });

  it('should return an error in errors.general for an object missing the image field', () => {
    const validationResult = Hip412Validator.validateSingleMetadataObject(
      METADATA_OBJECT_WITH_IMAGE_FIELD_MISSING
    );

    expect(validationResult.isValid).toBe(false);
    expect(validationResult.errors.general).toHaveLength(1);
  });
});
