<template>
    <vpage>
     <slot>
       <div style="background:black;height:100%;">
        <div class="header">
          <img class="ion_back" src="@/assets/img/u14.png" @click="back"> 
          <span style="color:orange;">资产包矿池</span>
        </div>
        <div style="padding:1.5rem 0;text-align: center;">
        <p style="color: #fff;font-size: .5rem;">{{mining_data.amount}} TBG  资产包</p>
        <p style="color: #fff;font-size: .4rem;">已挖矿时间  170 / 12000 H</p>
        </div>
        <div style=" text-align: center;"><img style="" class="ion_tbg" src="@/assets/img/tbg_selected.png"></div>
        <p style="padding:.7rem 0;text-align: center;font-size: 1.2rem;color: orange;">{{mining_data.mined}}</p>
        <p style="padding:.7rem 0;text-align: center;font-size: .5rem;color: #fff;">可收取：{{mining_data.collect_amount}} TBG</p>
        <div style=" bottom:20px;position:fixed;width:100%;" >
          <div class="charge" v-if="mining_data.state" @click="charges"><p>立即收取</p></div>
          <div class="no_charge" v-if="mining_data.state"><p>未满 24H 不可收取</p></div>
        </div>
       </div>
      
     </slot>
    </vpage>
    
</template>

<script>
import MyPage from '@/components/MyPage'
import {assetMiningDetails,assetMiningCharge} from '@/servers/invitation';


export default {
  components: {
    vpage: MyPage,
   },
  data() {
    return {
      log:true,
      mining_data:{},
    }
  },
  methods: {
       back() {
          this.$router.go(-1)
       },
       async charges() {
          try {
            const res = await assetMiningCharge({account_name:"tbtestuser1",mining_id:this.$route.params.mining_id})
            // console.log('withdrawHistory',res)
            if (res.code === 1) {
              console.log('withdrawHistory',res.data)
            }
          } catch (error) {
            console.log(error)
          }
       },
  },
  created(){
    // console.log('this',this);
    console.log(11111111111111111111111111111,this.$route.params.mining_id);
    assetMiningDetails({account_name:"tbtestuser1",mining_id:this.$route.params.mining_id}).then(res => {
        if (res.code === 1) {
        console.log('bindReferrer',res.data)
        this.mining_data=res.data;
        }
      })
  }
}
</script>

<style scoped>
p{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
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
.charge{
  border: 2px solid orange;
  color: orange;
  text-align: center;
  border-radius:10px;
  height: 100px;
  width: 70%;
  margin: 50px auto;
}
.charge p{font-size: 40px;line-height: 100px;}
.no_charge p{font-size: 40px;}
.no_charge{
  color: orange;
  text-align: center;
  border-radius:10px;
  padding: 30px 0;
  width: 70%;
  margin: 50px auto;
}
.ion_tbg{
  width: 4rem;   
}

</style>