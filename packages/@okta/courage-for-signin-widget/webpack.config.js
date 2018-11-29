/* global module __dirname */
const { resolve } = require('path');
const { BannerPlugin } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const PARENT_DIR = resolve(__dirname, '../');
const PUBLIC_DIR = `${PARENT_DIR}/courage-dist`;
const PACKAGE_JSON = require('./package.json');
const EMPTY = resolve(__dirname, 'src/empty');
const SHARED_JS = resolve(__dirname, 'node_modules/@okta/courage/src');
const DIST_FILE_NAME = 'okta';

const EXTERNAL_PATHS = [
  'jquery',
  'qtip',
  'backbone',
  'underscore',
  'handlebars',
  'moment',
  'shared/util/Bundles'
];

const webpackConfig = {
  entry: ['./src/CourageForSigninWidget.js'],
  devtool: 'source-map',
  output: {
    // why the destination is outside current directory?
    // turns out node_modules in current directory will hoist
    // node_modules at root directory.
    path: PUBLIC_DIR,
    filename: `${DIST_FILE_NAME}.js`,
    libraryTarget: 'commonjs2'
  },
  externals: EXTERNAL_PATHS,
  resolve: {
    alias: {

      'okta/jquery': SHARED_JS + '/util/jquery-wrapper',
      'okta/underscore': SHARED_JS + '/util/underscore-wrapper',
      'okta/handlebars': SHARED_JS + '/util/handlebars-wrapper',
      'okta/moment': SHARED_JS + '/util/moment-wrapper',

      // jsons is from StringUtil
      'vendor/lib/json2': EMPTY,

      // simplemodal is from dependency chain:
      //   BaseRouter -> ConfirmationDialog -> BaseFormDialog -> BaseModalDialog -> simplemodal
      'vendor/plugins/jquery.simplemodal': EMPTY,

      'shared': SHARED_JS,
      'vendor': SHARED_JS + '/vendor',
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['env'],
        }
      },
    ]
  },

  plugins: [
    new BannerPlugin(`THIS FILE IS GENERATED FROM PACKAGE @okta/courage@${PACKAGE_JSON.devDependencies['@okta/courage']}`),
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
      reportFilename: `${DIST_FILE_NAME}.html`,
      analyzerMode: 'static',
    }),
    new CopyWebpackPlugin([
      {
        from: `${SHARED_JS}/vendor/lib/jquery-1.12.4.js`,
        to: `${PUBLIC_DIR}/jquery.js`,
        toType: 'file'
      }
    ]),
  ]

};

module.exports = webpackConfig;
