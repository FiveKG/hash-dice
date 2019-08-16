<template>
  <vpage>
    <slot>
      <div>
        <!-- 抵押CPU -->
        <div class="resource_card">
          <div class="align_center card_header">
            <div class="resource_type">CPU</div>
            <div class="resource_price">{{$t('assets.price')}}: {{cpu.price}} EOS/ms/Day</div>
          </div>
          <div class="resource_remaining">
            <span class="remaining_progress" :style="{width: cpu.progress+'%'}"></span>
            <span class="remaining_text">{{$t('assets.remaining')}}: {{cpu.available}} ms / {{cpu.max}} ms</span>
          </div>
          <v-ons-row class="resource_delegate">
            <v-ons-col>
              <div>{{$t('assets.total_delegate')}}</div>
              <div class="total_delegate">{{cpu.cpu_weight}}</div>
            </v-ons-col>
            <v-ons-col class="self_other">
              <div>{{$t('assets.self_delegate')}}: {{cpu.self_delegate}}</div>
              <div>{{$t('assets.other_delegate')}}: {{cpu.other_delegate}}</div>
            </v-ons-col>
          </v-ons-row>
        </div>
        <div class="resource_card">
          <div class="align_center card_header">
            <div class="resource_type">NET</div>
            <div class="resource_price">{{$t('assets.price')}}: {{net.price}} EOS/kb/Day</div>
          </div>
          <div class="resource_remaining">
            <span class="remaining_progress" :style="{width: net.progress+'%'}"></span>
            <span class="remaining_text">{{$t('assets.remaining')}}: {{net.available}} KB / {{net.max}} KB</span>
          </div>
          <v-ons-row class="resource_delegate">
            <v-ons-col>
              <div>{{$t('assets.total_delegate')}}</div>
              <div class="total_delegate">{{net.net_weight}}</div>
            </v-ons-col>
            <v-ons-col class="self_other">
              <div>{{$t('assets.self_delegate')}}: {{net.self_delegate}}</div>
              <div>{{$t('assets.other_delegate')}}: {{net.other_delegate}}</div>
            </v-ons-col>
          </v-ons-row>
        </div>
        <div class="resource_card">
          <div class="align_center card_header">
            <div class="resource_type">{{$t('assets.refunding')}}</div>
          </div>
          <div class="align_center" style="margin-top: 10px;">
            <div class="refunding_text">
              <div>CPU: {{cpu.refunding}}</div>
              <div>NET: {{net.refunding}}</div>
            </div>
            <div class="refunding_text" style="text-align: right;">{{refundTime ? `End of: ${refundTime.refundDay}D ${refundTime.refundHour}H ${refundTime.refundMinute}M` : 'No refund'}}</div>
          </div>
        </div>
        <div class="resource_card">
          <!-- 单选框 -->
          <div class="action_checkbox align_center">
            <div class="delegate_checkbox">
              <div class="my_checkbox" @click="clickCheckbox('delegate')">
                <span class="ion_checkbox checked" v-if="cpuNetCheck.delegate"></span>
                <span class="ion_checkbox" v-else></span>
                <span class="checkbox_text">{{$t('assets.delegate')}}</span>
              </div>
              
            </div>
            <div class="refund_checkbox align_center">
              <div class="my_checkbox" @click="clickCheckbox('refund')">
                <span class="ion_checkbox" v-if="cpuNetCheck.delegate"></span>
                <span class="ion_checkbox checked" v-else></span>
                <span class="checkbox_text">{{$t('assets.refund')}}</span>
              </div>
              <div class="delegate_list"></div>
              <!-- {{$t('assets.delegate_list')}} -->
            </div>
          </div>
          <div class="balance">{{$t('assets.balance')}}: {{balance}}</div>
          <!-- 抵押/赎回CPU -->
          <div class="action_input">
            <div>{{delegateOrRefund}} CPU</div>
            <input type="text" class="text-input" :placeholder="$t('assets.input_eos_amount')" v-model="cpuAmount" />
            <!-- <span class="reclaimable" v-if="!cpuNetCheck.delegate">{{$t('assets.reclaimable')}}: {{cpu.self_delegate}}</span> -->
          </div>
          <!-- 抵押/赎回NET -->
          <div class="action_input">
            <div>{{delegateOrRefund}} NET</div>
            <input type="text" class="text-input" :placeholder="$t('assets.input_eos_amount')" v-model="netAmount" />
            <!-- <span class="reclaimable" v-if="!cpuNetCheck.delegate">{{$t('assets.reclaimable')}}: {{net.self_delegate}}</span> -->
          </div>
          <div class="receiver_account">
            <div style="position: relative;">
              <span>{{cpuNetCheck.delegate ? $t('assets.receiver_account'):$t('assets.retrieve_account')}}</span>
              <div class="radio_group">
                <label class="radio-button radio-button--material my_radio" :style="{color: radioType.cpuNet === 'self' ? '#0076ff':'#37474f'}">
                  <input type="radio" class="radio-button__input radio-button--material__input" name="self" value="self" v-model="radioType.cpuNet">
                  <div class="radio-button__checkmark radio-button--material__checkmark receiver_radio"></div>
                  <!-- <div class="radio_self"></div> -->
                  {{$t('assets.to_self')}}
                </label>
                <label class="radio-button radio-button--material my_radio" :style="{color: radioType.cpuNet === 'others' ? '#0076ff':'#37474f'}">
                  <input type="radio" class="radio-button__input radio-button--material__input" name="others" value="others" v-model="radioType.cpuNet">
                  <div class="radio-button__checkmark radio-button--material__checkmark receiver_radio"></div>
                  {{$t('assets.to_others')}}
                </label>
              </div>
            </div>
            <div v-if="radioType.cpuNet === 'others'" class="align_center contacts">
              <img src="@/assets/img/contacts.png" style="height: 16px;">
              <span class="line"></span>
              <input type="text" class="text-input" :placeholder="cpuNetCheck.delegate ? $t('assets.receiver_account'):$t('assets.retrieve_account')" maxlength="12" v-model="otherAccount">
              <div class="lease_transfer" v-if="cpuNetCheck.delegate">
                <span class="lease" :class="!isTransfer ? 'lt_active':''" @click="isTransfer = false">{{$t('assets.lease')}}</span>
                <span class="transfer" :class="isTransfer ? 'lt_active':''" @click="isTransfer = true">{{$t('assets.resource_transfer')}}</span>
              </div>
            </div>
          </div>
          <div class="btn">
            <span @click="cpuNetBtn">{{delegateOrRefund}}</span>
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
import MyPage from '@/components/MyPage'
import MDialog from '@/components/MDialog'
import PasswordService from '@/services/PasswordService'
import CryptoAES from '@/util/CryptoAES'
import { Decimal } from 'decimal.js'
import { format, parse } from 'date-fns'
import eos from '@/plugins/eos'

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
      delegateOrRefund: this.$t('assets.delegate'),
      checkbox: 'delegate',
      cpuNetCheck: {
        delegate: true,
      },
      radioType: {
        cpuNet: 'self'
      },
      cpu: {
        cpu_weight: '0.0000 EOS',
        available: '0.00',
        max: '0.00',
        price: '0.00',
        self_delegate: '0 EOS',
        other_delegate: '0 EOS',
        refunding: '0 EOS',
        progress: 0
      },
      net: {
        net_weight: '0.0000 EOS',
        available: '0.00',
        max: '0.00',
        price: '0.00',
        self_delegate: '0 EOS',
        other_delegate: '0 EOS',
        refunding: '0 EOS',
        progress: 0
      },
      balance: '',
      otherAccount: '',
      cpuAmount: '',
      netAmount: '',
      password: '',
      refundTime: null,
      accountInfo: null,
      isTransfer: false,
      loading: false,
      showDialog: false,
    }
  },
  created () {
    console.log('cpu create')
    this.initData()
  },
  watch: {
    tabIndex() {
      if (this.tabIndex === 0) {
        this.cpu.progress = 0
        this.net.progress = 0
        this.initData()
        console.log('cpu')
      }
    },
    showDialog(newVal, oldVal) {
      if (!newVal) this.password = ''
    }
  },
  methods: {
    goAction(privateKey) {
      this.showDialog = false
      if (this.cpuNetCheck.delegate) {
        // 抵押
        this.delegateEos(privateKey)
      } else {
        // 赎回
        this.refundEos(privateKey)
      }
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
    async verifyPassword() {
      this.loading = true
      const seed = await PasswordService.encrypt(this.password)
      const assets = this.$store.state.wallet.assets
      const privateKey = CryptoAES.decrypt(assets.privateKey,seed)
      return privateKey
    },
    async delegateEos(privateKey) {
      const stake_cpu_quantity = this.cpuAmount ? Decimal(this.cpuAmount).toFixed(4) + ' EOS' : '0.0000 EOS'
      const stake_net_quantity = this.netAmount ? Decimal(this.netAmount).toFixed(4) + ' EOS' : '0.0000 EOS'
      const receiver = this.radioType.cpuNet === 'self' ? this.accountInfo.account_name : this.otherAccount
      console.log(stake_cpu_quantity,stake_net_quantity,receiver)
      try {
        const res = await eos.transaction(tr => {
          tr.delegatebw({
            from: this.accountInfo.account_name,
            receiver: receiver,
            stake_cpu_quantity: stake_cpu_quantity,
            stake_net_quantity: stake_net_quantity,
            transfer: this.radioType.cpuNet === 'self' ? 0 : this.isTransfer ? 1 : 0
          })
        }, {keyProvider: privateKey})
        if (res.transaction_id) {
          const text = this.$i18n.locale === 'en' ? `${this.delegateOrRefund} ${this.$t('common.success')}` : `${this.delegateOrRefund}${this.$t('common.success')}`
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
    async refundEos(privateKey) {
      const unstake_cpu_quantity = this.cpuAmount ? Decimal(this.cpuAmount).toNumber() + ' EOS' : '0.0000 EOS'
      const unstake_net_quantity = this.netAmount ? Decimal(this.netAmount).toNumber() + ' EOS' : '0.0000 EOS'
      const receiver = this.radioType.cpuNet === 'self' ? this.accountInfo.account_name : this.otherAccount
      try {
        const res = await eos.transaction(tr => {
          tr.undelegatebw({
            from: this.accountInfo.account_name,
            receiver: receiver,
            unstake_cpu_quantity: unstake_cpu_quantity,
            unstake_net_quantity: unstake_net_quantity
          })
        }, {keyProvider: privateKey})
        if (res.transaction_id) {
          const text = this.$i18n.locale === 'en' ? `${this.delegateOrRefund} ${this.$t('common.success')}` : `${this.delegateOrRefund}${this.$t('common.success')}`
          this.$toast(text)
          // this.$emit('refresh')
          this.updateData()
        }
      } catch (error) {
        console.log(error)
        error = JSON.parse(error)
        if (error.error.code == 3080004) {

        }
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
      this.cpuAmount = ''
      this.netAmount = ''
      this.otherAccount = ''
      this.isTransfer = false
      this.loading = true
      try {
        const res = await eos.getAccount(this.$route.query.account)
        this.accountInfo = res
        console.log(res)
      } catch (error) {
        console.log(error)
      }
      this.loading = false
      const res = this.accountInfo
      this.balance = res.core_liquid_balance
      let cpu_limit = res.cpu_limit
      let net_limit = res.net_limit
      let total_resources = res.total_resources
      // cpu总抵押
      this.cpu.cpu_weight = total_resources.cpu_weight
      // net总抵押
      this.net.net_weight = total_resources.net_weight
      // cpu可用
      this.cpu.available = (cpu_limit.available /1000).toFixed(2)
      // cpu总量
      this.cpu.max = (cpu_limit.max /1000).toFixed(2)
      // net可用
      this.net.available = (net_limit.available /1000).toFixed(2)
      // net总量
      this.net.max = (net_limit.max /1000).toFixed(2)
      setTimeout(() => {
        this.cpu.progress = cpu_limit.available /cpu_limit.max *100
        this.net.progress = net_limit.available /net_limit.max *100
      }, 50);
      // 自身抵押
      if (res.self_delegated_bandwidth) {
        const self_delegated_bandwidth = res.self_delegated_bandwidth
        this.cpu.self_delegate = self_delegated_bandwidth.cpu_weight
        this.net.self_delegate = self_delegated_bandwidth.net_weight
        // 计算他人抵押
        this.cpu.other_delegate = Decimal.sub(parseFloat(total_resources.cpu_weight.split(' ')[0]),parseFloat(self_delegated_bandwidth.cpu_weight.split(' ')[0])).toNumber() + ' EOS'
        this.net.other_delegate = Decimal.sub(parseFloat(total_resources.net_weight.split(' ')[0]),parseFloat(self_delegated_bandwidth.net_weight.split(' ')[0])).toNumber() + ' EOS'
      } else {
        this.cpu.other_delegate = total_resources.cpu_weight
        this.net.other_delegate = total_resources.net_weight
      }
      //抵押CPU的EOS数量
      const cpuBalance = res.cpu_weight / 10000
      //CPU贷款的总量
      const cpuTotal = res.cpu_limit.max / 1024
      // CPU价格
      this.cpu.price = (cpuBalance / cpuTotal).toFixed(4)
      //抵押NET的EOS数量
      const netBalance = res.net_weight / 10000
      //NET贷款的总量
      const netTotal = res.net_limit.max / 1024
      // NET价格
      this.net.price = (netBalance / netTotal).toFixed(4)
      // 正在赎回
      if (res.refund_request) {
        this.cpu.refunding = res.refund_request.cpu_amount
        this.net.refunding = res.refund_request.net_amount
        // 请求时间
        const requestTimestamp = Number(format(this.convertUTCDateToLocalDate(new Date(res.refund_request.request_time)), 'x'))
        // 到期毫秒数
        const expiredTimestamp = requestTimestamp+3*24*60*60*1000
        // 时间差
        const dateDiff = expiredTimestamp - Date.now()
        // 剩余天数
        const refundDay = Decimal.div(dateDiff, 24*60*60*1000).toFixed(0)
        // 计算天数后剩余的毫秒数
        const leave1 = dateDiff%(24*3600*1000)
        // 剩余小时
        const refundHour = Math.floor(leave1/(3600*1000))
        //计算小时数后剩余的毫秒数
        const leave2=leave1%(3600*1000)
        // 剩余分钟
        const refundMinute = Math.floor(leave2/(60*1000))
        this.refundTime = {
          refundDay,
          refundHour,
          refundMinute
        }
        // console.log('format',format(this.convertUTCDateToLocalDate(new Date(res.refund_request.request_time)), 'YYYY-MM-DD HH:mm:ss'),leave1,leave2,refundDay,refundHour,refundMinute)
      }
    },
    convertUTCDateToLocalDate(date) {
      let newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

      let offset = date.getTimezoneOffset() / 60;
      let hours = date.getHours();

      newDate.setHours(hours - offset);

      return newDate;   
    },
    clickCheckbox(type) {
      if (type === this.checkbox) return
      this.checkbox = type
      this.cpuNetCheck.delegate = !this.cpuNetCheck.delegate
      if (this.cpuNetCheck.delegate) {
        this.delegateOrRefund = this.$t('assets.delegate')
      } else {
        this.delegateOrRefund = this.$t('assets.refund')
      }
    },
    changeCheck(e) {
      // console.log(e.target.name)
      const name = e.target.name;
      if (name === 'delegate' || name === 'refund') {
        if (name === 'delegate') {
          this.delegateOrRefund = this.$t('assets.delegate')
        }
        if (name === 'refund') {
          this.delegateOrRefund = this.$t('assets.refund')
        }
        if (this.cpuNetCheck[name]) {
          Object.keys(this.cpuNetCheck).map((key)=>{
            if(key != name) {
              this.cpuNetCheck[key] = false;
            }
          })
        }
      }
    },
    cpuNetBtn() {
      if (!this.cpuAmount && !this.netAmount) {
        const text = this.$i18n.locale === 'en' ? `${this.$t('common.input')} ${this.delegateOrRefund} ${this.$t('common.amount')}` : `${this.$t('common.input')}${this.delegateOrRefund}${this.$t('common.amount')}`
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
}
</script>

<style scoped>
.align_center {
  display: flex;
  align-items: center;
}
.resource_card {
  margin-top: 24px;
  background-color: #fff;
  padding: 34px 56px 15px 56px;
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
.self_other {
  text-align: right;
  font-size: 26px;
  color: grey;
  font-weight: 450;
}
.resource_delegate {
  font-size: 26px;
  margin-top: 50px;
  line-height: 1.5;
}
.total_delegate {
  font-weight: bold;
  font-size: 30px;
}
.refunding_text {
  flex: 1;
  font-size: 24px;
  line-height: 1.5;
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
.delegate_list {
  margin-top: 24px;
  font-size: 22px;
  color: #5789e4;
}
.action_input {
  position: relative;
  padding: 10px 0;
  /* border-bottom: 1px solid rgb(241, 240, 240); */
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
.reclaimable {
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 13px;
}
.sell_ram {
  color: rgb(119, 118, 118);
  font-weight: 450;
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
.btn {
  padding: 30px 84px;
}
.btn span {
  display: block;
  padding: 20px 0;
  border-radius: 15px;
  font-size: 36px;
  color: #fff;
  background-color: #ec565a;
  text-align: center;
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
.radio_self {
  display: inline-block;
  width: 5px;
  height: 20px;
  background-color: #0076ff;
}
</style>
