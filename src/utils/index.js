const files = require.context('.', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
  if (key === './index.js') return // 把utils下除了index.js的js文件全部导出
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

export default modules
