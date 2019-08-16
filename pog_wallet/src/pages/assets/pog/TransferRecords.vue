<template>
  <vpage>
    <slot>
      <div class="footer_fixed">
        <div class="btn btn_transfer" @click="clickTransfer">{{$t('assets.transfer')}}</div>
        <div class="btn btn_receive" @click="clickReceive">{{$t('assets.receive')}}</div>
      </div>
      <div class="page_header">
        <img class="ion_back" src="@/assets/img/back_fff.png" @click="back"> 
        <span>{{symbol}}</span>
      </div>
      <div ref="mescroll" class="mescroll">
        <v-ons-row class="token_detail">
          <v-ons-col>
            <div>{{$t('common.assets')}}</div>
            <div class="border_right">
              <div class="token_info">{{balance}}</div>
              <div>( {{`${$store.state.wallet.currency === 'USD' ? '$':'￥'} ${totalAssets}`}} )</div>
            </div>
          </v-ons-col>
          <v-ons-col>
            <div>{{$t('common.contract')}}</div>
            <div>
              <!-- <div class="token_info">{{contract}}</div> -->
              <div class="token_info">pog.token</div>
              <!-- <div>( $ 0.00 )</div> -->
            </div>
          </v-ons-col>
        </v-ons-row>
        <div class="records">
          <v-ons-row class="records_title">{{$t('common.transaction_records')}}</v-ons-row>
          <v-ons-row class="record_item" v-for="item in records" @click="clickItem(item)">
            <img src="@/assets/img/record_in.png" v-if="item.type === 'in'">
            <img src="@/assets/img/record_out.png" v-else>
            <div>
              <p class="record_account">{{item.type === 'in' ? item.sender : item.receiver}}</p>
              <p class="record_time">{{item.time}}</p>
            </div>
            <span class="record_amount" :style="{color: item.type === 'in' ? '#30ec30':'#ec565a'}">{{item.type === 'in' ? '+' : '-'}}{{item.quantity}} {{symbol}}</span>
          </v-ons-row>
        </div>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import pog from '@/plugins/pog'
import MeScroll from 'mescroll.js'
import 'mescroll.js/mescroll.min.css'
import { getEosTransfers,getCoinRate } from '@/servers'
import { format, parse } from 'date-fns'
import {Decimal} from 'decimal.js'

export default {
  components: {
    vpage: MyPage
  },
  data () {
    return {
      mescroll: null,
      account: '',
      symbol: '',
      contract: '',
      balance: '0',
      totalAssets: '0.00',
      page: 0,
      records: []
    }
  },
  created () {
    this.symbol = this.$route.query.symbol
    this.contract = 'eosio.token'
    this.account = this.$route.query.account
    this.getBalance()
  },
  mounted () {
    this.mescroll = new MeScroll(this.$refs.mescroll, {
      down: {
        auto: false,
        callback: this.downCallback,
        warpClass: 'mescroll-downwarp refresh_bg',
        htmlContent: '<p class="downwarp-tip" style="color:#f6f6f6;font-weight:bold;font-size:16px;"></p>'
      },
      up: {
        callback: this.upCallback
      }
    })
  },
  methods: {
    downCallback() {
      this.records = []
      this.page = 1
      this.loadData()
    },
    upCallback() {
      this.page += 1
      this.loadData()
    },
    async loadData() {
      try {
        const res = await getEosTransfers({account_name: this.account, symbol: this.symbol, page: this.page})
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
    async getBalance() {
      try {
        const balances = await pog.getTableRows({
          json:true,
          code:this.contract,
          scope:this.account,
          table:'accounts',
          limit:500
        })
        this.balance = balances.rows.length ? balances.rows[0].balance.split(' ')[0] : '0.0000'
        //const rate = await getCoinRate({coin_id: 'POG', convert: this.$store.state.wallet.currency})
        //按40元算
        this.totalAssets = Decimal.mul(this.balance, 40).toFixed(2)
      } catch (error) {
        console.log(error)
      }
    },
    clickItem(item) {
      console.log(item)
      this.$router.push({
        name: 'PogTransferDetail',
        query: item
      })
    },
    clickTransfer() {
      this.$store.commit('wallet/setSelectToken', {
        account_name: this.contract,
        balance: this.balance,
        symbol: this.symbol
      })
      this.$router.push({
        name: 'PogTransferStraight'
      })
    },
    clickReceive() {
      this.$router.push({
        name: 'PogReceive',
        query: {
          token: this.symbol
        }
      })
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
  }
}
</script>

<style scoped>
p {
  margin: 0;
}
.text_right {
  text-align: right;
}
.page_header {
  height: 130px;
  padding: 45px 55px;
  text-align: center;
  position: relative;
  font-size: 34px;
  background-color: #ec565a;
  color: #fff;
  box-sizing: border-box;
}
.ion_back {
  width: 42px;
  height: 32px;
  position: absolute;
  left: 55px;
  top: 50%;
  transform: translate(0, -50%);
}
.downwarp-progress {
  border: 1px solid #fff;
}
.mescroll {
  position: fixed;
  top: 130px;
  bottom: 120px;
  height: auto;
}
.footer_fixed {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 120px;
  background-color: #f6f6f6;
  display: flex;
  padding: 20px 0;
  box-sizing: border-box;
}
.btn {
  flex: 1;
  margin: 0 50px;
  border-radius: 10px;
  color: #fff;
  padding: 20px;
  font-weight: 450;
  font-size: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn_transfer {
  background-color: #ec565a;
}
.btn_receive {
  background-color: #5789e3;
}
.token_detail {
  background-color: #ec565a;
  color: #fff;
  text-align: center;
  font-size: 28px;
  padding-bottom: 30px;
}
.token_info {
  padding: 18px 0;
  font-size: 34px;
  font-weight: 450;
}
.border_right {
  border-right: 1PX solid #dfdfdf;
}
.records {
  padding: 68px 56px 0 56px;
}
.records_title {
  font-size: 28px;
  margin-bottom: 30px;
}
.record_item {
  align-items: center;
  padding: 28px 0;
  border-bottom: 1PX solid #d8d8d8;
}
.record_item:last-child {
  border: none;
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
