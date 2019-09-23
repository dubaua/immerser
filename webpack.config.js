const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const I18nPlugin = require('i18n-webpack-plugin');
const languages = {
  en: require('./i18n/en.json'),
  ru: require('./i18n/ru.json'),
};

const isDev = process.env.NODE_ENV !== 'production';

module.exports = Object.keys(languages).map(function(language) {
  return {
    name: language,
    entry: {
      main: path.resolve(__dirname, 'example/main.js'),
    },
    output: {
      path: __dirname + '/docs',
      filename: 'main.js',
    },
    optimization: {
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: ['babel-loader'],
          exclude: /node_modules/,
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
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, { loader: 'css-loader' }, { loader: 'sass-loader' }],
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, { loader: 'css-loader' }],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './example/index.html',
        filename: language === 'en' ? 'index.html' : language + '.html',
      }),
      new MiniCssExtractPlugin({
        filename: isDev ? '[name].css' : '[name].[hash].css',
        chunkFilename: isDev ? '[id].css' : '[id].[hash].css',
      }),
      new I18nPlugin(languages[language]),
    ],
  };
});
