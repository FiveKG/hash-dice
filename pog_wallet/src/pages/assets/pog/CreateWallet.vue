<template>
  <v-ons-page>
    <div class="background layout_bg"></div>
    <div class="content">
      <vheader :title="'创建钱包'" :background="'#ec565a'" :color="'#fff'" white />
      <attention></attention>
      <div class="layout">
        <v-ons-row class="chain_type">
          <span>{{$t('assets.chain_type')}}</span>
          <span class="row_content">POG底层</span>
        </v-ons-row>
        <v-ons-row class="row_item">
          <div>钱包名称</div>
          <div class="row_ipt row_content">
            <input type="text" class="text-input" maxlength="12" v-model="account">
          </div>
        </v-ons-row>
        <v-ons-row class="row_item">
          <div>{{$t('assets.password')}}</div>
          <div class="row_ipt row_content">
            <input :type="showPwd ? 'text':'password'" class="text-input" maxlength="15" v-model="pwd">
            <img class="eye" src="@/assets/img/eye_open2.png" @click="showPwd = false" v-if="showPwd">
            <img class="eye" src="@/assets/img/eye_close2.png" @click="showPwd = true" v-else>
          </div>
        </v-ons-row>
        <v-ons-row class="row_item">
          <div>{{$t('assets.repeat_password')}}</div>
          <div class="row_ipt row_content">
            <input :type="showPwd ? 'text':'password'" class="text-input" maxlength="15" v-model="pwd2">
          </div>
        </v-ons-row>
        <v-ons-row class="row_item">
          <div>{{$t('assets.hint')}}</div>
          <div class="row_ipt row_content">
            <input type="text" class="text-input" :placeholder="$t('assets.optional')" v-model="hint">
          </div>
        </v-ons-row>
        <div class="terms">
          <label class="checkbox">
            <input type="checkbox" class="checkbox__input" checked="checked" v-model="checkState">
            <div class="checkbox__checkmark"></div>
          </label>
          <span @click="checkState = !checkState">{{$t('assets.tspp1')}}<a class="tspp">{{$t('assets.tspp2')}}</a></span>
        </div>
        <div class="btn_import" @click="clickCreate">{{$t('assets.create_wallet')}}</div>
      </div>
    </div>
    <v-ons-modal :visible="loading" >
      <loading></loading>
    </v-ons-modal>
  </v-ons-page>
</template>

<script>
import MyHeader from '@/components/MyHeader'
import Attention from '@/components/create/Attention'
import PasswordService from '@/services/PasswordService'
import CryptoAES from '@/util/CryptoAES'
import eos from '@/plugins/pog'
import Eos from 'eosjs'

const {ecc} = Eos.modules
const {PrivateKey} = ecc

export default {
  components: {
    vheader: MyHeader,
    attention: Attention
  },
  data () {
    return {
      showPwd: false,
      loading: false,
      modalVisible: false,
      route: '',
      account: '',
      pwd: '',
      pwd2: '',
      hint: '',
      checkState: false
    }
  },
  methods: {
    async clickCreate() {
      if (!this.account) {
        this.$toast(this.$t('assets.toast_ance'))
        return
      }
      if (!this.pwd) {
        this.$toast(this.$t('assets.toast_pce'))
        return
      }
      if (!this.pwd2) {
        this.$toast(this.$t('assets.toast_cpce'))
        return
      }
      if (this.pwd !== this.pwd2) {
        this.$toast(this.$t('assets.toast_ttpid'))
        return
      }
      if (this.pwd.length < 8) {
        this.$toast(this.$t('assets.toast_tlotpsnblt8'))
        return
      }
      if (!this.checkState) {
        this.$toast(this.$t('assets.toast_yhnraaottosap'))
        return
      }
      if (this.account.length === 12) {
        this.loading = true
        try {
          const res = await eos.getAccount(this.account)
          console.log(res)
          if (res) {
            this.$toast(this.$t('assets.toast_tahae'))
          }
        } catch (error) {
          console.log(error)
          const buff = (await PrivateKey.randomKey()).toBuffer()
          const privateKey = ecc.PrivateKey.fromBuffer(new Buffer(buff)).toString()
          const publicKey = ecc.PrivateKey(privateKey).toPublic().toString('EOS')
          //console.log(privateKey, publicKey)

          // 密码加密
          const seed = await PasswordService.encrypt(this.pwd)
          // 私钥加密
          const encryptedPrivateKey = CryptoAES.encrypt(privateKey,seed)
          //console.log(123,encryptedPrivateKey);
          this.$router.push({
            name: 'PogBackupWallet',
            query: {
              route: this.route,
              //type: 'friendCreation',
              account: this.account,
              privateKey: privateKey,
              publicKey: publicKey,
              encryptedPrivateKey:encryptedPrivateKey
            }
          })
        }
        this.loading = false
      } else {
        this.$toast(this.$t('assets.toast_12c'))
      }
    }
  },
}
</script>

<style scoped>
.l_header {
  font-weight: bold;
}
.layout_bg {
  background-color: #f6f6f6;
}
.layout {
  padding: 38px;
}
.chain_type {
  font-size: 30px;
  color: #181818;
  display: flex;
  align-items: center;
  padding-bottom: 38px;
  /* border-bottom: 1PX solid rgb(235, 235, 235); */
}
.row_item {
  padding: 27px 0;
  box-sizing: border-box;
  font-size: 30px;
  color: #181818;
  display: flex;
  align-items: center;
  /* border-bottom: 1PX solid rgb(235, 235, 235); */
}
.row_content {
  margin-left: 42px;
}
.row_ipt {
  flex: 1;
  background-color: #efefef;
  padding: 30px;
  display: flex;
  align-items: center;
}
.row_ipt input {
  width: 90%;
  height: auto;
  padding: 0;
  font-size: 28px;
}
.eye {
  width: 36px;
  height: 20px;
}
.checkbox__checkmark:before {
  width: 32px;
  height: 32px;
  top: -5px;
}
.checkbox__checkmark:after {
  width: 15px;
  height: 10px;
  top: 3px;
  left: 8px;
}
:checked + .checkbox__checkmark:before {
  background: #2c92ed;
}
.tspp {
  color: #5d8de2;
  text-decoration: underline;
}
.terms {
  display: flex;
  align-items: center;
  margin-top: 30px;
}
.terms span {
  margin-left: 20px;
}
.btn_import {
  margin-top: 34px;
  background-color: #ec565a;
  color: #fff;
  text-align: center;
  font-size: 30px;
  border-radius: 15px;
  padding: 20px 0;
}
</style>