<template>
  <div>
    <transition  :name="transitionName" >
     	<router-view class="child-view"></router-view> 
    </transition>
    <v-ons-dialog
      modifier="width_pwd"
      cancelable
      :visible.sync="dialogVisible"
    >
      <div>
        <div class="delete_question">
          {{appName}}请求授权登录
        </div>
        <div class="btn_layout">
          <div class="cancel">
            <span @click="cancel">{{$t('common.cancel')}}</span>
          </div>
          <div class="confirm">
            <span @click="confirm">{{$t('common.confirm')}}</span>
          </div>
        </div>
      </div>
    </v-ons-dialog>
  </div>
</template>

<script>
import {getConfig} from '@/servers'

export default {
  data () {
    return {
      options: {
        animation: 'slide-ios',
        // animationOptions: {duration: 0.5,timing: 'ease-in'}
      },
      transitionName: '',
      dialogVisible: false,
      schema: '',
      appName: '',
      startTime:0
    }
  },
  watch: {
    '$route'(to,from) {
      // console.log(to.path, from.path)
      const pathList = this.$store.state.wallet.stack
      if(pathList.includes(to.path)) {
        const index = (pathList.findIndex((ele)=>{
          return ele === from.path
        }))
        pathList.splice(index,1)
        this.$router.isBack=true;
      } else {
        pathList.push(to.path)
        this.$router.isBack=false;
      }
      if (to.path==='/') {
        this.$router.isBack=true;
        this.$store.commit('wallet/setStack', [])
      }
      let isBack = this.$router.isBack
      if (isBack) {
        this.transitionName = 'slide-right'
      } else {
        this.transitionName = 'slide-left'
      }
      this.$router.isBack = false
    }
  },
  beforeCreate() {
    const str = localStorage.getItem('isecsp_wallet')
    const lang = localStorage.getItem('lang_type')
    const currency = localStorage.getItem('currency')
    if (str) {
      this.$store.commit('wallet/setLocalFile', JSON.parse(str))
      this.$store.commit('wallet/setCacheFingerprint', JSON.parse(str).wallets)
    }
    if (lang) {
      this.$i18n.locale = lang
    }
    if (currency) {
      this.$store.commit('wallet/setCurrency', currency)
    }
    getConfig().then(res => {
      console.log('getConfig',res)
      if (res.code === 1) this.$store.commit('wallet/setConfig', res.data)
    })
    this.$ons.ready(() => {
      console.log('ready')
      this.$ons.setDefaultDeviceBackButtonListener(() => {
        if (this.$store.state.wallet.stack.length) {
          // 路由在两层以上
          this.$router.go(-1)
        } else {
          window.plugins.toast.showWithOptions({
            message: '再按一次退出',
            duration: 'short',
            position: "bottom",
            addPixelsY: -150
          })
          const nowTime = Date.now()
          if (nowTime - this.startTime > 2000) {
            this.startTime = Date.now()
          } else {
            navigator.app.exitApp()
          }
        }
      })
      const that = this
      FingerprintAuth.isAvailable(isAvailableSuccessCallback, isAvailableErrorCallback);
      function isAvailableSuccessCallback(res) {
        if (res.isAvailable) that.$store.commit('wallet/setFingerprintAuth', true)
      }
      function isAvailableErrorCallback(err) {
        console.log('FingerprintAuth error',err)

      }
    })
  },
  created() {
    const that = this
    window.handleOpenURL = function (url) {
      setTimeout(function() {
        const urlArr = url.split('//')[1].split('/')
        console.log('handleOpenURL urlArr', urlArr)
        that.schema = urlArr[0]
        // szwallet://ese/login?chain=pog&appname=pog%E4%BA%A4%E6%98%93%E6%89%80
        if (that.$store.state.wallet.localFile.wallets.length) {
          const params = urlArr[1].split('?')
          if (params[0] === 'login') {
            that.dialogVisible = true
            const values = params[1].split('&')
            that.$store.commit('wallet/setSchemaChain', values[0].split('=')[1])
            const appName = values[1].split('=')[1]
            const nameEn = appName.substring(0, appName.indexOf('%'))
            const code = appName.substring(appName.indexOf('%'))
            console.log('code', nameEn, code)
            // let codeList = code.split('%').slice(1)
            // codeList = codeList.map(item => parseInt(item,16))
            // const decodeStr = codeList.map(item => '%'+item.toString(16)).join('')
            decodeURI(code)
            that.appName = nameEn+decodeURI(code)
          }
          if (params[0] === 'transfer') {
            // const values = params[1].split('&')
            const values = params[1].split('=')
            console.log('transfer', values[1])
            that.$router.push({
              name: 'PogTransferStraight',
              query: {
                type: 'schema',
                data: JSON.parse(values[1])
              }
            })
          }
        } else {
          console.log('empty wallet')
          // window.open(that.schema+'://login?account=', '_system')
        }
      }, 0);
    }
  },
  methods: {
    cancel() {
      this.dialogVisible = false
    },
    confirm() {
      const assets = this.$store.state.wallet.assets
      let account = ''
      if (assets) {
        account = assets.account
      }
      window.open(this.schema+'://login?account='+account, '_system')
    }
  },
  computed: {
    pageStack() {
      return this.$store.state.navigator.stack;
    }
  }
}
</script>

<style>
p {
  margin: 0;
}
.child-view {
  transition: all .3s ease;
}
  .slide-left-enter, .slide-right-leave-active {
    /* opacity: 0.6; */
    -webkit-transform: translate(80%, 0);
    transform: translate(80%, 0);
  }
  .slide-left-leave-active, .slide-right-enter {
    /* opacity: 0.6; */
    -webkit-transform: translate(-80%, 0);
    transform: translate(-80%, 0);
  }
.tabbar--resource, .tabbar--market {
  margin: 0 160px;
  width: auto;
  height: 100px;
  background-color: #fff;
}
.tabbar--resource__content, .tabbar--market__content {
  top: 100px;
}
.tabbar--resource__button, .tabbar--market__button {
  height: 100%;
}
.tabbar--market {
  margin: 0 120px;
  box-shadow: none;
}
::-webkit-scrollbar{
  display:none;
}
.action-sheet {
  left: 0;
  right: 0;
  bottom: 0;
}
.refresh_bg {
  background-color: #ec565a;
  color: #fff;
}
.dialog--width {
  min-width: 600px;
  min-height: auto;
  border-radius: 15px;
}
.dialog--width_pwd {
  min-width: 580px;
  min-height: auto;
  border-radius: 15px;
}
.modal--loading_modal {
  z-index: 99999;
}
.delete_question {
  padding: 35px 30px;
  font-size: 32px;
}
.btn_layout {
  height: 68px;
  margin: 36px 58px;
  display: flex;
  font-size: 28px;
}
.btn_layout .cancel {
  flex: 1;
  text-align: left;
}
.btn_layout .cancel span{
  width: 166px;
  display: inline-block;
  text-align: center;
  color: #fff;
  padding: 15px 0;
  border-radius: 15px;
  background-color: #ec565a;
}
.btn_layout .confirm {
  flex: 1;
  text-align: right;
}
.btn_layout .confirm span{
  width: 166px;
  display: inline-block;
  text-align: center;
  color: #fff;
  border-radius: 15px;
  padding: 15px 0;
  background-color: #5789e3;
}
</style>
