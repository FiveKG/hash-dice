<template>
  <vpage>
    <slot>
      <div class="flex_col">
        <div class="resource_card">
          <div class="align_center card_header">
            <div class="resource_type">{{$t('assets.ram')}}</div>
            <div class="resource_price">{{$t('assets.price')}}: {{ram.price}} EOS/KB</div>
          </div>
          <div class="resource_remaining">
            <span class="remaining_progress" :style="{width: ram.progress+'%'}"></span>
            <span class="remaining_text">{{$t('assets.remaining')}}: {{ram.unusage}} KB / {{ram.quota}} KB</span>
          </div>
        </div>
        <div class="resource_card" style="flex: 1;">
          <!-- 单选框 -->
          <div class="action_checkbox align_center">
            <div class="delegate_checkbox">
              <div class="my_checkbox" @click="clickCheckbox('buy')">
                <span class="ion_checkbox checked" v-if="ramCheck.buy"></span>
                <span class="ion_checkbox" v-else></span>
                <span class="checkbox_text">{{$t('assets.buy')}}</span>
              </div>
            </div>
            <div class="refund_checkbox">
              <div class="my_checkbox" @click="clickCheckbox('sell')">
                <span class="ion_checkbox" v-if="ramCheck.buy"></span>
                <span class="ion_checkbox checked" v-else></span>
                <span class="checkbox_text">{{$t('assets.sell')}}</span>
              </div>
            </div>
          </div>
          <div class="balance">{{$t('assets.balance')}}: {{balance}}</div>
          <!-- 购买ram -->
          <div class="action_input" v-if="ramCheck.buy">
            <div>{{$t('assets.buy')}} {{$t('assets.ram')}}</div>
            <input type="text" class="text-input" :placeholder="$t('assets.input_eos_amount')" v-model="buyAmount" />
            <!-- <span class="reclaimable" v-if="!cpuNetCheck.delegate">{{$t('assets.reclaimable')}}: {{cpu.self_delegate}}</span> -->
          </div>
          <!-- 出售ram -->
          <div class="action_input" v-else>
            <div>{{$t('assets.sell')}} {{$t('assets.ram')}}</div>
            <input type="text" class="text-input" :placeholder="$t('assets.ipt_ram_amount')" v-model="sellAmount" />
            <!-- <span class="reclaimable" v-if="!cpuNetCheck.delegate">{{$t('assets.reclaimable')}}: {{cpu.self_delegate}}</span> -->
          </div>
          <div class="receiver_account" v-if="ramCheck.buy">
            <div style="position: relative;">
              <span>{{$t('assets.receiver_account')}}</span>
              <div class="radio_group">
                <label class="radio-button radio-button--material my_radio" :style="{color: radioType.ram === 'self' ? '#0076ff':'#37474f'}">
                  <input type="radio" class="radio-button__input radio-button--material__input" name="self" value="self" v-model="radioType.ram">
                  <div class="radio-button__checkmark radio-button--material__checkmark receiver_radio"></div>
                  {{$t('assets.to_self')}}
                </label>
                <label class="radio-button radio-button--material my_radio" :style="{color: radioType.ram === 'others' ? '#0076ff':'#37474f'}">
                  <input type="radio" class="radio-button__input radio-button--material__input" name="others" value="others" v-model="radioType.ram">
                  <div class="radio-button__checkmark radio-button--material__checkmark receiver_radio"></div>
                  {{$t('assets.to_others')}}
                </label>
              </div>
            </div>
            <div v-if="radioType.ram === 'others'" class="align_center contacts">
              <img src="@/assets/img/contacts.png" style="height: 16px;">
              <span class="line"></span>
              <input type="text" class="text-input" :placeholder="$t('assets.receiver_account')" maxlength="12" v-model="otherAccount">
            </div>
          </div>
          <!-- 按钮 -->
          <div class="btn" v-if="ramCheck.buy">
            <span class="btn_buy" @click="ramBtn('buy')">{{$t('assets.btn_buy')}}</span>
          </div>
          <div class="btn" v-else>
            <span class="btn_sell" @click="ramBtn('sell')">{{$t('assets.btn_sell')}}</span>
          </div>
        </div>
        <v-ons-dialog
          modifier="width_pwd"
          cancelable
          style="background-color: rgba(0, 0, 0, .5);"
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
import eos from '@/plugins/eos'
import MyPage from '@/components/MyPage'
import MDialog from '@/components/MDialog'
import PasswordService from '@/services/PasswordService'
import CryptoAES from '@/util/CryptoAES'
import Decimal from 'decimal.js'

export default {
  components: {
    vpage: MyPage,
    MDialog
  },
  props: {
    tabIndex: {
      type: Number
    }
  },
  data () {
    return {
      checkbox: 'buy',
      ramCheck: {
        buy: true
      },
      radioType: {
        ram: 'self'
      },
      net: {
        net_weight: '0.0000 EOS',
        available: '0.00',
        max: '0.00',
        price: '0.00',
        self_delegate: '0 EOS',
        other_delegate: '0 EOS',
        progress: 0
      },
      ram: {
        quota: '0.00',
        unusage: '0.00',
        price: '0.00',
        progress: 0
      },
      buyAmount: '',
      sellAmount: '',
      balance: '',
      otherAccount: '',
      password: '',
      accountInfo: null,
      loading: false,
      showDialog: false
    }
  },
  // created () {
  //   if (this.accountInfo.account_name) this.initData()
  // },
  watch: {
    tabIndex() {
      if (this.tabIndex === 1) {
        console.log('ram',this.tabIndex)
        this.initData()
      }
    },
    showDialog(newVal, oldVal) {
      if (!newVal) this.password = ''
    }
  },
  methods: {
    goAction(privateKey) {
      this.showDialog = false
      if (this.ramCheck.buy) {
        // 购买
        this.buyRam(privateKey)
      } else {
        // 出售
        this.sellRam(privateKey)
      }
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
            that.goAction(privateKey)
          }
          function encryptErrorCallback(err) {
  
          }
        } else {
          that.goAction(privateKey)
        }
      } else {
        this.loading = false
        this.$toast(this.$t('common.wrong_pwd'))
      }
    },
    handleCancel() {
      this.showDialog = false
    },
    async buyRam(privateKey) {
      try {
        const receiver = this.radioType.ram === 'self' ? this.accountInfo.account_name : this.otherAccount
        const quant = Decimal(this.buyAmount).toFixed(4) + ' EOS'
        const res = await eos.transaction(tr => {
          tr.buyram({
            payer: this.accountInfo.account_name,
            receiver: receiver,
            quant: quant
          })
        }, {keyProvider: privateKey})
        if (res.transaction_id) {
          const text = this.$i18n.locale === 'en' ? `${this.$t('assets.buy')} ${this.$t('common.success')}` : `${this.$t('assets.buy')}${this.$t('common.success')}`
          this.$toast(text)
          // this.$emit('refresh')
          this.updateData()
        }
      } catch (error) {
        console.log(error)
        error = JSON.parse(error)
        if (error.error.code == 3080004) {

        }
        if (error.error.code == 3050003) {
          this.$toast(this.$t('common.overdrawn_balance'))
        }
      }
      this.loading = false
    },
    async sellRam(privateKey) {
      try {
        const res = await eos.transaction(tr => {
          tr.sellram({
            account: this.accountInfo.account_name,
            bytes: Math.floor(Decimal(this.sellAmount).toNumber()*1024)
          })
        }, {keyProvider: privateKey})
        if (res.transaction_id) {
          const text = this.$i18n.locale === 'en' ? `${this.$t('assets.sell')} ${this.$t('common.success')}` : `${this.$t('assets.sell')}${this.$t('common.success')}`
          this.$toast(text)
          // this.$emit('refresh')
          this.updateData()
        }
      } catch (error) {
        console.log(error)
        error = JSON.parse(error)
        this.$toast(error.error.code)
      }
      this.loading = false
    },
    updateData() {
      setTimeout(() => {
        eos.getAccount(this.$store.state.wallet.assets.account).then(res => {
          this.accountInfo = res
        })
      }, 1000);
    },
    async initData() {
      this.buyAmount = ''
      this.sellAmount = ''
      this.otherAccount = ''
      try {
        const res = await eos.getAccount(this.$route.query.account)
        this.accountInfo = res
        console.log(res)
      } catch (error) {
        console.log(error)
      }
      const res = this.accountInfo
      this.balance = res.core_liquid_balance
      // RAM剩余
      const quota = (res.ram_quota/1024).toFixed(2)
      const usage = (res.ram_usage/1024).toFixed(2)
      this.ram.quota = quota
      this.ram.unusage = (quota - usage).toFixed(2)
      setTimeout(() => {
        this.ram.progress = this.ram.unusage / quota * 100
      }, 20);
      try {
        const market = await eos.getTableRows({"json": true,"code": "eosio","scope":"eosio","table":"rammarket"})
        const ramMarket = market.rows[0]
        // const base = (Number(ramMarket.base.balance.split(' ')[0]) / 1024 / 1024 / 1024).toFixed(2)
        const price = ramMarket.quote.balance.split(' ')[0] / (1+ramMarket.base.balance.split(' ')[0] / 1024)
        this.ram.price = price.toFixed(6)
        console.log(this.ram.price)
      } catch (error) {
        console.log(error)
      }
    },
    clickCheckbox(type) {
      if (type === this.checkbox) return
      this.checkbox = type
      this.ramCheck.buy = !this.ramCheck.buy
    },
    changeCheck(e) {
      // console.log(e.target.name)
      const name = e.target.name;
      if (name === 'buy' || name === 'sell') {
        if (this.ramCheck[name]) {
          Object.keys(this.ramCheck).map((key)=>{
            if(key != name) {
              this.ramCheck[key] = false;
            }
          })
        }
      }
    },
    ramBtn(type) {
      if (type === 'buy') {
        if (!this.buyAmount) {
          const text = this.$i18n.locale === 'en' ? `${this.$t('common.input')} ${this.$t('assets.btn_buy')} ${this.$t('common.amount')}` : `${this.$t('common.input')}购买${this.$t('common.amount')}`
          this.$toast(text)
          return
        }
        if (this.radioType.ram === 'others') {
          if (!this.otherAccount) {
            const text = this.$i18n.locale === 'en' ? `${this.$t('common.input')} ${this.$t('assets.receiver')} ${this.$t('common.amount')}` : `${this.$t('common.input')}接收账号`
            this.$toast(text)
            return
          }
        }
        this.showDialog = true
      }
      if (type === 'sell') {
        if (!this.sellAmount) {
          const text = this.$i18n.locale === 'en' ? `${this.$t('common.input')} ${this.$t('assets.btn_sell')} ${this.$t('common.amount')}` : `${this.$t('common.input')}出售${this.$t('common.amount')}`
          this.$toast(text)
        } else {
          const that = this
          if (this.$store.state.wallet.fingerprintToken) {
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
                      that.goAction(privateKey)
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
        }
      }
    }
  },
}
</script>

<style scoped>
.align_center {
  display: flex;
  align-items: center;
}
.flex_col {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.resource_card {
  margin-top: 24px;
  background-color: #fff;
  padding: 34px 56px 20px 56px;
}
.resource_type {
  font-weight: bolder;
  font-size: 40px;
}
.resource_price {
  flex: 1;
  text-align: right;
  font-size: 24px;
}
.resource_remaining {
  margin: 15px 0;
  background-color: #fc8184;
  color: #fff;
  text-align: center;
  border-radius: 10px;
  font-size: 24px;
  font-weight: 450;
  position: relative;
  height: 34px;
}
.remaining_text {
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.remaining_progress {
  display: inline-block;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0;
  border-radius: 10px;
  background-color: #ec565a;
  transition-property: width;
  transition-duration: .3s;
  -webkit-transition-property: width;
  -webkit-transition-duration: .3s;
}
.action_checkbox {
  padding: 0 10px 10px 10px;
  font-size: 30px;
  /* border-bottom: 1px solid rgb(241, 240, 240); */
}
.delegate_checkbox {
  flex: 1;
}
.refund_checkbox {
  text-align: right;
  flex: 1;
}
.balance {
  margin-top: 24px;
  font-size: 22px;
}
.my_checkbox {
  margin-left: 10vw;
  display: flex;
  align-items: center;
}
.ion_checkbox {
  width: 45px;
  height: 45px;
  border: 1PX solid #acacac;
  border-radius: 5px;
  box-sizing: border-box;
}
.checkbox_text {
  font-size: 30px;
  margin-left: 20px;
}
.my_checkbox .checked {
  background-size: 45px 45px;
  background-image: url('~@/assets/img/resource_check.png');
  border: none;
}
.action_input {
  position: relative;
  margin-top: 20px;
  padding: 10px 0;
  display: flex;
  align-items: center;
  font-size: 30px;
}
.action_input input {
  flex: 1;
  height: 100%;
  margin-left: 40px;
  font-size: 26px;
  padding: 12px 22px;
  border-bottom: 1PX solid #e2e2e2;
}
.receiver_account {
  padding: 15px 0;
  position: relative;
  font-size: 30px;
  border-bottom: 1PX solid #e2e2e2;
}
.radio_group {
  position: absolute;
  right: 15px;
  top: 10px;
  display: inline-block;
}
.receiver_radio, .receiver_radio:before {
  width: 22px;
  height: 22px;
  top: 1px;
}
.receiver_radio:before {
  border: 1PX solid #37474f;
}
:checked + .receiver_radio:before {
  border: 1PX solid #5789e4;
}
.receiver_radio:after {
  top: 7px;
  left: 5px;
  width: 10px;
  height: 10px;
}
:checked + .receiver_radio:after {
  background: #5789e4;
}
.my_radio {
  font-size: 26px;
  margin-left: 15px;
}
.contacts {
  margin-top: 10px;
  display: flex;
  align-items: center;
}
.contacts .line {
  width: 1PX;
  height: 15px;
  margin: 0 8px;
  background-color: rgb(204, 204, 204);
}
.contacts input {
  flex: 1;
}
.lease_transfer {
  display: inline-block;
}
.lease_transfer span {
  padding: 5px 10px;
  font-size: 13px;
  font-weight: 450;
  box-sizing: border-box;
}
.lease_transfer .lease {
  color: grey;
  background-color: rgb(245, 245, 245);
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}
.lease_transfer .transfer {
  color: grey;
  background-color: rgb(245, 245, 245);
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
.lease_transfer .lt_active {
  background-color: #0076ff;
  color: #fff;
}
.btn {
  padding: 30px 84px;
  margin-top: 30px;
}
.btn span {
  display: block;
  padding: 20px 0;
  border-radius: 15px;
  font-size: 36px;
  color: #fff;
  text-align: center;
}
.btn_buy {
  background-color: #ec565a;
}
.btn_sell {
  background-color: #5789e3;
}
</style>
