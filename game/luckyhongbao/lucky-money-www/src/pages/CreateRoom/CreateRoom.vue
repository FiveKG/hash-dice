<template>
  <div>
    <HeadPart></HeadPart>
    <div class="amount">
      <div class="item" v-for="(item, index) in roomType.amount" :key="index" @click="selectAmount(item)" :style="roomInfo.amount == item ? 'background-color: #ff9900;' : ''">
        {{item}}POG
      </div>
    </div>
    <div class="amount_tips">请选择红包金额</div>
    <div class="num">
      <div class="item" v-for="(item, index) in roomType.num" :key="index" @click="selectNum(item)" :style="roomInfo.num == item ? 'background-color: #ff9900;' : ''">
        {{item}}份
      </div>
    </div>
    <div class="amount_tips">请选择红包份数</div>
    <div class="gameplay">
      <div class="gameplay_p" style="padding-top:2vh;margin:0px;"><span>红包房间创建规则</span></div>
      <p>1、每个房间创始红包由创建人发出 , 请保持您钱包账户或预红包房间创建规则存账户内余额大于您所选的红包金额</p>
      <p>2、可重复创建红包金额和个数均相同的房间</p>
      <p>3、每个房间72小时没人抢红包 , 则最后一个红包金额全部归创建人 , 已抢红包抵押将原路返回账号余额</p>
    </div>
    <!-- 创建按钮 -->
    <div class="create_button" v-if="!$store.state.sideBar">
      <div class="tips">
        <div class="info">{{roomInfo.amount}} POG 抢 {{roomInfo.num}}份</div>
        <div class="info">创建房间并发出 {{roomInfo.amount}}POG 创始红包</div>
      </div>
      <div class="button" @click="createRoom">确定创建</div>
    </div>
  </div>

</template>


<script>
  import HeadPart from '@/components/HeadPart/HeadPart';
  import { createRoom , storage } from '@/servers';
import { Toast } from 'vant';
  export default {
    name: 'CreateRoom',
    components: {
      HeadPart
    },
    data() {
      return {
        roomType:{
          amount:[0.1 , 0.2 , 0.5 , 1 , 2 , 5 , 10 , 20 , 50 , 100 , 200 , 500],
          num:[2, 3 , 5 , 10 , 20]
        },
        roomInfo:{
          amount:0.1,
          num:5
        }
      }
    },
    mounted(){
      
    },
    created() {
      
    },
    methods: {
      // 选择红包金额
      selectAmount(item){
        this.roomInfo.amount = item;
      },
      // 选择红包份数
      selectNum(item){
        this.roomInfo.num = item;
      },
      // 确认创建红包房间
      createRoom(){
        var that = this;
        let data = {
          club_id:this.$store.state.myClubId,
          amount:this.roomInfo.amount,
          quantity:this.roomInfo.num
        }
        if(data.amount === '' || data.quantity === ''){
          Toast('请选择房间规则');
          return;
        }
        if(this.$store.state.eosBalance < data.amount){
          Toast('余额不足 , 请充值后创建');
          return;
        }
        createRoom(data).then(res => {
          console.log("创建红包房间:",res)
          if(res.code == 1){
            setTimeout(function(){
              Toast('房间创建成功');
              storage.set('roomId',res.data);
              storage.set('roomAmount',data.amount);
              storage.set('roomType',data.quantity);
              that.$router.push({path: '/moneyclub'});
            },1000)
          }
        }).catch(err =>{
          console.log("创建红包房间失败:",err)
        });
      },
    }
  }
</script>

<style>
  .amount{
    padding-top: 10vh;
    width: 100%;
    display: inline-block;
  }
  .amount .item{
    width: 28%;
    margin-left: 2.5%;
    margin-right: 2.5%;
    margin-top: 10px;
    border-radius: 5px;
    height: 40px;
    color: #e2e2e2;
    text-align: center;
    line-height: 40px;
    display: table-row-group;
    float: left;
    background-color: #BC3A3E;
  }
  .amount_tips{
    width: 100%;
    text-align: center;
    color: #e2e2e2;
    margin-top: 20px;
  }
  .num{
    padding-top: 2vh;
    width: 100%;
    display: inline-block;
  }
  .num .item{
    width: 28%;
    margin-left: 2.5%;
    margin-right: 2.5%;
    margin-top: 10px;
    border-radius: 5px;
    height: 40px;
    color: #e2e2e2;
    text-align: center;
    line-height: 40px;
    display: table-row-group;
    float: left;
    background-color: #BC3A3E;
  }
  .gameplay{
    padding: 0vh 4vw 5vh 4vw;
    color: white;
    margin-bottom: 40px;
  }
  .gameplay p{
    /* margin:1.5vh 0px; */
  }
  .gameplay .gameplay_p{

    color: #ff9900;
    margin: 4vh 0px 2vh 0px;
    padding-bottom: 0.2vh;
    width: auto;
  }
  .gameplay .gameplay_p span{
    border-bottom: 1px solid #ff9900;
  }
  .create_button {
    width: 100%;
    height: 40px;
    display: flex;
    background-color: #BC3A3E;
    position: fixed;
    padding: 10px 0px 10px 0px;
    bottom: 0px;
  }
  .create_button .tips{
    width: 65%;
    height: 100%;
  }
  .create_button .tips .info{
    line-height: 20px;
    text-align: left;
    color:#ff9900;
    padding-left: 10px;
    font-size: 12px;
  }
  .create_button .button{
    text-align: center;
    color: white;
    line-height: 40px;
    margin: auto;
    padding: 0px 10px 0px 10px;
    background-color: #ff9900;
    border-radius: 5px;
    box-shadow: 2px 2px 5px #333333;
  }
</style>