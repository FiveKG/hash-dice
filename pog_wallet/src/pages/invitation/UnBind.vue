<template>
  <div class="layout">
    <div class="p_header">
      <div class="row_account ">
        <div class="account"> 
          <div @click="clickAccount">
            <span>{{account}}</span> <img src="@/assets/img/invitation_arrow_d.png" />
          </div>
        </div>
        <div class="flex_center">
          <span>未激活</span>
          <img src="@/assets/img/invitation_arrow_r.png" />
        </div>
      </div>
      <div class="row_logo flex_center">
        <img src="@/assets/img/tbg_selected.png" alt="">
        <div class="tbg_name">Token <span>•</span> Blockchain <span>•</span> Game</div>
      </div>
    </div>
    <div class="p_content">
      <div class="invitation_code" @click="clickInput">
        <span v-if="!keyboardVal[0]">请输入6位激活码</span>
        <div class="invitation_number" v-for="item in keyboardVal" v-else>{{item}}</div>
      </div>
      <div class="icon_arrow">
        <img class="invitation_line">
        <img class="invitation_arrow">
      </div>
      <div class="account_name">
        <div v-if="parentType">
          <div v-if="parentType === 'random'">系统将随机分配您的邀请人</div>
          <div v-else-if="parentType === 'error'" style="color: #cd5150;">邀请码不存在</div>
          <div v-else>{{parentAccount}}</div>
        </div>
      </div>
      <div class="desc">请核对邀请人EOS账号</div>
      <div class="desc">无误后立即绑定，绑定后无法更改</div>
      <div class="btn">
        <div @click="clickBind" :style="{background: keyboardVal[5]&&parentType !== 'error' ? '#ff8e05':'#b4b4b4'}">立即绑定</div>
      </div>
      <div class="desc tip">
        <div>若无邀请人，请输入000000</div>
        <div>由系统随机分配您的邀请人</div>
      </div>
    </div>

    <v-ons-dialog
      modifier="width_pwd"
      cancelable
      style="background-color: rgba(0, 0, 0, .5);"
      :visible.sync="showDialog">
      <div class="dialog_layout">
        <div class="dialog_title">确定核对无误?</div>
        <div class="dialog_msg">{{keyboardVal.join('')}} - {{parentAccount}}</div>
        <div class="dialog_action">
          <span class="cancel" @click="showDialog = false">取消</span>
          <span @click="clickConfirm">确定</span>
        </div>
      </div>
    </v-ons-dialog>
    <loading v-show="loading"></loading>
  </div>
</template>

<script>
import { getCodeByAccount,bindReferrer } from '@/servers/invitation';

export default {
  props: ['keyboardVal','account'],
  data() {
    return {
      showDialog: false,
      loading: false,
      parentType: '',
      parentAccount: ''
    }
  },
  watch: {
    keyboardVal(val) {
      const code = val.join('')
      if (code.length === 6) {
        if (code === '000000') {
          this.parentType = 'random'
        } else {
          getCodeByAccount({account_name: this.account,refer_code: code}).then(res => {
            console.log(res)
            if (res.code === 1) {
              this.parentType = 'account'
              this.parentAccount = res.data.account_name
            }
            if (res.code === 1001) {
              this.parentType = 'error'
            }
          })
        }
      } else {
        this.parentType = ''
      }
    }
  },
  methods: {
    clickConfirm() {
      this.showDialog = false
      this.loading = true
      bindReferrer({account_name: this.account,refer_code: this.keyboardVal.join('')}).then(res => {
        console.log('bindReferrer',res)
        if (res.code === 1) {
          this.loading = false
          this.$toast('绑定成功')
          this.$emit('bind', true)
        }
      })
    },
    clickBind() {
      if (this.keyboardVal[5] && this.parentType !== 'error') {
        this.showDialog = true
      }
    },
    clickAccount() {
      this.$emit('showWallets', true)
    },
    clickInput() {
      this.$emit('showKeyboard', true)
    }
  },
}
</script>

<style scoped>
.flex_center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  padding-bottom: 120px;
  box-sizing: border-box;
}
.p_header {
  height: 30vh;
  background-image: url('~@/assets/img/invitation.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
}
.row_account {
  display: flex;
  align-items: center;
  color: #fff;
  padding: 0 30px;
  margin-top: 30px;
  font-size: 34px;
  font-weight: 800;
}
.row_account img {
  height: 40px;
  margin-left: 10px;
}
.account {
  flex: 1;
  display: flex;
  align-items: center;
}
.row_logo {
  flex: 1;
  background-color: rgba(255, 255, 255, 0.8);
  margin: 20px;
  padding: 20px 50px;
  border-radius: 15px;
  position: relative;
}
.row_logo img {
  height: 180px;
}
.tbg_name {
  position: absolute;
  bottom: 10px;
  font-size: 32px;
}
.tbg_name span {
  font-size: 40px;
  font-weight: bold;
}
.p_content {
  flex: 1;
  margin: 15px;
  background-color: #fafafa;
  box-shadow: 0 5px 10px #b4b4b4;
  border-radius: 10px;
  text-align: center;
  position: relative;
}
.invitation_code {
  margin: 0 auto;
  margin-top: 100px;
  width: 50vw;
  min-height: 46px;
  display: flex;
  justify-content: center;
  border-bottom: 1PX solid #b4b4b4;
}
.invitation_code span {
  color: #b4b4b4;
  font-size: 34px;
}
.invitation_number {
  flex: 1;
  font-size: 30px;
}
.icon_arrow img {
  display: block;
  margin: 0 auto;
}
.invitation_line {
  width: 1PX;
  height: 50px;
  background-color: #b4b4b4;
}
.invitation_arrow {
  width: 0;
  height: 0;
  border-top: 15px solid #b4b4b4;
  border-right: 15px solid transparent;
  border-left: 15px solid transparent;
  border-bottom: 15px solid transparent;
}
.account_name {
  font-size: 32px;
  font-weight: 420;
  height: 32px;
  margin-bottom: 50px;
}
.desc {
  color: #b4b4b4;
  font-size: 28px;
  font-weight: 450;
  line-height: 1.8;
}
.btn {
  margin-top: 50px;
}
.btn div {
  display: inline-block;
  background-color: #ff8e05;
  color: #fff;
  border-radius: 10px;
  padding: 20px 80px;
  font-size: 34px;
  font-weight: bold;
}
.tip {
  width: calc(100vw - 30px);
  position: absolute;
  bottom: 50px;
}
.dialog_layout {
  padding: 35px 50px;
  font-size: 32px;
}
/* .dialog_title {
} */
.dialog_msg {
  color: #ff8e05;
  margin-top: 30px;
}
.dialog_action {
  text-align: right;
  color: #005b8e;
  margin-top: 50px;
}
.cancel {
  margin-right: 80px;
}
</style>