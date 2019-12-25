'use strict';

const path = require('path');

module.exports = {
  // 本地开发参数配置
  local: {
    /**
     * 不需要被 webpack 编译的静态资源文件存放目录，
     * 根目录下有 static 文件夹，可以存放一些无需编译的静态资源，
     * webpack 会将这些资源原封不动的拷贝到 staticAssetsDirectory 所定义的这个目录下。
     */
    staticAssetsDirectory: 'static',
    assetsPublicPath: "/", // 相对文件路径
    proxyTable: {},
    /**
     * !!! 如果你是移动端开发，想在手机上访问本地电脑，那么请设置 host 为 0.0.0.0，
     * 你在手机端就可以用电脑IP地址访问了。
     */
    host: 'localhost', // 为了方便别人访问，请设置0.0.0.0
    port: '8000', // 端口号
    autoOpenBrowser: true, // 是否自动打开浏览器
    errorOverlay: true, // 浏览器错误提示遮罩层
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    devtool: 'eval-source-map', // Source Maps
    disableHostCheck: false, // 当设置为true时，该选项绕过主机检查。不建议这样做，因为不检查主机的应用程序容易受到DNS重新绑定攻击。
  },
  // 测试环境参数配置
  dev: {
    // Paths
    staticAssetsDirectory: 'static',
    assetsPublicPath: '/', // 相对文件路径
    devtool: 'eval-source-map', // Source Maps 已按最有方式配置，勿改
  },
  // 生产环境参数配置
  build: {
    // Paths
    staticAssetsDirectory: 'static',
    /**
     * webpack 编译后的静态资源 (js、css、img、fonts) 存放路径，默认为 dist。
     */
    assetsRoot: path.resolve(__dirname, '../dist'),
    prassetsPublicPath: './',
    // 生产环境的souce map
    // 生产环境下source map devtool 不做配置
    devtool: 'source-map', // 已按最有方式配置，勿改
    // 生产环境下souce map的内网位置，private sourceMap
    sourcePath: '',
  },
};
