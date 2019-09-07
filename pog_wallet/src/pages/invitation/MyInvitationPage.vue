<template>
  <vpage>
    <slot>
      <div style="background-color: #fff;height: 100%;">
        <div class="header">
          <img src="@/assets/img/u14.png" @click="back">
          <span>我的邀请专页</span>
          <img src="@/assets/img/u124.png">
        </div>
        <div class="content">
            <img class="ion_tbg" src="@/assets/img/tbg_selected.png"> 
            <p class="font_weight_bold">Token · Blockchain · Game</p>
            <p >全球区块链去中心化游戏应用平台</p>
        </div>
        <div style="width:100%;height:.5rem"></div>
        <div class="games">
        <div style="width:100%;height:.5rem"></div>
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
        <div style="width:100%;height:.5rem"></div>
        </div>
        <div class="layout">
          <div>
            <div class="qrcode">
              <qrcode-vue :value="qrcode" :size="120" level="H"></qrcode-vue>
              <div class="qrcode_desc">扫码下载TBG钱包</div>
            </div>
          </div>
        </div>
        <div style="width:100%;height:.3rem"></div>
        <P v-if="account_type" class="Centered" style="font-size: 23px;color: rgb(0, 0, 0);">全球合伙人推荐码</P>
        <P v-if="!account_type" class="Centered" style="font-size: 23px;color: rgb(0, 0, 0);">推荐码</P>
        <div style="width:100%;height:.3rem"></div>
        <P class="font_b Centered" style="font-size: 23px;color: rgb(0, 0, 0);">{{invest_code[0]}}  {{invest_code[1]}}  {{invest_code[2]}}  {{invest_code[3]}}  {{invest_code[4]}}  {{invest_code[5]}}</P>
        <div style="width:100%;height:.3rem"></div>
        <div style="width:80%;margin:0 10%;">
          <div class="display_ib vertical_top " style="width:20%;"><div class="invite_icon" style=""><img style="width: 90%;height: 65%;margin: 17.5% 5%;" src="@/assets/img/tbg_selected.png" alt=""></div><p class="Centered">TBG</p></div>
          <div class="display_ib vertical_top " style="width:20%;"><P style=" font-size: 1rem;color: orange;" class="Centered">+</P></div>
          <div class="display_ib vertical_top " style="width:20%;"><div class="invite_icon"  style="background-color: #6699CC;"><img style="width: 90%;height: 80%;margin: 10% 5%;" src="@/assets/invitation2/u9.png" alt=""></div><p class="Centered">小鲸公链</p></div>
          <div class="display_ib vertical_top " style="width:20%;"><P style=" font-size: 1rem;color: orange;" class="Centered">+</P></div>
          <div class="display_ib vertical_top " style="width:20%;"><div class="invite_icon"  style="background-color: #737373;"><img style="width: 90%;height: 80%;margin: 14% 10%;" src="@/assets/invitation2/u10.svg" alt=""></div><p class="Centered">UE</p></div>
        </div>

      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import QrcodeVue from 'qrcode.vue'
import api from '@/servers/invitation'


export default {
  components: {
    vpage: MyPage,
    QrcodeVue
  },
  data() {
    return {
      qrcode: 'jsdfhbjsnkl',
      account_name:'',
      account_type:true,
      invest_code:[],
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    digitize(n) {
        return (n + "").split("").map(Number);
    }         
  },
  created(){
      this.account_name = this.$store.state.wallet.localFile.wallets.slice()[0].accountNames[0];
      api.getType({account_name:this.account_name}).then(res => {    // 获取账号类型
            if (res.code === 1) {
                res.data.account_type=="global"?this.account_type=true:this.account_type=false;
            }
          })
      api.getInvitation({account_name:this.account_name}).then(res => {    // 获取邀请码
            if (res.code === 1) {
                this.invest_code=this.digitize(res.data.invest_code);
            }
          })
  }
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
  margin-top: 60px;
  text-align: center;
}
.qrcode {
  display: inline-block;
  background-color: #fff;
  padding: 30px 35px;
  border-radius: 10px;
  box-shadow: 0 0 5px #c9c9c9;
}
.qrcode_desc {
  margin-top: 10px;
  font-size: 30px;
  color: gray;
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
.invite_icon{
    width: 1.3rem;
    height: 1.3rem;margin:0 auto;
    background-color: #fff;
    border-radius: 0.13333rem;
    box-shadow: 0 0 0.06667rem #c9c9c9;
}

.Centered{
  text-align: center;
}
.display_ib{
  display: inline-block;
}
p{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
  color: #000000;
  font-size: 0.4rem;
}
.font_b{
  font-family: 'Bahnschrift Regular', 'Bahnschrift';
}
.font_weight_bold{
  font-weight: 600;
}
.vertical_top{
  vertical-align: top;
}
</style>
