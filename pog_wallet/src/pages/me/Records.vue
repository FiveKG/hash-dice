<template>
  <vpage>
    <slot>
      <div class="fix_header">
        <div class="page_header">
          <img class="ion_back" src="@/assets/img/back.png" @click="back"> 
          <span>{{$t('me.transaction_records')}}</span>
        </div>
      </div>
      <div ref="mescroll" class="mescroll">
        <div class="record_item" v-for="item in records">
          <img src="@/assets/img/record_in.png" v-if="item.type === 'in'">
          <img src="@/assets/img/record_out.png" v-else>
          <div>
            <div class="record_account">{{item.type === 'in' ? item.sender : item.receiver}}</div>
            <div class="record_time">{{item.time}}</div>
          </div>
          <span class="record_amount" :style="{color: item.type === 'in' ? '#30ec30':'#ec565a'}">{{item.type === 'in' ? '+' : '-'}}{{item.quantity}} {{item.symbol}}</span>
        </div>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import { getEosTransfers } from '@/servers'
import { format, parse } from 'date-fns'
import MeScroll from 'mescroll.js'
import 'mescroll.js/mescroll.min.css'

export default {
  components: {
    vpage: MyPage
  },
  data() {
    return {
      records: [],
      page: 0,
      account: ''
    }
  },
  created() {
    console.log(this.$store.state.wallet.localFile.wallets)
    const wallets = this.$store.state.wallet.localFile.wallets.slice()
    for (const wallet of wallets) {
      if (wallet.isDefault) {
        if (wallet.chain === 'eos') {
          this.account = wallet.accountNames[0]
          // getEosTransfers({account_name: wallet.accountNames[0]}).then(res => {
          //   console.log(res)
          //   if (res.code === 1) {
          //     for (let item of res.data) {
          //       if (item.receiver === wallet.accountNames[0]) {
          //         item.type = 'in'
          //       } else {
          //         item.type = 'out'
          //       }
          //       item.time = format(this.convertUTCDateToLocalDate(new Date(item.timestamp)), 'YYYY-MM-DD HH:mm:ss')
          //       this.records.push(item)
          //     }
          //   }
          // })
        }
      }
    }
  },
  mounted () {
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
        const res = await getEosTransfers({account_name: this.account, page: this.page})
        // console.log(res)
        for (let item of res.data) {
          if (item.receiver === this.account) {
            item.type = 'in'
          } else {
            item.type = 'out'
          }
          item.time = format(this.convertUTCDateToLocalDate(new Date(item.timestamp)), 'YYYY-MM-DD HH:mm:ss')
          this.records.push(item)
        }
        this.mescroll.endSuccess(res.data.length)
      } catch (error) {
        console.log(error)
      }
    },
    convertUTCDateToLocalDate(date) {
      let newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

      let offset = date.getTimezoneOffset() / 60;
      let hours = date.getHours();

      newDate.setHours(hours - offset);

      return newDate;   
    },
    back() {
      this.$router.go(-1)
    }
  },
}
</script>

<style scoped>
.fix_header {
  position: fixed;
  width: 100%;
  height: 108px;
  top: 0;
  background-color: #f6f6f6;
  z-index: 200000;
}
.page_header {
  padding: 30px 55px;
  text-align: center;
  position: relative;
  font-size: 34px;
}
.ion_back {
  width: 42px;
  height: 32px;
  position: absolute;
  left: 55px;
  top: 50%;
  transform: translate(0, -50%);
}
.layout {
  padding: 100px 30px 0 30px;
}
.mescroll {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  height: auto;
  padding: 0 30px;
  box-sizing: border-box;
}
.record_item {
  display: flex;
  align-items: center;
  padding: 36px 24px;
  margin: 20px 0;
  background-color: #eeeeee;
  border-radius: 15px;
}
.record_item img {
  width: 62px;
  height: 62px;
}
.record_item div {
  flex: 1;
  margin-left: 28px;
}
.record_account {
  font-size: 34px;
}
.record_time {
  font-size: 22px;
  margin-top: 16px;
  color: #b1b1b1;
}
.record_amount {
  font-size: 28px;
  font-weight: bold;
}
</style>
