import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'
import Vue from 'vue'
import './plugins/axios'
import VueOnsen from 'vue-onsenui'
import router from './router'
import store from './store'
import App from './App.vue'

import Toast from './components/toast'
import Loading from './components/loading'
import Dialog from './components/dialog'

import i18n from './i18n'
import 'lib-flexible/flexible'

Vue.config.productionTip = false
Vue.prototype.ethNet = 'homestead'

Vue.use(VueOnsen)
Vue.use(Toast)
Vue.use(Dialog)
Vue.use(Loading)

// new Vue({
//   store: new Vuex.Store(storeLike),
//   router,
//   render: h => h(AppNavigator),
//   i18n,

//   beforeCreate() {
//     // Shortcut for Material Design
//     Vue.prototype.md = this.$ons.platform.isAndroid();

//     // Set iPhoneX flag based on URL
//     if (window.location.search.match(/iphonex/i)) {
//       document.documentElement.setAttribute('onsflag-iphonex-portrait', '');
//       document.documentElement.setAttribute('onsflag-iphonex-landscape', '');
//     }
//     console.log(this.$ons.platform.isAndroid())
//   }
// }).$mount('#app')

function runInBrowser() {
    new Vue({
        store,
        router,
        i18n,
        render: h => h(App)
    }).$mount('#app')
}

function runInCordova() {
    document.addEventListener('deviceready', OnDeviceready, false);

    function OnDeviceready() {
        new Vue({
            store,
            router,
            i18n,
            render: h => h(App)
        }).$mount('#app')

        // store.commit('wallet/isDebug', false)
        // window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, function(dirEntry) {
        //   dirEntry.getFile('wallet.json', {create: true}, function(fileEntry) {
        //     fileEntry.file(function (file) {
        //       var reader = new FileReader();
        //       reader.onloadend = function() {
        //         console.log("OnDeviceready: " + this.result);
        //         if (this.result) store.commit('wallet/setLocalFile', JSON.parse(this.result))
        //         new Vue({
        //           store,
        //           router,
        //           i18n,
        //           render: h => h(App)
        //         }).$mount('#app')
        //       };
        //       reader.readAsText(file);
        //     }, function(err) {
        //       console.log('readFile', err)
        //     });
        //   })
        // }, function(err) {
        //   console.log('readFile', err)
        // })

        if (typeof nodejs !== 'undefined') {
            nodejs.start('main.js', function() {
                console.log('startupCallback')
            })
        }
    }
}


// runInCordova()
runInBrowser()