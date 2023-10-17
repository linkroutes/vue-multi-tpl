import Vue from 'vue'
import App from './App.vue'
import TOOL from "../../utils/index";

import {Toast} from 'vant';
Vue.use(Toast);

const vp = Vue.prototype
vp.$tool = TOOL
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')