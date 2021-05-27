import Vue from 'vue'
import App from './App.vue'
import tool from "../../utils/tool";
Vue.prototype.$tool = tool
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')