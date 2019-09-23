<template>
  <div>
    <HeadPart></HeadPart>
    <div class="invite">
      <!--第一部分-->
      <div class="invite_a">
        <p class="invite_a_p1"><span>我的推荐链接</span></p>
        <div class="invite_a_left" id="invite_link" readonly="readonly">{{InviteLink}}</div>
        <div class="invite_a_right" ref="copy" data-clipboard-action="copy" data-clipboard-target="#invite_link" @click="copyLink">复制</div>
        <div style="clear: both"></div>
      </div>

      <!--第二部分-->
      <div class="invite_a invite_b">
        <p class="invite_a_p1"><span>推荐奖励</span></p>
        <p class="invite_b_p1">邀请的好友参与抢红包，您将获得好友所抢金额 1.5% 的奖励</p>
        <p class="invite_b_p1">每发出 1 POG 红包，您可获空投 1 CLUB</p>
      </div>

      <!--第三部分-->
      <div class="invite_a invite_c">
        <p class="invite_a_p1" ><span>推荐我的人</span></p>
        <p class="invite_c_p1" v-if="referName !=''">{{referName}}</p>
        <div style="display:flex;" v-if="referName ==''">
          <input class="input" type="text" style="margin:auto auto auto 0px;" v-model="inviteAccount" placeholder="请输入你的推荐人POG账号名"/>
          <div class="button" @click="checkInviteAccount">确定</div>
        </div>
        <div style="margin-top:10px;color:white" v-if="referName ==''">推荐人输入确定后不可更改，请谨慎输入</div>
      </div>

      <!--第四部分-->
      <div class="invite_a invite_d" v-if="myReferrals.length > 0">
        <p class="invite_a_p1"><span>我推荐的人</span></p>
        <div style="display:flex;flex-wrap: wrap;align-items: flex-start;">
          <div v-for="(item, index) in myReferrals" :key="index" style="width: 31%;padding:2px;font-size:12px;height: 5vh;line-height: 5vh;color: white;border: 1px solid;text-align: center">
            {{item.account_name}}
          </div>
        </div>
      </div>




    </div>
  </div>

</template>


<script>
  import { Toast } from 'vant';
  import HeadPart from '@/components/HeadPart/HeadPart';
  import { getReferrals ,setCheckRelation , inviteFriend} from '@/servers';
  export default {
    name: 'InviteFriends',
    components: {
      HeadPart
    },
    data() {
      return {
        InviteLink:"",//邀请链接
        copyBtn: null, //存储初始化复制按钮事件
        inviteAccount:'',
        myReferrals:[],//我的下线列表
        referName:""
      }
    },
    mounted(){
      this.CheakRelation();
      this.copyBtn = new this.clipboard(this.$refs.copy);
    },
    created() {
      this.getReferrals();
      this.timer = setInterval(()=>{
        if(this.$store.state.configIsOk != 0){
          console.log("this.$store.state.configIsOk:",this.$store.state.configIsOk)
          clearInterval(this.timer);
          if(this.$store.state.configIsOk === 1){
            this.InviteLink = location.href.split("#")[0]+'#/index/?invite='+this.$store.state.eosAccount.name;
          }
        }
      },500)
    },
    methods: {

      // 检查是否有人推荐我，是否有上线
      CheakRelation(){
          setCheckRelation("").then(res =>{
            if (res.code == 1 ) {
              this.referName =res.data.refer_name
            }
            
          }).catch(err =>{
            console.log(7777,res)
          })
      },
      // 复制链接
      copyLink() {
        /*这是点击按钮触发的点击事件*/
        let _this = this;
        let clipboard = _this.copyBtn;
        clipboard.on('success', function() {
          Toast('复制成功');
        });
        clipboard.on('error', function() {
          Toast("复制失败")
        });
      },
      // 检查邀请我的POG账号
      checkInviteAccount(){
        if( this.inviteAccount.length != 12){
          Toast('请输入正确的POG账号');
          return;
        }else{
          this.inviteFriend()

        }
      },
      inviteFriend(){
        let data = {
          account_name:this.$store.state.eosAccount.name,
          refer_name:this.inviteAccount
        }
        inviteFriend(data).then(res => {
          if(res.code == 1){
            // 建立关系后，重新调用检查关系接口
            this.CheakRelation();
          }else{
            Toast("建立失败："+res.desc);
          }
        }).catch(err =>{
          Toast('建立关系失败！');
        });
      },
      // 获取我的下线
      getReferrals(){
        getReferrals().then(res=>{
          console.log("获取我的下线:",res)
          if(res.code == 1){
            // for (let i = 0; i < 4 ;i++) {
            //  this.myReferrals.push({account_name:"uesr"+i})
            // }

            this.myReferrals = res.data;
          }
        }).catch(err=>{
          console.log("获取我的下线失败:",err)
        })
      },
    }
  }
</script>

<style scoped>
  .invite{
    padding: 2vh 4vw 4vh  4vw;
    padding-top: 10vh;
  }

  /*第一部分*/
  .invite_a{
    margin-bottom: 5vh;
  }
  .invite_a .invite_a_p1{
    margin: 0px 0px 1.5vh 0px;
    color: #ffac2f;
    padding-bottom: 0.5vh;
  }
  .invite_a .invite_a_p1 span{
    border-bottom:1px solid #ffac2f;
    padding-bottom: 0.3vh;
  }
  .invite_a .invite_a_left{
    width: 80%;
    float: left;
    background: #c13939;
    height: 8vh;
    line-height: 4vh;
    /*padding: 0px 5vw;*/
    text-align: center;
    color: white;
    font-size: 0.9rem;
  }
  .invite_a .invite_a_right{
    width: 18%;
    float: right;
    background: #c13939;
    height: 8vh;
    line-height: 8vh;
    text-align: center;
    color: white;
  }

  /*第二部分*/
  .invite_b .invite_b_p1{
    margin: 0.5vh 0px;
    color: white;
  }

  /*第三部分*/
  .invite_c .invite_c_p1{
    margin: 0px;
    background: #c13939;
    padding: 2vh;
    text-align: center;
    color: white;
  }
  .input{
    margin: auto auto auto 0px;
    width: 70%;
    /* border-radius: 10px; */
    /* border: 1px solid #FFBF60; */
    background-color: #c13939;
    margin-bottom: 30px;
    border: none;
    height: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 5px;
    color:aliceblue;
  }
  .button{
    width: 25%;
    margin: auto auto auto auto;
    background-color: #ff9900;
    color: white;
    font-size: 16px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 5px;
  }

  /*第四部分*/
  .invite_d table{
    text-align: center;
  }
  .invite_d table td{
    background: #c13939;
    padding: 1.5vh 0px;
    color: white;
    font-size: 0.9rem;
  }
</style>













