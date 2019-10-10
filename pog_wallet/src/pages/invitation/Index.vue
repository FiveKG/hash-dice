<template>
  <div :class="{'topshow':!isBind}" style="height:100%;">
    <is-bind v-if="isBind" :account="account" @showWallets="actionSheetVisible = true" ref="bind"></is-bind>
    <un-bind v-else :account="account" :keyboardVal="invitationNumber" @bind="bind" @showKeyboard="showKeyboard" @showWallets="actionSheetVisible = true"></un-bind>

    <keyboard 
      :show="keyboardVisible"
      @typing="typing"></keyboard>

    <v-ons-action-sheet
      :visible.sync="actionSheetVisible"
      cancelable
      style="background: rgba(0,0,0,0.5);"
    >
      <div class="action_layout">
        <div class="action_header">
          <div>EOS钱包</div>
          <img src="@/assets/img/u102.png" @click="actionSheetVisible = false">
        </div>
        <div class="action_item" v-for="item in eosWallets" @click="clickItem(item)">
          <img src="@/assets/img/u96.png" v-if="item === account">
          <div>{{item}}</div>
        </div>
      </div>
    </v-ons-action-sheet>
  </div>
</template>

<script>
import UnBind from './UnBind'
import IsBind from './IsBind'
import keyboard from '@/components/keyboard/Keyboard';
import api from '@/servers/invitation';

export default {
  components: {
    UnBind,
    IsBind,
    keyboard
  },
  data() {
    return {
      isBind: false,
      keyboardVisible: false,
      actionSheetVisible: false,
      account: '',
      invitationVal: '',
      invitationNumber: ['','','','','',''],
      eosWallets: []
    }
  },
  mounted() {
    console.log('welcome bingding')
    this.initData()
  },
  methods: {
    showKeyboard(value) {
      this.keyboardVisible = value
    },
    typing(val) {
      switch (val) {
        case 'hide':
          setTimeout(() => {
            this.keyboardVisible = false
          }, 100);
          break;
        case 'del':
          let invitationVal = this.invitationVal
          if (invitationVal.length) {
            this.invitationNumber.splice(invitationVal.length - 1, 1, '')
          }
          this.invitationVal = invitationVal.slice(0, -1);
          break;
      
        default:
          if (this.invitationVal.length < 6) {
            this.invitationVal += val
            let arr = this.invitationVal.split('')
            if (arr.length) {
              this.invitationNumber.splice(arr.length - 1, 1, arr[arr.length - 1])
            }
          }
          if (this.invitationVal.length > 5) {
            setTimeout(() => {
              this.keyboardVisible = false
            }, 100);
          }
          break;
      }
    },
    clickItem(item) {
      this.getBindState(item)
      this.account = item
      const localFile = this.$store.state.wallet.localFile
      localFile.invitationAccount = item
      localStorage.setItem('isecsp_wallet', JSON.stringify(localFile))
      this.actionSheetVisible = false
    },
    getBindState(account_name) {
      api.isBind({account_name}).then(res => {
        console.log(res)
        if (res.code === 1 && res.data.is_bind) {
          this.isBind = true
          setTimeout(() => {
            this.$refs.bind.getActiveState()
          }, 50);
        }
        if (res.code === 1001) {
          this.isBind = false
        }
      })
    },
    bind(value) {
      if (value) this.isBind = true
    },
    initData() {
      const localFile = this.$store.state.wallet.localFile
      console.log('isbind active')
      // this.account = this.$store.state.wallet.assets.account
      this.accodunt = localFile.invitationAccount
      this.account = this.$store.state.wallet.assets.account;
      const wallets = localFile.wallets
      for (const item of wallets) {
        if (item.chain === 'eos') {
          this.eosWallets.push(item.accountNames[0])
        }
      }
      this.getBindState(this.account)
    }
  },
}
</script>

<style scoped>
.topshow {
  z-index:10001;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.action_layout {
  background-color: #fff;
  padding: 35px 50px;
}
.action_header {
  display: flex;
  align-items: center;
  font-size: 32px;
  margin-bottom: 50px;
}
.action_header div {
  flex: 1;
}
.action_header img {
  height: 50px;
}
.action_item {
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 10px #cfcfcf;
  display: flex;
  align-items: center;
  margin-top: 15px;
  height: 110px;
  box-sizing: border-box;
  position: relative;
}
.action_item img {
  height: 50px;
  position: absolute;
  left: 30px;
  top: 50%;
  transform: translate(0, -50%);
}
.action_item div {
  margin-left: 90px;
  font-size: 32px;
}
</style>
