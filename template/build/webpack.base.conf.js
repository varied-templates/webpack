'use strict';
const webpack = require('webpack');
const config = require('../config');
const VueLoaderPlugin = require('vue-loader/lib/plugin'); // vue 加载器
const depsPlugin = require('extract-dependency-manifest-plugin'); // 提取依赖清单工具
const path = require('path');
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 提取单独打包css文件
// 引入插件
var vConsolePlugin = require('vconsole-webpack-plugin'); // 日志工具

// 接收运行参数
const argv = require('yargs')
  .describe('debug', 'debug 环境') // use 'webpack --debug'
  .argv;

const plugins = [];
console.log('Building on *---' + process.env.NODE_ENV + '---* MODE');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js',
  },
  output: {
    path: config.build.assetsRoot,
    filename: isProduction || isDevelopment
      ? 'js/[name].[contenthash:7].js'
      : 'js/[name].js',
    chunkFilename: isProduction || isDevelopment
      ? 'js/[name].[contenthash:7].js'
      : 'js/[name].js',
    publicPath: isProduction
      ? config.build.assetsPublicPath
      : (isDevelopment
        ? config.dev.assetsPublicPath
        : config.local.assetsPublicPath),
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.scss', 'less'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    },
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(vue|js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        include: resolve('src'),
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/,
        include: resolve('src'),
      },
      {
        test: /\.js$/,
        use: isProduction
          ? [
              {
                loader: 'cache-loader',
                options: {
                  cacheDirectory: resolve('cache-loader'),
                },
              },
              'babel-loader',
            ]
          : ['babel-loader'],
        exclude: /node_modules/,
        include: resolve('src'),
      },
      // 它会应用到普通的 `.css` 文件
      // 以及 `.vue` 文件中的 `<style>` 块
      {{#if_eq cssPreprocessors "Sass"}}
      {
        test: /\.(sc|c)ss$/,
        use: [
          {
            // 使用 MiniCssExtractPlugin 控件 需要 css-hot-loader 做热替换插件
            loader: 'css-hot-loader',
          },
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
      {{/if_eq}}
      {{#if_eq cssPreprocessors "Less"}}
      {
        test: /\.(le|c)ss$/,
        use: [
          {
            // 使用 MiniCssExtractPlugin 控件 需要 css-hot-loader 做热替换插件
            loader: 'css-hot-loader',
          },
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            },
          },
          'postcss-loader',
          'less-loader',
        ],
      },
      {{/if_eq}}
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [resolve('src/icons')],
        options: {
          symbolId: 'icon-[name]',
        },
      },
      {
        test: /.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        exclude: [resolve('src/icons')],
        options: {
          limit: 10000,
          name: 'img/[name].[hash:4].[ext]',
        },
      },
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[hash:4].[ext]',
        },
      },
      {
        test: /.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:4].[ext]',
        },
      },
    ],
  },
  plugins: [
    //keep module.id stable when vendor modules does not change
    new depsPlugin(JSON.stringify(require("../package.json").version)),
    new webpack.HashedModuleIdsPlugin(),
    new vConsolePlugin({enable: !!argv.debug}),
    new VueLoaderPlugin(), // vue loader 15 必须添加plugin
  ].concat(plugins),
};
