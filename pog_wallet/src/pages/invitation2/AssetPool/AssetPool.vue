<template>
    <vpage>
     <slot>
       <div class="asset_pool">
        <div class="header">
          <img class="ion_back" src="@/assets/img/u14.png" @click="back"> 
          <span>资产包矿池</span>
        </div>
        <div class="content">
          <img class="ion_tbg" src="@/assets/img/tbg_selected.png"> 
          <p class="font_weight_bold">Token · Blockchain · Game</p>
          <p >全球区块链去中心化游戏应用平台</p>
          <!-- 有效资产包矿机 -->
          <div class="num_tbg" v-if="log">
            <span style="color:RGB(255,153,0);font-size:0.8rem;">74.6124 </span>
            <span style="color:rgb(161, 161, 161);font-size:0.8rem;">1206 </span>
            <span style="color:RGB(255,153,0);font-size:0.8rem;">TBG</span>
          </div>
          <!-- 已结束资产包矿机 -->
          <div class="num_tbg" v-if="!log">
            <p >已挖矿至线性释放池</p>
            <p style="padding-bottom: 0.1rem;" class="font_weight_bold">74.6124 1206</p>
            <p class="font_weight_bold">TBG</p>
        </div>
          <p style="color:RGB(255,153,0);padding-bottom: .3rem;">收益需收取才可至线性释放池释放</p>
        </div>
        <div class="asset_pool"> 
          <div class="asset_pool_select"> 
              <span @click="SwitchL" :class="{Orange:log,silver:!log}">有效资产包矿机 - {{mining_count}}</span>
              <span class="silver">|</span>
              <span @click="SwitchR" :class="{Orange:!log,silver:log}">已结束资产包矿机 - {{mined_count}}</span>
          </div>
          <!-- 有效资产包矿机 -->
          <div class="asset_pool_header" v-if="log"> 
              <span style="width:35%;">资产包</span>
              <span style="width:25%;">已挖矿时间</span>
              <span style="width:20%;">已挖矿</span>
              <span style="width:20%;">查看</span>
          </div>
          <div v-if="log">
          <div class="asset_pool_data"  v-for="item in start_mined" :key='item.key'>
            <div class="asset_pool_data_item" style="width:35%;">
              <img style="display:inline-block;" src="@/assets/img/tbg_selected.png">
              <div style="margin:0 auto;display:inline-block;"><p>{{item.amount}}TBG</p><p>{{item.per_hour_mining}}/H</p></div>
            </div>
            <div class="asset_pool_data_item" style="width:25%;top:.2rem;"><p>{{item.mining_time}}</p><p style="font-size: .1rem;">-</p><p>12000</p></div>
            <div class="asset_pool_data_item" style="width:20%;"><p>{{item.mining_income}}</p><p>TBG</p></div>
            <div class="asset_pool_data_item" style="width:20%;top:0.1px;">
              <div class="check_details" @click="orderDetails(item.mining_id)"><p style="padding:5px 0 0 0;">查看</p><p style="padding:0 0 5px 0;">详情</p></div>
            </div>
          </div>
          </div>
          <!-- 已结束资产包矿机 -->
          <div class="asset_pool_header" v-if="!log"> 
              <span style="width:40%;">资产包</span>
              <span style="width:30%;">已挖矿时间</span>
              <span style="width:30%;">已挖矿</span>
          </div>
          <div v-if="!log">
          <div class="asset_pool_data" v-for="item in over_mined" :key='item.key'>
            <div class="asset_pool_data_item "  style="width:40%;">
              <img style="display:inline-block;" src="@/assets/img/tbg_selected.png">
              <div style="margin:0 auto;display:inline-block;"><p>{{item.amount}}TBG</p><p>{{item.per_hour_mining}}/H</p></div>
            </div>
            <div class="asset_pool_data_item " style="width:30%;top:.2rem;"><p>{{item.mining_time}}</p><p style="font-size: .1rem;">-</p><p>12000</p></div>
            <div class="asset_pool_data_item " style="width:30%;"><p>{{item.mined_income}}</p><p>TBG</p></div>
          </div>
          </div>
          <div style="width: 100%;height: 1.6rem;"><p></p></div>
        </div>
        <div class="cha">
          <div class="charge" @click="charges"><p>一键收取</p></div>
        </div>     
      </div>
     </slot>
    </vpage>
    
</template>

<script>

import MyPage from '@/components/MyPage'
import {effectiveAssets,overAssets,assetMiningCharge,isBind} from '@/servers/invitation';
import axios from 'axios';


export default {
  components: {
    vpage: MyPage,
   },
  data() {
    return {
        log:true,
        //有效矿机
        mining_count:'',
        mined_count:'',
        mined_amount:'',
        start_mined:[
                    // {amount:1,per_hour_mining:1,mining_time:1,mining_income:1,mining_id:1},
                    // {amount:1,per_hour_mining:1,mining_time:1,mining_income:1,mining_id:1},
        ],
        // 已结束矿机
        over_mined:[
           
        ],
    }
  },
  methods: {
       back() {
          this.$router.go(-1)
       },
       orderDetails(id) {
         console.log(11111111111112,id);
          this.$router.push({
          name: 'MiningDetails',
          params: {
            mining_id: id
          }
        })
       },
       SwitchL() {
          this.log=true;
       },
       SwitchR() {
          this.log=false
       },
       async charges() {
          try {
            var id=[];
            for(var i=0;i<this.start_mined.length;i++){
              id.push(this.start_mined[i].mining_id);
            }
            const res = await assetMiningCharge({account_name:"tbtestuser1",mining_id:id})
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
      // console.log(22222222222222222222222,this.$store.state.wallet.localFile.wallets.slice());
      // console.log(33333333333333333333,this.$store.state.wallet.localFile.wallets.slice()[0].accountNames[0]);
      //获取有效矿机
      effectiveAssets({account_name:"yujinsheng11"}).then(res => {
        console.log('111111111111111111111111',res)
        if (res.code === 1) {
        this.start_mined=res.data.mining_info;
        this.mining_count=res.data.mining_count;
        this.mined_count=res.data.mined_count;
        this.mining_amount=res.data.mining_amount;
        }
      })
      // 获取结束矿机
      overAssets({account_name:"yujinsheng11"}).then(res => {
        console.log('bindReferrer',res);
        if (res.code === 1) {
        this.over_mined=res.data.mining_info;
        }
      })
  
    
  },
}
</script>

<style scoped>
.asset_pool{
  background-color: #fff;
  height: 100%;
}
.header {
  padding: 30px 55px;
  position: relative;
  font-size: 34px;
  background-color: RGB(243,243,243);
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
  margin: 25px 30px;
}
.asset_pool{

}
.asset_pool_select{
  border: 30px solid RGB(243,243,243);
  padding: 30px 0;
  background-color: #fff;
  text-align: center;
}
.asset_pool_select span{
  padding: 0 10px;
  font-size:30px;
}
.asset_pool_header{
  border: 1px solid RGB(243,243,243);
  padding: 20px 0;
}
.asset_pool_header span{
  text-align: center;
  font-size: 30px;
  display:inline-block;
}
.asset_pool_data{
  border: 1px solid RGB(228,228,228);
  height: 130px;
  width: 100%;
}
.asset_pool_data_item{
  height: 80%;
  text-align: center;
  font-size: 30px;
  font-weight: 600;
  display:inline-block;
  vertical-align: top;
  position: relative;
  top:.3rem;
}
.asset_pool_data img{
  width: auto;
  height: 50px;
  margin: 10px 1px 10px auto;
}
.check_details{
  border: 2px solid orange;
  border-radius:10px;
  width: 110px;
  height: 100px;
  margin: .2rem auto;
}
.check_details p{
  font-size: 30px;
  color: orange;
  font-weight: 100;
}
.charge{
  border: 2px solid orange;
  text-align: center;
  border-radius:10px;
  width: 80%;
  height: 60%;
  margin: 0.3rem auto;
}
.cha{
  position: fixed;
  width: 100%;
  z-index: 1000;
  font-size: 34px;
  height: 120px;
  text-align: center;
  bottom: 0px;
  border: 2px solid RGB(228,228,228);
  background: #fff;
}
.charge p{
  color: orange;
  font-size:.4rem;
  margin: .22rem 0;
}








/* display: flex; */
  /* flex-direction: column;  排列方向 */
  /* flex-wrap: nowrap;        是否换行 */
  /* justify-content: space-around;  对齐 */
/* style=" bottom: 0;position:fixed; "固定 */
p{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
  color: #000000;
  font-size: 0.4rem;
}
span{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
}    
div{
  background: #fff;
}
.font_weight_bold{
  font-weight: 600;
}
.close_mining{
  position: relative;
  top:.3rem;
}
.Orange{
  color: orange;
}
.silver{
  color: rgb(161, 161, 161);
}


</style>