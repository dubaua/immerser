const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const I18nPlugin = require('@zainulbr/i18n-webpack-plugin');
const languages = {
  en: require('./i18n/en.js'),
  ru: require('./i18n/ru.js'),
};

const isDev = process.env.NODE_ENV !== 'production';

module.exports = Object.keys(languages).map((language) => ({
  name: language,
  entry: {
    main: path.resolve(__dirname, 'example/main.js'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  output: {
    path: __dirname + '/docs',
    filename: 'main.js',
  },
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new TerserJSPlugin({
        terserOptions: {
          mangle: {
            reserved: ['Immerser'],
          },
        },
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
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
        exclude: /svg[/\\]/,
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
        use: [MiniCSSExtractPlugin.loader, { loader: 'css-loader' }, { loader: 'sass-loader' }],
      },
      {
        test: /\.css$/,
        use: [MiniCSSExtractPlugin.loader, { loader: 'css-loader' }],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './example/index.html',
      filename: language === 'en' ? 'index.html' : language + '.html',
      favicon: './example/favicon/favicon.ico',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    }),
    new MiniCSSExtractPlugin({
      filename: isDev ? '[name].css' : '[name].[hash].css',
      chunkFilename: isDev ? '[id].css' : '[id].[hash].css',
    }),
    new I18nPlugin(languages[language], {
      functionName: 'getTranslation',
    }),
  ],
}));
