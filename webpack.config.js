const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const baseConfig = {
  entry: './src/immerser.ts',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  devtool: 'source-map',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: {
            reserved: ['Immerser', 'ImmerserDomController', 'ImmerserMarkupController', 'ImmerserEngine'],
          },
        },
      }),
    ],
  },
};

module.exports = [
  {
    ...baseConfig,
    output: {
      filename: 'immerser.min.js',
      library: 'Immerser',
      libraryTarget: 'umd',
      libraryExport: 'default',
      globalObject: 'this',
    },
  },
  {
    ...baseConfig,
    output: {
      filename: 'immerser.esm.mjs',
      library: {
        type: 'module',
      },
    },
    experiments: {
      outputModule: true,
    },
  },
];
