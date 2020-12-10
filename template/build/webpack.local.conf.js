'use strict';
const MODE = process.env.NODE_ENV || 'local';
const path = require("path");
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge'); // webpack 配置合并工具包
const CopyWebpackPlugin = require('copy-webpack-plugin'); // 复制工具
const baseWebpackConfig = require('./webpack.base.conf'); // 基础配置引入
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin'); // 友好报错工具
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Html生成工具
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 提取单独打包css文件
const portfinder = require('portfinder'); // 节点端口查找器

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

const localWebpackConfig = merge.smartStrategy({
  'module.rules.use': 'prepend',
})(baseWebpackConfig, {
  mode: 'development', // 设定环境
  devtool: config.local.devtool,
  devServer: {
    // 当使用内联模式(inline mode)时，控制台(console)将显示消息，可能的值有 none, error, warning 或者 info（默认值）。
    clientLogLevel: 'none',
    //当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
    historyApiFallback: {
      index: `${config.local.assetsPublicPath}index.html`,
    },
    // 启用 webpack 的模块热替换特性
    hot: true,
    // 告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要。我们这里直接禁用掉
    contentBase: false,
    // 一切服务都启用gzip 压缩：
    compress: true,
    // 指定使用一个 host。默认是 localhost
    host: HOST || config.local.host,
    // 指定要监听请求的端口号
    port: PORT || config.local.port,
    // local服务器自动打开浏览器。
    open: config.local.autoOpenBrowser,
    // 当出现编译器错误或警告时，在浏览器中显示全屏遮罩层。默认情况下禁用。
    overlay: config.local.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    // 浏览器中访问的相对路径
    publicPath: config.local.assetsPublicPath,
    // 代理配置
    proxy: config.local.proxyTable,
    // 除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见。
    // 我们配置 FriendlyErrorsPlugin 来显示错误信息到控制台
    quiet: true,
    // webpack 使用文件系统(file system)获取文件改动的通知。监视文件
    watchOptions: {
      poll: config.local.poll,
    },
    disableHostCheck: config.local.disableHostCheck,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'vendors',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: 'index.html',
    }),
    //配置环境变量
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(MODE),
      },
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.local.staticAssetsDirectory,
        ignore: ['.*']
      }
    ]),
    // css 提取
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css',
      sourceMap: true,
    }),
    new webpack.SourceMapDevToolPlugin(), // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/29
    // 启用模块热替换(HMR)
    new webpack.HotModuleReplacementPlugin(),
  ],
});

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.local.port;
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port;
      // add port to devServer config
      localWebpackConfig.devServer.port = port;

      // Add FriendlyErrorsPlugin
      localWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${localWebpackConfig.devServer.host}:${port}`],
        }
      }));

      resolve(localWebpackConfig)
    }
  })
});
