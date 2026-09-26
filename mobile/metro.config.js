const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const realDir = 'c:/Users/Varchswa Gupta/Pictures/Screenshots/paradise app/mobile';

config.watchFolders = [
  __dirname,
  path.resolve(__dirname),
  realDir,
  path.resolve(realDir, 'node_modules'),
];

config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(realDir, 'node_modules'),
];

module.exports = config;
