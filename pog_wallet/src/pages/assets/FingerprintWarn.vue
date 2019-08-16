<template>
  <vpage>
    <slot>
      <div>
        <img class="ion_back" src="@/assets/img/back.png">
      </div>
      <div class="warn_title">永久免密注意事项</div>
      <div class="desc1">永久免密使用了设备生物识别技术进行确认是否为设备拥有者，并且使用生物特性进行加密存储，除了设备拥有者，没有任何人可以取出密码。</div>
      <div class="desc_list">
        <div>使用永久免密，请您确保以下注意事项:</div>
        <div class="desc2">
          <div>• 请勿在root设备使用该功能</div>
          <div>• 请勿在自己手机添加他人指纹或面部识别</div>
          <div>• 请勿将手机开启密码告诉其他人</div>
          <div>• 请勿将手机交给他人</div>
          <div>• 增加或删除手机指纹后App需要重新开启指纹支付</div>
        </div>
      </div>
      <div class="btn">
        <span v-if="assets.fingerprintToken && $store.state.wallet.fingerprintToken" @click="clickBtn('close')">关闭指纹支付</span>
        <span v-else @click="clickBtn('open')">开启指纹支付</span>
      </div>
      <v-ons-dialog
        modifier="width_pwd"
        cancelable
        style="background-color: rgba(0, 0, 0, .5);"
        :visible.sync="showDialog">
        <m-dialog :showFingerprint="false" v-model="password" v-on:confirm="handleConfirm" v-on:cancel="handleCancel"></m-dialog>
      </v-ons-dialog>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import MDialog from '@/components/MDialog'
import PasswordService from '@/services/PasswordService'
import CryptoAES from '@/util/CryptoAES'

export default {
  components: {
    vpage: MyPage,
    MDialog
  },
  data() {
    return {
      showDialog: false,
      password: '',
      assets: null
    }
  },
  watch: {
    showDialog(newVal, oldVal) {
      if (!newVal) this.password = ''
    }
  },
  created() {
    this.assets = this.$store.state.wallet.assets
  },
  methods: {
    async verifyPassword() {
      const seed = await PasswordService.encrypt(this.password)
      const privateKey = CryptoAES.decrypt(this.assets.privateKey,seed)
      return privateKey
    },
    async handleConfirm() {
      const that = this
      const privateKey = await this.verifyPassword()
      if (privateKey) {
        const localFile = this.$store.state.wallet.localFile
        const wallets = localFile.wallets
        // 加密
        FingerprintAuth.encrypt({ clientId: 'com.isecsp.wallet', username: 'wallet', password: that.password, locale: 'zh_CN', disableBackup: true },encryptSuccessCallback, encryptErrorCallback)
        function encryptSuccessCallback(res) {
          for (let item of wallets) {
            if (that.assets.chain === 'eos') {
              if (item.publicKey === that.assets.publicKey) {
                item.fingerprintToken = res.token
                that.assets.fingerprintToken = res.token
              }
            }
            if (that.assets.chain === 'eth') {
              if (item.address === that.assets.address) {
                item.fingerprintToken = res.token
                that.assets.fingerprintToken = res.token
              }
            }
          }
          that.$store.commit('wallet/changeFingerprintToken', res.token)
          localStorage.setItem('isecsp_wallet',JSON.stringify(localFile))
          that.$router.go(-1)
        }
        function encryptErrorCallback(err) {

        }
      } else {
        this.$toast(this.$t('common.wrong_pwd'))
      }
    },
    handleCancel() {
      this.showDialog = false
    },
    closeFingerprint() {
      const that = this
      const localFile = this.$store.state.wallet.localFile
      const wallets = localFile.wallets
      FingerprintAuth.decrypt({clientId: "com.isecsp.wallet", username: 'wallet', locale: 'zh_CN', disableBackup: true, token: this.$store.state.wallet.fingerprintToken}, successCallback, errorCallback);
      async function successCallback(result) {
        console.log("successCallback(): " + JSON.stringify(result));
        if (result.withFingerprint) {
            console.log("Successful biometric authentication.");
            if (result.password) {
                console.log("password: " + result.password);
                for (let item of wallets) {
                  if (that.assets.chain === 'eos') {
                    if (item.publicKey === that.assets.publicKey) {
                      item.fingerprintToken = ''
                    }
                  }
                  if (that.assets.chain === 'eth') {
                    if (item.address === that.assets.address) {
                      item.fingerprintToken = ''
                    }
                  }
                }
                that.$store.commit('wallet/changeFingerprintToken', '')
                localStorage.setItem('isecsp_wallet',JSON.stringify(localFile))
                that.$toast('指纹支付已关闭')
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
    },
    clickBtn(type) {
      switch (type) {
        case 'open':
          this.showDialog = true
          break;
        case 'close':
          this.closeFingerprint()
          break;
      
        default:
          break;
      }
    }
  },
}
</script>

<style scoped>
.ion_back {
  width: 42px;
  height: 32px;
  margin: 35px;
}
.warn_title {
  margin-top: 50px;
  text-align: center;
  font-size: 38px;
  font-weight: bold;
}
.desc1 {
  margin-top: 30px;
  padding: 0 35px;
  font-size: 24px;
  color: gray;
}
.desc_list {
  margin-top: 30px;
  padding: 0 60px;
  font-size: 25px;
  line-height: 1.8;
}
.desc2 {
  color: #ec5f5a;
  font-weight: 450;
}
.btn {
  margin-top: 90px;
  text-align: center;
}
.btn span {
  padding: 28px 70px;
  background-color: #5789e3;
  color: #fff;
  border-radius: 50px;
  font-size: 32px;
}
</style>
