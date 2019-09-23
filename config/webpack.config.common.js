'use strict';

const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const helpers = require('./helpers');
const isDev = process.env.NODE_ENV === 'development';

const webpackConfig = {
  entry: {
    polyfill: '@babel/polyfill',
    main: helpers.root('example', 'main.js'),
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': helpers.root('src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [helpers.root('src')],
      },
      {
        test: /\.css$/,
        use: [MiniCSSExtractPlugin.loader, { loader: 'css-loader', options: { sourceMap: isDev } }],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCSSExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: isDev } },
          { loader: 'sass-loader', options: { sourceMap: isDev } },
        ],
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: [{ loader: 'file-loader', options: { name: 'fonts/[name].[ext]' } }],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        exclude: /svg[\/\\]/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlPlugin({ template: './example/index.html', chunksSortMode: 'dependency' }),
    new webpack.NormalModuleReplacementPlugin(
      /element-ui[\/\\]lib[\/\\]locale[\/\\]lang[\/\\]zh-CN/,
      'element-ui/lib/locale/lang/ru-RU'
    ),
    new MiniCSSExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
};

module.exports = webpackConfig;
