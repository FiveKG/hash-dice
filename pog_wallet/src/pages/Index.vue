<template>
  <v-ons-page>
    <div class="background my_bg"></div>
    <div class="content my_page" :style="noPadding ? 'padding:0;':''">
      <loading v-if="selectTab === 'loading'"></loading>
      <assets v-else-if="selectTab === 'assets'"></assets>
      <wallet v-else-if="selectTab === 'wallet'"></wallet>
      <!-- <market v-else-if="selectTab === 'market'"></market> -->
      <invitation v-else-if="selectTab === 'invitation'"></invitation>
      <xx v-else-if="selectTab === 'xx' "></xx>
      <Binding v-else-if="selectTab === 'Binding' "></Binding>
      <discover v-else-if="selectTab === 'discover'"></discover>
      <exchange v-else-if="selectTab === 'exchange'"></exchange>
      <me v-else-if="selectTab === 'me'"></me>
      
      <div class="tabbar" ref="tabbar">
        <div class="footer-item" :class="(selectTab === 'assets') || (selectTab === 'wallet') ? 'router-link-active':''" @click="clickTab('assets')">
          <i class="icon footerHomeIcon"></i>
          <p class="footer-title">{{$t('common.assets')}}</p>
        </div>
        <!-- <div class="footer-item flex_center" :class="selectTab === 'invitation'? 'router-link-active':''" @click="clickTab('invitation')">
          <img class="ico_tbg" src="@/assets/img/tbg_selected.png" v-if="selectTab === 'invitation'">
          <img class="ico_tbg" src="@/assets/img/tbg.png" v-else>
        </div> -->

        <div class="footer-item flex_center" :class="selectTab === 'xx'? 'router-link-active':''" @click="clickTab('xx')">
          <img class="ico_tbg" src="@/assets/img/tbg_selected.png" v-if="selectTab === 'xx'">
          <img class="ico_tbg" src="@/assets/img/tbg.png" v-else>
        </div>

        <div class="footer-item" :class="selectTab === 'discover'? 'router-link-active':''" @click="clickTab('discover')">
          <i class="icon footerDiscoverIcon"></i>
          <p class="footer-title">{{$t('common.discover')}}</p>
        </div>
        <!-- <div class="footer-item" :class="selectTab === 'exchange'? 'router-link-active':''" @click="clickTab('exchange')">
          <i class="icon footerDiscoverIcon"></i>
          <p class="footer-title">{{$t('common.exchange')}}</p>
        </div> -->
        <div class="footer-item" :class="selectTab === 'me'? 'router-link-active':''" @click="clickTab('me')">
          <i class="icon footerMeIcon"></i>
          <p class="footer-title">{{$t('common.me')}}</p>
        </div>
      </div>
    </div>
    <v-ons-dialog
      modifier="width_pwd"
      style="background-color: rgba(0, 0, 0, .5);z-index: 10000;"
      :visible.sync="showDialog">
      <div class="dialog_layout">
        <div class="alert-dialog-title verify_title">发现新版本</div>
        <div>修复了部分BUG</div>
        <div class="btn_layout">
          <div class="cancel">
            <span @click="cancel">{{$t('common.cancel')}}</span>
          </div>
          <div class="confirm">
            <span @click="confirm">{{$t('common.update')}}</span>
          </div>
        </div>
      </div>
    </v-ons-dialog>
    <v-ons-dialog
      modifier="width_pwd"
      style="background-color: rgba(0, 0, 0, .5);z-index: 10000;"
      :visible.sync="showExDialog">
      <div class="dialog_layout">
        <div class="alert-dialog-title verify_title">您还未下载POG交易所，请先下载</div>
        <div class="btn_layout">
          <div class="cancel">
            <span @click="pogcancel">{{$t('common.cancel')}}</span>
          </div>
          <div class="confirm">
            <span @click="pogconfirm">{{$t('common.update')}}</span>
          </div>
        </div>
      </div>
    </v-ons-dialog>
    <ons-modal ref='modal' direction="up">
      <div style="text-align: center">
        <p>
          <ons-icon icon="md-spinner" size="28px" spin></ons-icon> Loading...
        </p>
      </div>
    </ons-modal>
  </v-ons-page>
</template>

<script>
import Loading from './assets/Loading'
import Wallet from './assets/Wallet'
import Assets from './assets/Assets'
import Market from './market/Market'
import Invitation from './invitation/Invitation'
import Discover from './discover/bak'
import Chat from './chat/Chat'
import Me from './me/Me'
import Exchange from './exchange/Exchange'
import axios from 'axios'
import ClientSocket from '@/socket/ClientSocket'
import { getAdImg } from '@/servers';
import xx from './invitation2/NotParticipating'

import Binding from './invitation/Index'
import api from '@/servers/invitation'


export default {
  components: {
    Loading,
    Wallet,
    Assets,
    Market,
    Invitation,
    Exchange,
    Discover,
    Chat,
    Me,
    xx,
    Binding
  },
  data () {
    return {
      // selectTab: 'wallet',
      // type: 'wallet',
      showDialog: false,
      showExDialog: false,
      noPadding: false,
      modal: '',
      test: 0
    }
  },
  computed: {
    selectTab () {
      console.log('正在前往页面',this.$store.state.wallet.selectedTab)
      return this.$store.state.wallet.selectedTab
    }
  },
  beforeRouteEnter (to, from, next) {
    if (!localStorage.everEnter && localStorage.everEnter) {
      localStorage.setItem('everEnter', true)
      next('/welcome')
    } else {
      next()
    }
  },
  created () {
    // this.$store.commit('wallet/setSelectedTab', 'Binding')
    this.initData()
    getAdImg().then(res => {
      if (res.code === 1) {
        let arr = this.$store.state.wallet.discoverSwiper
        arr.splice(0)
        for (const item of res.data) {
          let obj = Object.assign({}, item)
          obj.img_url = this.$store.state.wallet.config.base_data_address.img_host + item.img_url
          arr.push(obj)
        }
      }
    })
    if (typeof nodejs !== "undefined") {
      nodejs.channel.setListener(msg => {
        console.log(msg)
        if (msg === 'serverOpen') {
          // ClientSocket.link().then(conn => {
          //   console.log(conn)
          //   if (conn) {
          //     ClientSocket.setAccount(this.$store.state.wallet.assets.account)
          //   }
          // }).catch(err => {
          //   console.log(err)
          // })
          setTimeout(() => {
            const s = new WebSocket('ws://127.0.0.1:50005/socket.io/?EIO=3&transport=websocket')
            s.onmessage = msg => {
              if(msg.data.indexOf('42/app') === -1) return false;
              const [data] = JSON.parse(msg.data.replace('42/app,', ''));
              console.log('onmessage', data)
              if (data.type && data.type === 'requestSignature') {
                this.$store.commit('wallet/setSignatureData',data.data)
                this.$store.commit('wallet/setSignatureRequest',data.request)
              }
            }
            s.onerror = err => {
              console.log('onerror',err)
            }
            s.onopen = () => {
              console.log('onopen')
              s.send('40/app')
            }
            s.onclose = () => {
              console.log('onclose')
            }
          },1000);
        }
        else if (msg === 'IFServerOpen') {
          console.log('IFServerOpen')
          this.test++
        }
      })
    }  
  },
  mounted() {
    const url = 'http://www.eos.isecsp.com/app/versionInfo.json'
    // axios.get(url).then(res => {
    //   this.versionInfo = res.data
    //   const u = navigator.userAgent;
    //   const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
    //   const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    //   let downloadUrl,versionCode
    //   if (isAndroid) {
    //     downloadUrl = this.versionInfo.android.downloadUrl
    //     versionCode = this.versionInfo.android.versionCode
    //   }
    //   if (isiOS) {
    //     downloadUrl = this.versionInfo.ios.downloadUrl
    //     versionCode = this.versionInfo.ios.versionCode
    //   }
    //   if (downloadUrl) {
    //     cordova.getAppVersion.getVersionNumber().then(version => {
    //       if (versionCode && version !== versionCode) {
    //         this.showDialog = true
    //       }
    //     })
    //   }
    // }).catch(err => {
    //   console.log(err)
    // })
  },
  methods: {
    cancel() {
      this.showDialog = false
    },
    confirm() {
      const u = navigator.userAgent;
      const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
      const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if (isAndroid) {
        window.open(this.versionInfo.android.downloadUrl, '_system', 'location=yes');
      }
      if (isiOS) {
        window.open(this.versionInfo.ios.downloadUrl, '_system', 'location=yes');
      }
    },
    pogcancel() {
      this.showExDialog = false
    },
    pogconfirm() {
      window.open('http://web.svconcloud.com/download/', '_system', 'location=yes');
    },
    async initData({...data}) {
      console.log('targetTab',data)
      const selectedTab = data.targetTab? data.targetTab : this.$store.state.wallet.selectedTab
      const currentAcc = this.$store.state.wallet.assets
      if (selectedTab == 'xx') {
        // 当前不存在账户放弃跳转
      let modal = this.$refs.modal
        if (!currentAcc || !currentAcc.account) {
          this.$ons.notification.toast('当前无账号，无法跳转',{timeout:1000})
          return
        }
        modal.show()
        // 存在用户的话判断是否绑定
        const response = await api.isBind({account_name: currentAcc.account})
        if (response.code == 1){
          if(response.data.is_bind==true){
            this.$store.commit('wallet/setTbgBindStatus', true)
            // this.selectTab='xx'
            console.log('前往xx页面')
            this.$store.commit('wallet/setSelectedTab', 'xx')
            setTimeout(function() {
              modal.hide();
            }, 800);
            return
          }else{
            this.$store.commit('wallet/setTbgBindStatus', false)
            // this.selectTab='Binding'
            this.$ons.notification.toast('请您先绑定',{timeout:1000})
            this.$store.commit('wallet/setSelectedTab', 'Binding')
            return
          }
        }else{
          this.$ons.notification.toast('网络请求错误',{timeout:1000})
          return
        }
        setTimeout(function() {
          modal.hide();
        }, 800);
      } else if (selectedTab === 'assets') {
        if (this.$store.state.wallet.localFile.wallets.length) {
          // this.type = 'assets'
          // this.selectTab = 'assets'
          this.$store.commit('wallet/setSelectedTab', 'assets')
          return
        } else {
          // this.type = 'wallet'
          // this.selectTab = 'wallet'
          this.$store.commit('wallet/setSelectedTab', 'wallet')
          return
        }
      } else if (selectedTab === 'invitation') {
          this.noPadding = true
      }
      this.$store.commit('wallet/setSelectedTab', selectedTab)
    },
    clickTab(target) {
      if (target === 'invitation') {
        this.noPadding = true
      } else if (target === 'exchange') {
        window.plugins.launcher.canLaunch({packageName:'com.isecsp.pogex'}, successCallback, errorCallback);
      } else {
        this.noPadding = false
      }
      this.initData({targetTab:target})
      const that = this
      function successCallback(data) {
        console.log('success', data)
        window.plugins.launcher.launch({packageName:'com.isecsp.pogex'}, function success(params) {
          
        }, function error(params) {
          this.$ons.notification.toast(params,{timeout:1000})
        });
      }
      function errorCallback(err) {
        console.log('error', err)
        that.showExDialog = true
      }
    },
  },
  watch: {
    test (newVal) {
      console.log('已收到来自node消息', newVal)
    },
    '$store.state.wallet.localFile.wallets'(newVal) {
      if (!newVal.length) {
        // this.type = 'wallet'
        this.$store.commit('wallet/setSelectedTab', 'wallet')
      }
    },
    '$store.state.wallet.tbgIsBind': function(newVal, oldVal) {
      if (newVal === true) {
        this.$store.commit('wallet/setSelectedTab', 'xx')
      }
    }
  },
}
</script>

<style scoped>
.my_bg {
  background-color: #fff;
}
.my_page {
  /* padding-bottom: 120px; */
}
.tabbar {
  height: 120px;
  padding: 14px 0;
  box-sizing: border-box;
  background-color: #fff;
  border-top: 1px solid #f8f8f8;
  z-index: 1000;
  position:fixed;
  
}
.tabbar__label {
  margin-top: 10px;
  font-size: 26px;
  color: #7a7a7a;
}
.tabbar__button {
  height: auto;
}
.assets {
  height: 50px;
  background: url('~@/assets/img/assets.png') center/contain no-repeat;
}
:checked + .tabbar__button .assets {
  background: url('~@/assets/img/assets_selected.png') center/contain no-repeat;
}
.market {
  height: 50px;
  background: url('~@/assets/img/market.png') center/contain no-repeat;
}
:checked + .tabbar__button .market {
  background: url('~@/assets/img/market_selected.png') center/contain no-repeat;
}
.discover {
  height: 50px;
  background: url('~@/assets/img/discover.png') center/contain no-repeat;
}
:checked + .tabbar__button .discover {
  background: url('~@/assets/img/discover_selected.png') center/contain no-repeat;
}
.chat {
  height: 50px;
  background: url('~@/assets/img/chat.png') center/contain no-repeat;
}
:checked + .tabbar__button .chat {
  background: url('~@/assets/img/chat_selected.png') center/contain no-repeat;
}
.me {
  height: 50px;
  background: url('~@/assets/img/mine.png') center/contain no-repeat;
}
:checked + .tabbar__button .me {
  background: url('~@/assets/img/mine_selected.png') center/contain no-repeat;
}
.flex_center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.footer-item {
  flex: 1;
  text-align: center;
  position: relative;
}
.footer-title {
  margin-top: 10px;
  font-size: 26px;
}
.icon {
  width: 50px;
  height: 50px;
  display: block;
  margin: 0 auto;
  text-align: center;
  background-size: 100% 100%!important;
}
.footerHomeIcon {
  background: url('~@/assets/img/assets.png');
}
.footerMarketIcon {
  background: url('~@/assets/img/market.png');
}
.footerDiscoverIcon {
  background: url('~@/assets/img/discover.png');
}
.footerMeIcon {
  background: url('~@/assets/img/mine.png');
}
.router-link-active .footer-title {
  color: #e74c31;
}
.router-link-active .footerHomeIcon {
  background: url('~@/assets/img/assets_selected.png');
}
.router-link-active .footerMarketIcon {
  background: url('~@/assets/img/market_selected.png');
}
.router-link-active .footerDiscoverIcon {
  background: url('~@/assets/img/discover_selected.png');
}
.router-link-active .footerMeIcon {
  background: url('~@/assets/img/mine_selected.png');
}
.ico_tbg {
  height: 60px;
  line-height: 60px;
}
.dialog_layout {
  padding: 0 58px;
}
.verify_title {
  font-weight: bold;
  font-size: 30px;
  margin: 28px 0;
  padding-bottom: 20px;
  border-bottom: 1PX solid #dfdfdf;
}
.btn_layout {
  height: 68px;
  margin: 50px 30px 36px 30px;
  display: flex;
  font-size: 26px;
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
  padding: 10px 0;
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
  padding: 10px 0;
  background-color: #5789e3;
}
</style>
