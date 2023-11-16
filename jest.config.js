/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  roots: ['src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json"
  ],
  verbose: true,
  moduleNameMapper: {
    '^.+\\.(css|scss)$': '<rootDir>/src/tests/CSSStub.js'
  }
};

const {defaults} = require('jest-config');