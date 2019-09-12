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
              <span style="font-weight:600;" class="font_size_five">{{amount}} TBG</span>
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
            <div class="asset_pool_data_item" style="width:25%;"><p :class="{font_red:item.amount<0}">{{item.amount}}</p></div>
            <div class="asset_pool_data_item" style="width:25%;"><p>{{item.balance}}</p></div>
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
  },
  created(){
    // console.log('this',this);
    api.SaleableAmount({account_name:this.$store.state.wallet.assets.account}).then(res => {
      if (res.code === 1) {
            console.log(this.$store.state.wallet.assets.account,res)
            // for(var i=0;i<res.data.length;i++){
            //   if(res.data[i].amount>0){
            //     switch (res.data[i].release_type) {
            //         case 1:res.data[i].release_type='买入200TBG';break;
            //         case 2:res.data[i].release_type='绑定';break;
            //         case 3:res.data[i].release_type='参与TBG-I';break;
            //         case 4:res.data[i].release_type='签到';break;
            //         case 5:res.data[i].release_type='游戏';break;
            //         case 6:res.data[i].release_type='挖矿';break;
            //         case 7:res.data[i].release_type='挖矿推荐受益';break;
            //         case 8:res.data[i].release_type='首次购买推荐收益';break;      
            //         default: console.log('null');break;
            //     }
            //   }else{
            //     switch (res.data[i].release_type) {
            //         case 1:res.data[i].release_type='释放';break;
            //         case 2:res.data[i].release_type='卖出销毁';break; 
            //         default: console.log('null');break;
            //     }
            //   }
            // }
            this.amount=res.data.saleable_balance;
            this.items=res.data.detail;
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
/* 
    position: absolute;
    overflow: hidden;
    top: 0px;
    width: 100%;
    z-index: 10000;
    background: white; */
</style>