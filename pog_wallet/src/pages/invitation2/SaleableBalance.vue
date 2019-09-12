<template >
    <vpage>
     <slot>
     <div style=" background-color: #fff;height:100%;">
        <div class="header">
          <img class="ion_back" src="@/assets/img/u14.png" @click="back"> 
          <span>可售余额</span>
        </div>
        <div class="content">
          <div style="position: relative;text-align: center;">
            <img class="ion_tbg" src="@/assets/img/tbg_selected.png"> 
            <p class="font_weight_bold">Token · Blockchain · Game</p>
            <p>全球区块链去中心化游戏应用平台</p>
            <div class="num_tbg">
              <div style="display: inline-block;width:30%;"><span style="line-height: 1.1rem;">可售余额</span></div>
              <div style="display: inline-block;width:60%;text-align: right;">
                <span class="font_B " style="line-height: 1.1rem;">{{saleable_amount[0]}}.{{saleable_amount[1][0]}}</span>
                <span class="font_B " style="line-height: 1.1rem;color:rgb(161, 161, 161);"> {{saleable_amount[1][1]}} </span>
                <span style="line-height: 1.1rem;" class="font_B ">TBG</span>
              </div>
            </div>
              <p style="color:RGB(255,153,0);font-size:0.45rem;margin-bottom:.3rem;">可售余额由线性释放池释放获得</p>
          </div>
          <div style="padding:4px 0;background:RGB(228,228,228);"></div>
          <div class="asset_pool_header" > 
              <span style="width:25%;">时间</span>
              <span style="width:25%;">明细</span>
              <span style="width:25%;">金额</span>
              <span style="width:25%;">余额</span>
          </div>
          <div class="asset_pool_data" v-for="item in items" :key='item.key'>
            <div class="asset_pool_data_item" style="width:25%;"><p style="font-size: 0.38rem;" >{{item.create_time}}</p></div>
            <div class="asset_pool_data_item" style="width:25%;"><p style="font-size: 0.38rem;" class="font_fine">{{item.info}}</p></div>
            <div class="asset_pool_data_item" style="width:25%;"><p style="font-size: 0.38rem;" :class="{font_red:item.amount<0}">{{item.amount}}</p><p  style="font-size: 0.38rem;" class="font_silver">11111</p></div>
            <div class="asset_pool_data_item" style="width:25%;"><p style="font-size: 0.38rem;" >{{item.balance}}</p><p  style="font-size: 0.38rem;" class="font_silver">11111</p></div>
          </div>
        </div>
      </div>
     </slot>
    </vpage>
    
</template>

<script>
import MyPage from '@/components/MyPage'
import api from '@/servers/invitation'



export default {
  components: {
    vpage: MyPage,
   },
  data() {
    return {
      log:true,
      saleable_amount:'',
      items:[
          //        {create_time:'1111-11-11',
          //  info:'首次购买推荐收益'
          //  ,amount:'+ 11111',balance:'1,111.11191'},
        ],
    }
  },
  methods: {
       back() {
          this.$router.go(-1)
       },
       addSpace (str) { 
        return str.slice(0,str.length-4) + " " +str.slice(-4)
        },
  },
  created(){
    // console.log('this',this);
const type = [
              {NAME:"私募",ID:'raise'},
              {NAME:"释放",ID:'release'},
              {NAME:"转出",ID:'buy'},
              // {NAME:"买入",ID:'sell'},
              {NAME:"买入",ID:'买入'},
              {NAME:"挖矿推荐收益",ID:'mining_referrer'},
              {NAME:"首次购买",ID:'first_buy'},
              {NAME:"首次购买推荐收益",ID:'first_buy_referrer'},
              {NAME:"卖出销毁",ID:'destroy'},
              {NAME:"绑定",ID:'bind'},
              {NAME:"参与 TBG-I",ID:'tbg_1'},
              {NAME:"挖矿",ID:'mining'},
              {NAME:"游戏",ID:'game'},
              {NAME:"游戏邀请",ID:'game_invite'},
              {NAME:"签到",ID:'check_in'},
              {NAME:"直接推荐",ID:'invite'},
              {NAME:"奖金",ID:'bingo'},
              {NAME:"直接推荐 PK 奖金",ID:'pk'},
              {NAME:"三倍收益保障金",ID:'protection'},
              {NAME:"股东池分红",ID:'holder'},
              {NAME:"一行公排收益",ID:'sort'},
              {NAME:"三三公排收益",ID:'mode'},
              {NAME:"复投",ID:'repeat'},
              {NAME:"提现",ID:'withdraw'},
              {NAME:"提现",ID:'investment'},
]
api.SaleableBalance({account_name:this.$store.state.wallet.assets.account}).then(res => {
  console.log(res.data.detail)
    if (res.code == 1) {
      this.items=res.data.detail;
      
      for(var i=0;i<this.items.length;i++){
        console.log(1);
        for( var l=0;l<this.items.length;l++){
              if(this.items[l].info==type[l].ID){
                this.items[l].info=type[l].NAME;
                }
              }
            
            }


            this.saleable_amount = res.data.saleable_amount.split('.');
            this.saleable_amount[1] = this.addSpace(this.saleable_amount[1]);
            this.saleable_amount[1] = this.saleable_amount[1].split(' ');
          }
      }
    )
  }
}
</script>

<style scoped>
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
  border: 2px solid RGB(228,228,228);
  border-radius:7px;
  width:90% ;
  height: 1.1rem;
  margin: 25px 5%;
  font-size: 0.4rem;
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
  display:inline-block;
  font-weight:600;
  vertical-align: middle;
}


div{
  background: #fff;
}
p{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
  color: #000000;
  font-size:0.4rem;
} 
span{
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
.font_fine{
  font-weight: 400;
}
.font_silver{
  color: #BCBCBC;
}
.font_red{
  color: #FF0000;
}
/* 
    position: absolute;
    overflow: hidden;
    top: 0px;
    width: 100%;
    z-index: 10000;
    background: white; */
</style>