/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  clearMocks: true,

  collectCoverage: false,

  coverageDirectory: 'coverage',

  testEnvironment: 'jsdom',
}
