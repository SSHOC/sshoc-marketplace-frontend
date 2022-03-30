/**
 * Jest config with SWC not yet working with `.mjs` imports.
 */

import createConfigFactory from 'next/jest.js'

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  collectCoverageFrom: ['**/*.@(ts|tsx)', '!**/*.d.ts', '!**/node_modules/**'],
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
    '\\?symbol-icon$': '<rootDir>/test/__mocks__/Icon.tsx',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/$1',
  },
  rootDir: '../',
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/cypress/'],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
}

const createConfig = createConfigFactory({ dir: process.cwd() })

export default createConfig(config)
