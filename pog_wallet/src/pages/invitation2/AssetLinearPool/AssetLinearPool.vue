<template>
    <vpage>
     <slot>
       <div style="  background-color: #fff;height:100%">
        <div class="header">
          <img class="ion_back" src="@/assets/img/u14.png" @click="back"> 
          <img class="ion_details" src="@/assets/img/u14.png" @click="jump_details"> 
          <span>资产包矿池</span>
        </div>
        <div class="content">
          <img class="ion_tbg" src="@/assets/img/tbg_selected.png"> 
          <p style="font-weight:600;font-size:0.45rem;">Token · Blockchain · Game</p>
          <p style="font-size:0.45rem;">全球区块链去中心化游戏应用平台</p>
          <!-- 有效资产包矿机 -->
          <div class="num_tbg" style=" float: left;  margin: 15px 0% 10px 8%;">
            <p style="font-size:0.45rem;">已释放</p>
            <p style="font-weight:600;font-size:0.45rem;">{{pool_data.released}}</p>
            <p style="font-weight:600;font-size:0.45rem;">TBG</p>
          </div>
          <div class="num_tbg" style=" float: right;  margin: 15px 8% 10px 0%;">
            <p style="font-size:0.45rem;">已释放</p>
            <p style="font-weight:600;font-size:0.45rem;">{{pool_data.releasing}}</p>
            <p style="font-weight:600;font-size:0.45rem;">TBG</p>
          </div>
          <p style="color:RGB(255,153,0);font-size:0.45rem;margin-bottom:.3rem;clear:both;">收益需收取才可至线性释放池释放</p>
        </div>
        <div style=" text-align: center;"><img style=" width: 4rem;height: auto;" src="@/assets/img/tbg_selected.png"></div>
        <p style="padding:.2rem 0;text-align: center;font-size: 1.2rem;color:rgb(51,204,153);">1.1921 3251</p>
        <p style="padding:.2rem 0 .3rem 0;text-align: center;font-size: .5rem;color: orange;">海蓝会员</p>
        <div style="width: 0.5rem;height: 0.1rem;background: rgb(51, 204, 153);margin: 0 auto;border-radius: 10px;"></div>
        <p style="padding:.3rem 0 0 0;text-align: center;font-size:0.45rem;">每日线性释放比例</p>
        <p style="padding:.0rem 0;text-align: center;font-weight:600;font-size:0.45rem;">{{pool_data.release_rate}}</p>  
       </div>
      
     </slot>
    </vpage>
    
</template>

<script>
import MyPage from '@/components/MyPage'
import {LinearReleasePool,} from '@/servers/invitation';


export default {
  components: {
    vpage: MyPage,
   },
  data() {
    return {
      log:true,
      pool_data:{},
    }
  },
  methods: {
       back() {
          this.$router.go(-1)
       },
       jump_details() {
          this.$router.push({
          name: 'AssetLinearDetails'
        })
       },
  },
  created(){
      // console.log('this',this);
      
      LinearReleasePool({account_name:"tbgtestuser1"}).then(res => {
        if (res.code === 1) {
        console.log('bindReferrer',res.data)
        this.pool_data=res.data;
        }
      })
  }
}
</script>

<style scoped>
div{
  background: #fff;
}
.page__content{
  background-color: #fff;
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
.ion_details{
  width: 70px;
  height: 70px;
  position: absolute;
  right: 45px;
  top: 50%;
  transform: translate(0, -50%);
}
.header span{
  margin-left: 80px;
}
.content{
  position: relative;
  text-align: center;
}
.ion_tbg{
  width: 100px;
  height: 70px;
  padding: 20px 0 0 0;
}
.num_tbg{
  border: 3px solid RGB(228,228,228);
  border-radius:7px;
  padding: 50px 0;
  width: 40%;
}

</style>