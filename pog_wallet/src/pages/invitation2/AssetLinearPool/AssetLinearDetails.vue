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
          <div class="asset_pool_data_item" style="width:25%;"><p :class="{font_red:item.amount<0}">{{item.amount}}</p><p class="font_silver">11111</p></div>
          <div class="asset_pool_data_item" style="width:25%;"><p>{{item.balance}}</p><p class="font_silver">11111</p></div>
         </div>
       </div>

      
     </slot>
    </vpage>
    
</template>

<script>
import MyPage from '@/components/MyPage'
import {LinearReleaseDetail,} from '@/servers/invitation';

export default {
  components: {
    vpage: MyPage,
   },
  data() {
    return {
      log:true,
      items:[
           {create_time:'1111-11-11',
           release_type:'首次购买推荐收益'
           ,amount:'+ 11111',balance:'1,111.11191'},
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
       LinearReleaseDetail({account_name:"tbgtestuser1"}).then(res => {
         if (res.code === 1) {
            console.log('bindReferrer',res.data)
            for(var i=0;i<res.data.length;i++){
              if(res.data[i].amount>0){
                switch (res.data[i].release_type) {
                    case 1:res.data[i].release_type='买入200TBG';break;
                    case 2:res.data[i].release_type='绑定';break;
                    case 3:res.data[i].release_type='参与TBG-I';break;
                    case 4:res.data[i].release_type='签到';break;
                    case 5:res.data[i].release_type='游戏';break;
                    case 6:res.data[i].release_type='挖矿';break;
                    case 7:res.data[i].release_type='挖矿推荐受益';break;
                    case 8:res.data[i].release_type='首次购买推荐收益';break;      
                    default: console.log('null');break;
                }
              }else{
                switch (res.data[i].release_type) {
                    case 1:res.data[i].release_type='释放';break;
                    case 2:res.data[i].release_type='卖出销毁';break; 
                    default: console.log('null');break;
                }
              }
            }
            this.items=res.data;
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