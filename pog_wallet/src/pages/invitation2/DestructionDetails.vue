<template>
   <v-ons-page>
   <div class="wrap">
      <!-- 头部信息 -->
      <div class="top-info">
        <img @click="goback()" src="@/assets/img/u14.png" alt="">
        <span>TBG</span>
     </div>

     <div class="log">
       <img src="../../../public/img/u482.svg" alt="">
       <p class="log_title"> 
          <span >Token ●</span>
          <span> Blockchain ●</span>
          <span> Game</span>
       </p>
       <p class="log_txt">全球区块链去中心化游戏应用平台</p>
    </div>


      <!-- 总发行 -->
      <div class="total">
          <p>TBG 总发行</p>
          <p>1,000,000,000 TBG，永不增发</p>
          <p>每次交易均销毁一定比例，直至21,000,000 TBG</p>
      </div> 


      <!-- 已销毁 -->
      <div class="destroyed">
          <p>已销毁</p>
          <p><span>{{destroy_amount[0]}}.</span><span>{{destroy_amount[1]}}</span> TBG </p>
          <p>余</p>
          <p>{{surplus_amount[0]}}.<span>{{surplus_amount[1]}}</span> TBG</p> 
      </div>

      <!-- 资产包挖矿及空投 -->
      <div class="miningassets">
          <p>资产包挖矿及空投</p>
          <p>占发行量 <span>80%</span> ，共 <span>800,000,000 TBG</span> </p>
          <p>其中：</p>
          <ul>
            <li>
                资产包挖矿
                <span>70%，700,000,000 TBG，</span> 
                挖完即止
            </li>
            <li>
             绑定 TBG 推荐关系空投 30 TBG进入线性释放池，限前10万名激活用户，空投完即止
            <span> <br> 共 3,000,000 TBG，占 0.3% <br></span> 
            <span>绑定后 48 小时未参与TBG-I即收回空投</span>   
            </li>
            <li>参与 TBG-I 即空投 150 TBG 进入线性释放池，限前30万名用户，空投完即止 
              <span> <br>共 45,000,000 TBG，占 4.5%</span>
            </li>
            <li>
              参与 TBG 旗下游戏均可获得空投，空投规则
              为<span>每投注1UE即空投0.05TBG <br> </span>
              <span>共 50,000,000 TBG，占 5%，</span>
            </li>
            <li>
              会员每日签到可获空投，空投完即止
              <span> <br> 共 2,000,000 TBG，占 0.2%</span>
            </li>
          </ul>
      </div>


      <!-- TBG基金 -->
      <div class="fund">
          <p>TBG 总发行</p>
          <p>占发行量<span> 5%</span>，共 <span>50,000,000 TBG</span> </p>
          <p>作为长期社区建设、管理等费用</p>
          <p> <span>发行第 2 年开始 5 年线性逐步释放</span> </p>
      </div>

      <!-- TBG 区块链实验室 -->
      <div class="laboratory">
          <p>TBG 总发行</p>
          <p>占发行量<span> 15%</span>，共 <span>150,000,000 TBG</span> </p>
          <p>作为长期社区建设、管理等费用</p>
          <p> <span>发行第 2 年开始 5 年线性逐步释放</span> </p>
      </div>

    </div>
    </v-ons-page>
</template>

<script type="text/ecmascript-6">
import api from '@/servers/invitation'


export default {
   name: '',
   data() {
       return {
         destroy_amount: '',
         surplus_amount: '',
       }
   },
  components: {},
  methods:{
      goback(){
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
    api.getDestory().then(res => {  //获取已销毁surplus_amount
          this.destroy_amount = res.data.destroy_amount.split('.')
          this.destroy_amount[1] = this.addSpace(this.destroy_amount[1])
          this.destroy_amount[0]=this.addComma(this.destroy_amount[0]);
          this.surplus_amount = res.data.surplus_amount.split('.')
          this.surplus_amount[1] = this.addSpace(this.surplus_amount[1])
          this.surplus_amount[0]=this.addComma(this.surplus_amount[0]);
        })
  }
}
</script>

<style scoped lang="less">
.wrap{
  background-color:#f6f6f6;
  font-family: '微軟正黑體 Regular', '微軟正黑體';
}
.top-info{
    height: 1.3rem;
    display: flex;
    align-items: center;
}
.top-info img{
    padding-left:0.3rem;
    height: 0.8rem;
    width:0.8rem;
}
.top-info span{
    font-family: 'Bahnschrift Regular', 'Bahnschrift';
    font-size:0.5rem;
    padding-left:0.1rem;
}



.log{
  text-align:center;
  background-color:#fff;
  width:100%;
  padding:0.5rem 0;
  color:#333;
  margin-bottom:0.04rem;
}
.log_title{
  padding:0.2rem 0;
  font-size:0.43rem;
  font-family: 'Bahnschrift Regular', 'Bahnschrift';
}
.log_txt{
  font-size:0.45rem;
}



.total{
  padding:.6rem;
  margin-top:.2rem;
  background-color:#fff;
  color: #FF9900;
  font-size:.4rem;
}
.total p{
  padding:0.1rem 0;
}
.total p:nth-child(1){
  font-size:.6rem;
}


.destroyed{
  padding:.6rem;
  margin-top:.2rem;
  background-color:#fff;
  font-size:.5rem;
}
.destroyed p{
  padding:0.1rem 0;
}
.destroyed p:nth-child(2){
  font-family: 'Bahnschrift Regular', 'Bahnschrift';
  font-weight: 400;
  font-size:.6rem;
}
.destroyed p:nth-child(2) span:nth-child(1){
  color:#FF9900;
}
.destroyed p:nth-child(2) span:nth-child(2){
  color:#BCBCBC;
}

.destroyed p:nth-child(4){
  font-size:.45rem;
}

.destroyed p:nth-child(4) span{
    color:#BCBCBC;
}
.miningassets{
  background-color:#fff;
  padding:.6rem;
  margin-top:.2rem;
}
.miningassets p:nth-child(1){
  color:#FF9900;
  font-size:.55rem;
}
.miningassets p{
  line-height:.8rem;
  font-size:.45rem
}
.miningassets p:nth-child(2) span{
  color:#FF9900;
}
.miningassets ul li{
  list-style:decimal;
  font-size: .4rem;
  line-height: .8rem;
}
.miningassets ul li:nth-child(1) span{
  color: #33CC99;
}
.miningassets ul li:nth-child(2) span:nth-child(1){
  color: #33CC99;
}
.miningassets ul li:nth-child(2) span:nth-child(2){
  color:#FF9900;
}
.miningassets ul li:nth-child(3) span{
  color: #33CC99;
}
.miningassets ul li:nth-child(4) span:nth-child(1){
  color:#FF9900;
}
.miningassets ul li:nth-child(4) span:nth-child(2){
  color: #33CC99;
}
.miningassets ul li:nth-child(5) span{
  color: #33CC99;
}


.fund{
  padding:.6rem;
  margin-top:.2rem;
  background-color:#fff;
  font-size:.4rem;
}
.fund p{
  padding:0.1rem 0;
}
.fund p:nth-child(1){
  font-size:.6rem;
   color: #FF9900;
}
.fund span{
  color:#FF9900;
}


.laboratory{
  padding:.6rem;
  margin-top:.2rem;
  background-color:#fff;
  font-size:.4rem;
}
.laboratory p{
  padding:0.1rem 0;
}
.laboratory p:nth-child(1){
  font-size:.6rem;
   color: #FF9900;
}
.laboratory span{
  color:#FF9900;
}
</style>
