<template>
    <vpage>
      <slot>
        <div class="container">
          <Header :HeaderTitlle="HeaderTitlle"></Header>
          <div class="detail-title">投注详情</div>
          <div class="tips">全球彩投注号码 :</div>
          <!-- 已开奖 -->
          <div v-for="(item,index) in BetDetail.detail" :key="index">
            <div class="bet-item">
              <div class="num">{{item.bet_num}}</div>
              <!-- <div class="count">{{BetDetail.bet_key}} Key</div> <br> -->
            </div>
            <div class="bet-item" style="line-height:0.5rem;" v-if="BetDetail.bet_num != ''">
              <div class="num" style="color:#a9a9a9;" v-if="BetDetail.bet_num != '' && item.win_type == 'sorry'">未中奖</div>
              <div class="num" style="color:#a9a9a9;" v-if="BetDetail.bet_num != '' && item.win_type == 'lottery_award'">超级全球彩大奖</div>
              <div class="num" style="color:#a9a9a9;" v-if="BetDetail.bet_num != '' && item.win_type == 'second_price'">二等奖</div>
              <div class="num" style="color:#a9a9a9;" v-if="BetDetail.bet_num != '' && item.win_type == 'third_price'">三等奖</div>
              <div class="num" style="color:#a9a9a9;" v-if="BetDetail.bet_num != '' && item.win_type == 'fourth_price'">四等奖</div>
              <div class="num" style="color:#a9a9a9;" v-if="BetDetail.bet_num != '' && item.win_type == 'special_award'">特别奖</div>
              <div class="num" style="color:#a9a9a9;" v-if="BetDetail.bet_num != '' && item.win_type == 'fifth_price'">五等奖</div>
              <div class="num" style="color:#a9a9a9;" v-if="BetDetail.bet_num != '' && item.win_type == 'sixth_price'">六等奖</div>
              <div class="num" style="color:#a9a9a9;" v-if="BetDetail.bet_num != '' && item.win_type == 'seventh_price'">七等奖</div>
              <div class="count" style="color:#a9a9a9;">{{item.win_count}} UE</div> <br>
            </div>
          </div>
          <!-- 未开奖 -->
          <div v-for="(item,index) in BetDetail.bet_num" :key="index">
            <div class="bet-item">
              <div class="num">{{item}}</div>
            </div>
          </div>
          <div class="bet-item" v-if="BetDetail.detail">
            <div class="num" style="font-size:0.4rem;">总中奖金额</div>
            <div class="count" style="font-size:0.4rem;color:rgb(218, 178, 121);">{{WinCount}} UE</div> <br>
          </div>
          <div class="line"></div>
          <div class="info">
            <div class="title">期数:</div>
            <div class="content">第 {{BetDetail.periods}} 期 
              <span v-if="BetDetail.bet_num" style="color:rgb(218, 178, 121);">(未开奖)</span> 
            </div>
          </div>
          <div class="info">
            <div class="title">开奖时间:</div>
            <div class="content">{{BetDetail.reward_time}}</div>
          </div>
          <div class="info">
            <div class="title">投注时间:</div>
            <div class="content">{{BetDetail.bet_time}}</div>
          </div>
          <div class="info">
            <div class="title">投注数量:</div>
            <div class="content">{{BetDetail.bet_key}} Key</div>
          </div>
          <div class="info">
            <div class="title">投注金额:</div>
            <div class="content">{{BetDetail.bet_amount}} UE</div>
          </div>
          <div class="info">
            <div class="title">代投账号:</div>
            <div class="content">{{BetDetail.agent_account}}</div>
          </div>
          <div class="info">
            <div class="title">交易ID:</div>
            <div class="content">{{BetDetail.transaction_id}}</div>
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
      BetDetail: {},//投注详情
      WinCount: 0.00,//总中奖金额
    }
  },
  methods: {
    // 获取投注详情
    getBetDetail(bo_id){
      api.getUserBetWeek({
        account_name:this.$store.state.wallet.account,
        bo_id:bo_id}).then(res => {
        console.log("获取投注详情:",res);
        if(res.code != 1){
          this.$toast('获取投注详情失败，请检查再重试！')
          return false;
        }
        if(res.code == 1){
          this.BetDetail = res.data;
          this.BetDetail.bet_time = format(parse(this.BetDetail.bet_time), 'MM/DD/YY HH:mm:ss');
          this.BetDetail.reward_time = format(parse(this.BetDetail.reward_time), 'MM/DD/YY HH:mm:ss');
          this.BetDetail.transaction_id = '...'+this.BetDetail.transaction_id.slice(45);
          if(this.BetDetail.detail){
            this.BetDetail.detail.forEach(element => {
              this.WinCount += element.win_count;
            });
          }
        }
      })
    }
  },
  created(){
    this.getBetDetail(this.$route.params.bo_id);
  }
}
</script>

<style scoped>
.container{
  height: auto;width: 100%;background-color:rgb(40,40,40);min-height: 100%;
}
.detail-title{
  height: 1.2rem;line-height: 1.2rem;padding-left: 0.5rem;padding-top: 1.6rem;color: rgb(218, 178, 121);font-size: 0.45rem;font-weight: bold;
}
.container .tips{
  padding-left: 0.5rem;height: 1rem;line-height: 1rem;font-size: 0.2rem;color: white;
}
.container .bet-item{
  min-height: 0.8rem;line-height: 0.8rem;color: white;
}
.container .bet-item .num{
  float: left;margin-left: 5%;margin-right: 5%;word-break: break-all;
}
.container .bet-item .count{
  float: right;padding-right: 0.5rem;
}
.container .line{
  height: 0.5rem;width: 90%;border-bottom: 1px solid rgb(218, 178, 121);margin: auto;margin-bottom: 0.5rem;
}
.container .info{
  width: 90%;margin: auto;display: flex;line-height: 0.8rem;font-size: 0.4rem;
}
.container .info .title{
  width: 35%;text-align: left;color: #a9a9a9;
}
.container .info .content{
  width: 65%;text-align: left;color: white;
}

</style>