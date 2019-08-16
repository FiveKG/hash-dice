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
      <mescroll-vue ref="mescroll" :down="getMescrollDown()" :up="getMescrollUp()" @init="mescrollInit">
        <div class="token_detail">
          <div class="token_item">
            <div class="token_assets">
              <div>{{$t('common.assets')}}</div>
              <div class="token_info">{{balance}}</div>
            </div>
            <div class="token_usd">
              <div>( {{`${$store.state.wallet.currency === 'USD' ? '$':'￥'} ${totalAssets}`}} )</div>
            </div>
          </div>
          <div class="">
            <div>{{$t('common.contract')}}</div>
            <div class="token_info">{{contract}}</div>
          </div>
        </div>
        <div class="records">
          <v-ons-row class="records_title">{{$t('common.transaction_records')}}</v-ons-row>
          <div class="record_item" v-for="item in records" @click="clickItem(item)">
            <img src="@/assets/img/record_in.png" v-if="item.type === 'in'">
            <img src="@/assets/img/record_out.png" v-else>
            <div>
              <p class="record_account">{{item.type === 'in' ? item.from : item.to}}</p>
              <p class="record_time">{{item.time}}</p>
            </div>
            <span class="record_amount" :style="{color: item.type === 'in' ? '#30ec30':'#ec565a'}">{{item.type === 'in' ? '+' : '-'}}{{item.quantity}} {{symbol}}</span>
          </div>
        </div>

      </mescroll-vue>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import MescrollVue from '@/components/mescroll'
import MeScroll from 'mescroll.js'
import 'mescroll.js/mescroll.min.css'
import { getCoinRate } from '@/servers'
import { format, parse } from 'date-fns'
import {Decimal} from 'decimal.js'
import {ethers} from 'ethers'
import {getabi} from '@/servers/eth'
import axios from 'axios';

export default {
  components: {
    vpage: MyPage,
    MescrollVue
  },
  data () {
    return {
      mescroll: null,
      address: '',
      symbol: '',
      contract: '',
      balance: '0',
      totalAssets: '0.00',
      page: 0,
      records: [],
    }
  },
  created () {
    this.symbol = this.$route.query.symbol
    this.address = this.$route.query.address
    this.contract = this.$route.query.contract
    console.log(this.$route.query)
    this.getBalance()
  },
  mounted () {
    // this.mescroll = new MeScroll(this.$refs.mescroll, {
    //   down: {
    //     auto: false,
    //     callback: this.downCallback,
    //     warpClass: 'mescroll-downwarp refresh_bg',
    //     htmlContent: '<p class="downwarp-tip" style="color:#f6f6f6;font-weight:bold;font-size:16px;"></p>'
    //   },
    //   up: {
    //     callback: this.upCallback
    //   }
    // })
  },
  methods: {
    mescrollInit(mescroll) {
      this.mescroll = mescroll
    },
    getMescrollDown() {
      return {
        auto: true,
        callback: this.downCallback,
        warpClass: 'mescroll-downwarp refresh_bg',
        htmlContent: '<p class="downwarp-tip" style="color:#f6f6f6;font-weight:bold;font-size:16px;"></p>'
      }
    },
    getMescrollUp() {
      return {
        auto: false,
        callback: this.upCallback,
      }
    },
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
      if (this.symbol === 'ETH') {
        axios.get(`http://api.etherscan.io/api?module=account&action=txlist&address=${this.address}&page=${this.page}&offset=10&sort=desc&apikey=VUDCK19I8D3NNT5Y9UHKIGC12MZ16ZS91C`).then(res => {
          console.log(res)
          if (res.status === 200) {
            for (const item of res.data.result) {
              item.quantity = ethers.utils.formatEther(item.value)
              item.time = format(new Date(Number(item.timeStamp)*1000),'YYYY-MM-DD HH:mm:ss')
              if (item.to.toLowerCase() === this.address.toLowerCase()) {
                item.type = 'in'
              } else {
                item.type = 'out'
              }
              this.records.push(item)
            }
            console.log(this.records)
            this.mescroll.endSuccess(res.data.result.length)
          }
        })
      } else {
        axios.get(`https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${this.contract}&address=${this.address}&page=${this.page}&offset=10&sort=desc&apikey=VUDCK19I8D3NNT5Y9UHKIGC12MZ16ZS91C`).then(res => {
          console.log(res)
          if (res.status === 200) {
            for (const item of res.data.result) {
              item.quantity = ethers.utils.formatEther(item.value)
              item.time = format(new Date(Number(item.timeStamp)*1000),'YYYY-MM-DD HH:mm:ss')
              if (item.to.toLowerCase() === this.address.toLowerCase()) {
                item.type = 'in'
              } else {
                item.type = 'out'
              }
              this.records.push(item)
            }
            console.log(this.records)
            this.mescroll.endSuccess(res.data.result.length)
          }
        })
      }
    },
    async getBalance() {
      try {
        const provider = ethers.getDefaultProvider(this.ethNet)
        if (this.symbol === 'ETH') {
          provider.getBalance(this.address).then(balance => {
            const estr = ethers.utils.formatEther(balance);
            console.log('getBalance',estr)
            this.balance = estr
          })
          const rate = await getCoinRate({coin_id: this.symbol, convert: this.$store.state.wallet.currency})
          this.totalAssets = Decimal.mul(this.balance, rate.data.price).toFixed(2)
        } else {
          getabi({address: this.contract}).then(async res => {
            if (res.message === 'OK') {
              const abi = JSON.parse(res.result)
              const contract = new ethers.Contract(this.contract,abi,provider)
              const balance = await contract.balanceOf(this.address)
              this.balance = ethers.utils.formatEther(balance)
            }
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    clickItem(item) {
      item.symbol = this.symbol
      console.log(item)
      this.$router.push({
        name: 'EthTransferDetail',
        query: item
      })
    },
    clickTransfer() {
      this.$store.commit('wallet/setSelectEthToken', {
        address: this.$route.query.contract,
        symbol: this.symbol
      })
      this.$router.push({
        name: 'EthTransferStraight'
      })
    },
    clickReceive() {
      this.$router.push({
        name: 'EthReceive',
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
  font-weight: bold;
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
  font-size: 26px;
  padding: 0 30px 30px 30px;
}
.token_item {
  display: flex;
  align-items: center;
}
.token_assets {
  flex: 1;
}
.token_usd {
  font-size: 34px;
}
.token_info {
  padding: 18px 0;
  font-size: 34px;
  font-weight: 450;
  overflow: hidden;
  word-wrap: break-word;
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
  display: flex;
  align-items: center;
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
  overflow: hidden;
}
.record_account {
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
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
