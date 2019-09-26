<template>
  <vpage>
    <slot>
      <div class="header">
        <img src="@/assets/img/u14.png" @click="back">
        <span>提现</span>
      </div>
      <div class="layout">
        <div class="ipt_header">
          <div style="flex:1;">可提现</div>
          <div class="with_all" @click="reqParams.amount = balance">全部提现</div>
        </div>
        <div class="ipt_layout">
          <input type="text" class="text-input" :placeholder="`余额：${balance}`" v-model="reqParams.amount">
        </div>
        <div class="btn" @click="clickWithdraw">提现</div>
      </div>
      <div class="record">
        <div class="record_title">
          <div>时间</div>
          <div>提现金额</div>
        </div>
        <div class="record_item" v-for="item in records">
          <div>
            <div>{{item.create_time.split(' ')[0]}}</div>
            <div>{{item.create_time.split(' ')[1]}}</div>
          </div>
          <div>{{item.withdraw_amount}}</div>
        </div>
      </div>
      <v-ons-dialog
        modifier="width_pwd"
        cancelable
        style="background-color: rgba(0, 0, 0, .5);z-index: 10000;"
        :visible.sync="showDialog">
        <m-dialog v-model="password" v-on:confirm="handleConfirm" v-on:cancel="handleCancel"></m-dialog>
      </v-ons-dialog>
      <v-ons-modal :visible="loading" >
        <loading></loading>
      </v-ons-modal>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import MDialog from '@/components/MDialog'
import PasswordService from '@/services/PasswordService'
import CryptoAES from '@/util/CryptoAES'
import { format, parse } from 'date-fns'
import { balanceInfo,withdraw,withdrawHistory } from '@/servers/invitation';

export default {
  components: {
    vpage: MyPage,
    MDialog
  },
  data() {
    return {
      balance: '',
      reqParams: {
        account: '',
        amount: ''
      },
      password: '',
      showDialog: false,
      loading: false,
      records: []
    }
  },
  created() {
    this.reqParams.account = this.$route.query.account
    this.balanceInfo()
    this.withdrawHistory()
  },
  methods: {
    async handleConfirm() {
      this.loading = true
      const privateKey = await this.verifyPassword()
      if (privateKey) {
        const res = await this.withdraw()
        if (res) {
          this.$toast('提现成功')
          this.loading = false
          this.showDialog = false
          setTimeout(() => {
            this.withdrawHistory()
          }, 500);
        }
      } else {
        this.$toast(this.$t('common.wrong_pwd'))
        this.loading = false
      }
    },
    handleCancel() {
      this.showDialog = false
    },
    // 验证密码
    async verifyPassword() {
      const seed = await PasswordService.encrypt(this.password)
      const wallets = this.$store.state.wallet.localFile.wallets
      const current = wallets.find(ele => ele.accountNames[0] === this.reqParams.account)
      const privateKey = CryptoAES.decrypt(current.privateKey,seed)
      return privateKey
    },
    async withdraw() {
      try {
        const res = await withdraw({
          account_name: this.reqParams.account,
          amount: this.reqParams.amount,
          symbol: 'EOS'
        })
        console.log('withdraw',res)
        if (res.code === 1) {
          return true
        }
      } catch (error) {
        console.log(error)
      }
      return false
    },
    async withdrawHistory() {
      try {
        this.records = []
        const res = await withdrawHistory({account_name: this.reqParams.account})
        console.log('withdrawHistory',res)
        if (res.code === 1) {
          for (const item of res.data) {
            this.records.push({
              create_time: format(this.convertUTCDateToLocalDate(new Date(item.create_time)), 'YYYY-MM-DD HH:mm:ss'),
              withdraw_amount: parseFloat(item.withdraw_amount).toFixed(4)
            })
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    async balanceInfo() {
      try {
        const res = await balanceInfo({account_name: this.reqParams.account})
        console.log('balanceInfo',res)
        if (res.code === 1) {
          this.balance = res.data.withdraw_enable
        }
      } catch (error) {
        console.log(error)
      }
    },
    convertUTCDateToLocalDate(date) {
      // let newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
      let newDate = date

      let offset = date.getTimezoneOffset() / 60;
      let hours = date.getHours();

      newDate.setHours(hours - offset);

      return newDate;   
    },
    clickWithdraw() {
      if (this.reqParams.amount) {
        this.showDialog = true
      }
    },
    back() {
      this.$router.go(-1)
    }
  },
}
</script>

<style scoped>
.header {
  padding: 30px 35px;
  display: flex;
  align-items: center;
  font-size: 38px;
  background-color: #ececec;
}
.header img {
  width: auto;
  height: 50px;
}
.header span {
  flex: 1;
  margin-left: 20px;
}
.layout {
  padding: 50px 30px;
}
.ipt_header {
  padding: 20px 30px;
  display: flex;
  align-items: center;
  font-size: 30px;
}
.with_all {
  color: #006699;
}
.ipt_layout {
  background-color: #fff;
  border-radius: 10px;
  padding: 30px 40px;
}
.ipt_layout input {
  font-size: 30px;
}
.btn {
  margin-top: 50px;
  padding: 20px;
  background-color: #ff8e05;
  color: #fff;
  border-radius: 10px;
  font-size: 35px;
  font-weight: bold;
  text-align: center;
}
.record_title {
  background-color: #fff;
  display: flex;
  align-items: center;
  font-size: 30px;
  padding: 20px;
}
.record_title div {
  flex: 1;
  text-align: center;
}
.record_item {
  background-color: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  padding: 20px;
  font-size: 30px;
}
.record_item:nth-child(even) {
  background-color: #f9f9f9;
}
</style>
