<template >
    <vpage>
     <slot>
      <div style=" background-color: #fff;height:100%;">
        <div class="header">
          <img class="ion_back" src="@/assets/img/u14.png" @click="back"> 
          <span>我的分红</span>
        </div>
        <div class="content">
          <div style="background: rgb(247,247,247);width:100%;text-align: center;">
            <div style="width:100%;height:30px;"></div>
            <p>截止 169 期我的 TBG 可售数量</p>
            <div style="width:100%;height:10px;"></div>
            <p><span class="orange font_eight">69.0052 </span><span class="gray font_eight">2300</span></p>
            <p class="font_B font_five">TBG</p>
            <div style="width:100%;height:5px;"></div>
            <p>每 <span>1 TBG</span> 可分红 <span>0.0023 3215 UE</span></p>
            <div style="width:100%;height:5px;"></div>
            <p> <span class="orange">本期可分红 0.1609</span><span class="gray"> 3053 </span><span class="orange">UE</span></p>
            <div style="width:100%;height:20px;"></div>
            <div><img src="@/assets/img/u8.png" alt=""></div>
            <div style="width:100%;height:20px;"></div>
            <p>我已获得分红总额</p>
            <div style="width:100%;height:10px;"></div>
            <p><span class="font_B font_five">5.2510</span><span class="gray font_five"> 6210</span></p>
            <p class="font_B font_five">UE</p>
            <div style="width:100%;height:10px;"></div>
          </div>
          <div class="asset_pool_header" > 
              <span style="width:33.33%;">时间</span>
              <span style="width:33.33%;">期数</span>
              <span style="width:33.33%;">分红额</span>
          </div>
          <div class="asset_pool_data" v-for="item in items" :key='item.key'>
            <div class="asset_pool_data_item" style="width:33.33%;"><p>{{item.create_time}}</p></div>
            <div class="asset_pool_data_item" style="width:33.33%;"><p>{{item.reward[0]}}.{{item.reward[1][0]}} TBG</p></div>
            <div class="asset_pool_data_item" style="width:33.33%;"><p>{{item.reward[0]}}.{{item.reward[1][0]}} TBG</p></div>
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
      
      items:[
         
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
    // console.log('this1111111111',this.account);
    api.incomeDividend({account_name:this.$store.state.wallet.assets.account}).then(res => {
      console.log('bindReferrer',res);
      if (res.code === 1) {
        // this.schedule=(res.data.airdrop_quantity/res.data.airdrop_amount)*100;
        // this.items=res.data.detail;
        // for(var i=0;i<this.items.length;i++){
        //       this.items[i].create_time=format(new Date(this.items[i].create_time), 'YYYY-MM-DD')
        //       this.items[i].reward = this.items[i].reward.split('.')
        //       this.items[i].reward[1] = this.addSpace(this.items[i].reward[1])
        //       this.items[i].reward[1] = this.items[i].reward[1].split(' ');
        //     }   

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
  width: 100%;
  height: 1rem;
  line-height: 1rem;
}
.asset_pool_header span{
  text-align: center;
  font-size: 30px;
  display:inline-block;
}
.asset_pool_data{
  border: .5px solid RGB(228,228,228); 
  width: 100%;
  height: 1.4rem;
  line-height: 1.4rem;
}
.asset_pool_data_item{
  text-align: center;
  font-size: 30px;
  display:inline-block;
  font-weight:600;
}

p{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
  color: #000000;
  font-size:0.45rem;
}    
span{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
  color: #000000;
}
.font_A{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
}
.font_B{
  font-family: 'Bahnschrift Regular', 'Bahnschrift';
}
.font_five{
  font-size: 0.50rem;
}
.font_six{
  font-size: 0.60rem;
}
.font_eight{
  font-size: 0.80rem;
}
.font_weight_bold{
  font-weight: 600;
}
.gray{
  color: #BCBCBC;
}
.orange{
  color: orange;
}
.bold{
  font-weight: bold;
}
</style>