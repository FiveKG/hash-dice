<template>
    <vpage>
      <slot>
        <div class="container">
          <Header :HeaderTitlle="HeaderTitlle"></Header>
          <div class="record-title">我的投注</div>
          <div class="myList">
            <p v-for="(item,index) in MyRecordList" :key="index" @click="gotoBetDetail(item.bo_id)">
              <span># {{item.periods}} 期<span style="color:#FF9900" v-if="item.win_type== 'waiting'"> - 待开奖</span> <span style="color:#FF9900" v-if="item.win_type== 'bingo'"> - 中奖</span> </span>   
              <span>{{item.bet_time}}</span>
              <span>{{item.bet_key}} Key<img src="@/assets/img/invitation_profitarrow.png" alt=""></span> 
            </p>
          </div>
        </div>
      </slot>
    </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import Header from '@/components/header/Header'
import api from '@/servers/game'
import { format, parse } from 'date-fns'
import {Decimal} from 'decimal.js';
export default {
  components: {
    vpage: MyPage,
    Header,
  },
  data() {
    return {
      HeaderTitlle: '',//顶部标题内容
      MyRecordList: [],//我的投注记录列表
    }
  },
  methods: {
    // 获取我的投注记录列表
    getMyGame(){
      api.getUserBet({account_name:this.$store.state.wallet.account}).then(res => {
        console.log("获取我的投注记录列表:",res);
        this.MyRecordList = res.data.detail;
        for(var i=0; i<this.MyRecordList.length; i++){
          this.MyRecordList[i].bet_time = format(parse(this.MyRecordList[i].bet_time), 'MM/DD HH:mm:ss')
        }
      })
    },
    // 前往投注详情页
    gotoBetDetail(bo_id){
      console.log("前往投注详情页:",bo_id);
      this.$router.push({name:'QqcBetDetail' , params:{bo_id:bo_id}});
    }
  },
  created(){
    this.getMyGame();// 获取我的投注记录列表
  }
}
</script>

<style scoped>
.container{
  height: auto;width: 100%;background-color:rgb(56, 56, 58);;min-height: 100%;
}
.record-title{
  height: 1.2rem;line-height: 1.2rem;padding-left: 0.5rem;padding-top: 1.6rem;color: rgb(218, 178, 121);font-size: 0.45rem;font-weight: bold;
}

.allList, .myList{
    background-color:rgb(56, 56, 58);;
    /* height:10.5rem; */
    overflow-y:scroll;
}
.allList p, .myList p{
    display:flex;
    flex-wrap:nowrap;
    align-items:center;
    justify-content:space-between;
    padding:0 0.35rem 0 0.35rem;
    height:1.1rem;
    font-family: '微軟正黑體 Regular', '微軟正黑體';
    font-size:0.42rem;
}
.allList p span:nth-child(1), .myList p span:nth-child(1){
    /* color:#BCBCBC; */color: white;font-size: 0.4rem;
}
.allList p span:nth-child(2), .myList p span:nth-child(2){
    /* color:#BCBCBC; */color: white;font-size: 0.4rem;
}
.allList p span:nth-child(3), .myList p span:nth-child(3){
    /* color:#BCBCBC; */color: white;font-size: 0.4rem;
}
.allList p img, .myList p img{
  vertical-align: middle;
  width:.5rem;
  height:.5rem;
}

</style>