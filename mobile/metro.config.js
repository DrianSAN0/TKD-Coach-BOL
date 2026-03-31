const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const EMPTY_MODULES = [
  '@mediapipe/pose',
  'react-native-fs',
  'seedrandom',
  '@tensorflow/tfjs-backend-webgpu',
  '@tensorflow/tfjs-backend-nodegl',
  'gl',
];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (EMPTY_MODULES.includes(moduleName)) {
    return {
      filePath: require.resolve('./emptyModule.js'),
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;