const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/impl/**/*.{ts,js}',
    'src/**/utils/**/*.{ts,js}',
    'src/**/routes/**/*.{ts,js}',
  ]
};