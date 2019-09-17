<template>
    <vpage>
     <slot>
       <div style="  background-color: #fff;height:100%">
        <div class="header">
          <img class="ion_back" src="@/assets/img/u14.png" @click="back"> 
          <img class="ion_details" src="@/assets/invitation2/u20.png" @click="jump_details"> 
          <span>线性释放池</span>
        </div>
        <div class="content">
          <img class="ion_tbg" src="@/assets/img/tbg_selected.png"> 
          <p class="font_weight_bold">Token · Blockchain · Game</p>
          <p >全球区块链去中心化游戏应用平台</p>
          <!-- 有效资产包矿机 -->
          <div class="num_tbg" style=" float: left;  margin: 15px 0% 10px 8%;">
            <p style="margin-bottom:0.2rem;" >已释放</p>
            <p class="font_weight_bold">{{pool_data.released[0]}}.{{pool_data.released[1][0]}} {{pool_data.released[1][1]}}</p>
            <p class="font_weight_bold">TBG</p>
          </div>
          <div class="num_tbg" style=" float: right;  margin: 15px 8% 10px 0%;">
            <p style="margin-bottom:0.2rem;" >释放中...</p>
            <p class="font_weight_bold">{{pool_data.releasing[0]}}.{{pool_data.releasing[1][0]}} {{pool_data.releasing[1][1]}}</p>
            <p class="font_weight_bold">TBG</p>
          </div>
          <p style="color:RGB(255,153,0);margin-bottom:.3rem;clear:both;">所有进入释放池的TBG，从次日0:00开始释放</p>
        </div>
        <div style=" text-align: center;"><img style=" width: 4rem;height: auto;" src="@/assets/img/tbg_selected.png"></div>
        <p style="padding:.2rem 0;text-align: center;font-size: .9rem;color:rgb(51,204,153);">{{pool_data.balance_info}}</p>
        <p style="padding:.2rem 0 .3rem 0;text-align: center;font-size: .5rem;color: orange;">{{pool_data.level}}</p>
        <div style="width: 0.5rem;height: 0.1rem;background: rgb(51, 204, 153);margin: 0 auto;border-radius: 10px;"></div>
        <p style="padding:.3rem 0 0 0;text-align: center;">每日线性释放比例</p>
        <p style="padding:.0rem 0;text-align: center;font-weight:600;">{{pool_data.release_rate}}</p>  
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
      pool_data:{},
      a:true,
      b:true,
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
       addSpace (str) { 
          return str.slice(0,str.length-4) + " " +str.slice(-4)
        }
  },
  created(){
      // console.log('this',this);
      
      api.LinearReleasePool({account_name:this.$store.state.wallet.assets.account}).then(res => {
        if (res.code === 1) {
        console.log('bindReferrer',res.data)
        this.pool_data=res.data;

        this.pool_data.released = this.pool_data.released.split('.');
        this.pool_data.released[1] = this.addSpace(this.pool_data.released[1]);
        this.pool_data.released[1] = this.pool_data.released[1].split(' ');

        this.pool_data.releasing = this.pool_data.releasing.split('.');
        this.pool_data.releasing[1] = this.addSpace(this.pool_data.releasing[1]);
        this.pool_data.releasing[1] = this.pool_data.releasing[1].split(' ');
        }
      })
  }
}
</script>

<style scoped>
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
  width: 50px;
  height: 50px;
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
  padding: 0.3rem 0;
  width: 40%;
}

div{
  background: #fff;
}
p{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
  color: #000000;
  font-size:0.40rem;
}    
span{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
}
.font_weight_bold{
  font-weight: 600;
}


</style>