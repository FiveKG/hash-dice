<template>
  <vpage>
    <slot>
      <div>
        <div class="page_header">
          <img class="ion_back" src="@/assets/img/back.png" @click="back"> 
          <span>{{$t('assets.transfer')}}</span>
        </div>
        <v-ons-row class="receiver">
          <span>{{$t('assets.transfer_to')}}</span>
          <input type="text" class="text-input" :placeholder="$t('assets.transfer_to_ipt')" maxlength="12" v-model="to">
        </v-ons-row>
        <div class="item_layout">
          <v-ons-row class="item">
            <span>{{$t('assets.transfer_amount')}}</span>
            <input type="text" class="text-input" :placeholder="$t('assets.transfer_amount_ipt')" maxlength="12" v-model="amount">
            <div class="symbol" @click="clickToken"> <span>{{token}}</span> <img src="@/assets/img/transfer_arrow.png"> </div>
          </v-ons-row>
          <v-ons-row class="item">
            <span>{{$t('assets.transfer_balance')}}</span>
            <div class="balance">{{balance}} {{token}}</div>
          </v-ons-row>
          <v-ons-row class="item">
            <span>Memo</span>
            <input type="text" class="text-input" placeholder="memo" maxlength="12" v-model="memo">
          </v-ons-row>
        </div>
        <div class="btn_import" @click="clickNext">{{$t('assets.transfer_next')}}</div>
        
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
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import MyHeader from '@/components/MyHeader'
import MDialog from '@/components/MDialog'
import PasswordService from '@/services/PasswordService'
import CryptoAES from '@/util/CryptoAES'
import pog from '@/plugins/pog'
import { Decimal } from 'decimal.js'

export default {
  components: {
    vpage: MyPage,
    vheader: MyHeader,
    MDialog
  },
  data () {
    return {
      token: '',
      balance: '',
      from: '',
      to: '',
      amount: '',
      memo: '',
      contract: '',
      password: '',
      loading: false,
      showDialog: false
    }
  },
  created() {
    console.log(this.$store.state.wallet.selectToken, this.$route.query)
    const query = this.$route.query
    if (query.to) {
      this.to = query.to
    }
    if (query.type && query.type === 'schema') {
      this.to = query.data.receiver
      this.token = query.data.symbol
    }
    this.from = this.$store.state.wallet.assets.account
    this.getBalance()
    if (query.content) {
      // 扫码转账
      const obj = JSON.parse(query.content)
      this.to = obj.account
      this.amount = obj.amount
    }
  },
  methods: {
    async getBalance() {
      const selectToken = this.$store.state.wallet.selectToken
      this.token = 'POG'
      this.contract = 'eosio.token'
      // if (selectToken.symbol !== 'POG') {
      //   this.contract = selectToken.account_name
      //   this.token = selectToken.symbol
      // }
      const balances = await pog.getTableRows({
        json:true,
        code:this.contract,
        scope:this.from,
        table:'accounts',
        limit:500
      })
      console.log(balances)
      this.balance = balances.rows.length ? balances.rows[0].balance.split(' ')[0] : '0'
    },
    async goTransfer(privateKey) {
      if (privateKey) {
        this.showDialog = false
        try {
          const opts = { authorization:[`${this.from}@active`], keyProvider: privateKey }
          if (!this.contract || this.contract === 'eosio.token') {
            await pog.transfer(this.from, this.to, `${Decimal(this.amount).toFixed(4)} ${this.token}`, this.memo, opts)
          } else {
            // 转代币
            const adm = await pog.contract(this.contract)
            const trx = await adm.transfer(this.from, this.to, `${Decimal(this.amount).toFixed(4)} ${this.token}`, this.memo, opts)
          }
          this.$toast(this.$t('assets.transfer_success2'))
          this.$store.commit('wallet/setAssets', null)
          const stack = this.$store.state.wallet.stack
          this.$router.go(0 - stack.length)
          stack.splice(0)
        } catch (error) {
          console.log(error)
          error = JSON.parse(error)
          if (error.error.code == 3050003) {
            this.$toast(this.$t('common.overdrawn_balance'))
          }
          if (error.error.code == 3080004) {
            this.$toast('CPU资源受限')
          }
        }
        this.resetData()
      } else {
        this.$toast(this.$t('common.wrong_pwd'))
      }
      this.loading = false
    },
    async verifyPassword() {
      this.loading = true
      const seed = await PasswordService.encrypt(this.password)
      const assets = this.$store.state.wallet.assets
      const privateKey = CryptoAES.decrypt(assets.privateKey,seed)
      return privateKey
    },
    async handleConfirm(fingerprintState) {
      const that = this
      const privateKey = await this.verifyPassword()
      if (privateKey) {
        if (fingerprintState) {
          // 加密
          FingerprintAuth.encrypt({ clientId: 'com.isecsp.wallet', username: 'wallet', password: that.password, locale: 'zh_CN', disableBackup: true },encryptSuccessCallback, encryptErrorCallback)
          function encryptSuccessCallback(res) {
            // console.log(res)
            that.$store.commit('wallet/setFingerprintToken', res.token)
            that.goTransfer(privateKey)
          }
          function encryptErrorCallback(err) {
  
          }
        } else {
          this.goTransfer(privateKey)
        }
      } else {
        this.loading = false
        this.$toast(this.$t('common.wrong_pwd'))
      }
    },
    handleCancel() {
      this.showDialog = false
    },
    async clickNext() {
      if (!this.to) {
        this.$toast(this.$t('assets.toast_etan'))
        return
      }
      if (!this.amount) {
        this.$toast(this.$t('assets.toast_etcnoo'))
        return
      }
      if (this.from === this.to) {
        this.$toast(this.$t('assets.toast_cntts'))
        return
      }
      this.loading = true
      try {
        await pog.getAccount(this.to)
        if (this.$store.state.wallet.fingerprintToken) {
          const that = this
          // 已开启指纹支付
          FingerprintAuth.decrypt({clientId: "com.isecsp.wallet", username: 'wallet', locale: 'zh_CN', disableBackup: true, token: this.$store.state.wallet.fingerprintToken}, successCallback, errorCallback);
          async function successCallback(result) {
            console.log("successCallback(): " + JSON.stringify(result));
            if (result.withFingerprint) {
                console.log("Successful biometric authentication.");
                if (result.password) {
                    console.log("password: " + result.password);
                    that.password = result.password
                    const privateKey = await that.verifyPassword()
                    that.goTransfer(privateKey)
                }
            } else if (result.withBackup) {
                console.log("Authenticated with backup password");
            }
          }
          function errorCallback(error) {
            if (error === FingerprintAuth.ERRORS.FINGERPRINT_CANCELLED) {
                console.log("FingerprintAuth Dialog Cancelled!");
            } else {
                console.log("FingerprintAuth Error: " + error);
            }
          }
        } else {
          this.showDialog = true
        }
      } catch (error) {
        console.log(error)
        this.$toast(this.$t('assets.toast_adne'))
      }
      this.loading = false
    },
    clickContact() {
      
    },
    clickToken() {
      this.$router.push({
        name: 'PogSelectToken'
      })
    },
    back() {
      this.$router.go(-1)
    },
    resetData() {
      this.to = ''
      this.amount = ''
      this.memo = ''
    }
  },
  watch: {
    showDialog(newVal, oldVal) {
      if (!newVal) this.password = ''
    },
    '$route'(to, from) {
      // console.log(to, from)
      if (from.name === 'SelectToken') {
        this.getBalance()
      }
    }
  },
  directives: {
    focus: {
      inserted: (el) => {
        el.focus()
      }
    }
  }
}
</script>

<style scoped>
.page_header {
  padding: 30px 55px;
  text-align: center;
  position: relative;
  font-size: 34px;
  background-color: #fff;
}
.ion_back {
  width: 42px;
  height: 32px;
  position: absolute;
  left: 55px;
  top: 50%;
  transform: translate(0, -50%);
}
.page_content {
  background-color: #fff;
  padding: 30px;
}
.receiver {
  margin: 22px 0;
  padding: 40px 56px;
  font-size: 30px;
  align-items: center;
  background-color: #fff;
}
.item_layout {
  padding: 0 56px;
  background-color: #fff;
}
.item {
  padding: 40px 0;
  font-size: 30px;
  align-items: center;
  background-color: #fff;
  border-bottom: 1PX solid rgb(228, 228, 228);
}
.item:last-child {
  border: none;
}
.item input, .receiver input {
  flex: 1;
  margin-left: 40px;
  font-size: 30px;
  height: 100%;
}
.symbol {
  font-size: 22px;
  padding: 3px 12px;
  color: #c3c3c3;
  border-radius: 30px;
  border: 1PX solid #c3c3c3;
  display: flex;
  align-items: center;
}
.symbol img {
  height: 22px;
  margin-left: 5px;
}
.balance {
  flex:1;
  text-align:right;
  color: #c3c3c3;
  font-size: 22px;
}
.btn_import {
  margin: 73px 40px;
  background-color: #ec565a;
  color: #fff;
  text-align: center;
  font-size: 30px;
  border-radius: 15px;
  padding: 20px 0;
}
input {
  caret-color: #027be3;
  width: 100%;
}
</style>
