// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = withNativeWind(getDefaultConfig(__dirname), {
	input: "./global.css",
	configPath: "./tailwind.config.js",
});

config.resolver.unstable_enablePackageExports = true;

module.exports = config;
