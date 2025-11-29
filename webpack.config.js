const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/immerser.ts',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'immerser.min.js',
    library: 'Immerser',
    libraryTarget: 'umd',
    libraryExport: 'default',
    globalObject: 'this',
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
            reserved: ['Immerser'],
          },
        },
      }),
    ],
  },
};
