<template >
    <vpage>
     <slot>
      <div style=" background-color: #fff;height:100%;">
        <div class="header">
          <img class="ion_back" src="@/assets/img/u14.png" @click="back"> 
          <span>签到奖励明细</span>
        </div>
        <div class="content">
          <div style="position: relative;text-align: center;">
            <img class="ion_tbg" src="@/assets/img/tbg_selected.png"> 
            <p class="font_weight_bold">Token · Blockchain · Game</p>
            <p >全球区块链去中心化游戏应用平台</p>
            <p style="margin: .5rem 0 .1rem 0">
              <span class=" bold">{{airdrop_quantity[0]}}.{{airdrop_quantity[1][0]}} </span>
              <span class=" bold gray">{{airdrop_quantity[1][1]}} </span>
              <span class=" bold"> / </span>
              <span class=" bold">{{airdrop_amount[0]}}.{{airdrop_amount[1][0]}} </span>
              <span class=" bold gray">{{airdrop_amount[1][1]}} </span>
            </p>
            <div class="schedule_white"><div class="schedule_orange" :style="{ width: schedule + '%' }"></div></div>
            <p style="color:RGB(255,153,0);font-size:0.45rem;margin:.3rem 0;font-weight:500;">签到共空投 2,000,000 TBG，空投完即止</p>
            <div class="num_tbg">
              <span class="font_size_five">共获得奖励</span>
              <span style="padding:0 1.1rem;"></span>
              <span class="font_weight_bold font_size_five">{{income[0]}} </span>
              <span class="font_weight_bold font_size_five gray">{{income[1]}}</span>
              <!-- <span class="gray font_size_five"> 1206 </span> -->
              <span class="font_weight_bold font_size_five ">TBG</span>
            </div>
              <p style="color:RGB(255,153,0);margin-bottom:.3rem;font-weight:500;" class="font_size_five">签到奖励进入线性释放池释放</p>
          </div>
          <div style="padding:4px 0;background:RGB(228,228,228);"></div>
          <div class="asset_pool_header" > 
              <span style="width:50%;">时间</span>
              <span style="width:50%;">明细</span>
          </div>
          <div class="asset_pool_data" v-for="item in items" :key='item.key'>
            <div class="asset_pool_data_item" style="width:50%;"><p>{{item.create_time}}</p></div>
            <div class="asset_pool_data_item" style="width:50%;"><p>{{item.reward}} TBG</p></div>
          </div>
        </div>
      </div>
     </slot>
    </vpage>
    
</template>

<script>
import MyPage from '@/components/MyPage'
import api from '@/servers/invitation'
import { format, parse } from 'date-fns'
import {Decimal} from 'decimal.js'


export default {
  components: {
    vpage: MyPage,
   },
  data() {
    return {
      log:true,
      airdrop_amount:'',
      airdrop_quantity:'',
      income:'',
      schedule: '',
      items:[
         
        ],
    }
  },
  methods: {
       back() {
          this.$router.go(-1)
       },
       addSpace (str) { //修改已销毁数据
          return str.slice(0,str.length-4) + " " +str.slice(-4)
        },
         addComma(data){  //修改已销毁数据
        var a=data;var b='';var c=a.length;
          for(var i=0;c/3>i;i++){
            if(a.length>3){
              b=','+a.slice(a.length-3,a.length)+b;
              a=a.slice(0,a.length-3);
            }else{
              b=a+b;
            }
          }
          return b;
      },
  },
  created(){
    // console.log('this1111111111',this.account);
    api.CheckInDetail({account_name:this.$store.state.wallet.assets.account}).then(res => {
      console.log('bindReferrer',res);
      if (res.code === 1) {
          this.schedule = new Decimal(res.data.airdrop_quantity).div(new Decimal(res.data.airdrop_amount)).mul(new Decimal(100)).toFixed(4)

          this.airdrop_amount = res.data.airdrop_amount
          this.airdrop_amount = this.airdrop_amount.split('.')
          this.airdrop_amount[1] = this.addSpace(this.airdrop_amount[1])
          this.airdrop_amount[0]=this.addComma(this.airdrop_amount[0]);
          this.airdrop_amount[1] = this.airdrop_amount[1].split(' ');

          this.airdrop_quantity = res.data.airdrop_quantity
          this.airdrop_quantity = this.airdrop_quantity.split('.')
          this.airdrop_quantity[1] = this.addSpace(this.airdrop_quantity[1])
          this.airdrop_quantity[0]=this.addComma(this.airdrop_quantity[0]);
          this.airdrop_quantity[1] = this.airdrop_quantity[1].split(' ');

          this.income=this.addSpace(res.data.income);
          this.income = this.income.split(' ');
            for(let i=0;i<res.data.detail.length;i++){
              res.data.detail[i].create_time=format(new Date(res.data.detail[i].create_time), 'YYYY-MM-DD')
              res.data.detail[i].reward=res.data.detail[i].reward.slice(0,res.data.detail[i].reward.length-4)
            }
            this.items=res.data.detail;
        }
      })
  }
}
</script>

<style scoped>
div{
  background: #fff;
}
.header{
  position: fixed;
  width: 100%;
  z-index: 1000;
  font-size: 34px;
  background: RGB(228,228,228);
  height: 100px;
  text-align: center;
}
.ion_back {
  width: 70px;
  height: 70px;
  position: absolute;
  left: 45px;
  top: 50%;
  transform: translate(0, -50%);
}
.header span{
  position: absolute;
  left: 120px;
  top: 48%;
  transform: translate(0, -50%);
}
.content{
  position: relative;
  top: 100px;
}
.ion_tbg{
  width: 130px;
  height: 100px;
  padding: 20px 0 0 0;
}
.num_tbg{
  border: 3px solid RGB(228,228,228);
  border-radius:7px;
  padding: 30px 0;
  margin: 25px 30px;
}
.schedule_white{
  width: 90%;
  height: 15px;
  border-radius: 20px;
  margin: 0 auto;
}
.schedule_orange{
  width: 50%;
  height: 100%;
  background:orange;
  border-radius: 20px;
}
.asset_pool_header{
  border: 1px solid RGB(228,228,228);
  padding: 20px 0;
}
.asset_pool_header span{
  text-align: center;
  font-size: 30px;
  display:inline-block;
}
.asset_pool_data{
  border: .5px solid RGB(228,228,228);
  padding: 30px 0;
}
.asset_pool_data_item{
  text-align: center;
  font-size: 30px;
  display:inline-block;
  font-weight:600;
}
/* 
    position: absolute;
    overflow: hidden;
    top: 0px;
    width: 100%;
    z-index: 10000;
    background: white; */
p{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
  color: #000000;
  font-size:0.40rem;
}    
span{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
}
.font_A{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
}
.font_B{
  font-family: 'Bahnschrift Regular', 'Bahnschrift';
}
.font_size_five{
  font-size: 0.40rem;
}
.font_weight_bold{
  font-weight: 600;
}
.gray{
  color: #BCBCBC;
}
.bold{
  font-weight: bold;
}
</style>