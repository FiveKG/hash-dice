<template>
    <vpage>
     <slot>
       <div style=" background-color: #fff;height:100%;">
        <div class="header">
          <img class="ion_back" src="@/assets/img/u14.png" @click="back"> 
          <span>线性释放池明细</span>
        </div>
        <div class="asset_pool_header" > 
            <span style="width:25%;">时间</span>
            <span style="width:25%;">明细</span>
            <span style="width:25%;">金额</span>
            <span style="width:25%;">余额</span>
        </div>
         <div class="asset_pool_data" v-for="item in items" :key='item.key'>
          <div class="asset_pool_data_item" style="width:25%;"><p>{{item.create_time}}</p></div>
          <div class="asset_pool_data_item" style="width:25%;"><p class="font_fine">{{item.release_type}}</p></div>
          <div class="asset_pool_data_item" style="width:25%;">
            <p  :class="{font_red:item.amount[0]<0}" ><span v-if="!(item.amount[0]<0)">+ </span>{{item.amount[0]}}.{{item.amount[1][0]}}</p><p class="font_silver">{{item.amount[1][1]}}</p>
          </div>
          <div class="asset_pool_data_item" style="width:25%;"><p>{{item.balance[0]}}.{{item.balance[1][0]}}</p><p class="font_silver">{{item.balance[1][1]}}</p></div>
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
      items:[
          //  {create_time:'1111-11-11',
          //  release_type:'首次购买推荐收益'
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
        addComma(data){
        var a=data;var b='';var c=a.length+1;
          for(var i=0;c/3>i;i++){
            if(a.length>3){
              b=','+a.slice(a.length-3,a.length)+b;
              a=a.slice(0,a.length-3);
            }else if(a.length==3){
              b=a;
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

       api.LinearReleaseDetail({account_name:this.$store.state.wallet.assets.account}).then(res => {
         console.log(res.data);
         if (res.code === 1) {
           this.items=res.data.detail;
            for(var i=0;i<this.items.length;i++){
              var Subscript=id.indexOf(this.items[i].release_type);
              this.items[i].release_type=name[Subscript];
              this.items[i].create_time=format(new Date(this.items[i].create_time), 'YYYY-MM-DD')

              this.items[i].amount = this.items[i].amount.split('.');
              this.items[i].amount[1] = this.addSpace(this.items[i].amount[1]);
              this.items[i].amount[1] = this.items[i].amount[1].split(' ');

              this.items[i].balance = this.items[i].balance.split('.');
              this.items[i].balance[1] = this.addSpace(this.items[i].balance[1]);
              this.items[i].balance[0] = this.addComma(this.items[i].balance[0]);
              this.items[i].balance[1] = this.items[i].balance[1].split(' ');
            }   
        }
      })


  }
}
</script>

<style scoped>
div{
  background: #fff;
}
.header {
  padding: 30px 55px; 
  position: relative;
  font-size: 34px;
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
  margin-left: 80px;
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
  border: 1px solid RGB(228,228,228);
  padding: 30px 0;
  position: relative;
  bottom: 1px;
}
.asset_pool_data_item{
  text-align: center;
  font-size: 30px;
  font-weight: 600;
  display:inline-block;
  vertical-align: middle;
}

p{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
  color: #000000;
  font-size:0.40rem;
}    
span{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
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
</style>