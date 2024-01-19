import type { JestConfigWithTsJest } from 'ts-jest';

const PATHS_TO_EXCLUDE_FROM_TESTS = [''];

const config: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  moduleNameMapper: {
    '^@src(.*)$': '<rootDir>/src$1',
    '^@mocks(.*)$': '<rootDir>/tests/__mocks__$1',
  },
  roots: ['<rootDir>'],
  coveragePathIgnorePatterns: PATHS_TO_EXCLUDE_FROM_TESTS,
  testPathIgnorePatterns: PATHS_TO_EXCLUDE_FROM_TESTS,
  modulePathIgnorePatterns: PATHS_TO_EXCLUDE_FROM_TESTS,
  testMatch: ['**/tests/**/*.test.(ts|tsx)'],
};

export default config;
