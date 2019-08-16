<template>
  <vpage>
    <slot>
      <div class="page_header">
        <img class="ion_back" src="@/assets/img/back.png" @click="back"> 
        <span>{{query.account}}</span>
      </div>
      <div class="page_content">
        <div class="assets_card">
          <div class="assets_label">{{$t('common.assets')}}</div>
          <div class="balance">{{$store.state.wallet.currency === 'USD' ? '$':'￥'}} {{query.assets}}</div>
        </div>
        <div class="item">
          <span>{{$t('me.account_name')}}</span>
          <span class="item_value">{{query.account}}</span>
        </div>
        <div class="item">
          <span>{{$t('me.publick_key')}}</span>
          <span class="item_value">{{query.shortKey}}</span>
        </div>
        <div class="item" @click="clickItem('export')">
          <div class="item_label">{{$t('me.export_private')}}</div>
          <img class="item_icon" src="@/assets/img/manage_arrow.png" alt="">
        </div>
        <div class="item" @click="clickItem('resource')">
          <div class="item_label">{{$t('me.resource_management')}}</div>
          <img class="item_icon" src="@/assets/img/manage_arrow.png" alt="">
        </div>
        <div class="item" @click="clickItem('permission')">
          <div class="item_label">{{$t('me.permission')}}</div>
          <img class="item_icon" src="@/assets/img/manage_arrow.png" alt="">
        </div>
        <div class="item" @click="clickItem('fingerprint')">
          <div class="item_label">{{$t('me.fingerprint')}}</div>
          <img class="item_icon" src="@/assets/img/manage_arrow.png" alt="">
        </div>
        <div class="btn delete" @click="clickDelete">{{$t('me.delete_wallet')}}</div>
      </div>
      <v-ons-dialog
        modifier="width_pwd"
        cancelable
        style="background-color: rgba(0, 0, 0, .5);"
        :visible.sync="showDialog">
        <m-dialog :showFingerprint="false" v-model="password" v-on:confirm="handleConfirm" v-on:cancel="handleCancel"></m-dialog>
      </v-ons-dialog>
      <v-ons-dialog
        modifier="width_pwd"
        cancelable
        style="background-color: rgba(0, 0, 0, .5);"
        :visible.sync="showPrivate">
        <div class="dialog_layout">
          <div class="dialog_tips">{{$t('me.hint')}}</div>
          <div class="safe_warn">{{$t('me.hint_security')}}</div>
          <div class="private_key">{{privateKey}}</div>
          <div class="btn copy" :data-clipboard-text="privateKey" @click="copy">{{$t('me.copy_key')}}</div>
        </div>
      </v-ons-dialog>
      <v-ons-dialog
        modifier="width"
        cancelable
        :visible.sync="deleteDialog">
        <div>
          <div class="delete_question">
            {{$t('me.confirm_delete')}}
          </div>
          <div class="dialog_action">
            <span class="btn_cancel" @click="deleteDialog = false">{{$t('common.cancel')}}</span>
            <span class="btn_delete" @click="deleteConfirm">{{$t('common.confirm')}}</span>
          </div>
        </div>
      </v-ons-dialog>
      <!-- <loading :show="loading"></loading> -->
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import MDialog from '@/components/MDialog'
import PasswordService from '@/services/PasswordService'
import CryptoAES from '@/util/CryptoAES'
import {getCoinRate} from '@/servers'
import {Decimal} from 'decimal.js'
import Clipboard from 'clipboard'

export default {
  components: {
    vpage: MyPage,
    MDialog
  },
  data() {
    return {
      query: {},
      showDialog: false,
      showPrivate: false,
      deleteDialog: false,
      loading: false,
      password: '',
      privateKey: '',
      action: ''
    }
  },
  created() {
    this.query = Object.assign({assets: '0.00'}, this.$route.query)
    this.query.shortKey = this.query.publicKey.substr(0,12) + '...' + this.query.publicKey.substr(this.query.publicKey.length - 12)
    getCoinRate({coin_id: 'EOS', convert: this.$store.state.wallet.currency}).then(res => {
      // console.log(res)
      if (res.code === 1) {
        this.query.assets = Decimal.mul(this.query.balance, res.data.price).toFixed(2)
      }
    })
  },
  watch: {
    showDialog(newVal) {
      if (!newVal) {
        this.action = ''
        this.password = ''
      }
    }
  },
  methods: {
    deleteWallet() {
      const localFile = this.$store.state.wallet.localFile
      const wallets = localFile.wallets
      const isDefault = wallets.find(ele => ele.accountNames[0] === this.query.account).isDefault
      const index = wallets.findIndex(ele => ele.accountNames[0] === this.query.account)
      wallets.splice(index, 1)
      if (isDefault && wallets.length) {
        wallets[0].isDefault = true
        localFile.invitationAccount = wallets[0].accountNames[0]
      }
      localStorage.setItem('isecsp_wallet',JSON.stringify(localFile))
      this.$store.commit('wallet/setAssets', null)
      this.$router.go(-1)
    },
    deleteConfirm() {
      this.action = 'delete'
      this.showDialog = true
      this.deleteDialog = false
    },
    async handleConfirm() {
      if (!this.password) return
      const privatekey = this.$route.query.privateKey
      try {
        const seed = await PasswordService.encrypt(this.password)
        const privateKey = CryptoAES.decrypt(privatekey,seed)
        if (privateKey) {
          if (this.action === 'delete') {
            // 删除钱包
            this.deleteWallet()
          } else {
            this.privateKey = privateKey
            this.showDialog = false
            this.showPrivate = true
          }
        } else {
          this.$toast(this.$t('common.wrong_pwd'))
        }
      } catch (error) {
        console.log('handleConfirm',error)
      }
    },
    handleCancel() {
      this.showDialog = false
    },
    copy() {
      const copyBoard = new Clipboard('.copy')
      copyBoard.on('success', (e) => {
        copyBoard.destroy();
        this.showPrivate = false
        this.$toast(this.$t('me.toast_pkhbcttc'));
      })
    },
    clickDelete() {
      this.deleteDialog = true
    },
    clickItem(type) {
      switch (type) {
        case 'export':
          this.showDialog = true
          break;
        case 'resource':
          this.$router.push({
            name: 'Resource',
            query: {
              account: this.query.account
            }
          })
          break;
        case 'permission':
          this.$router.push({
            name: 'Permission',
            query: {
              account: this.query.account
            }
          })
          break;
        case 'fingerprint':
          this.$router.push({
            name: 'FingerprintWarn',
            query: {
              account: this.query.account
            }
          })
          break;
      
        default:
          break;
      }
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
  padding: 0 32px;
}
.assets_card {
  margin-top: 59px;
  margin-bottom: 16px;
  height: 332px;
  background-color: #ec565e;
  color: #fff;
  padding-top: 54px;
  border-radius: 15px;
  text-align: center;
  box-sizing: border-box;
}
.assets_label {
  font-size: 34px;
}
.balance {
  margin-top: 57px;
  font-size: 50px;
  font-weight: bold;
}
.item {
  padding: 38px 0;
  font-size: 28px;
  border-bottom: 1PX solid #dfdfdf;
  display: flex;
  align-items: center;
}
.item_value {
  color: #b0b0b0;
  margin-left: 30px;
}
.item_label {
  flex: 1;
}
.item_icon {
  width: 16px;
  height: 28px;
}
.btn {
  padding: 15px 0;
  font-size: 34px;
  color: #fff;
  border-radius: 15px;
  text-align: center;
}
.delete {
  background-color: #ec565e;
  margin-top: 38px;
}
.copy {
  background-color: #5789e4;
  margin-top: 15px;
  font-size: 26px;
  border-radius: 10px;
}
.dialog_layout {
  padding: 20px;
}
.dialog_tips {
  text-align: center;
  font-size: 26px;
  font-weight: bold;
}
.safe_warn {
  margin-top: 15px;
  padding: 10px;
  border-radius: 10px;
  background-color: #fde4e6;
  color: #8d1e1e;
  font-size: 28px;
  line-height: 1.2;
}
.private_key {
  margin-top: 15px;
  padding: 10px;
  border-radius: 10px;
  background-color: #e7e7e7;
  font-size: 24px;
  line-height: 1.2;
  word-break: break-all;
}
.delete_question {
  padding: 35px 30px;
  font-size: 32px;
}
.dialog_action {
  text-align: right;
  padding: 20px 25px;
  font-size: 32px;
}
.btn_cancel {
  color: grey;
}
.btn_delete {
  color: #027be3;
  margin-left: 50px;
}
</style>
