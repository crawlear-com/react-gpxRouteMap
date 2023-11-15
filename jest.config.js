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
};

const {defaults} = require('jest-config');