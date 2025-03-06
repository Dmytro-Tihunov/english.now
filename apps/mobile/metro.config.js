/* eslint-env node */
const { getDefaultConfig } = require("expo/metro-config");

// eslint-disable-next-line no-undef
const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true,
});

config.resolver.unstable_enablePackageExports = true;

module.exports = config;
