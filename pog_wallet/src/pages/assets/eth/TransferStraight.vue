<template>
  <vpage>
    <slot>
      <div>
        <div class="page_header">
          <img class="ion_back" src="@/assets/img/back.png" @click="back"> 
          <span>{{$t('assets.transfer')}}</span>
        </div>
        <v-ons-row class="receiver">
          <span>收款地址</span>
          <input type="text" class="text-input" :placeholder="'输入或粘贴钱包地址'" v-model="to">
        </v-ons-row>
        <div class="item_layout">
          <v-ons-row class="item">
            <span>{{$t('assets.transfer_amount')}}</span>
            <input type="text" class="text-input" :placeholder="$t('assets.transfer_amount_ipt')" maxlength="12" v-model="amount">
            <div class="symbol" @click="clickToken"> <span>{{token}}</span> <img src="@/assets/img/transfer_arrow.png"> </div>
          </v-ons-row>
          <v-ons-row class="item">
            <span>钱包余额</span>
            <div class="balance">{{balance}} {{token}}</div>
          </v-ons-row>
          <!-- <v-ons-row class="item">
            <span>Memo</span>
            <input type="text" class="text-input" placeholder="memo" maxlength="12" v-model="memo">
          </v-ons-row> -->
        </div>
        <div class="gas_fee" v-if="token === 'ETH'">
          <div class="gas_item">
            <span>矿工费</span>
            <span class="gas_price">{{gasAmount}} ETH</span>
          </div>
          <div>
            <vue-slider v-model="gasAmount" tooltip="none" v-bind="sliderOptions" />
            <span>{{gasAmount}} ETH</span>
          </div>
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
import { Decimal } from 'decimal.js'
import {ethers} from 'ethers'
import {getabi} from '@/servers/eth'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

export default {
  components: {
    vpage: MyPage,
    vheader: MyHeader,
    MDialog,
    VueSlider
  },
  data () {
    return {
      token: 'ETH',
      balance: '',
      from: '',
      to: '',//0x6Eb1B8a1700915c78f30c020B58561157dC892a0 0x1fc135E1Fef4c9982886485d77Ac54DC1118AFAA
      amount: '',
      memo: '',
      address: '',
      contract: '',
      password: '',
      gasAmount: 0.00021,
      loading: false,
      showDialog: false,
      sliderOptions: {
        interval: 0.00001,
        min: 0.00021,
        max: 0.00348
      }
    }
  },
  created() {
    console.log(this.$store.state.wallet.assets, this.$route.query.content)
    if (this.$route.query.to) {
      this.to = this.$route.query.to
    }
    this.getBalance()
    if (this.$route.query.content) {
      // 扫码转账
      const obj = JSON.parse(this.$route.query.content)
      this.to = obj.address
      this.amount = obj.amount
    }
  },
  methods: {
    async getBalance() {
      const provider = ethers.getDefaultProvider(this.ethNet)
      this.from = this.$store.state.wallet.assets.address
      const selectToken = this.$store.state.wallet.selectEthToken
      if (selectToken.symbol === 'ETH') {
        provider.getBalance(this.from).then(balance => {
          const estr = ethers.utils.formatEther(balance);
          console.log('getBalance',estr)
          this.balance = estr
        })
      } else {
        this.token = selectToken.symbol
        this.address = selectToken.address
        getabi({address: this.address}).then(async res => {
          // console.log('getabi',res)
          if (res.message === 'OK') {
            const abi = JSON.parse(res.result)
            console.log('abi',abi)
            const contract = new ethers.Contract(this.address,abi,provider)
            console.log(contract)
            const balance = await contract.balanceOf(this.from)
            this.balance = ethers.utils.formatEther(balance)
            console.log(ethers.utils.formatEther(balance))
          }
        })
      }
    },
    async goTransfer(privateKey) {
      const provider = ethers.getDefaultProvider(this.ethNet)
      const wallet = new ethers.Wallet(privateKey, provider)
      console.log(privateKey,wallet)
      const amount = ethers.utils.parseEther(this.amount)
      if (this.token === 'ETH') {
        let tx = {
          to: this.to,
          value: amount,
          gasLimit: 21000,
          gasPrice: ethers.utils.parseEther(this.gasAmount+'').div(ethers.utils.bigNumberify(21000)).toNumber(),
        }
        wallet.sendTransaction(tx).then(res => {
          console.log(res)
          this.$toast('转账成功')
          this.loading = false
          this.showDialog = false
          this.amount = ''
          setTimeout(() => {
            this.getBalance()
          }, 1000);
        }).catch(err => {
          console.log(err)
        })
      } else {
        getabi({address: this.address}).then(async res => {
          // console.log('getabi',res)
          if (res.message === 'OK') {
            const abi = JSON.parse(res.result)
            const contract = new ethers.Contract(this.address,abi,provider)
            const contractWithSigner = contract.connect(wallet)
            try {
              const tx = await contractWithSigner.transfer(this.to, amount)
              this.$toast('转账成功')
              this.loading = false
              this.showDialog = false
              this.amount = ''
            } catch (error) {
              console.log(error)
            }
          }
        })
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
            that.goTransfer(privateKey)
          }
          function encryptErrorCallback(err) {
  
          }
        } else {
          this.goTransfer(privateKey)
        }
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
    },
    clickContact() {
      
    },
    clickToken() {
      this.$router.push({
        name: 'EthSelectToken'
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
.gas_fee {
  margin-top: 22px;
  padding: 40px 56px;
  font-size: 30px;
  background-color: #fff;
}
.gas_item {
  display: flex;
  align-items: center;
}
.gas_price {
  flex: 1;
  text-align: right;
  color: gray;
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
