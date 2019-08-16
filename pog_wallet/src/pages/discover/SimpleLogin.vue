<template>
  <vpage>
    <slot>
      <div class="page_header">
        <img class="ion_back" src="@/assets/img/back_fff.png" @click="back"> 
        <span>授权登录</span>
      </div>
      <div class="dapp_header">
        <div class="dapp_logo">
          <img :src="msg.dappIcon">
        </div>
        <div class="dapp_name">{{msg.dappName}}</div>
        <div class="desc1">DApp需要您授权钱包账号信息</div>
      </div>
      <div class="dapp_content">
        <div class="desc2">授权后该应用将获得以下权限</div>
        <div class="desc3">获取您的钱包账号信任</div>
        <div class="desc4">注意：账号授权不会向DApp提供您的私钥</div>
        <div class="account_label">授权账号：</div>
        <div class="account_name">{{account}}</div>
        <div class="btn_box">
          <div class="login" @click="login">立即授权</div>
          <br>
          <div class="cancel" @click="back">取消</div>
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
import ClientSocket from '@/socket/ClientSocket'
import PasswordService from '@/services/PasswordService'
import CryptoAES from '@/util/CryptoAES'
import Eos from 'eosjs'
import axios from 'axios'

const {ecc} = Eos.modules

export default {
  components: {
    vpage: MyPage,
    MDialog
  },
  data() {
    return {
      msg: {},
      account: '',
      password: '',
      loading: false,
      showDialog: false,
    }
  },
  created() {
    console.log(this.$store.state.wallet.assets.account)
    this.account = this.$store.state.wallet.assets.account
    if (this.$route.query.content) {
        // this.msg = this.$route.query.content
        this.msg = JSON.parse(this.$route.query.content)
        // const timestamp = Date.parse( new Date())/1000
        // const data = timestamp+this.account+obj.uuID+'yzwallet'
        
        // const sign = ecc.sign(data,'5HxoWu1CUtRWjpsdoje1qd5z1WViY9U4crNmjYjG2KwdDv7Hwd2')
    }
  },
  watch: {
    showDialog(newVal, oldVal) {
      if (!newVal) {
        this.password = ''
      }
    },
  },
  methods: {
    login() {
      this.showDialog = true
    },
    handleCancel() {
      this.showDialog = false
    },
    async handleConfirm() {
      const assets = this.$store.state.wallet.assets
      this.loading = true
      try {
        const seed = await PasswordService.encrypt(this.password)
        const privateKey = CryptoAES.decrypt(assets.privateKey,seed)
        if (privateKey) {
          const timestamp = Date.now()/1000
          const data = timestamp+this.account+this.msg.uuID+'wallet'
          const sign = ecc.sign(data,privateKey)
          this.msg.timestamp = timestamp
          this.msg.sign = sign
          const params = {
            protocol: this.msg.protocol,
            version: this.msg.version,
            timestamp: this.msg.timestamp,
            sign: this.msg.sign,
            uuID: this.msg.uuID,
            account: this.msg.account,
            ref: 'wallet'
          }
          axios.post(this.msg.loginUrl, params).then(res => {
            console.log(res.data)
            if (res.data.code === 0) {
              this.$toast(this.$t('common.action_success'))
            } else {  
              this.$toast(res.error)
            }
            this.showDialog = false
          }).catch(err => {
            console.log(err)
          })
          // const conn = await ClientSocket.link()
          // const res = await ClientSocket.simpleLogin(JSON.stringify(this.msg))
          // console.log(res)
          // if (res.code === 1 && res.error) {
          //   this.$toast(res.error)
          // } else {
          //   this.$toast(this.$t('common.action_success'))
          //   this.$router.go(-1)
          // }
        } else {
          this.$toast(this.$t('common.wrong_pwd'))
        }
      } catch (error) {
        console.log('simplewallet',error)
      }
      this.loading = false
    },
    back() {
      this.$router.go(-1)
    }
  },
}
</script>

<style scoped>
.page_header {
  padding: 30px 55px;
  text-align: center;
  position: relative;
  font-size: 34px;
  background-color: #ec565a;
  color: #ffffff;
}
.ion_back {
  width: 42px;
  height: 32px;
  position: absolute;
  left: 55px;
  top: 50%;
  transform: translate(0, -50%);
}
.dapp_header {
  text-align: center;
}
.dapp_logo {
  margin-top: 80px;
}
.dapp_logo img{
  width: 150px;
  height: 150px;
}
.dapp_name {
  font-size: 30px;
  margin-top: 20px;
}
.desc1 {
  margin-top: 10px;
  font-size: 24px;
  color: #777777;
}
.dapp_content {
  padding: 0 20px;
}
.desc2 {
  margin-top: 50px;
  font-size: 24px;
  color: #777777;
}
.desc3 {
  margin-top: 20px;
  font-size: 28px;
}
.desc4 {
  margin-top: 15px;
  font-size: 24px;
}
.account_label {
  margin-top: 50px;
  font-size: 24px;
  color: #777777;
}
.account_name {
  padding: 10px 0;
  font-size: 30px;
  border-bottom: 1PX solid #dfdfdf;
}
.btn_box {
  margin-top: 50px;
  text-align: center;
}
.btn_box div {
  display: inline-block;
}
.login {
  background-color: #ec565a;
  color: #ffffff;
  font-size: 30px;
  border-radius: 50px;
  padding: 15px 0;
  min-width: 50vw;
}
.cancel {
  margin-top: 20px;
  color: #ec565a;
  font-size: 30px;
  border: 2px solid #ec565a;
  border-radius: 50px;
  padding: 15px 0;
  min-width: 50vw;
}
</style>
