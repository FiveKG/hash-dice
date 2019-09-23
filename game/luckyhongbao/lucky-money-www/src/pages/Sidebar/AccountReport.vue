<template>
  <div>
    <HeadPart></HeadPart>
    <div style="width:100%;display:flex;height:5vh;font-size:12px;padding-top:8vh;line-height:5vh;text-align:center;color:white;">
      <div style="width:25%;">时间</div>
      <div style="width:25%;">金额</div>
      <div style="width:25%;">账号POG余额</div>
      <div style="width:25%;">备注</div>
    </div>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="getAccountLog" style="height: 87vh;overflow-y: scroll;">
      <!-- <van-cell v-for="item in list" :key="item" :title="item" style="position: unset;"/> -->
      <div style="width:100%;display:flex;height:30px;position: unset;font-size:12px;text-align:center;margin-bottom:10px;color:white;" v-for="(item,index) in list" :key="index">
        <div style="width:25%;text-align:left;padding-left:3px;overflow-wrap: break-word;">{{item.create_time | dateFormat}}</div>
        <div style="width:25%;overflow-wrap: break-word;">{{Number(item.change_amount)}}</div>
        <div style="width:25%;overflow-wrap: break-word;">{{Number(item.current_balance)}}</div>
        <!-- <div style="width:25%;overflow-wrap: break-word;" v-if="item.op_type == 'grab_red_envelope'">抢红包</div>
        <div style="width:25%;overflow-wrap: break-word;" v-if="item.op_type == 'pre_deduction'">余额抵押</div>
        <div style="width:25%;overflow-wrap: break-word;" v-if="item.op_type == 'pre_deduction_chain'">代币抵押</div>
        <div style="width:25%;overflow-wrap: break-word;" v-if="item.op_type == 'recharge'">充值</div>
        <div style="width:25%;overflow-wrap: break-word;" v-if="item.op_type == 'refund'">返还</div>
        <div style="width:25%;overflow-wrap: break-word;" v-if="item.op_type == 'withdraw'">提现</div> -->
        <div style="width:25%;overflow-wrap: break-word;">{{item.op_type}}</div>
      </div>
    </van-list>
  </div>

</template>


<script>
  import HeadPart from '@/components/HeadPart/HeadPart';
  import { Toast } from 'vant';
  import { getAccountLog , dateFormat } from '@/servers';
  export default {
    name: 'AccountReport',  
    components: {
      HeadPart
    },
    data() {
      return {
        list: [],
        loading: false,
        finished: false,
        page_info:{
          page:1,
          limit:10
        }
      }
    },
    filters: {
      dateFormat(time) {
        var date = new Date(time);
        return dateFormat(date, 'yyyy-MM-dd hh:mm:ss');
      }
    },
    mounted(){

    },
    created() {
      
    },
    methods: {
      onLoad() {
        // 异步更新数据
        setTimeout(() => {
          for (let i = 0; i < 10; i++) {
            this.list.push({
              crate_time:new Date().toLocaleString(),
              amount:'+'+i,
              balance:200+i,
              type:'充值'
            });
          }
          // 加载状态结束
          this.loading = false;

          // 数据全部加载完成
          if (this.list.length >= 40) {
            this.finished = true;
          }
        }, 500);
      },
      // 获取账号操作日志
      getAccountLog(){
        getAccountLog(this.page_info).then(res => {
          console.log("获取账号操作日志:",res)
          if(res.code == 1){
            this.page_info.page = this.page_info.page+1;
            // for(var i=0 ; i<res.data.length ; i++){
            //   res.data[i].crate_time = dateFormat()
            // }
            this.list = this.list.concat(res.data);
            this.loading = false;
            if(res.data.length < 10){
              this.finished = true;
            }
          }
        }).catch(err =>{
          console.log("获取账号操作日志失败:",err);
          Toast("获取账号操作日志失败");
          this.loading = false;
           this.finished = true;
        });
      },
    }
  }
</script>

<style scoped>
.account{
  padding-top: 10vh;
  width: 100%;
  text-align: center;
  color: #ff9900;
  font-size: 18px;
}
.text{
  width: 100%;
  text-align: center;
  color: white;
  font-size: 12px;
}
.week_park{
  width: 100%;
  /* display: flex; */
  margin-top: 10px;
}
.week_park .item{
  width: 90%;
  margin: auto;
  /* height: 30px; */
  display: flex;
}
.week_park .item .text{
  margin: auto;
  /* height: 30px; */
  /* line-height: 30px; */
  font-size: 12px;
}
/*处理表格*/
 .d_table table{
    color: #ffeaea;
    /* font-size: 1rem; */
    font-size: 12px;
    text-align: center;
    margin-top: 20px;
  }
 .d_table table th{
    padding: 1.5vh 0px;
    /*border-bottom:1px solid skyblue ;*/
  }
 .d_table table td{
    border-top:2px solid #e84244 ;
    padding: 2vh 0px;
  }
 .e_table tr:nth-child(1) td:nth-child(1){
    background: url(../../assets/03.png) no-repeat center center;
    /*background-size:100% 100%;*/
    /*-moz-background-size:100% 100%;*/
  }
 .e_table tr:nth-child(2) td:nth-child(1){
    background: url(../../assets/04.png) no-repeat center center;
  }
 .e_table tr:nth-child(3) td:nth-child(1){
    background: url(../../assets/05.png) no-repeat center center;
  }
</style>