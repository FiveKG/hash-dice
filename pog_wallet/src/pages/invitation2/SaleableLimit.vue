<template >
    <vpage>
     <slot>
       <div style=" background-color: #fff;height:100%;">
        <div class="header">
          <img class="ion_back" src="@/assets/img/u14.png" @click="back"> 
          <span>可售额度</span>
        </div>
        <div class="content">
          <div style="position: relative;text-align: center;">
            <img class="ion_tbg" src="@/assets/img/tbg_selected.png"> 
            <p style="font-weight:600;" class="font_size_five">Token · Blockchain · Game</p>
            <p class="font_size_five">全球区块链去中心化游戏应用平台</p>
            <div class="num_tbg">
              <span class="font_size_five">可售余额</span>
              <span style="padding:0 2rem;"></span>
              <span style="font-weight:600;" class="font_size_five">{{amount[0]}} TBG</span>
            </div>
              <p style="color:RGB(255,153,0);font-size:0.45rem;margin-bottom:.3rem;">可售额度由买入资产包获得</p>
          </div>
          <div style="padding:4px 0;background:RGB(228,228,228);"></div>
          <div class="asset_pool_header" > 
              <span style="width:25%;">时间</span>
              <span style="width:25%;">明细</span>
              <span style="width:25%;">金额</span>
              <span style="width:25%;">余额</span>
          </div>
          <div class="asset_pool_data" v-for="item in items" :key='item.key'>
            <div class="asset_pool_data_item" style="width:25%;"><p>{{item.create_time}}</p></div>
            <div class="asset_pool_data_item" style="width:25%;"><p class="">{{item.info}}</p><p></p></div>
            <div class="asset_pool_data_item" style="width:25%;">
              <p class="font_red" v-if="item.info=='转出'">- {{item.amount[0]}}</p>
              <p v-if="!(item.info=='转出')">+ {{item.amount[0]}}</p>
              </div>
            <div class="asset_pool_data_item" style="width:25%;"><p>{{item.balance[0]}}</p></div>
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

export default {
  components: {
    vpage: MyPage,
   },
  data() {
    return {
      log:true,
      amount:'',
      items:[
          //    {create_time:'1111-11-11',
          //  info:'首次购买推荐收益'
          //  ,amount:'+ 11111',balance:'1,111.11191'},
        ],
    }
  },
  methods: {
       back() {
          this.$router.go(-1)
       },
       addComma(data){
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
      }
  },
  created(){
    // console.log('this',this);
const name = ["私募","释放","买入","转出","挖矿推荐收益","首次购买","首次购买推荐收益","卖出销毁","绑定","参与 TBG-I","挖矿",
"游戏","游戏邀请","签到","直接推荐","奖金","直接推荐 PK 奖金","三倍收益保障金","股东池分红","一行公排收益","三三公排收益","复投","提现","提现"]
const id = ['raise','release','buy','sell','mining_referrer','first_buy','first_buy_referrer','destroy','bind','tbg_1',
'mining','game','game_invite','check_in','invite','bingo','pk','protection','holder','sort','mode','repeat','withdraw','investment']

    api.SaleableAmount({account_name:this.$store.state.wallet.assets.account}).then(res => {
      if (res.code === 1) {
            this.items=res.data.detail;
            for(var i=0;i<this.items.length;i++){
            var Subscript=id.indexOf(this.items[i].info);
            this.items[i].info=name[Subscript];
            this.items[i].create_time=format(new Date(this.items[i].create_time), 'YYYY-MM-DD')

            this.items[i].amount = this.items[i].amount.split('.');
            this.items[i].balance = this.items[i].balance.split('.');
            this.items[i].balance[0] = this.addComma(this.items[i].balance[0]);
            }         
            this.amount=res.data.saleable_balance.split('.');
            this.amount[0]=this.addComma(this.amount[0]);
        }
      })
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
  border: 3px solid RGB(228,228,228);
  border-radius:7px;
  padding: 30px 0;
  margin: 25px 30px;

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
  vertical-align: middle;
}


div{
  background: #fff;
}
p{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
  color: #000000;
  font-size: 0.40rem;
}    
span{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
}
.font_size_five{
  font-size: 0.40rem;
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