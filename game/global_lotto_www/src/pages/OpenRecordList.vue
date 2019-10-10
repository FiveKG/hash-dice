<template>
    <vpage>
      <slot>
        <div class="container">
          <Header :HeaderTitlle="HeaderTitlle"></Header>
          <div class="record-title">开奖记录</div>
          <div class="allList">
            <p v-for="(item,index) in RecordList" :key="index" @click="gotoRecordDetail(item.gs_id)">
              <span># {{item.periods}} 期</span>  
              <span style="color:#FF9900" v-if="item.reward_num =='' ">待开奖 - 开奖倒计时 {{tiemer}}</span>
              <span v-if="item.reward_num">{{item.reward_num}}</span>
              <span>{{item.key}} <img src="@/assets/img/invitation_profitarrow.png" alt=""></span> 
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
export default {
  components: {
    vpage: MyPage,
    Header,
  },
  data() {
    return {
      HeaderTitlle: '',//顶部标题内容
      RecordList: [],//开奖记录列表
      tiemer: "",//开奖倒计时
    }
  },
  methods: {
    // 获取开奖记录列表
    getAllGame(){
      api.getOpenlist().then(res => {
        console.log("获取开奖记录列表:",res);
        this.RecordList = res.data;
        var endTime = new Date(this.RecordList[0].reward_time);
        console.log("开奖时间:",endTime);
        var startTime = new Date();
        console.log("当前时间:",startTime);
        console.log("时间差:",endTime.getTime() - startTime.getTime());
        var allSecond = Math.abs((endTime.getTime() - startTime.getTime())/1000);
        console.log("allSecond:",allSecond);
        var timeInerval=setInterval(()=>{
          let hour = parseInt(allSecond / 3600 % 24)
          if(hour<10){
            hour = '0' + hour
          }
          let minute = parseInt(allSecond / 60 % 60)
          if(minute<10){
            minute = '0' + minute
          }
          let second = parseInt(allSecond % 60)
          if(second<10){
            second = '0' + second
          }
          if(second == 0 && minute==0  && hour==0){
            clearInterval(timeInerval);
          }
          this.tiemer = hour + ':' + minute + ':' + second
          allSecond--
        },1000)
      })
    },
    // 前往开奖记录详情页
    gotoRecordDetail(gs_id){
      console.log("前往开奖记录详情页:",gs_id);
      this.$router.push({name:'QqcOpenDetail' , params:{gs_id:gs_id}});
    }
  },
  created(){
    this.getAllGame();// 获取开奖记录列表
  }
}
</script>

<style scoped>
.container{
  height: auto;width: 100%;background-color:rgb(56,56,58);min-height: 100%;
}
.record-title{
  height: 1.2rem;line-height: 1.2rem;padding-left: 0.5rem;padding-top: 1.6rem;color: rgb(218, 178, 121);font-size: 0.45rem;font-weight: bold;
}
.allList, .myList{
  background-color:rgb(56,56,58);
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
    color:white;font-size:0.4rem;;
}
.allList p span:nth-child(2), .myList p span:nth-child(2){
    color:white;font-size:0.4rem;;
}
.allList p span:nth-child(3), .myList p span:nth-child(3){
    color:white;font-size:0.4rem;;
}
.allList p img, .myList p img{
  vertical-align: middle;
  width:.5rem;
  height:.5rem;
}

</style>