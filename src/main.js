import Vue from 'vue'
import App from './App.vue'
import router from './router'

import "./assets/css/reset.css";
import "./assets/css/iconfont.css";

Vue.config.productionTip = false

// 注册全局过滤器
import timeFromNow from './utils'
Vue.filter('timeFromNow',timeFromNow);

//注册Card全局组件
import Card from './components/common/Card'
Vue.component('card',Card);
// 注册axios
import axios from 'axios';
axios.defaults.baseURL = 'http://123.206.71.208/backend';
Vue.prototype.$http = axios;
// 初始化vue-amap
import VueAMap from 'vue-amap';

Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  // 高德的key
  key: '84fd5492fc4347f796de12a67de1df84',
  // 插件集合
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 高德 sdk 版本，默认为 1.4.4
  v: '1.4.4'
});

new Vue({
  el: '#app',
  router,
  render: h => h(App)
}).$mount("#app")