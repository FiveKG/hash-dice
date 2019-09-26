<template>
  <vpage>
    <slot>
      <vheader :title="$t('assets.import_wallet')" :background="'#ec565a'" :color="'#fff'" white />
      <!-- :icon="'img/scanner.png'" -->
      <div class="my_textarea">
        <textarea class="textarea" rows="2" :placeholder="$t('assets.express_private_key')" maxlength="60" v-model="privateKey"></textarea>
      </div>
      <div class="layout">
        <v-ons-row class="chain_type">
          <span>{{$t('assets.chain_type')}}</span>
          <span class="row_content">POG底层</span>
        </v-ons-row>
        <v-ons-row class="row_item">
          <div>{{$t('assets.password')}}</div>
          <div class="row_ipt row_content">
            <input :type="showPwd ? 'text':'password'" class="text-input" maxlength="15" :placeholder="$t('assets.password_tip')" v-model="pwd">
          </div>
          <div>
            <img class="eye" src="@/assets/img/eye_open.png" @click="showPwd = false" v-if="showPwd">
            <img class="eye" src="@/assets/img/eye_close.png" @click="showPwd = true" v-else>
          </div>
        </v-ons-row>
        <v-ons-row class="row_item">
          <div>{{$t('assets.repeat_password')}}</div>
          <div class="row_ipt row_content">
            <input :type="showPwd ? 'text':'password'" class="text-input" maxlength="15" :placeholder="$t('assets.repeat_password')" v-model="pwd2">
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
        <div class="btn_import" @click="clickImport">{{$t('assets.import_wallet')}}</div>
        <v-ons-row class="privatekey_question" @click="clickQuestion">{{$t('assets.w_private_key')}}</v-ons-row>
      </div>
      <v-ons-modal :visible="loading" >
        <loading></loading>
      </v-ons-modal>

    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import MyHeader from '@/components/MyHeader'
import PasswordService from '@/services/PasswordService'
import CryptoAES from '@/util/CryptoAES'
import { setInvitation } from '@/servers/invitation';
import eos from '@/plugins/pog'
import Eos from 'eosjs'

const {ecc} = Eos.modules

export default {
  components: {
    vpage: MyPage,
    vheader: MyHeader
  },
  data () {
    return {
      tabIndex: 0,
      privateKey: '', //5HvHR3z7hDzxYUYj7uXrvG2XFbhbXWQF5UwffBnhMpwFR9sdRLL(ahsbakjsdajk), 5JUZPZ77znTE7j2pKsSPA6wXM9qoBHXCHA4w28A34Eyb6vfVp9g(bdasfbajkdba)
      pwd: '',
      pwd2: '',
      hint: '',
      showPwd: false,
      loading: false,
      checkState: false
    }
  },
  methods: {
    async clickImport() {
      if (!this.privateKey) {
        this.$toast(this.$t('assets.toast_pkcbe'))
        return
      }
      if (!this.pwd || !this.pwd2) {
        this.$toast(this.$t('assets.toast_pce'))
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
      try {
        if (this.privateKey.length === 51 && ecc.isValidPrivate(this.privateKey)) {
          this.loading = true
          // 用私钥获取对应公钥
          const publicKey = ecc.PrivateKey(this.privateKey).toPublic().toString('EOS')
          // 用公钥获取账号
          const account = await eos.getKeyAccounts(publicKey)
          console.log('account',account)
          if (!account.account_names.length) {
            this.$toast(this.$t('assets.toast_cpkhna'))
            this.loading = false
            return
          }
          // 密码加密
          const seed = await PasswordService.encrypt(this.pwd)
          // 私钥加密
          const encryptedPrivateKey = CryptoAES.encrypt(this.privateKey,seed)
          const localFile = this.$store.state.wallet.localFile
          const wallets = localFile.wallets
          const elem = wallets.find(ele => ele.publicKey === publicKey)
          if (elem) {
            // 钱包已经存在
            this.$toast(`${account.account_names[0]} ${this.$t('assets.toast_waeadnntbi')}`)
          } else {
            let tokenList = []
            for (let item of wallets) {
              if (item.isDefault) {
                item.isDefault = false
              }
              if (item.chain === 'pog' && item.accountNames[0] === account.account_names[0]) {
                tokenList = item.tokenList
              }
            }
            wallets.unshift({
              chain: 'pog',
              privateKey: encryptedPrivateKey,
              publicKey: publicKey,
              accountNames: account.account_names,
              tokenList: tokenList,
              isDefault: true
            })
            localStorage.setItem('isecsp_wallet',JSON.stringify(localFile))
            this.$store.commit('wallet/setAssets', null)
            this.$store.commit('wallet/setSelectedTab', 'assets')
            if (this.$store.state.wallet.selectedTab === 'invitation') {
              this.$store.commit('wallet/setSelectedTab', 'assets')
            }
            setTimeout(() => {
              this.$router.push({
                path: '/'
              })
            }, 20);
          }
          this.loading = false
        } else {
          this.$toast(this.$t('assets.toast_ipk'))
          return
        }
      } catch (error) {
        console.log(error)
      }
    },
    clickQuestion() {
      this.$router.push({
        name: 'PrivateKey'
      })
    }
  },
}
</script>

<style scoped>
input, textarea {
  caret-color: #027be3;
  width: 100%;
  height: 212px;
  padding: 15px;
  font-size: 28px;
}
.my_textarea {
  border: 1PX solid rgb(190, 190, 190);
  box-sizing: border-box;
  margin: 40px 38px 64px 38px;
  border-radius: 10px;
}
.textarea {
  border: none;
  background-color: transparent;
}
.layout {
  padding: 0 38px;
}
.chain_type {
  font-size: 30px;
  color: #181818;
  display: flex;
  align-items: center;
  margin-bottom: 38px;
}
.row_item {
  padding: 38px 0;
  box-sizing: border-box;
  font-size: 30px;
  color: #181818;
  display: flex;
  align-items: center;
  border-bottom: 1PX solid rgb(219, 219, 219);
}
.row_content {
  margin-left: 42px;
}
.row_ipt {
  flex: 1;
  display: flex;
  align-items: center;
}
.row_ipt input {
  width: 100%;
  height: auto;
  padding: 0;
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
.my_modal {
  background-color: transparent;
}
.loading {
  padding: 50px;
  background-color: rgba(0, 0, 0, .7);
  display: inline-block;
  border-radius: 10px;
}
.progress_color {
  stroke: #0076ff;
}
.progress-circular__primary {
  stroke-width: 10%;
}
.progress-circular--indeterminate {
  width: 60px;
  height: 60px;
}
.privatekey_question {
  margin-top: 30px;
  justify-content: center;
  color: #ec565a;
  font-size: 28px;
}

</style>
