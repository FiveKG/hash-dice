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
              <span class=" bold">{{airdrop_quantity}} </span>
              <span class=" bold gray">8000 </span>
              <span class=" bold"> / </span>
              <span class=" bold">{{airdrop_amount}} </span>
              <span class=" bold gray"> 0000</span>
            </p>
            <div class="schedule_white"><div class="schedule_orange" :style="{ width: schedule + '%' }"></div></div>
            <p style="color:RGB(255,153,0);font-size:0.45rem;margin:.3rem 0;font-weight:500;">签到共空投 2,000,000 TBG，空投完即止</p>
            <div class="num_tbg">
              <span class="font_size_five">共获得奖励</span>
              <span style="padding:0 1.1rem;"></span>
              <span style="font_weight_bold font_size_five ">{{income}}</span>
              <span class="gray font_size_five"> 1206 </span>
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
            <div class="asset_pool_data_item" style="width:50%;"><p>{{item.reward}}</p></div>
          </div>
        </div>
      </div>
     </slot>
    </vpage>
    
</template>

<script>
import MyPage from '@/components/MyPage'
import {CheckIn,} from '@/servers/invitation';


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
            // {create_time:111111111111,reward:1111111111111,key:1},
            // {create_time:111111111111,reward:1111111111111,key:2},
            // {create_time:111111111111,reward:1111111111111,key:3},
            // {create_time:111111111111,reward:1111111111111,key:4},
            // {create_time:111111111111,reward:1111111111111,key:5},
            // {create_time:111111111111,reward:1111111111111,key:6},
            // {create_time:111111111111,reward:1111111111111,key:7},
         
        ],
    }
  },
  methods: {
       back() {
          this.$router.go(-1)
       },
  },
  created(){
    console.log('this1111111111',this.account);
    // CheckIn({account_name:"tbgtestuser1"}).then(res => {
    //   if (res.code === 1) {
    //         console.log('bindReferrer',res)
    //         this.airdrop_amount=res.data.airdrop_amount;
    //         this.airdrop_quantity=res.data.airdrop_quantity;
    //         this.income=res.data.income;
    //         this.items=res.data.properties;
    //         this.schedule=(res.data.airdrop_quantity/res.data.airdrop_amount)*100;
    //     }
    //   })

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