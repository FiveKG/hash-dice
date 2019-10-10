<template>
  <div>
    <v-ons-row class="header_search">
      <div class="search_box" @click="clickSearch">
        <img class="ion_search" src="@/assets/img/assets_search.png">
        <span>搜索DAPP或者链接</span>
      </div>
      <img class="ion_scan" src="@/assets/img/discover_scan.png" @click="clickScan">
    </v-ons-row>
    <div class="layout_content" ref="layout" v-scroll="handleScroll">
      <swiper class="swiper_box" dots-position="center" dots-class="dots" loop auto @on-click-list-item="clickSwiper" height="140px">
        <swiper-item>
          <img :style="bannerSwiperImgStyle" src="@/assets/img/find_img_banner.png">
        </swiper-item>
        <template v-if="swiperList.length > 0">
          <swiper-item  v-for="(item, index) in swiperList" :key="index">
            <img :style="bannerSwiperImgStyle" :src="item.img">
          </swiper-item>
        </template>

      </swiper>
        <v-ons-row class="list_title">热门推荐</v-ons-row>
        <v-ons-row class="hot_dapp">
        <v-ons-col class="dapp_item" v-for="(item, index) in hotDapp" :key="index" @click="clickHot(item)">
          <img class="dapp_logo" :src="item.logo_url" v-if="item.logo_url">
          <span class="dapp_name" v-if="item.name">{{item.name}}</span>
        </v-ons-col>
      </v-ons-row>
      <div class="tab-slider">
        <div class="tab-body">
          <div v-for="(item, key) in app_type" :key="key" :class="{'active':item === selectedTab}" @click="clickTab(key)" class="tab-item">
            {{item}}
          </div>
        </div>
      </div>
      <swiper class="type_list" v-model="index" :show-dots="false" height="9rem">
        <swiper-item class="type_box" v-for="(item, index) in dappList" :key="index">
          <v-ons-row style="margin: 0 0 1.8rem 0;" v-if="item.list.length">
            <v-ons-row style="display: block;"> 
              <div class="type_item" v-for="dapp in item.list" @click="clickDapp(dapp)">
              <!-- <div class="type_item" v-for="dapp in item.list" v-if="dapp.odd_even === 'odd'" @click="clickDapp(dapp)"> -->
                <img :src="dapp.img">
                <div class="type_detail">
                  <div class="type_name">{{dapp.name}}</div>
                  <div class="summary">{{dapp.summary}}</div>
                </div>
                <img src="@/assets/img/invitation_profitarrow.png" alt="">
              </div>
            </v-ons-row>
            <!-- <v-ons-row>
              <div class="type_item" v-for="dapp in item.list" v-if="dapp.odd_even === 'even'" @click="clickDapp(dapp)">
                <img :src="dapp.img">
                <div class="type_detail">
                  <div class="type_name">{{dapp.name}}</div>
                  <div class="summary">{{dapp.summary}}</div>
                </div>
                <img src="@/assets/img/invitation_profitarrow.png" alt="">
              </div>
            </v-ons-row> -->
             <!-- <v-ons-row>
              <div class="type_item"  @click="gogame()">
                <img src="@/assets/invitation2/u1.png">
                <div class="type_detail">
                  <div class="type_name">全球彩</div>
                  <div class="summary">全球彩游戏</div>
                </div>
                <img src="@/assets/img/invitation_profitarrow.png" alt="">
              </div>
              </v-ons-row>
               <v-ons-row>
              <div class="type_item"  @click="goLottery()">
                <img src="@/assets/invitation2/u1.png">
                <div class="type_detail">
                  <div class="type_name">哈希分分彩</div>
                  <div class="summary">哈希分分彩游戏</div>
                </div>
                <img src="@/assets/img/invitation_profitarrow.png" alt="">
              </div>
              </v-ons-row>
               <v-ons-row>
              <div class="type_item"  @click="goHashDice()">
                <img src="@/assets/invitation2/u4.svg">
                <div class="type_detail">
                  <div class="type_name">哈希骰子</div>
                  <div class="summary">哈希骰子游戏</div>
                </div>
                <img src="@/assets/img/invitation_profitarrow.png" alt="">
              </div>
             </v-ons-row>
             <v-ons-row>
              <div class="type_item"  @click="goTreasure()">
                <img src="@/assets/invitation2/u3.png">
                <div class="type_detail">
                  <div class="type_name">夺宝</div>
                  <div class="summary">夺宝游戏</div>
                </div>
                <img src="@/assets/img/invitation_profitarrow.png" alt="">
              </div>
             </v-ons-row> -->

          </v-ons-row>
          <v-ons-row class="dapp_more" v-if="item.list.length > 5" @click="clickMore(index)">查看更多 <img src="@/assets/img/discover_arrow.png"> </v-ons-row>
        </swiper-item>
      </swiper>
    </div>
    <v-ons-dialog
      modifier="width_pwd"
      style="background-color: rgba(0, 0, 0, .5);z-index: 10000;"
      :visible.sync="showDialog">
      <div class="dialog_layout">
        <div class="alert-dialog-title statement_title">责任声明</div>
        <div>您即将使用第三方DApp，确认即同意第三方DApp的用户协议与隐私政策，由第三方DApp向您承当责任。</div>
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
import api from '@/servers/invitation';

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
      showExDialog: false,
      showDialog: false,
      curDApp: {
        site_url: "",
        name: "",
        type: ""
      },
      bannerSwiperImgStyle:{
        'max-width': '100%',
        'max-height': '100%'
      }
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
    cancel() {
      this.showDialog = false;
    },
    confirm() {
      this.showDialog = false;
      this.runIframe();
    },
    runIframe() {
      if (this.wallet) {
        ClientSocket.link().then(conn => {
          if (conn) {
            ClientSocket.setAccount(this.wallet.account).then(res => {
              // 获取token----------------start
              api.getGameToken({key: this.$store.state.wallet.localFile.wallets[0].privateKey}).then(res => {
                if(res.code == 1){
                  this.$router.push({
                    name: 'Iframe',
                    query: {
                      url: this.curDApp.site_url+'/#/'+'?account='+this.$store.state.wallet.localFile.wallets[0].accountNames[0]+'&token='+res.data+'&privateKey='+this.$store.state.wallet.localFile.wallets[0].privateKey,
                      name: this.curDApp.name,
                      type: this.curDApp.type
                    }
                  })
                }
                console.log("进入游戏时获取token:",res);
              })
              // 获取token----------------end
              // this.$router.push({
              //   name: 'Iframe',
              //   query: {
              //     url: this.curDApp.site_url,
              //     name: this.curDApp.name,
              //     type: this.curDApp.type
              //   }
              // })
            }).catch(err => {
              console.log('setAccount',err)
            })
          }
        }).catch(err => {
          console.log('link client socket err',err)
        })
      } else {
        this.$router.push({
          name: 'Iframe',
          query: {
            url: this.curDApp.site_url,
            name: this.curDApp.name,
            type: this.curDApp.type
          }
        })
      }
    },
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
                    name: item.name,
                    type: item.type
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
              name: item.name,
              type: item.type
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
      this.curDApp.site_url = item.site_url;
      this.curDApp.name = item.name;
      this.curDApp.type = item.type;

      this.showDialog = true;
    },
    handleScroll(evt, el) {
      console.log(window.scrollY, this.$refs.label.scrollTop)
      // if (window.scrollY > 50) {
      // }
    },
    clickHot(item) {
      this.curDApp.site_url = item.site_url;
      this.curDApp.name = item.name;
      this.curDApp.type = item.type;

      console.log("this.curDApp:",this.curDApp);
      
      this.showDialog = true;
      // 前往交易所
      // if (item.type == 'exchange_market'){
      //   this.gotoExchange();
      //   return;
      // }

      // if (this.wallet) {
      //   ClientSocket.link().then(conn => {
      //     if (conn) {
      //       ClientSocket.setAccount(this.wallet.account).then(res => {
      //         this.$router.push({
      //           name: 'Iframe',
      //           query: {
      //             url: item.site_url,
      //             name: item.name
      //           }
      //         })
      //       }).catch(err => {
      //         console.log('setAccount',err)
      //       })
      //     }
      //   }).catch(err => {
      //     console.log('clickHot',err)
      //   })
      // } else {
      //   this.$router.push({
      //     name: 'Iframe',
      //     query: {
      //       url: item.site_url,
      //       name: item.name
      //     }
      //   })
      // }
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
      api.getGameToken({key: this.$store.state.wallet.localFile.wallets[0].privateKey}).then(res => {
        if(res.code == 1){
          // this.$router.push('GlovalLotto');
          this.$router.push({
            name: 'Iframe',
            query: {
              url: 'http://localhost:8080/#/'+'?account='+this.$store.state.wallet.localFile.wallets[0].accountNames[0]+'&token='+res.data+'&privateKey='+this.$store.state.wallet.localFile.wallets[0].privateKey,
              name: '全球彩'
            }
          })
        }
        console.log("进入游戏时获取token:",res);
      })
    },
    goLottery(){
      this.$router.push('LotteryGo')
    },
    goHashDice(){
      this.$router.push('HashDicePage')
    },
    goTreasure(){
      this.$router.push('TreasurePage')
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
  background-color: #fff;
  z-index: 100;
  padding-top: .4rem;
}
.ion_scan {
  width: 50px;
  height: 50px;
  margin: 0 30px;
  background-color: rgb(248, 249, 255);
  /* border-radius: .2rem; */
}
.search_box {
  flex: 1;
  height: 70px;
  margin-left: 32px;
  border-radius: 30px;
  background-color: rgb(248, 249, 255);
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
  font-size: .45rem;
  font-weight: bold;
  color: #555;
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
.type_box {
  overflow-y: scroll;
  padding-bottom: 1.8rem;
}
.type_item {
  display: flex;
  align-items: center;
  margin-top: 39px;
  flex: 1;
}
.type_item>img:nth-child(1) {
  width: 94px;
  height: 94px;
  border-radius: 20px;
}
.type_item>img:nth-child(3) {
  width: .6rem;
  height: .6rem;
}
.type_detail {
  margin: 0 34px;
  flex: 1;
}
.type_name {
  font-weight: bold;
  font-size: 28px;
}
.tab-slider {
  width: 100%;
  padding: .4rem 0;
  overflow-y: hidden;
  overflow-x: scroll;
}
.tab-body {
  width: auto;
  height: 1.5rem;
  display: flex;
}
.tab-item {
  padding: .2rem .5rem;
  white-space: nowrap;
  position: relative;
  font-size: .35rem;
  display: flex;
  align-items: flex-end;
  transition: all .3s;
}
.tab-item.active {
  font-size: .45rem;
  font-weight: bold;
}
.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: .22rem;
  height: .09rem;
  background: #5789e4;
  border-radius: .1rem;
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
.dialog_layout {
  padding: 20px 48px;
}
.statement_title {
  font-size: 0.4rem;
}
</style>
