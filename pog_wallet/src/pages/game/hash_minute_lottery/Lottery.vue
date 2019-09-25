<template>
  <vpage>
    <slot>
      <div class="container">
        <!-- 头部 -->
        <div class="header">
          <div class="logo"><img src="@/assets/minute_lottery.png" alt=""></div>
          <div class="title">哈希分分彩</div>
          <div class="action">
            <div @click="actionSheetVisible = true" class="more"><img src="@/assets/img/更多.png" alt=""></div>
            <div @click="back" class="exit"><img src="@/assets/img/u102.png" alt=""></div>
          </div>
        </div>
        <!-- 实时区块记录 -->
        <div class="current-block-record" id="current-block-record">
          <div class="item" v-for="(item,index) in $store.state.gameMinuteLottery.blockList" :key="index">
            <div class="num">{{item.block_num}}</div>
            <div class="code">{{item.id}}</div>
            <div class="time">{{item.timestamp}}</div>
          </div>
        </div>
        <!-- 实时开奖/中奖记录 -->
        <div class="current-periods-win-record">
          <!-- 开奖 -->
          <div class="periods-record">
            <div class="item" v-for="(item,index) in CurrentPeriodsRecord" :key="index">
              <div class="periods">{{item.periods}}</div>
              <div class="code">[ {{item.code}} ]</div>
            </div>
          </div>
          <!-- 中奖 -->
          <div class="win-record">
            <div class="item" v-for="(item,index) in CurrentWinRecord" :key="index">
              <div class="account">{{item.account}}</div>
              <div class="count">+{{item.count}}</div>
              <div class="time">{{item.time}}</div>
            </div>
          </div>
        </div>
        <!-- 最新一期信息 -->
        <div class="current-periods-info">
          <div class="count-down"><img src="@/assets/img/u12820.png" alt="">00:52</div>
          <div class="periods">25949240 期</div>
          <div class="bet-sum">
            <span style="padding:0px 0.25rem;">投注限额</span><span>15 / 9.5 K</span>
          </div>
        </div>
        <!-- 投注类型 -->
        <div class="bet-type">
          <!-- 大小单双 -->
          <div class="min-max">
            <div class="item" v-for="(item , index) in BetMinMax" :key="index">{{item}}</div>
          </div>
          <!-- 数字 -->
          <div class="number">
            <div class="item" v-for="(item , index) in ValidBetNumber" :key="index">{{item}}</div>
          </div>
        </div>
        <!-- 投注金额倍数 -->
        <div class="bet-multiple">
          <!-- 倍数选择 -->
          <div class="multiple">
            <div class="default"><img src="@/assets/img/u2548.svg" alt="">0.5</div>
            <div class="item">1/2</div>
            <div class="item">2X</div>
            <div class="item">MIN</div>
            <div class="item">MAX</div>
          </div>
          <!-- 投注统计 -->
          <div class="bet-total">
            <div class="bet-num">当前注数: <span>3</span></div>
            <div class="bet-count">投注总额: <span>1.5</span></div>
          </div>
          <!-- 投注操作 -->
          <div class="bet-action">投注</div>
        </div>
        <!-- 开奖记录/我的投注 -->
        <div class="record-mybet-tab">
          <div :class="BetRecordOrMyBet== 'BetRecord' ? 'tab-on' : 'tab'" @click="SelectBetRecordOrMyBet('BetRecord')">开奖记录</div>
          <div :class="BetRecordOrMyBet== 'MyBet' ? 'tab-on' : 'tab'" @click="SelectBetRecordOrMyBet('MyBet')">我的投注</div>
        </div>
        <!-- 开奖记录列表 -->
        <div class="record-list" v-if="BetRecordOrMyBet == 'BetRecord'">
          <div class="tab-header">
            <div class="title">时间</div><div class="title">期数</div><div class="title">开奖号</div><div class="title">大小｜单双</div>
          </div>
          <div class="list">
            <div class="item" v-for="(item,index) in BetRecordList" :key="index" @click="GoToRecordDetail()">
              <div class="value">{{item.time}}</div>
              <div class="value">{{item.periods}}</div>
              <div class="value" style="color:rgba(255, 153, 0, 1);">{{item.code}}</div>
              <div class="value" style="color:rgba(255, 153, 0, 1);">{{item.min_max}}</div>
              <div class="action"><img src="@/assets/img/u12391.png" alt=""></div>
            </div>
          </div>
        </div>
        <!-- 我的投注记录列表 -->
        <div class="mybet-list" v-if="BetRecordOrMyBet == 'MyBet'">
          <div class="tab-header">
            <div class="title" style="width:25%;">时间</div><div class="title" style="width:15%;">期数</div><div class="title" style="width:20%;">详情</div><div class="title" style="width:15%;">类型</div><div class="title" style="width:20%;">金额</div>
          </div>
          <div class="list">
            <div class="item" v-for="(item,index) in MyBetList" :key="index" @click="GoToBetDetail()">
              <div class="value" style="width:25%;">{{item.time}}</div>
              <div class="value" style="width:15%;">{{item.periods}}</div>
              <div class="value" style="width:20%;">{{item.deatil}}</div>
              <div class="value" style="width:15%;">{{item.type}}</div>
              <div class="value" style="width:20%;">{{item.count}}</div>
              <div class="action" style="width:5%;"><img src="@/assets/img/u12391.png" alt=""></div>
            </div>
          </div>
        </div>
        <v-ons-action-sheet
          :visible.sync="actionSheetVisible"
          cancelable
        >
          <div class="selectwrap">
              <div class="wdclose" @click="actionSheetVisible = false">
              </div>
              <v-ons-row class="selectrow" >
                  <img class="people" src="@/assets/img/u9830.png" alt="">
                  <span>eoscheshieos</span>
                  <img class="pic" src="@/assets/img/u9827.png" alt="">
                  <img class="pic" src="@/assets/img/u9825.png" alt="">
              </v-ons-row>

              <v-ons-row class="selectrow" @click="jumpTreasureRule">
                  <img class="rule" src="@/assets/img/u9832.png" alt="">
                  <span>规则</span>
              </v-ons-row>
          </div>
        </v-ons-action-sheet> 
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import Header from '@/pages/game/hash_minute_lottery/components/Header'
import ClientSocket from '@/pages/game/hash_minute_lottery/ClientSocket'
import { error } from 'util';

export default {
  components: {
    vpage: MyPage,
    Header
   },
  data() {
    return {
      actionSheetVisible: false,
      // 实时区块记录
      CurrentBlockRecord: [
        { num: 33283273 , code: 'F7B195473D4F09BC8F1' , time: '15:23:02.0' },
        { num: 33283273 , code: 'F7B195473D4F09BC8F1' , time: '15:23:02.0' },
        { num: 33283273 , code: 'F7B195473D4F09BC8F1' , time: '15:23:02.0' },
        { num: 33283273 , code: 'F7B195473D4F09BC8F1' , time: '15:23:02.0' },
        { num: 33283273 , code: 'F7B195473D4F09BC8F1' , time: '15:23:02.0' },
        { num: 33283273 , code: 'F7B195473D4F09BC8F1' , time: '15:23:02.0' },
        { num: 33283273 , code: 'F7B195473D4F09BC8F1' , time: '15:23:02.0' },
        { num: 33283273 , code: 'F7B195473D4F09BC8F1' , time: '15:23:02.0' },
      ],
      // 实时开奖记录
      CurrentPeriodsRecord: [
        { periods: '18:50' , code: '0' },
        { periods: '18:50' , code: '0' },
        { periods: '18:50' , code: '0' },
        { periods: '18:50' , code: '0' },
        { periods: '18:50' , code: '0' },
        { periods: '18:50' , code: '0' },
        { periods: '18:50' , code: '0' },
      ],
      // 实时中奖记录
      CurrentWinRecord: [
        { account: 'mmmm22552255' , count: 0.5 , time: '15:23:02' },
        { account: 'mmmm22552255' , count: 0.5 , time: '15:23:02' },
        { account: 'mmmm22552255' , count: 0.5 , time: '15:23:02' },
        { account: 'mmmm22552255' , count: 0.5 , time: '15:23:02' },
        { account: 'mmmm22552255' , count: 0.5 , time: '15:23:02' },
        { account: 'mmmm22552255' , count: 0.5 , time: '15:23:02' },
        { account: 'mmmm22552255' , count: 0.5 , time: '15:23:02' },
      ],
      // 大小单双
      BetMinMax: [ '大' , '小' , '单' , '双' ],
      // 可投注数字
      ValidBetNumber: [ 0 , 1 , 2 , 3, 4 , 5 , 6 , 7 , 8 , 9 ],
      // 开奖记录列表
      BetRecordList: [
        { time: '05/04 18:50' , periods: '25949239' , code: 0 , min_max: '小 | 双' },
        { time: '05/04 18:50' , periods: '25949239' , code: 0 , min_max: '小 | 双' },
        { time: '05/04 18:50' , periods: '25949239' , code: 0 , min_max: '小 | 双' },
        { time: '05/04 18:50' , periods: '25949239' , code: 0 , min_max: '小 | 双' },
        { time: '05/04 18:50' , periods: '25949239' , code: 0 , min_max: '小 | 双' },
        { time: '05/04 18:50' , periods: '25949239' , code: 0 , min_max: '小 | 双' },
        { time: '05/04 18:50' , periods: '25949239' , code: 0 , min_max: '小 | 双' },
      ],
      // 投注记录列表
      MyBetList: [
        { time: '05/04 18:50:00' , periods: '25949239' , deatil: '0 - 小' , type: '中奖' , count: '0.1960' },
        { time: '05/04 18:50:00' , periods: '25949239' , deatil: '0 - 小' , type: '中奖' , count: '0.1960' },
        { time: '05/04 18:50:00' , periods: '25949239' , deatil: '0 - 小' , type: '中奖' , count: '0.1960' },
        { time: '05/04 18:50:00' , periods: '25949239' , deatil: '0 - 小' , type: '中奖' , count: '0.1960' },
        { time: '05/04 18:50:00' , periods: '25949239' , deatil: '0 - 小' , type: '中奖' , count: '0.1960' },
        { time: '05/04 18:50:00' , periods: '25949239' , deatil: '0 - 小' , type: '中奖' , count: '0.1960' },
        { time: '05/04 18:50:00' , periods: '25949239' , deatil: '0 - 小' , type: '中奖' , count: '0.1960' },
        { time: '05/04 18:50:00' , periods: '25949239' , deatil: '0 - 小' , type: '中奖' , count: '0.1960' },
      ],
      // 当前选择
      BetRecordOrMyBet: 'BetRecord',
    }
  },
  methods: {
    // 选择`开奖记录`/`我的投注`
    SelectBetRecordOrMyBet(value){
      console.log("选择`开奖记录`/`我的投注`:",value);
      this.BetRecordOrMyBet = value;
    },
    // 前往开奖记录详情
    GoToRecordDetail(){
      this.$router.push({ path:'/LotteryRecord' });
    },
    // 前往投注记录详情
    GoToBetDetail(){
      this.$router.push({ path:'/BetDetail' });
    },
    back() {
      this.$router.go(-2)
    },
    jumpTreasureRule() {
      this.$router.push({
      name: 'TreasureRule',
    })
    }
  },
  created(){
    // 初始化Socket连接
    ClientSocket.link().then(conn => {
      if (conn) {
        console.log("Socket连接成功:",conn);
      }
    }).catch(error => {
      console.log("Socket连接error:",error);
    })

  },
  destroyed (){
    // 断开websocket
    ClientSocket.getSocket().close();
  }
}
</script>

<style scoped>
  .container{
    height: auto;width: 100%;background-color:rgb(27, 27, 27);
  }
  .header{
    height: 1.6rem;width: 100%;position: fixed;background-color: rgb(27, 27, 27);display: flex;z-index: 9999;
  }
  .header .logo{
    height: 100%;width: 20%;display: flex;
  }
  .header .logo img{
    height: 1.2rem;width: auto;margin: auto;
  }
  .header .title{
    height: 100%;width: 40%;padding-left: 10px;line-height: 1.6rem;color: rgba(255, 153, 0, 1);font-weight: bold;font-size: 0.5rem;
  }
  .header .action{
    height: 60%;width: 36%;display: flex;margin: auto 2%;border-radius: 10px;border: 0.02rem solid #6e6767;
  }
  .header .action .more{
    height: 100%;width: 50%;display: flex;border-right: 0.02rem solid #6e6767;
  }
  .header .action .more img{
    height: 100%;width: auto;margin: auto;
  }
  .header .action .exit{
    height: 100%;width: 50%;display: flex;
  }
  .header .action .exit img{
    height: 80%;width: auto;margin: auto;
  }
  .current-block-record{
    height: 5rem;width: 100%;padding-top: 1.6rem;overflow-y: scroll;background-color:rgb(40, 40, 40);
  }
  .current-block-record .item{
    height: 0.8rem;width: 100%;display: flex;line-height: 0.8rem;text-align: center;color: #999999;
  }
  .current-block-record .item .num{
    width: 25%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .current-block-record .item .code{
    width: 50%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .current-block-record .item .time{
    width: 25%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .current-periods-win-record{
    height: 4rem;width: 100%;background-color:rgb(27, 27, 27);margin-top: 0.25rem;display: flex;
  }
  .current-periods-win-record .periods-record{
    height: 4rem;width: 30%;line-height: 0.8rem;text-align: center;color: #999999;overflow-y: scroll;
  }
  .current-periods-win-record .periods-record .item{
    height: 0.8rem;display: flex;
  }
  .current-periods-win-record .periods-record .item .periods{
    width: 60%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .current-periods-win-record .periods-record .item .code{
    width: 40%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    color: rgba(255, 153, 0, 1);font-weight: bold;border-right: 0.05rem solid #999999;
  }
  .current-periods-win-record .win-record{
    height: 4rem;width: 70%;line-height: 0.8rem;text-align: center;color: #999999;overflow-y: scroll;
  }
  .current-periods-win-record .win-record .item{
    height: 0.8rem;display: flex;
  }
  .current-periods-win-record .win-record .item .account{
    width: 50%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .current-periods-win-record .win-record .item .count{
    width: 25%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    color: rgba(255, 153, 0, 1);font-weight: bold;
  }
  .current-periods-win-record .win-record .item .time{
    width: 25%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    text-align: left;
  }
  .current-periods-info{
    height: 2rem;background-color: rgb(40, 40, 40);display: flex;
  }
  .current-periods-info .count-down{
    height: 1rem;width: 23%;margin: auto 1%;display: flex;border-radius: 0.1rem;background-color: rgba(255, 153, 0, 1);color: white;font-size: 0.4rem;
    line-height: 1rem;font-weight: bold;
  }
  .current-periods-info .count-down img{
    height: 0.6rem;margin: auto 5px;
  }
  .current-periods-info .periods{
    height: 1rem;width: 28%;margin: auto 1%;border-radius: 0.1rem;color: white;font-size: 0.4rem;
    line-height: 1rem;text-align: center;
    border: 0.02rem solid #6e6767;
  }
  .current-periods-info .bet-sum{
    height: 1rem;width: 48%;margin: auto 1%;border-radius: 0.1rem;color: white;font-size: 0.4rem;
    line-height: 1rem;
    border: 0.02rem solid rgba(255, 153, 0, 1);
  }
  .bet-type{
    height: 4rem;width: 100%;background-color:rgb(40 , 40, 40);
  }
  .bet-type .min-max{
    height: 1.5rem;width: 100%;display: flex;
  }
  .bet-type .min-max .item{
    height: 1.5rem;width: 23%;margin: auto 1%;line-height: 1.5rem;text-align: center;color: #6e6767;font-size: 0.8rem;
    background-color: rgb(27, 27, 27);border-radius: 0.2rem;
  }
  .bet-type .number{
    height: 1.5rem;width: 100%;display: flex;margin-top: 0.5rem;
  }
  .bet-type .number .item{
    height: 1.5rem;width: 9%;margin: auto 0 auto 0.9%;line-height: 1.5rem;text-align: center;color: #6e6767;font-size: 0.6rem;
    background-color: rgb(27, 27, 27);border-radius: 0.2rem;
  }
  .bet-multiple{
    height: 5rem;width: 100%;background-color:rgb(40 , 40, 40);
  }
  .bet-multiple .multiple{
    height: 1.5rem;width: 100%;display: flex;
  }
  .bet-multiple .multiple .default{
    width: 30%;margin: 0 1%;border: 0.02rem solid #6e6767;border-radius: 0.2rem;display: flex;line-height: 1.5rem;color: white;font-size: 0.6rem;
  }
  .bet-multiple .multiple .item{
    width: 15%;margin: 0 1%;border: 0.02rem solid #6e6767;border-radius: 0.2rem;line-height: 1.5rem;color: white;font-size: 0.6rem;
    text-align: center;
  }
  .bet-multiple .bet-total{
    height: 1.2rem;width: 100%;display: flex;line-height: 1.2rem;color: white;font-size: 0.4rem;
  }
  .bet-multiple .bet-total span{
    color: rgba(255, 153, 0, 1);
  }
  .bet-multiple .bet-total .bet-num{
    width: 49%;height: 1.2rem;text-align: left;padding-left: 1%;
  }
  .bet-multiple .bet-total .bet-count{
    width: 49%;height: 1.2rem;text-align: right;padding-right: 1%;
  }
  .bet-multiple .bet-action{
    height: 1.2rem;width: 98%;margin: 0.5rem 1% 0 1%;background-color: rgba(255, 153, 0, 1);color: white;font-size: 0.6rem;text-align: center;
    line-height: 1.2rem;border-radius: 0.2rem;
  }
  .record-mybet-tab{
    height: 1.5rem;width: 100%;display: flex;
  }
  .record-mybet-tab .tab-on{
    width: 50%;line-height: 1.5rem;text-align: center;color: rgba(255, 153, 0, 1);font-size: 0.5rem;background-color: rgb(40, 40, 40);
  }
  .record-mybet-tab .tab{
    width: 50%;line-height: 1.5rem;text-align: center;color: white;font-size: 0.5rem;background-color: rgb(52, 52, 52);
  }
  .record-list{
    height: 6rem;width: 100%;line-height: 0.8rem;color: white;font-size: 0.3rem;text-align: center;
  }
  .record-list .tab-header{
    height: 0.8rem;width: 100%;display: flex;background-color: rgb(40, 40, 40);
  }
  .record-list .tab-header .title{
    width: 25%;
  }
  .record-list .list{
    height: 5.2rem;width: 100%;overflow-y: scroll;background-color: rgb(40, 40, 40);text-align: center;
  }
  .record-list .list .item{
    height: 0.8rem;width: 100%;display: flex;
  }
  .record-list .list .item .value{
    width: 24%;
  }
  .record-list .list .item .action{
    width: 4%;
  }
  .record-list .list .item .action img{
    width: 100%;
  }
  .mybet-list{
    height: 6rem;width: 100%;line-height: 0.8rem;color: white;font-size: 0.3rem;text-align: center;
  }
  .mybet-list .tab-header{
    height: 0.8rem;width: 100%;display: flex;background-color: rgb(40, 40, 40);
  }
  .mybet-list .tab-header .title{
    width: 20%;
  }
  .mybet-list .list{
    height: 5.2rem;width: 100%;overflow-y: scroll;background-color: rgb(40, 40, 40);text-align: center;
  }
  .mybet-list .list .item{
    height: 0.8rem;width: 100%;display: flex;
  }
  .mybet-list .list .item .value{
    width: 19%;
  }
  .mybet-list .list .item .action{
    width: 4%;
  }
  .mybet-list .list .item .action img{
    width: 100%;
  }

/* 下拉框 */
.selectwrap{
  background-color: #fff;
  min-height: 200px;
  max-height: 100vh;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: scroll;
}
.wdclose{
  width:.6rem;
  height:.6rem;
  background:url("../../../assets/img/u102.png") no-repeat center center;
  background-size:1rem 1rem;
  position:absolute;
  right:.8rem;
  top:.65rem;
}
.selectrow{
  padding:.6rem;
  align-items:center;
  font-size:0.5rem;
  font-family: "Bahnschrift Regular", Bahnschrift;
  color:#FF9900;
  font-weight: 400;
}
.selectrow span{
  padding-right:1rem;
}
.pic{
  width: .7rem;
  height: .5rem;
  padding-right:.5rem;
}
.people{
  width:0.8rem;
  height:0.8rem;
  padding-right:.2rem;
}
.rule{
  width:0.8rem;
  height:0.8rem;
  padding-right:.2rem;
}
</style>

<style>
.progress-bar{
  height: 0.1rem;background-color:rgba(54, 54, 54, 1);
}
.progress-bar__primary{
  background-color: rgba(255, 153, 0, 1);
} 
</style>
