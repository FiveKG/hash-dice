<template>
  <div>
    <HeadPart></HeadPart>
    <div class="account">{{Number(leaderboardlist.bonus_amount).toFixed(4)}}</div>
    <div class="text">POG</div>
    <div class="text">当前未分配分红累计</div>
    <div class="week_park">
      <div class="item">
        <div class="text" style="border-right:1px solid white;">{{club_bonus[0]}}%</div>
        <div class="text" style="border-right:1px solid white;">{{club_bonus[1]}}%</div>
        <div class="text" style="border-right:1px solid white;">{{club_bonus[2]}}%</div>
        <div class="text" style="border-right:1px solid white;">{{club_bonus[3]}}%</div>
        <div class="text" >{{club_bonus[4]}}%</div>
      </div>
      <div class="item" style="border-top:1px solid white ; margin-top:10px;margin-bottom: 10px;">
        <div class="text" >1</div>
        <div class="text" >2</div>
        <div class="text" >3</div>
        <div class="text" >4</div>
        <div class="text" >5</div>
      </div>
    </div>
    <div class="text">每周一 00:00:00 至 周日 23:59:59</div>
    <div class="text">分红直接存入您的账户余额</div>
    <!-- 排名 -->
    <div class="d_table e_table">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th width="10%">排名</th>
            <th width="30%">俱乐部</th>
            <th width="30%">发出红包POG</th>
            <th width="30%">实时可获分红POG</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in leaderboardlist.rank_list" :key="index">
            <td>{{item.rank}}</td>
            <td>{{item.club_name}}</td>
            <td>{{item.produce_amount}}</td>
            <td>{{item.tab4}}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="leaderboardlist.rank_list == ''" style="font-size: 16px;text-align: center;margin: 5px 0px;color: #f8f8f8">暂&nbsp;无&nbsp;记&nbsp;录</p>
    </div>
  </div>

</template>


<script>
  import HeadPart from '@/components/HeadPart/HeadPart';
  import { getLeaderboard ,getConfig} from '@/servers';
  export default {
    name: 'ClubLeaderboard',
    components: {
      HeadPart
    },
    data() {
      return {
        club_bonus:[],
        leaderboardlist:""
      }
    },
    mounted(){
      
      this.getConfig()
      

    },
    created() {


    },
    methods: {
      // 获取配置
      getConfig(){
        getConfig().then(res => {
          this.club_bonus =res.data.club_bonus
          this.leaderboard();

        }).catch(err =>{

        })
      },
      leaderboard(){
        getLeaderboard("").then(res => {
          if (res.code ==1) {
            for (let i = 0; i < res.data.rank_list.length; i++) {
              if (i<2) {
                res.data.rank_list[i].rank = ""
              }
              if (i<4) {
                res.data.rank_list[i].tab4 = Number(res.data.bonus_amount *this.club_bonus[i]/100).toFixed(4)
              }else{
                res.data.rank_list[i].tab4 = "-"
              }
            }
            this.leaderboardlist = res.data
          }

          
          
         
        }).catch(err =>{
         
        });
      }

    }
  }
</script>

<style scoped>
.account{
  padding-top:11vh;
  width: 100%;
  text-align: center;
  color: #ff9900;
  font-size: 24px;
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
    margin: 30px 0px;
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













