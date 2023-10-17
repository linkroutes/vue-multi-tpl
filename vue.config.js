const isProduction = process.env.NODE_ENV === 'production';
const argv = require('minimist')(process.argv.slice(2));
const isAlpha = !!argv.v;
const vConsolePlugin = require('vconsole-webpack-plugin')
let force = false;

const createPage = (name, title, chunk = '') => {
  return {
    entry: `src/pages/${name}/main.js`,
    template: 'public/index.html',
    filename: `${name}.html`,
    title,
    chunks: ['chunk-vendors', 'chunk-common', chunk || name],
  }
}

module.exports = {
  chainWebpack: (config) => {
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
    if (isProduction) {
      // config.optimization.delete('splitChunks')
      config.optimization.minimize(true);
    }


    // 重写图片处理规则
    config.module
      .rule('images')
      .uses.clear()

    config.module
      .rule("images")
      .oneOf("inline")
      .resourceQuery(/inline/) // 图片?inline 会被强制内联(base64)
      .use("inline-url-loader")
      .loader(require.resolve("url-loader"))
      .options({
        fallback: {
          loader: require.resolve("file-loader"),
        },
      })
      .end()
      .end()
      .oneOf("default")
      .use("url-loader")
      .loader("url-loader")
      .options({
        limit: 0, // 剩余的图片无论大小都不转化成base64
        esModule: false,
        fallback: {
          loader: require.resolve("file-loader"),
          options: {
            name: "img/[name].[hash:8].[ext]",
          },
        },
      })
      .end()
      .end();
  },
  configureWebpack: (config) => {

    if (force || (isProduction && !isAlpha)) { // 默认打包情况下去除vconsole
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }

    if (force || isAlpha) {
      let pluginsDev = [
        new vConsolePlugin({
          filter: [],
          enable: true
        })
      ]
      config.plugins = [...config.plugins, ...pluginsDev]
    }
  },
  productionSourceMap: false,
  publicPath: './', // 官方建议不要再pages配置下使用这个参数
  lintOnSave: false,
  pages: {
    index: createPage('index', '首页'),
    jumper: createPage('jumper', '跳转页'),
  },
  css: {
    loaderOptions: {
      scss: {
        // prependData: `@import "@/assets/scss/global.scss";` // 8.x之前的写法
        additionalData: `@import "@/assets/scss/global.scss";`
      },
    }
  },
}