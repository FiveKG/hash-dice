<template>
  <vpage>
    <slot>
      <div class="header">
        <img src="@/assets/img/u14.png" @click="back">
        <span>帮助我的伙伴投资</span>
      </div>
      <div class="layout">
        <div class="ipt_layout">
          <input type="text" class="text-input" placeholder="请输入伙伴的EOS账号" v-model="reqParams.friendAccountName">
        </div>
        <div class="btn" @click="clickConfirm">确定</div>
        <div class="tips">
          <div>注：</div>
          <ol>
            <li>帮助伙伴投资后，伙伴的账号为您直接推荐的账号；</li>
            <li>伙伴投资的 EOS 账号应为未投资账号，已投资账号无效；</li>
            <li>投资的 30 EOS 将优先从您可提现账户中扣除，当可提现账户不足时，从您的钱包账户中扣除。</li>
          </ol>
        </div>
      </div>
      <v-ons-action-sheet
        :visible.sync="actionSheetVisible"
        cancelable
        style="background: rgba(0,0,0,0.5);"
      >
        <div class="action_layout">
          <div class="btn_active" @click="showDialog = true">支付 30EOS 投资</div>
        </div>
      </v-ons-action-sheet>
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
import PasswordService from '@/services/PasswordService'
import CryptoAES from '@/util/CryptoAES'
import eos from '@/plugins/eos'
import { friendInvest,getConfig } from '@/servers/invitation';

export default {
  components: {
    vpage: MyPage,
    MDialog
  },
  data() {
    return {
      reqParams: {
        account: '',
        friendAccountName: ''
      },
      password: '',
      actionSheetVisible: false,
      showDialog: false,
      loading: false,
    }
  },
  created() {
    this.reqParams.account = this.$route.query.account
  },
  methods: {
    // 验证密码
    async verifyPassword() {
      const seed = await PasswordService.encrypt(this.password)
      const wallets = this.$store.state.wallet.localFile.wallets
      const current = wallets.find(ele => ele.accountNames[0] === this.reqParams.account)
      const privateKey = CryptoAES.decrypt(current.privateKey,seed)
      return privateKey
    },
    async goPay(privateKey) {
      if (privateKey) {
        this.showDialog = false
        try {
          const config = await this.getConfig()
          const opts = { authorization:[`${this.reqParams.account}@active`], keyProvider: privateKey }
          await eos.transfer(this.reqParams.account, config.wallet_receiver, `0.0001 EOS`, `tbg_invest:${this.reqParams.account}`, opts)
          return true
        } catch (error) {
          console.log(error)
          error = JSON.parse(error)
          if (error.error.code == 3050003) {
            this.$toast(this.$t('common.overdrawn_balance'))
          }
          if (error.error.code == 3080004) {
            this.$toast('CPU资源受限')
          }
          return false
        }
      } else {
        this.$toast(this.$t('common.wrong_pwd'))
      }
    },
    async friendInvest() {
      try {
        const res = await friendInvest()
        return res.code
      } catch (error) {
        console.log(error)
      }
    },
    async getConfig() {
      try {
        const res = await getConfig()
        if (res.code === 1) {
          console.log('getConfig',res)
          return res.data
        }
      } catch (error) {
        console.log(error)
      }
    },
    async handleConfirm() {
      this.loading = true
      const privateKey = await this.verifyPassword()
      if (privateKey) {
        const res = await this.goPay(privateKey)
        if (res) this.$toast('投资成功')
        this.loading = false
        this.showDialog = false
        this.actionSheetVisible = false
      } else {
        this.$toast(this.$t('common.wrong_pwd'))
        this.loading = false
      }
    },
    handleCancel() {
      this.showDialog = false
    },
    async clickConfirm() {
      if (this.reqParams.friendAccountName) {
        const res = await this.friendInvest()
        if (res === 1) {
          this.$toast('投资成功')
        } else {
          this.actionSheetVisible = true
        }
      }
    },
    back() {
      this.$router.go(-1)
    }
  },
}
</script>

<style scoped>
.header {
  padding: 30px 35px;
  display: flex;
  align-items: center;
  font-size: 38px;
  background-color: #ececec;
}
.header img {
  width: auto;
  height: 50px;
}
.header span {
  flex: 1;
  margin-left: 20px;
}
.layout {
  padding: 50px 30px;
}
.ipt_layout {
  background-color: #fff;
  border-radius: 10px;
  padding: 30px 40px;
}
.ipt_layout input {
  font-size: 30px;
}
.btn {
  margin-top: 50px;
  padding: 20px;
  background-color: #ff8e05;
  color: #fff;
  border-radius: 10px;
  font-size: 35px;
  font-weight: bold;
  text-align: center;
}
.tips {
  margin-top: 80px;
  font-size: 30px;
  line-height: 2;
}
ol {
  margin: 0;
  padding-left: 30px;
}
.action_layout {
  background-color: #fff;
  padding: 35px 50px;
}
.btn_active {
  background-color: #ff8e05;
  color: #fff;
  text-align: center;
  padding: 30px;
  border-radius: 10px;
  font-size: 36px;
  font-weight: bold;
}
</style>
