<template>
  <vpage>
    <slot>
      <div class="un-bind">
        <div class="general-question">常见问题</div>
        <div class="banner">
          <div><img src="../../../public/img/u482.svg" alt=""></div>
          <span>Token · Blockchain · Game</span>
          <span>全球区块链去中心化游戏应用平台</span>
        </div>
        <div class="bind-content">
          <div class="bind-title">绑定邀请码</div>
          <div class="bind-subtitle">与好友一起玩TBG</div>
          <div @click="clickInput" class="number-wrapper">
            <div class="invite-number">{{inviteNumber}}</div>
          </div>
          <p class="input-suggest">绑定后无法更改，无误后立即绑定</p>
          <div @click="clickBind" :class="{'enable-confirm-btn':enableConfirm}" class="confirm-btn">绑定</div>
          <div class="bind-suggest">{{suggestText}}</div>
        </div>
      </div>
      <v-ons-dialog
        modifier="width_pwd"
        cancelable
        style="background-color: rgba(0, 0, 0, .5);"
        :visible.sync="showDialog">
        <div class="dialog_layout">
          <div class="dialog_title">确定核对无误?</div>
          <div class="dialog_msg">{{keyboardVal.join('')}} - {{inviterAccount}}</div>
          <div class="dialog_action">
            <span class="cancel" @click="showDialog = false">取消</span>
            <span @click="clickConfirm">确定</span>
          </div>
        </div>
      </v-ons-dialog>
      <loading v-show="loading"></loading>
    </slot>
  </vpage>
  <!-- <div class="layout">
    <div class="header">
      <p class="gray font_b" style="text-align: center;">{{account}}</p>
      <p class="gray font_b" style="text-align: center;">未激活</p>
    </div>
    <div class="content">
        <img class="ion_tbg" src="@/assets/img/tbg_selected.png"> 
        <p class="font_weight_bold">Token · Blockchain · Game</p>
        <p >全球区块链去中心化游戏应用平台</p>
    </div>
    <div style="width:100%;height:.5rem"></div>
    <div class="games">
    <div style="width:100%;height:.25rem"></div>
    <p class="games_title">查看 TBG 旗下游戏</p>
    <div class="games_group" >
      <img src="@/assets/invitation2/u1.png" alt="">
      <img src="@/assets/invitation2/u2.svg" alt="">
      <img src="@/assets/invitation2/u3.png" alt="">
      <img src="@/assets/invitation2/u4.svg" alt="">
      <img src="@/assets/invitation2/u5.png" alt="">
      <img src="@/assets/invitation2/u6.png" alt="">
      <span>></span>
    </div>
      <p>...</p>
    <div style="width:100%;height:.2rem"></div>
    </div>
    <p style="text-align: center;margin: .2rem 0;">规则及常见问题</p>
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
        <div v-if="inviterType">
          <div v-if="inviterType === 'random'">系统将随机分配您的邀请人</div>
          <div v-else-if="inviterType === 'error'" style="color: #cd5150;">您输入的推荐码不存在，请重新输入</div>
          <div v-else>{{inviterAccount}}</div>
        </div>
      </div>
      <div  class="desc">请核对邀请人EOS账号</div>
      <div  class="desc">无误后立即绑定，绑定后无法更改</div>
      <div class="btn">
        <div @click="clickBind" :style="{background: keyboardVal[5]&&inviterType !== 'error' ? '#ff8e05':'#b4b4b4'}">立即绑定</div>
      </div>
      <div class="desc">
        <div>若无邀请人，请输入000000</div>
        <div>由系统随机分配您的邀请人</div>
      </div>
    </div>
  </div> -->
</template>

<script>
// import { getCodeByAccount,bindReferrer } from '@/servers/invitation';

import api from '@/servers/invitation'
import MyPage from '@/components/MyPage'

export default {
  components:{
    vpage: MyPage,
  },
  props: ['keyboardVal','account'],
  data() {
    return {
      showDialog: false,
      loading: false,
      inviterAccount: '',
      inviterType: '',
      suggestTextGroup: {
        inviterAcc: '邀请人TBG账号:',
        globalNum: '全球合伙人专用链接，绑定后先参与TBG-I，再到TBG-II专享通道购买特惠TBG',
        noExsitCode: '您输入的推荐码不存在，请重新输入',
        noInviter: '若无邀请人，请输入000000，由系统随机分配您的邀请人'
      },
      enableConfirm: false
    }
  },
  computed: {
    suggestText () {
      switch (this.inviterType) {
        case 'random':
          return this.suggestTextGroup.noInviter;break;
        case 'account':
          return this.suggestTextGroup.inviterAcc + this.inviterAccount;break;
        case 'error':
          return this.suggestTextGroup.noExsitCode;break;
        case '':
          return this.suggestTextGroup.noInviter;
      }
    },
    inviteNumber () {
      console.log(this.keyboardVal)
      return this.keyboardVal[0] !== '' ? this.keyboardVal.join(' ') : '请输入6位激活码'
    }
  },
  watch: {
    keyboardVal(val) {
      this.enableConfirm = false
      const code = val.join('')
      if (code.length === 6) {
        if (code === '000000') {
          this.inviterType = 'random'
          this.enableConfirm = true
        } else {
          api.getCodeByAccount({account_name: this.account,refer_code: code}).then(res => {
            console.log(res)
            if (res.code === 1) {
              this.inviterType = 'account'
              this.inviterAccount = res.data.account_name
              this.enableConfirm = true
            }
            if (res.code === 1001) {
              this.inviterType = 'error'
            }
          })
        }
      } else {
        this.inviterType = ''
      }
    }
  },
  methods: {
    clickConfirm() {            
      this.showDialog = false
      this.loading = true
      console.log(22222222,this.account,this.keyboardVal.join(''));
       api.bindReferrer({account_name: this.account,refer_code:this.keyboardVal.join('')}).then(res => {
            console.log('bindReferrer',res)
          if (res.code === 1||res.code === 1020) {
            this.$store.commit('wallet/setTbgBindStatus', true)
            this.loading = false
            this.$toast('绑定成功')
            api.getType({account_name:this.account}).then(res => {    // 获取账号类型
              if (res.code === 1) {
                  if(res.data.account_type=="global"){
                    this.$router.push({     
                      name: 'TradingCenter',
                      params: {
                        buyPartner: 2,
                      }
                    })
                  }else{
                    this.$router.push({     
                      name: 'TradingCenter',
                    })
                  }
              }
            })
          }
        })
    },
    clickBind() {
      if (this.keyboardVal[5] && this.inviterType !== 'error') {
        this.showDialog = true
      }
    },
    clickAccount() {
      this.$emit('showWallets', true)
    },
    clickInput() {
      this.$emit('showKeyboard', true)
    }
  }
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
  background: rgb(255, 255, 255)
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
.btn div {
  display: inline-block;
  background-color: #ff8e05;
  color: #fff;
  border-radius: 10px;
  padding: 20px 80px;
  font-size: 34px;
  font-weight: bold;
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


.header {
  padding: 15px 55px;
  position: relative;
  font-size: 34px;
  background-color: RGB(243,243,243);
}
.content{
  position: relative;
  text-align: center;
}
.ion_tbg{
  width: 100px;
  height: 70px;
  padding: 20px 0 0 0;
}
.games{
  /* padding:0.5rem 0; */
  background-color:#fff;
  margin-bottom:0.04rem;
  text-align:center;
  border: 2px solid rgb(242, 242, 242);;
}
.games_title{
  font-size:0.43rem;
}
.games_group{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .2rem 1rem;
}
.games_group img{
  width: 11vw;
  height: 11vw;
}

.font_weight_bold{
  font-weight: 600;
}
p{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
  color: #000000;
  font-size: 0.4rem;
}
.font_b{
  font-family: 'Bahnschrift Regular', 'Bahnschrift';
}
.gray{
  color:#A1A1A1;
}




.un-bind {
  width: 100vw;
  min-height: 100vh;
  background: url('../../assets/invite/invite-bg.png') no-repeat center;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 20vw 0;
  box-sizing: border-box;
  position: relative;
  z-index: 9999999;
}
.general-question {
  padding: .3rem .35rem;
  background: rgba(255,255,255,.15);
  border-radius: .2rem;
  font-weight: 400;
  color: #fafafa;
  font-size: .36rem;
  position: absolute;
  right: 1rem;
  top: .6rem;
}
.banner {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fafafa; 
}
.banner>div {
  width: 2rem;
  height: 2rem;
  border-radius: .3rem;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: .5rem;
}
.banner>div img {
  width: 100%;
}
.banner>span:nth-of-type(1) {
  letter-spacing: 3px;
  font-weight: 200;
  margin-bottom: .2rem;
}
.banner>span:nth-of-type(2) {
  letter-spacing: 1px;
  font-size: .42rem;
}
.bind-content {
  width: 80vw;
  max-width: 8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.7rem;
  background: #fff;
  border-radius: .5rem;
  padding: .5rem .4rem;
  box-sizing: border-box;
}
.bind-title {
  font-size: .55rem;
  color: rgb(81, 88, 236);
  font-weight: 600;
}
.bind-subtitle {
  font-size: .38rem;
  color: rgba(0,0,0,.5);
  padding: .1rem 0;
}
.number-wrapper {
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  background: rgb(248, 249, 255);
  padding: .4rem;
  border-radius: .3rem;
  margin-top: .8rem;
}
.invite-number {
  text-align: center;
  font-size: .5rem;
  font-weight: bold;
  color: #000000;
  letter-spacing: .2rem;
}
.input-suggest {
  width: 100%;
  text-align: left;
  padding-top: .2rem;
  padding-bottom: .5rem;
  color: #888;
  font-size: .3rem;
}
.confirm-btn {
  width: 100%;
  text-align: center;
  padding: .4rem 0;
  background: rgb(222, 222, 222);
  border-radius: .3rem;
  color: #fafafa;
  pointer-events: none;
}
.confirm-btn.enable-confirm-btn {
  background: rgb(81, 83, 232);
  pointer-events: all;
}
.bind-suggest {
  color: #888;
  font-size: .3rem;
  padding: .3rem 0 .3rem 0;
  align-self: flex-start;
}
</style>