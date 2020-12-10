'use strict';

const path = require('path');
const os = require('os');

/**
 * 获取电脑ip地址
 * @returns {null}
 */
function getIPAddress() {
  let interfaces = os.networkInterfaces();
  let host = null;
  Object.values(interfaces).forEach((value) => {
    for (let i = 0; i < value.length; i++) {
      let alias = value[i];
      if (
        alias.family === 'IPv4' &&
        alias.address !== '127.0.0.1' &&
        !alias.internal
      ) {
        host = alias.address;
      }
    }
  });
  return host;
}

const myHost = getIPAddress();
module.exports = {
  // 本地开发参数配置
  local: {
    /**
     * 无需编译的资源文件存放目录
     * webpack构建时会将其复制到staticAssetsDirectory配置的目录中
     */
    staticAssetsDirectory: 'static',
    assetsPublicPath: "/", // 相对文件路径
    proxyTable: {},
    host: myHost, // 这里无需改动，会主动获取电脑ip地址
    port: '8000', // 端口号
    autoOpenBrowser: true, // 是否自动打开浏览器
    errorOverlay: true, // 浏览器错误提示遮罩层
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    devtool: 'eval-source-map', // 会生成原始源代码
    disableHostCheck: false, // 当设置为true时，该选项绕过主机检查。不建议这样做，因为不检查主机的应用程序容易受到DNS重新绑定攻击。
  },
  // 测试环境参数配置
  dev: {
    /**
     * 无需编译的资源文件存放目录
     * webpack构建时会将其复制到staticAssetsDirectory配置的目录中
     */
    staticAssetsDirectory: 'static',
    assetsPublicPath: './', // 相对文件路径
    devtool: 'eval-source-map', // 会生成原始源代码
  },
  // 生产环境参数配置
  build: {
    /**
     * 无需编译的资源文件存放目录
     * webpack构建时会将其复制到staticAssetsDirectory配置的目录中
     */
    staticAssetsDirectory: 'static',
    /**
     * webpack 构建后资源存放目录
     */
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsPublicPath: './',
    devtool: false, // 不生成源码文件
  },
};
