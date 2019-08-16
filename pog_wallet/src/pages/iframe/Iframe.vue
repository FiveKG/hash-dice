<template>
  <v-ons-page>
    <div class="layout">
      <!-- <div class="page_header">
        <img class="ion_back" src="@/assets/img/back.png" @click="back"> 
        <span>{{name}}</span>
      </div> -->
      <iframe id="show-iframe" frameborder="0" scrolling="auto" :src="url"></iframe>
    </div>
    
    <v-ons-dialog
      modifier="width_pwd"
      style="background-color: rgba(0, 0, 0, .5);z-index: 10000;"
      :visible.sync="showSignature">
      <div>
        <div class="alert-dialog-title verify_title">{{$t('discover.sign_request')}}</div>
        <div class="sign_layout">
          <div class="authorization">{{signMessage.authorization ? `${signMessage.authorization[0].actor}@${signMessage.authorization[0].permission}` : ''}}</div>
          <div class="contract_action">合约 → 操作</div>
          <div class="sign_data">
            <div style="font-weight:bold;">{{signMessage.code}}→{{signMessage.type}}</div>
            <div class="sign_item">
              <div>from</div>
              <div style="flex:1;">{{signMessage.data.from}}</div>
            </div>
            <div class="sign_item">
              <div>to</div>
              <div style="flex:1;">{{signMessage.data.to}}</div>
            </div>
            <div class="sign_item">
              <div>quantity</div>
              <div style="flex:1;">{{signMessage.data.quantity}}</div>
            </div>
            <div class="sign_item">
              <div style="flex:1;">{{signMessage.data.memo}}</div>
            </div>
          </div>
        </div>
        <div class="btn_layout">
          <div class="cancel">
            <span @click="signCancel">{{$t('common.cancel')}}</span>
          </div>
          <div class="confirm">
            <span @click="signConfirm">{{$t('common.confirm')}}</span>
          </div>
        </div>
      </div>
    </v-ons-dialog>
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
  </v-ons-page>
</template>

<script>
import MDialog from '@/components/MDialog'
import ClientSocket from '@/socket/ClientSocket'
import PasswordService from '@/services/PasswordService'
import CryptoAES from '@/util/CryptoAES'
import Eos from 'eosjs'

const {ecc} = Eos.modules

export default {
  components: {
    MDialog
  },
  data() {
    return {
      url: '',
      name: '',
      password: '',
      success: false,
      loading: false,
      showSignature: false,
      showDialog: false,
      signMessage: {
        authorization: null,
        data: {}
      }
    }
  },
  watch: {
    '$store.state.wallet.signatureData'(newVal) {
      console.log(newVal)
      if (!newVal) return
      this.signMessage = newVal[0]
      this.signMessage.data.memo = newVal[0].data.memo.substr(0, 22)
      this.showSignature = true
    },
    showDialog(newVal, oldVal) {
      if (!newVal) {
        this.password = ''
      }
      // if (newVal) {
      //   this.success = false
      // } else {
      //   this.$store.commit('wallet/setShowDialog',false)
      //   this.password = ''
      //   if (!this.success) {
      //     ClientSocket.link().then(conn => {
      //       if (conn) {
      //         ClientSocket.signTranstion('')
      //       }
      //     })
      //   }
      // }
    },
  },
  mounted() {
    console.log(this.$route.query)
    this.url = this.$route.query.url
    this.name = this.$route.query.name
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    signConfirm() {
      this.showDialog = true
    },
    signCancel() {
      ClientSocket.link().then(conn => {
        if (conn) {
          ClientSocket.signTranstion('')
        }
      })
      this.$store.commit('wallet/setSignatureData',null)
      this.$store.commit('wallet/setSignatureRequest',null)
      this.showSignature = false
    },
    async handleConfirm() {
      const assets = this.$store.state.wallet.assets
      this.loading = true
      const signatureRequest = this.$store.state.wallet.signatureRequest
      try {
        const seed = await PasswordService.encrypt(this.password)
        const privateKey = CryptoAES.decrypt(assets.privateKey,seed)
        if (privateKey) {
          const {payload} = signatureRequest
          const signatest = ecc.sign(Buffer.from(payload.buf, 'utf8'), privateKey);
          const signatestarr = []
          signatestarr.push(signatest)
          this.showDialog = false
          this.showSignature = false
          this.success = true
          ClientSocket.signTranstion(signatestarr)
        } else {
          this.$toast(this.$t('common.wrong_pwd'))
        }
      } catch (error) {
        console.log('handleConfirm',error)
      }
      this.loading = false
    },
    handleCancel() {
      this.showDialog = false
    },
  },
}
</script>

<style scoped>
.layout {
  width: 100%;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
iframe {
  border: none;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.page_header {
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* text-align: center; */
  position: relative;
  font-size: 34px;
  background-color: #fff;
  color: #2d2d2d;
}
.ion_back {
  width: 42px;
  height: 32px;
  position: absolute;
  left: 35px;
  top: 50%;
  transform: translate(0, -50%);
}
.alert-dialog-content {
  padding: 10px 20px;
}
.verify_title {
  font-weight: bold;
  font-size: 30px;
  margin: 28px 58px;
  /* border-bottom: 1PX solid #dfdfdf; */
}
.btn_layout {
  height: 68px;
  margin: 36px 58px;
  display: flex;
  font-size: 28px;
}
.btn_layout .cancel {
  flex: 1;
  text-align: left;
}
.btn_layout .cancel span{
  width: 170px;
  display: inline-block;
  text-align: center;
  color: #fff;
  padding: 15px 0;
  border-radius: 15px;
  background-color: #ec565a;
}
.btn_layout .confirm {
  flex: 1;
  text-align: right;
}
.btn_layout .confirm span{
  width: 170px;
  display: inline-block;
  text-align: center;
  color: #fff;
  border-radius: 15px;
  padding: 15px 0;
  background-color: #5789e3;
}
.sign_layout {
  padding: 0 30px;
}
.authorization {
  color: #447be2;
  font-size: 20px;
}
.contract_action {
  margin-top: 10px;
  font-size: 30px;
  font-weight: bold;
}
.sign_data {
  margin-top: 15px;
  padding: 20px 15px;
  font-size: 20px;
  background-color: #ececec;
}
.sign_item {
  margin-top: 20px;
  display: flex;
  text-align: right;
  color: #999999;
}
</style>
