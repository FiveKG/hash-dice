<template>
  <vpage>
    <slot>
      <div style="height:100%;">
        <div class="page_header">
          <div class="arrow_back">
            <img src="@/assets/img/back.png" @click="back">
          </div>
          <!-- <v-ons-tabbar 
            swipeable
            position="top"
            modifier="resource"
            @postchange="postchange"
          >
            <template slot="pages">
              <cpu-net id="cpu" :tabIndex="tabIndex" :accountInfo="accountInfo" v-on:refresh="refresh"></cpu-net>
              <ram id="net" :tabIndex="tabIndex" :accountInfo="accountInfo" v-on:refresh="refresh"></ram>
            </template>
            <ons-tab page="cpu">
              <input type="radio" style="display: none">
              <button class="tabbar__button">
                <div class="tabbar__label">CPU/NET</div>
              </button>
            </ons-tab>
            <ons-tab page="net">
              <input type="radio" style="display: none">
              <button class="tabbar__button">
                <div class="tabbar__label">{{$t('assets.ram')}}</div>
              </button>
            </ons-tab>
          </v-ons-tabbar> -->
          <tab class="type_tab" :animate="false" customClass>
            <tab-item class="item" customClass v-for="(item, key) in tabs" :key="key" @on-item-click="clickTab(item, key)">
              <span class="tab_item" :style="{borderBottom: item === selectedTab ? '2px solid red':'none'}">{{item}}</span>
            </tab-item>
          </tab>
          <div class="arrow_back"></div>
        </div>
        <swiper class="page_content" v-model="tabIndex" :show-dots="false">
          <swiper-item>
            <cpu-net :tabIndex="tabIndex" :accountInfo="accountInfo" v-on:refresh="refresh"></cpu-net>
          </swiper-item>
          <swiper-item>
            <ram :tabIndex="tabIndex" :accountInfo="accountInfo" v-on:refresh="refresh"></ram>
          </swiper-item>
        </swiper>
      </div>
    </slot>
  </vpage>
</template>

<script>
import eos from '@/plugins/eos'
import MyPage from '@/components/MyPage'
import CpuNet from './CpuNet'
import Ram from './Ram'
import tab from '@/components/tab/tab';
import tabItem from '@/components/tab/tab-item';
import swiper from '@/components/tab/swiper.vue';
import swiperItem from '@/components/tab/swiper-item';

export default {
  components: {
    vpage: MyPage,
    CpuNet,
    Ram,
    tab,
    tabItem,
    swiper,
    swiperItem
  },
  data() {
    return {
      tabIndex: 0,
      selectedTab: 'CPU/NET',
      tabs: ['CPU/NET', this.$t('assets.ram')],
      accountInfo: {},
      loading: false
    }
  },
  created () {
    // this.initData()
  },
  watch: {
    tabIndex(val) {
      this.selectedTab = this.tabs[val]
    }
  },
  methods: {
    async initData() {
      console.log('resource-initData',this.$route.query)
      const account = this.$route.query.account
      this.loading = true
      try {
        const res = await eos.getAccount(account)
        this.accountInfo = res
        console.log(res)
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    clickTab(item, index) {
      this.selectedTab = item
      this.tabIndex = index
    },
    refresh() {
      console.log('refresh')
      // setTimeout(() => {
      // }, 100);
      // const eos_config = {
      //   chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
      //   keyProvider: ['5KVL23nv9LGjChq8zqHv86ETcZ2FV68DHrniSBdXxMwmTF5ZusW'], // 私钥
      //   httpEndpoint: 'https://nodes.get-scatter.com:443',
      //   expireInSeconds: 60,
      //   broadcast: true,
      //   verbose: false, // API activity
      //   sign: true
      // }
      // const eos = Eos(eos_config)
      // eos.transaction(tr => {
      //     tr.newaccount({
      //         creator: '', //激活者
      //         name: '', //被激活的账号
      //         owner: '', //被激活账号的owner公钥
      //         active: '',//被激活账号的active公钥
      //     })
      //     // 给被激活账号购买内存
      //     tr.buyram({
      //         payer: '', //支付内存的账号
      //         receiver: '', //接收内存的被激活账号
      //         quant: '1.0000 EOS' //支付EOS数量
      //     })
      //     // 给被激活账号抵押CPU和NET
      //     tr.delegatebw({
      //         from: '', //支付方
      //         receiver: '',//接收方(被激活的账号)
      //         stake_cpu_quantity: '0.50000 EOS',//抵押CPU的EOS数量
      //         stake_net_quantity: '0.50000 EOS',//抵押NET的EOS数量
      //         transfer: 1 //0:租借  1:转账
      //     })
      // })
    },
    back () {
      this.$router.go(-1)
    }
  },
}
</script>

<style scoped>

.align_center {
  display: flex;
  align-items: center;
}
.page_header {
  background-color: #fff;
  height: 100px;
  display: flex;
}
.arrow_back {
  position: relative;
  flex: 1;
}
.arrow_back img {
  position: absolute;
  left: 55px;
  top: 50%;
  transform: translate(0, -50%);
  width: 42px;
  height: 32px;
  z-index: 22222;
}
.type_tab {
  flex: 2;
}
.item {
  height: 100px;
  line-height: 100px;
  font-size: 34px;
  font-weight: 450;
  color: #000;
}
.tab_item {
  padding-bottom: 5px;
}
.header_tab {
  height: 100%;
  box-sizing: border-box;
  padding-bottom: 15px;
}
.header_tab span {
  height: 100%;
  display: inline-block;
  line-height: 100px;
  margin: 0 60px;
}
.tab_active {
  border-bottom: 8px solid #ec565a;
}
.page_content {
  height: calc(100vh - 100px);
  /* padding-top: 100px; */
  box-sizing: border-box;
}
.layout {
  height: calc(100% - 120px);
  display: flex;
  flex-direction: column;
}
.tabbar__label {
  font-size: 34px;
  font-weight: 450;
  color: #000;
  box-sizing: border-box;
}
:checked + .tabbar__button .tabbar__label {
  border-bottom: 5px solid #ec565a;
}
:checked + .tabbar__button {
  color: #000;
}
</style>