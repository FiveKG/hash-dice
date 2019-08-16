<template>
  <vpage>
    <slot>
      <div class="fixed_header">
        <div class="page_header">
          <img class="ion_back" src="@/assets/img/back_fff.png" @click="back"> 
          <span>DAPP</span>
        </div>
      </div>
      <div class="layout">
        <div ref="mescroll" class="mescroll">
          <div class="item" v-for="item in dappList" @click="clickItem(item)">
            <img :src="item.img">
            <div class="dapp_detail">
              <div class="dapp_name">{{item.name}}</div>
              <div class="dapp_info">{{item.summary}}</div>
            </div>
          </div>

        </div>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage';
import { getDappList } from '@/servers';
import MeScroll from 'mescroll.js'
import 'mescroll.js/mescroll.min.css'
import ClientSocket from '@/socket/ClientSocket'

export default {
  components: {
    vpage: MyPage
  },
  data() {
    return {
      img_host: '',
      page: 0,
      dappList: [],
      wallet: {}
    }
  },
  created() {
    this.wallet = this.$store.state.wallet.assets
    this.img_host = this.$store.state.wallet.config.base_data_address.img_host
    console.log(this.$route.query)
    this.query = this.$route.query
  },
  mounted() {
    this.mescroll = new MeScroll(this.$refs.mescroll, {
      down: {
        auto: false,
        callback: this.downCallback,
        warpClass: 'mescroll-downwarp',
        htmlContent: '<p class="downwarp-tip"></p>'
      },
      up: {
        callback: this.upCallback
      }
    })
  },
  methods: {
    downCallback() {
      this.page = 1
      this.loadData()
    },
    upCallback() {
      this.page += 1
      this.loadData()
    },
    async loadData() {
      try {
        const res = await getDappList({type: this.query.type, page: this.page})
        console.log(res)
        if (res.code === 1) {
          for (const item of res.data) {
            item.img = this.img_host + item.logo_url
          }
          this.dappList = res.data
        }
        this.mescroll.endSuccess(res.data.length)
      } catch (error) {
        console.log(error)
      }
    },
    clickItem(item) {
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
          })
        }
      })
    },
    back() {
      this.$router.go(-1)
    }
  },
}
</script>

<style scoped>
.fixed_header {
  position: fixed;
  height: 100px;
  width: 100%;
  background-color: #ec565a;
  z-index: 20000;
}
.page_header {
  padding: 30px;
  text-align: center;
  position: relative;
  font-size: 30px;
  font-weight: bold;
  color: #fff;
  box-sizing: border-box;
}
.ion_back {
  width: 42px;
  height: 32px;
  position: absolute;
  left: 30px;
  top: 50%;
  transform: translate(0, -50%);
}
.layout {
  padding-top: 110px;
  box-sizing: border-box;
}
.mescroll {
  position: fixed;
  top: 100px;
  bottom: 0;
  width: 100%;
  height: auto;
  box-sizing: border-box;
}
.item {
  padding: 40px 0;
  margin: 0 50px;
  display: flex;
  align-items: center;
  border-bottom: 1PX solid #dfdfdf;
}
.item img {
  width: 94px;
  height: 94px;
  border-radius: 20px;
}
.dapp_detail {
  flex: 1;
  /* padding: 30px 0; */
  margin-left: 30px;
}
.dapp_name {
  font-size: 30px;
  font-weight: bold;
}
.dapp_info {
  color: #666666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 70vw;
}
</style>
