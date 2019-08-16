<template>
  <vpage>
    <slot>
      <div>
        <vheader :title="'激活码创建'" :color="'#fff'" :background="'#027be3'" class="l_header"></vheader>
        <attention></attention>
        <div class="layout">
          <v-ons-row class="row_item">
            <span>{{$t('assets.chain_type')}}</span>
            <span style="margin-left: 20px;">{{$t('assets.eos_chain')}}</span>
          </v-ons-row>
          <v-ons-row class="row_item">
            <div>{{$t('assets.account_name')}}</div>
            <div style="flex: 1;margin-left: 20px;">
              <input 
                type="text" 
                class="text-input my_input" 
                maxlength="12"
                v-model="account">
            </div>
          </v-ons-row>
          <vinput :label="$t('assets.password')" isPassword showEye :showPwd="showPwd" v-on:clickEye="clickEye" v-model="pwd"></vinput>
          <vinput :label="$t('assets.repeat_password')" isPassword :showPwd="showPwd" v-model="pwd2"></vinput>
          <v-ons-row class="row_item">
            <div>激活码</div>
            <div style="flex: 1;margin-left: 20px;">
              <input
                type="text" 
                class="text-input my_input" 
                maxlength="12"
                v-model="activationCode">
            </div>
            <span class="activation_code">点击获取激活码</span>
          </v-ons-row>
          <vinput :label="$t('assets.hint')" isHint v-model="hint"></vinput>
          <v-ons-row style="padding: 15px 0;">
            <label class="checkbox checkbox--material terms">
              <input type="checkbox" class="checkbox__input checkbox--material__input" v-model="checkState">
              <div class="checkbox__checkmark checkbox--material__checkmark"></div>
              {{$t('assets.tspp1')}}<a class="tspp">{{$t('assets.tspp2')}}</a>
            </label>
          </v-ons-row>
          <v-ons-row>
            <vbtn :text="$t('assets.create_wallet')" v-on:clickBtn="clickCreate"></vbtn>
          </v-ons-row>
          <v-ons-row>
            <v-ons-col style="margin-top: 15px;text-align: center;color: #027be3;font-size: 14px;" @click="clickImport">{{$t('assets.import_wallet')}}</v-ons-col>
          </v-ons-row>
        </div>
      </div>
    </slot>
    <v-ons-modal :visible="loading" >
      <loading></loading>
    </v-ons-modal>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import MyHeader from '@/components/MyHeader'
import Attention from '@/components/create/Attention'
import MyInput from '@/components/input/MyInput'
import eos from '@/plugins/eos'
import Eos from 'eosjs'

const {ecc} = Eos.modules
const {PrivateKey} = ecc

export default {
  components: {
    vpage: MyPage,
    vheader: MyHeader,
    vinput: MyInput,
    Attention
  },
  data () {
    return {
      showPwd: false,
      loading: false,
      account: '',
      pwd: '',
      pwd2: '',
      hint: '',
      activationCode: '',
      checkState: false
    }
  },
  methods: {
    async clickCreate() {
      if (!this.account) {
        this.$toast(this.$t('assets.toast_wnce'))
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
      if (!this.activationCode) {
        this.$toast(this.$t('assets.toast_petac'))
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
          console.log(privateKey, publicKey)
          this.$router.push({
            name: 'BackupWallet',
            query: {
              type: 'activationCode',
              account: this.account,
              privateKey: privateKey,
              publicKey: publicKey,
              activationCode: this.activationCode
            }
          })
        }
        this.loading = false
      } else {
        this.$toast(this.$t('assets.toast_12c'))
      }
    },
    clickImport() {
      this.$router.push({
        name: 'ImportWallet'
      })
    },
    clickEye(type) {
      if (type === 'open') {
        this.showPwd = true
      } else {
        this.showPwd = false
      }
    }
  }
}
</script>

<style scoped>
.l_header {
  font-weight: bold;
}
.layout {
  padding: 0 15px;
}
.row_item {
  padding: 20px 0;
  font-size: 16px;
  font-weight: 420;
  border-bottom: 1px solid #e8e8e8;
  align-items: center;
  position: relative;
}
.my_input {
  width: 100%;
  height: auto;
  font-size: 14px;
  vertical-align: middle;
}
.terms {
  font-size: 12px;
}
.tspp {
  color: #027be3;
  text-decoration: underline;
}
.my_modal {
  background-color: transparent;
}
.loading {
  padding: 20px;
  background-color: rgba(0, 0, 0, .7);
  display: inline-block;
  border-radius: 10px;
}
.progress_color {
  stroke: #57a9f5;
}
.activation_code {
  font-size: 12px;
  color: #027be3;
}
</style>
