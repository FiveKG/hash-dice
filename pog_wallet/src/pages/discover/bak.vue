<template>
  <div>
    <v-ons-row class="header_search">
      <div class="search_box" @click="clickSearch">
        <img class="ion_search" src="@/assets/img/assets_search.png">
        <span>搜索DAPP或输入链接进入玩耍</span>
      </div>
      <img class="ion_scan" src="@/assets/img/discover_scan.png" @click="clickScan">
    </v-ons-row>
    <div class="layout_content" ref="layout" v-scroll="handleScroll">
      <swiper class="swiper_box" dots-position="center" dots-class="dots" loop auto :list="swiperList" @on-click-list-item="clickSwiper" height="180px"></swiper>
      <v-ons-row class="list_title">热门推荐</v-ons-row>
      <v-ons-row class="hot_dapp">
        <v-ons-col class="dapp_item" v-for="(item, index) in hotDapp" :key="index" @click="clickHot(item)">
          <img class="dapp_logo" :src="item.logo_url" v-if="item.logo_url">
          <span class="dapp_name" v-if="item.name">{{item.name}}</span>
        </v-ons-col>
      </v-ons-row>
      <tab class="type_tab" active-color="#ea545a" :animate="false">
        <tab-item v-for="(item, key) in app_type" :key="key" :selected="item === selectedTab" @on-item-click="clickTab(key)">{{item}}</tab-item>
      </tab>
      <swiper class="type_list" v-model="index" :show-dots="false" height="260px">
        <swiper-item v-for="(item, index) in dappList" :key="index">
          <v-ons-row v-if="item.list.length">
            <v-ons-col>
              <div class="type_item" v-for="dapp in item.list" v-if="dapp.odd_even === 'odd'" @click="clickDapp(dapp)">
                <img :src="dapp.img">
                <div class="type_detail">
                  <div class="type_name">{{dapp.name}}</div>
                  <div class="summary">{{dapp.summary}}</div>
                </div>
              </div>
            </v-ons-col>
            <v-ons-col>
              <!-- <div class="type_item" v-for="dapp in item.list" v-if="dapp.odd_even === 'even'" @click="clickDapp(dapp)">
                <img :src="dapp.img">
                <div class="type_detail">
                  <div class="type_name">{{dapp.name}}</div>
                  <div class="summary">{{dapp.summary}}</div>
                </div>
              </div> -->
              <div class="type_item" v-for="dapp in item.list" v-if="dapp.odd_even === 'even'" @click="clickluck()">
                <img :src="dapp.img">
                <div class="type_detail">
                  <div class="type_name">{{dapp.name}}</div>
                  <div class="summary">{{dapp.summary}}</div>
                </div>
              </div>
            </v-ons-col>
             <v-ons-col>
              <div class="type_item"  @click="gogame()">
                <div><img src="@/assets/invitation2/u1.png"></div>
                <div class="type_detail">
                  <div class="type_name">全球彩</div>
                  <div class="summary">全球彩游戏</div>
                </div>
              </div>
              </v-ons-col>
               <v-ons-col>
              <div class="type_item"  @click="goLottery()">
                <img src="@/assets/invitation2/u1.png">
                <div class="type_detail">
                  <div class="type_name">哈希分分彩</div>
                  <div class="summary">哈希分分彩游戏</div>
                </div>
              </div>
              </v-ons-col>
               <v-ons-col>
              <div class="type_item"  @click="goHashDice()">
                <img src="@/assets/invitation2/u4.svg">
                <div class="type_detail">
                  <div class="type_name">哈希骰子</div>
                  <div class="summary">哈希骰子游戏</div>
                </div>
              </div>
             </v-ons-col>
             <v-ons-col>
              <div class="type_item"  @click="goTreasure()">
                <img src="@/assets/invitation2/u3.png">
                <div class="type_detail">
                  <div class="type_name">夺宝</div>
                  <div class="summary">夺宝游戏</div>
                </div>
              </div>
             </v-ons-col>

          </v-ons-row>
          <v-ons-row class="dapp_more" v-if="item.list.length > 5" @click="clickMore(index)">查看更多 <img src="@/assets/img/discover_arrow.png"> </v-ons-row>
        </swiper-item>
      </swiper>
    </div>
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
            <span @click="pogconfirm">{{$t('common.download')}}</span>
          </div>
        </div>
      </div>
    </v-ons-dialog>
  </div>
</template>

<script>
import tab from '@/components/tab/tab'
import tabItem from '@/components/tab/tab-item'
import swiper from '@/components/tab/swiper.vue'
import swiperItem from '@/components/tab/swiper-item'
import ClientSocket from '@/socket/ClientSocket'
import { getPopular, getDappList } from '@/servers';

export default {
  components: {
    tab,
    tabItem,
    swiper,
    swiperItem
  },
  data() {
    return {
      index: 0,
      selectedTab: '',
      img_host: '',
      swiperList: [],
      app_type: [],
      dappList: [],
      hotDapp: [],
      wallet: {},
      showExDialog:false
    }
  },
  created() {
    console.log(this.$store.state.wallet.discoverSwiper)
    this.wallet = this.$store.state.wallet.assets
    let discoverSwiper = this.$store.state.wallet.discoverSwiper
    // this.swiperList = discoverSwiper
    for (const item of discoverSwiper) {
      this.swiperList.push({
        url: 'javascript:',
        img: item.img_url,
        target_url: item.target_url,
        name: item.name,
        type: item.type
      })
    }
    this.img_host = this.$store.state.wallet.config.base_data_address.img_host
    let app_type = this.$store.state.wallet.config.app_type
    for (const item of app_type) {
      this.app_type.push(item.text)
      this.dappList.push({
        type: item.code,
        list: []
      })
    }
    this.selectedTab = this.app_type[0]
    // 热门推荐
    getPopular({total: 5}).then(res => {
      // console.log(res)
      if (res.code === 1) {
        let arr = [{},{},{},{},{}]
        for (const [index,item] of res.data.entries()) {
          let obj = Object.assign({}, item)
          obj.logo_url = this.img_host + item.logo_url
          arr[index] = obj
        }
        this.hotDapp = arr
      }
    })
    this.fetchDapp(0)
  },
  mounted() {
    // this.box = this.$refs.layout
    // this.box.addEventListener('scroll', this.handleScroll,false)
  },
  methods: {
    clickSwiper(item) {
      if (item.type === 'website') {
        if (this.wallet) {
          ClientSocket.link().then(conn => {
            if (conn) {
              ClientSocket.setAccount(this.wallet.account).then(res => {
                this.$router.push({
                  name: 'Iframe',
                  query: {
                    url: item.target_url,
                    name: item.name
                  }
                })
              }).catch(err => {
                console.log('setAccount',err)
              })
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.$router.push({
            name: 'Iframe',
            query: {
              url: item.target_url,
              name: item.name
            }
          })
        }
      }
    },
    pogcancel() {
      this.showExDialog = false
    },
    pogconfirm() {
      window.open('http://web.svconcloud.com/download/', '_system', 'location=yes');
    },
    // 前往交易所
    gotoExchange() {
      const that = this

      window.plugins.launcher.canLaunch({packageName:'com.isecsp.pogex'}, successCallback, errorCallback);

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
    },
    clickTab(index) {
      this.index = index
    },
    clickDapp(item) {
      // 前往交易所
      if (item.type == 'exchange_market'){
        this.gotoExchange();
        return;
      }
      // this.$router.push({
      //   name: 'Iframe',
      //   query: {
      //     url: item.site_url,
      //     name: item.name
      //   }
      // })
      if (this.wallet) {
        ClientSocket.link().then(conn => {
          if (conn) {
            ClientSocket.setAccount(this.wallet.account).then(res => {
              this.$ons.notification.alert('成功运行!!!!!!')
              this.$router.push({
                name: 'Iframe',
                query: {
                  url: item.site_url,
                  name: item.name
                }
              })
            }).catch(err => {
              console.log('setAccount',err)
            })
          }
        })
      } else {
        this.$router.push({
          name: 'Iframe',
          query: {
            url: item.site_url,
            name: item.name
          }
        })
      }
    },
    handleScroll(evt, el) {
      console.log(window.scrollY, this.$refs.label.scrollTop)
      // if (window.scrollY > 50) {
      // }
    },
    clickHot(item) {
      // 前往交易所
      if (item.type == 'exchange_market'){
        this.gotoExchange();
        return;
      }

      if (this.wallet) {
        ClientSocket.link().then(conn => {
          if (conn) {
            ClientSocket.setAccount(this.wallet.account).then(res => {
              this.$router.push({
                name: 'Iframe',
                query: {
                  url: item.site_url,
                  name: item.name
                }
              })
            }).catch(err => {
              console.log('setAccount',err)
            })
          }
        }).catch(err => {
          console.log('clickHot',err)
        })
      } else {
        this.$router.push({
          name: 'Iframe',
          query: {
            url: item.site_url,
            name: item.name
          }
        })
      }
    },
    fetchDapp(index) {
      getDappList({type: this.dappList[index].type, limit: 6}).then(res => {
        if (res.code === 1) {
          for (const [index,dapp] of res.data.entries()) {
            if (index % 2) {
              dapp.odd_even = 'even'
            } else {
              dapp.odd_even = 'odd'
            }
            dapp.img = this.img_host + dapp.logo_url
          }
          this.dappList[index].list = res.data
        }
      })
    },
    clickScan() {
      this.$router.push({
        name: 'Scanner'
      })
    },
    clickSearch() {
      this.$router.push({
        name: 'DappSearch'
      })
    },
    clickMore(index) {
      console.log(this.app_type[index])
      this.$router.push({
        name: 'DappList',
        query: {
          type: this.dappList[index].type,
          text: this.app_type[index]
        }
      })
    },
    gogame(){
      this.$router.push('GlovalLotto')
    },
    goLottery(){
      this.$router.push('LotteryGo')
    },
    goHashDice(){
      this.$router.push('HashDiceGo')
    },
    goTreasure(){
      this.$router.push('TreasureGo')
    },
    clickluck(){
      var names=this.$store.state.wallet.assets.account;
      
      window.location.href = `http://localhost:8388/#/?name=${names}`;
    },
    
  },
  watch: {
    index(val) {
      this.selectedTab = this.app_type[val]
      this.fetchDapp(val)
    }
  },
  directives: {
    scroll: {
      inserted: (el, binding) => {
        // console.log(el, binding)
        // let f = function(evt) {
        //   if (binding.value(evt, el)) {
        //     window.removeEventListener('scroll', f);
        //   }
        // };
        // window.addEventListener('scroll', f)
      }
    }
  }
}
</script>

<style scoped>
.header_search {
  position: fixed;
  height: 100px;
  width: 100%;
  align-items: center;
  background-color: #f6f6f6;
  z-index: 100;
}
.ion_scan {
  width: 50px;
  height: 50px;
  margin: 0 30px;
}
.search_box {
  flex: 1;
  height: 70px;
  margin-left: 32px;
  border-radius: 30px;
  background-color: #ececec;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ion_search {
  width: 30px;
  height: 30px;
}
.search_box span {
  margin-left: 30px;
  font-size: 28px;
  color: #b0b0b0;
}
.layout_content {
  padding-top: 120px;
  /* padding-top: 30px; */
}
.swiper_box {
  border-radius: 15px;
  margin: 0 32px;
}
.swiper_item {
  height: 280px;
  background-color: aqua;
}
.swiper_img {
  width: 100%;
}
.list_title {
  padding: 30px 32px;
  font-size: 28px;
}
.hot_dapp {
  padding-left: 4px;
}
.dapp_item {
  text-align: center;
}
.dapp_logo {
  display: block;
  width: 94px;
  height: 94px;
  margin: 0 auto;
  border-radius: 20px;
}
.dapp_name {
  display: block;
  font-size: 24px;
  margin-top: 15px;
}
.type_tab {
  margin-top: 26px;
}
.type_list {
  margin: 0 30px;
  /* padding-bottom: 25px; */
}
.type_item {
  display: flex;
  align-items: center;
  margin-top: 39px;
}
.type_item img {
  width: 94px;
  height: 94px;
  border-radius: 20px;
}
.type_detail {
  margin: 0 34px;
  flex: 1;
}
.type_name {
  font-weight: bold;
  font-size: 28px;
}
.summary {
  color: #969696;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 170px;
  margin-top: 10px;
}
.dapp_more {
  text-align: center;
  color: #5789e4;
  align-items: center;
  justify-content: center;
  margin-top: 29px;
  font-size: 22px;
}
.dapp_more img {
  width: 12px;
  height: 24px;
  margin-left: 10px;
}
</style>
