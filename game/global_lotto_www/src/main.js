// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'
import VueOnsen from 'vue-onsenui'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import Toast from './components/toast'
import Loading from './components/loading'
import Dialog from './components/dialog'

import 'lib-flexible/flexible'

Vue.config.productionTip = false

Vue.use(VueOnsen)
Vue.use(Toast)
Vue.use(Dialog)
Vue.use(Loading)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
