<template>
  <vpage>
    <slot>
      <vheader :title="$t('assets.import_wallet')" :background="'#ec565a'" :color="'#fff'" white />
      <!-- :icon="'img/scanner.png'" -->
      <div class="header_tab">
        <div :class="tabIndex === 0 ? 'tab_selected':''" @click="tabIndex = 0">助记词</div>
        <div :class="tabIndex === 1 ? 'tab_selected':''" @click="tabIndex = 1">私钥</div>
      </div>
      <div v-if="tabIndex === 0">
        <div class="my_textarea">
          <textarea class="textarea" rows="2" :placeholder="'助记词，用空格分隔'" v-model="mnemonic.word"></textarea>
        </div>
        <div class="layout">
          <v-ons-row class="chain_type">
            <span>{{$t('assets.chain_type')}}</span>
            <span class="row_content">以太坊底层</span>
          </v-ons-row>
          <!-- <v-ons-row class="row_item" @click="dialogVisible = true">
            <span>选择格式</span>
            <span class="row_content">m/44'/60'/0'/0/0 Jaxx,Metamask(ETH)</span>
          </v-ons-row> -->
          <v-ons-row class="row_item">
            <div>钱包名称</div>
            <div class="row_ipt row_content">
              <input type="text" class="text-input" maxlength="15" placeholder="钱包名称" v-model="mnemonic.name">
            </div>
          </v-ons-row>
          <v-ons-row class="row_item">
            <div>{{$t('assets.password')}}</div>
            <div class="row_ipt row_content">
              <input :type="mnemonic.showPwd ? 'text':'password'" class="text-input" maxlength="15" :placeholder="$t('assets.password_tip')" v-model="mnemonic.pwd">
            </div>
            <div>
              <img class="eye" src="@/assets/img/eye_open.png" @click="mnemonic.showPwd = false" v-if="mnemonic.showPwd">
              <img class="eye" src="@/assets/img/eye_close.png" @click="mnemonic.showPwd = true" v-else>
            </div>
          </v-ons-row>
          <v-ons-row class="row_item">
            <div>{{$t('assets.repeat_password')}}</div>
            <div class="row_ipt row_content">
              <input :type="mnemonic.showPwd ? 'text':'password'" class="text-input" maxlength="15" :placeholder="$t('assets.repeat_password')" v-model="mnemonic.pwd2">
            </div>
          </v-ons-row>
          <v-ons-row class="row_item">
            <div>{{$t('assets.hint')}}</div>
            <div class="row_ipt row_content">
              <input type="text" class="text-input" :placeholder="$t('assets.optional')" v-model="mnemonic.hint">
            </div>
          </v-ons-row>
          <div class="terms">
            <label class="checkbox">
              <input type="checkbox" class="checkbox__input" checked="checked" v-model="mnemonic.checkState">
              <div class="checkbox__checkmark"></div>
            </label>
            <span @click="mnemonic.checkState = !mnemonic.checkState">{{$t('assets.tspp1')}}<a class="tspp">{{$t('assets.tspp2')}}</a></span>
          </div>
          <div class="btn_import" @click="clickImport">{{$t('assets.import_wallet')}}</div>
        </div>
      </div>
      <div v-else>
        <div class="my_textarea">
          <textarea class="textarea" rows="2" :placeholder="$t('assets.express_private_key')" v-model="privateKey.key"></textarea>
        </div>
        <div class="layout">
          <v-ons-row class="chain_type">
            <span>{{$t('assets.chain_type')}}</span>
            <span class="row_content">以太坊底层</span>
          </v-ons-row>
          <v-ons-row class="row_item">
            <div>钱包名称</div>
            <div class="row_ipt row_content">
              <input type="text" class="text-input" maxlength="15" placeholder="钱包名称" v-model="privateKey.name">
            </div>
          </v-ons-row>
          <v-ons-row class="row_item">
            <div>{{$t('assets.password')}}</div>
            <div class="row_ipt row_content">
              <input :type="privateKey.showPwd ? 'text':'password'" class="text-input" maxlength="15" :placeholder="$t('assets.password_tip')" v-model="privateKey.pwd">
            </div>
            <div>
              <img class="eye" src="@/assets/img/eye_open.png" @click="privateKey.showPwd = false" v-if="privateKey.showPwd">
              <img class="eye" src="@/assets/img/eye_close.png" @click="privateKey.showPwd = true" v-else>
            </div>
          </v-ons-row>
          <v-ons-row class="row_item">
            <div>{{$t('assets.repeat_password')}}</div>
            <div class="row_ipt row_content">
              <input :type="privateKey.showPwd ? 'text':'password'" class="text-input" maxlength="15" :placeholder="$t('assets.repeat_password')" v-model="privateKey.pwd2">
            </div>
          </v-ons-row>
          <v-ons-row class="row_item">
            <div>{{$t('assets.hint')}}</div>
            <div class="row_ipt row_content">
              <input type="text" class="text-input" :placeholder="$t('assets.optional')" v-model="privateKey.hint">
            </div>
          </v-ons-row>
          <div class="terms">
            <label class="checkbox">
              <input type="checkbox" class="checkbox__input" checked="checked" v-model="privateKey.checkState">
              <div class="checkbox__checkmark"></div>
            </label>
            <span @click="privateKey.checkState = !privateKey.checkState">{{$t('assets.tspp1')}}<a class="tspp">{{$t('assets.tspp2')}}</a></span>
          </div>
          <div class="btn_import" @click="clickImport">{{$t('assets.import_wallet')}}</div>
          <v-ons-row class="privatekey_question" @click="clickQuestion">{{$t('assets.w_private_key')}}</v-ons-row>
        </div>
      </div>
      <v-ons-dialog
        modifier="width_pwd"
        cancelable
        :visible.sync="dialogVisible"
      >
        <div class="dialog_layout">
          <div class="path_item">m/44'/60'/0'/0 Ledger(ETH)</div>
          <div class="path_item">m/44'/60'/0'/0/0 Jaxx,Metamask(ETH)</div>
        </div>
      </v-ons-dialog>
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
import {ethers} from 'ethers'

export default {
  components: {
    vpage: MyPage,
    vheader: MyHeader
  },
  data () {
    return {
      tabIndex: 0,
      loading: false,
      dialogVisible: false,
      mnemonic: {
        word: '', //wash sugar peanut guitar among moment success half foil labor comfort attack
        name: '',
        pwd: '',
        pwd2: '',
        hint: '',
        showPwd: false,
        checkState: false
      },
      privateKey: {
        key: '',//0x97b723a47e9786548aa3eed32d4ceab72078123b0ba9522d5c5e8c7328824747  0xeeff3b54f7fd1654cee311d7cfe9c470f3c5e9fe5fd313a164cd807be5b6b7a0 
        name: '',
        pwd: '',
        pwd2: '',
        hint: '',
        showPwd: false,
        checkState: false
      }, 
    }
  },
  methods: {
    async clickImport() {
      let params
      if (this.tabIndex === 0) {
        params = this.mnemonic
        if (!params.word) {
          this.$toast('助记词错误')
          return
        }
      } else {
        params = this.privateKey
        if (!params.key) {
          this.$toast(this.$t('assets.toast_pkcbe'))
          return
        }
      }
      if (!params.name) {
        this.$toast('钱包名称不能为空')
        return
      }
      if (!params.pwd || !params.pwd2) {
        this.$toast(this.$t('assets.toast_pce'))
        return
      }
      if (params.pwd !== params.pwd2) {
        this.$toast(this.$t('assets.toast_ttpid'))
        return
      }
      if (params.pwd.length < 8) {
        this.$toast(this.$t('assets.toast_tlotpsnblt8'))
        return
      }
      if (!params.checkState) {
        this.$toast(this.$t('assets.toast_yhnraaottosap'))
        return
      }
      this.loading = true
      const localFile = this.$store.state.wallet.localFile
      const wallets = localFile.wallets
      if (this.tabIndex === 0) {
        const path = "m/44'/60'/0'/0";
        try {
          const wallet = ethers.Wallet.fromMnemonic(params.word, path);
          console.log(wallet)
          const elem = wallets.find(ele => ele.address === wallet.address)
          if (elem) {
            // 钱包已经存在
            this.$toast(`${params.name} ${this.$t('assets.toast_waeadnntbi')}`)
          } else {
            // 密码加密
            const seed = await PasswordService.encrypt(params.pwd)
            // 私钥加密
            const encryptedPrivateKey = CryptoAES.encrypt(wallet.privateKey,seed)
            for (let item of wallets) {
              if (item.isDefault) {
                item.isDefault = false
              }
            }
            wallets.unshift({
              chain: 'eth',
              privateKey: encryptedPrivateKey,
              address: wallet.address,
              name: params.name,
              tokenList: [],
              isDefault: true
            })
            localStorage.setItem('isecsp_wallet',JSON.stringify(localFile))
            this.$store.commit('wallet/setAssets', null)
            setTimeout(() => {
              this.$router.go(1-this.$route.query.back)
            }, 20);
          }
        } catch (error) {
          console.log(error)
          this.$toast('助记词错误')
        }
      } else {
        try {
          const wallet = new ethers.Wallet(params.key)
          console.log(wallet)
          const elem = wallets.find(ele => ele.address === wallet.address)
          if (elem) {
            // 钱包已经存在
            this.$toast(`${params.name} ${this.$t('assets.toast_waeadnntbi')}`)
          } else {
            // 密码加密
            const seed = await PasswordService.encrypt(params.pwd)
            // 私钥加密
            const encryptedPrivateKey = CryptoAES.encrypt(wallet.privateKey,seed)
            for (let item of wallets) {
              if (item.isDefault) {
                item.isDefault = false
              }
            }
            wallets.unshift({
              chain: 'eth',
              privateKey: encryptedPrivateKey,
              address: wallet.address,
              name: params.name,
              tokenList: [],
              isDefault: true
            })
            localStorage.setItem('isecsp_wallet',JSON.stringify(localFile))
            this.$store.commit('wallet/setAssets', null)
            setTimeout(() => {
              this.$router.go(1-this.$route.query.back)
            }, 20);
          }
        } catch (error) {
          console.log(error)
          this.$toast('私钥错误')
        }
      }
      this.loading = false
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
  margin: 20px 38px;
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
  margin: 30px 0;
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
  margin: 34px 0;
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
  margin: 30px 0;
  justify-content: center;
  color: #ec565a;
  font-size: 28px;
}
.header_tab {
  display: flex;
  justify-content: space-around;
  padding: 10px 50px;
  color: #505050;
}
.header_tab div {
  padding: 15px 20px;
  font-size: 30px;
}
.tab_selected {
  color: #ec565a;
  border-bottom: 3px solid #ec565a;
}
.dialog_layout {
  text-align: center;
  font-size: 30px;
}
.path_item {
  padding: 30px 0;
  border-bottom: 1PX solid #e2e2e2;
}
</style>
