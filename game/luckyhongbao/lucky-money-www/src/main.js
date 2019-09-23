// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant from 'vant'
import clipboard from 'clipboard';
import 'vant/lib/index.css';

import store from'./store/store'

Vue.prototype.clipboard = clipboard;
Vue.config.productionTip = false

Vue.use(Vant,{
  i18n:(key,value) => i18n.t(key,value)
})


/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})


