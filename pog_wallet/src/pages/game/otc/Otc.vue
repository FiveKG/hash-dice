<template>
  <v-ons-page>
    <div class="my_bg"></div>
    <div class="" :style="noPadding ? 'padding:0;':''">
      <OtcTransaction v-if="selectTab === 'OtcTransaction' "></OtcTransaction>
      <OtcOrder v-else-if="selectTab === 'OtcOrder'"></OtcOrder>
      <OtcAdviertisement v-else-if="selectTab === 'OtcAdviertisement'"></OtcAdviertisement>

      <div class="tabbar" ref="tabbar">
        <div class="footer-item" :class="(selectTab === 'assets') || (selectTab === 'OtcTransaction') ? 'router-link-active':''" @click="clickTab('OtcTransaction')">
          <i class="icon footerHomeIcon"></i>
          <p class="footer-title">ccc</p>
        </div>
        <div class="footer-item" :class="selectTab === 'OtcOrder'? 'router-link-active':''" @click="clickTab('OtcOrder')">
          <i class="icon footerDiscoverIcon"></i>
          <p class="footer-title">ccc</p>
        </div>
        <div class="footer-item" :class="selectTab === 'OtcAdviertisement'? 'router-link-active':''" @click="clickTab('OtcAdviertisement')">
          <i class="icon footerMeIcon"></i>
          <p class="footer-title">ccc</p>
        </div>
      </div>
    </div>
  </v-ons-page>
</template>

<script>
import axios from 'axios'
import ClientSocket from '@/socket/ClientSocket'
import { getAdImg } from '@/servers'

import OtcTransaction from './OtcTransaction'
import OtcOrder from './OtcOrder'
import OtcAdviertisement from './OtcAdviertisement'

export default {
  components: {
    OtcTransaction,
    OtcOrder,
    OtcAdviertisement
  },
  data () {
    return {
      selectTab: 'wallet',
      type: 'wallet',
      showDialog: false,
      showExDialog: false,
      noPadding: false
    }
  },
  created () {
    // this.initData()
    this.selectTab = 'OtcTransaction';
  },
  methods: {
    initData() {
      const selectedTab = this.$store.state.wallet.selectedTab
      console.log(111111111,selectedTab);
      if (selectedTab === 'assets') {
        if (this.$store.state.wallet.localFile.wallets.length) {
          this.type = 'assets'
          this.selectTab = 'assets'
        } else {
          this.type = 'OtcTransaction'
          this.selectTab = 'OtcTransaction'
        }
      } else {
        if (selectedTab === 'invitation') {
          this.noPadding = true
        }
        this.type = selectedTab
        this.selectTab = selectedTab
      }
      console.log('index-init',this.type,this.selectTab)
    },
    clickTab(type) {
      if (type === 'invitation') {
        this.noPadding = true
      } else if (type === 'exchange') {
        window.plugins.launcher.canLaunch({packageName:'com.isecsp.pogex'}, successCallback, errorCallback);
      } else {
        this.noPadding = false
      }
      this.$store.commit('wallet/setSelectedTab', type)
      this.initData()
      const that = this
      function successCallback(data) {
        console.log('success', data)
        window.plugins.launcher.launch({packageName:'com.isecsp.pogex'}, function success(params) {
          
        }, function error(params) {
          console.log('error', params)
        });
      }
      function errorCallback(err) {
        console.log('error', err)
        that.showExDialog = true
      }
    }
  },
  watch: {
    '$store.state.wallet.localFile.wallets'(newVal) {
      if (!newVal.length) {
        this.type = 'wallet'
      }
    }
  },
}
</script>

<style scoped>
.my_bg {
  background-color: #f6f6f6;
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
.OtcOrder {
  height: 50px;
  background: url('~@/assets/img/discover.png') center/contain no-repeat;
}
:checked + .tabbar__button .OtcOrder {
  background: url('~@/assets/img/discover_selected.png') center/contain no-repeat;
}
.chat {
  height: 50px;
  background: url('~@/assets/img/chat.png') center/contain no-repeat;
}
:checked + .tabbar__button .chat {
  background: url('~@/assets/img/chat_selected.png') center/contain no-repeat;
}
.OtcAdviertisement {
  height: 50px;
  background: url('~@/assets/img/mine.png') center/contain no-repeat;
}
:checked + .tabbar__button .OtcAdviertisement {
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

