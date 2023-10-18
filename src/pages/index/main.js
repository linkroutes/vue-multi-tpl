import Vue from 'vue'
import App from './App.vue'
import axios from "axios";
import TOOL from "../../utils/index";

import {Toast} from 'vant';
Vue.use(Toast);

const vp = Vue.prototype
vp.$http = axios // 也可以按需创建axios实例
vp.$tool = TOOL
console.log(`TOOL`, TOOL);

Vue.config.productionTip = false
console.log(`process.env`, process.env);

new Vue({
  render: h => h(App)
}).$mount('#app')