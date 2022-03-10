/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  collectCoverageFrom: ['**/*.@(js|mjs|ts|tsx)', '!**/*.d.ts', '!**/node_modules/**'],
  coverageProvider: 'v8',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  /**
   * `@testing-library/jest-dom/matchers` cannot currently extend `expect` when it's
   * not used as a global, but imported from '@jest/globals`.
   *
   * @see https://github.com/facebook/jest/pull/11490
   */
  // injectGlobals: false,
  moduleNameMapper: {
    '\\.module\\.css$': 'identity-obj-proxy',
    '\\.css$': '<rootDir>/test/mocks/style.ts',
    '\\.(?:jpg|jpeg|png|gif|webp|avif|svg)$': '<rootDir>/test/mocks/next-image.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/$1',
  },
  /** Custom resolver is necessary until jest supports package exports. */
  resolver: '<rootDir>/scripts/resolver.js',
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/out/',
    '<rootDir>/cypress/',
  ],
  transform: {
    '\\.(?:js|mjs|ts|tsx)$': [
      'babel-jest',
      {
        presets: ['next/babel'],
      },
    ],
  },
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
}

export default config
