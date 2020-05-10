// eslint-disable-next-line no-unused-vars
const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const optimizator = (isProd) => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetsPlugin(),
      new TerserPlugin(),
    ];
  }

  return config;
};

const jsLoader = (isProd) => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
      },
    },
  ];

  if (!isProd) {
    loaders.push('eslint-loader');
  }

  return loaders;
};

const fileName = (ext, isProd) => (isProd ? `[name][hash].${ext}` : `[name].${ext}`);

module.exports = (env, options) => {
  const isProd = options.mode === 'production';

  const config = {
    context: path.resolve(__dirname, 'src'),
    mode: isProd ? 'production' : 'development',
    watch: !isProd,
    entry: ['@babel/polyfill', './script.js', './sass/main.scss'],
    output: {
      filename: fileName('js', isProd),
      path: path.resolve(__dirname, 'dist'),
    },
    optimization: optimizator(isProd),
    devtool: isProd ? 'none' : 'source-map',
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './index.html',
        minify: {
          collapseWhitespace: isProd,
        },
      }),
      new MiniCssExtractPlugin({
        filename: fileName('css'),
      }),
      new CopyPlugin([
        {
          from: './data/**/*',
          to: './',
        },
      ]),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: jsLoader(isProd),
        },
        {
          test: /\.s(a|c)ss$/i,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: !isProd,
                reloadAll: true,
              },
            },
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
        {
          test: /\.html$/i,
          use: [
            {
              loader: 'html-loader',
            },
          ],
        },
      ],
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      hot: !isProd,
      port: 9000,
    },
  };

  return config;
};
