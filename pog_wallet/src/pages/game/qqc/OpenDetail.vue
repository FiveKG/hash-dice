<template>
    <vpage>
      <slot>
        <div class="container">
          <Header :HeaderTitlle="HeaderTitlle"></Header>
          <div class="record-title">
            <span :class="SelectedWinDetail ? 'select-off' : ''" @click="SelectedWinDetail = false ">开奖详情</span>
            <span :class="SelectedWinDetail ? '' : 'select-off'" style="padding-left:0.5rem;" @click="SelectedWinDetail = true " v-if="OpenDetail.reward_code">中奖明细</span>
          </div>
          <!-- 未开奖 -->
          <div class="not-open-title" v-if="!OpenDetail.reward_code && !SelectedWinDetail">
            <div class="container">
              <div class="title">待开奖-开奖倒计时:</div>
              <div class="content">{{tiemer}}</div>
            </div>
          </div>
          <div class="not-open-info" v-if="!OpenDetail.reward_code  && !SelectedWinDetail">
            <div class="container">
              <div class="item">
                <div class="title">本期</div>
                <div class="content">第 {{OpenDetail.periods}} 期</div>
              </div>
              <div class="item">
                <div class="title">开奖时间</div>
                <div class="content">{{OpenDetail.reward_time}}</div>
              </div>
              <div class="item">
                <div class="title">本期累计奖池</div>
                <div class="content">{{OpenDetail.prize_pool}}UE</div>
              </div>
            </div>
          </div>
          <!-- 已开奖 -->
          <div class="not-open-title" v-if="OpenDetail.reward_code  && !SelectedWinDetail">
            <div class="container">
              <div class="title">本期中奖号码:</div>
              <div class="content">{{OpenDetail.reward_code}}</div>
            </div>
          </div>
          <div class="open-info" v-if="OpenDetail.reward_code  && !SelectedWinDetail">
            <div class="container">
              <div class="item">
                <div class="title">本期:</div>
                <div class="content">第 {{OpenDetail.periods}} 期</div>
              </div>
              <div class="item">
                <div class="title">开奖时间:</div>
                <div class="content">{{OpenDetail.reward_time}}</div>
              </div>
              <div class="item">
                <div class="title">本期累计奖池:</div>
                <div class="content">{{OpenDetail.prize_pool}}UE</div>
              </div>
              <div class="item">
                <div class="title">本期共派奖:</div>
                <div class="content">{{OpenDetail.award_amount}}UE</div>
              </div>
              <div class="item">
                <div class="title">本期奖池余额:</div>
                <div class="content">{{OpenDetail.prize_pool_balance}}UE</div>
              </div>
              <div class="item">
                <div class="title">本期储备池拨出:</div>
                <div class="content">{{OpenDetail.reserve_pool_award}}UE</div>
              </div>
              <div class="item">
                <div class="title">底池拨入下一期奖池:</div>
                <div class="content">{{OpenDetail.bottom_pool_award}}UE</div>
              </div>
              <div class="item">
                <div class="title">第 50 期奖池初始额:</div>
                <div class="content">{{OpenDetail.next_init_amount}}UE</div>
              </div>
            </div>
          </div>
          <!-- 区块id开奖数据(已开奖) -->
          <div class="block-open-info" v-if="OpenDetail.reward_code  && !SelectedWinDetail">
            <div class="container">
              <div class="title">区块id开奖数据</div>
              <div class="tips">(尾数为非数字跳过,取9组数字尾数为开奖号码)</div>
              <div style="height: 13.5rem;overflow-y: scroll;">
                <div class="block-item" v-for="(item,index) in OpenDetail.relate_info" :key="index">
                  <div class="time">{{item.timestamp}}</div>
                  <div class="id">{{item.id}}</div>
                </div>
              </div>
              <div style="width:80%;margin:auto;font-size:0.25rem;color:#a9a9a9;">区块 ID 为UE 公链生成 , 无法预知,预设,修改 , 随时可在UE公链进行查询, 作为开奖依据, 完全公正公平透明可信.</div>
            </div>
          </div>
          <!-- 中奖明细 -->
          <div class="win-type-list" v-if="SelectedWinDetail">
            <div v-for="(item,index) in OpenDetail.detail" :key="index" >
              <div class="container" v-if="item.bonus_type != 'sorry'">
                <div class="title" v-if="item.bonus_type != 'sorry'">
                  <div class="name" v-if="item.bonus_type == 'lottery_award'">超级全球彩大奖</div>
                  <div class="name" v-if="item.bonus_type == 'second_price'">二等奖</div>
                  <div class="name" v-if="item.bonus_type == 'third_price'">三等奖</div>
                  <div class="name" v-if="item.bonus_type == 'fourth_price'">四等奖</div>
                  <div class="name" v-if="item.bonus_type == 'special_award'">特别奖</div>
                  <div class="name" v-if="item.bonus_type == 'fifth_price'">五等奖</div>
                  <div class="name" v-if="item.bonus_type == 'sixth_price'">六等奖</div>
                  <div class="name" v-if="item.bonus_type == 'seventh_price'">七等奖</div>
                  <div class="win-list" @click="openWinnerList(index)">中奖名单</div>
                </div>
                <div class="info" v-if="item.bonus_type == 'lottery_award'">奖金= ( 全球彩奖池 x 60% ) / 中奖数量</div>
                <div class="info" v-if="item.bonus_type == 'second_price'">奖金= ( 全球彩奖池 x 20% ) / 中奖数量</div>
                <div class="info" v-if="item.bonus_type == 'third_price'">奖金= ( 全球彩奖池 x 10% ) / 中奖数量</div>
                <div class="info" v-if="item.bonus_type == 'fourth_price'">奖金= ( 全球彩奖池 x 5% ) / 中奖数量</div>
                <div class="info" v-if="item.bonus_type == 'special_award'">奖金= 被推荐者超级全球彩大奖奖金的10%</div>
                <div class="info" v-if="item.bonus_type == 'fifth_price'">10 UE</div>
                <div class="info" v-if="item.bonus_type == 'sixth_price'">5 UE</div>
                <div class="info" v-if="item.bonus_type == 'seventh_price'">1 UE</div>
                <div class="info" v-if="item.bonus_type != 'sorry'">中奖数: {{item.key_count}} Key</div>
                <div class="info" v-if="item.bonus_type != 'sorry'">全球彩奖池: 21938903890.00</div>
                <div class="win-count" v-if="item.bonus_type != 'sorry'">
                  <div class="win-title">奖金</div>
                  <div class="win-num">{{item.award_amount}} UE</div>
                </div>
              </div>
            </div>
          </div>
          <!-- 中奖者名单 -->
          <transition>
            <div class="winner-list" v-if="winnerDialog">
              <div class="container">
                <div class="body">
                  <div class="winner-body">
                    <div class="header">
                      <div class="item">中奖账户</div>
                      <div class="item">中奖数</div>
                      <div class="item">派奖金额</div>
                    </div>
                    <div class="header" v-for="(item,index) in winnerList" :key="index">
                      <div class="item">{{item.account_name}}</div>
                      <div class="item">{{item.win_key}}</div>
                      <div class="item">{{item.award_amount}}</div>
                    </div>
                  </div>
                  <div class="close-btn"><div class="content" @click="winnerDialog = false">关闭</div></div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </slot>
    </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import Header from '@/pages/game/qqc/components/Header'
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
      OpenDetail: {},//开奖详情
      tiemer: "",//开奖倒计时
      SelectedWinDetail: false,//是否展示中奖明细
      winnerDialog: false,//中奖者弹窗
      winnerList: [],//中奖者名单
    }
  },
  methods: {
    // 获取开奖详情
    getOpenDetail(gs_id){
      api.getMessageOne({gs_id:gs_id}).then(res => {
        console.log("获取开奖详情:",res);
        if(res.code != 1){
          this.$toast('获取开奖详情失败，请检查再重试！')
          return false;
        }
        if(res.code == 1){
          this.OpenDetail = res.data;
          this.OpenDetail.reward_time = format(parse(this.OpenDetail.reward_time), 'MM/DD/YY HH:mm:ss');
          // 判断是否已开奖 , 未开奖计算倒计时
          if(!this.OpenDetail.reward_code){
            //倒计时
            var allSecond =Math.abs(this.OpenDetail.count_down) 
            if(!allSecond){
              return false 
            }
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
          }
          // 判断是否已开奖 , 已开奖解析区块id
          if(this.OpenDetail.reward_code){
            this.OpenDetail.relate_info.forEach(element => {
              element.timestamp = format(parse(element.timestamp), 'HH:mm:ss:S');
              element.id = '...'+element.id.slice(45);
            });
          }
        }
      })
    },
    // 打开中奖者名单弹窗
    openWinnerList(index){
      this.winnerDialog = true;
      this.winnerList = this.OpenDetail.detail[index].award_lists;
      console.log("打开中奖者名单弹窗:",index,this.winnerList);
    }
  },
  created(){
    this.getOpenDetail(this.$route.params.gs_id);
  }
}
</script>

<style scoped>
.container{
  height: auto;width: 100%;background-color:rgb(40,40,40);min-height: 100%;
}
.record-title{
  height: 1.2rem;line-height: 1.2rem;padding-left: 0.5rem;padding-top: 1.6rem;color: rgb(218, 178, 121);font-size: 0.45rem;font-weight: bold;
}

/* 未开奖 */
.not-open-title{
  width: 100%;display: flex;height: 1.2rem;margin-top: 0.5rem;
}
.not-open-title .container{
  width: 80%;height: 100%;margin:auto;
  background:url('../../../assets/qqc/bg_2_time_img.png');
  margin: auto;background-repeat: no-repeat;background-size: 100%;
}
.not-open-title .container .title{
  float: left;line-height: 1.2rem;color: white;padding-left: 0.2rem;
}
.not-open-title .container .content{
  float: right;line-height: 1.2rem;color: white;padding-right: 0.2rem;font-weight: bold;font-size: 0.5rem;
}
.not-open-info{
  width: 100%;display: flex;height: auto;margin-top: -5px;
}
.not-open-info .container{
  width: 85%;min-height: 10rem;margin:auto;
  background:url('../../../assets/qqc/no award_bg_1_img.png');
  margin: auto;background-repeat: no-repeat;background-size: 100%;
}
.not-open-info .container .item{
  width: 100%;height: 1.2rem;line-height: 1.2rem;color: rgb(218, 178, 121);font-size: 0.4rem;
}
.not-open-info .container .item .title{
  float: left;padding-left: 0.5rem;
}
.not-open-info .container .item .content{
  float: right;padding-right: 0.5rem;
}

/* 已开奖 */
.open-title{
  width: 100%;display: flex;height: 1.2rem;margin-top: 0.5rem;
}
.open-title .container{
  width: 80%;height: 100%;margin:auto;
  background:url('../../../assets/qqc/bg_2_time_img.png');
  margin: auto;background-repeat: no-repeat;background-size: 100%;
}
.open-title .container .title{
  float: left;line-height: 1.2rem;color: white;padding-left: 0.2rem;
}
.open-title .container .content{
  float: right;line-height: 1.2rem;color: white;padding-right: 0.2rem;font-weight: bold;font-size: 0.5rem;
}
.open-info{
  width: 100%;display: flex;height: auto;margin-top: -5px;
}
.open-info .container{
  width: 85%;min-height: 10rem;margin:auto;
  background:url('../../../assets/qqc/lottery_bg_1_img.png');
  margin: auto;background-repeat: no-repeat;background-size: 100%;
}
.open-info .container .item{
  width: 100%;height: 1rem;line-height: 1rem;color: rgb(218, 178, 121);font-size: 0.4rem;
}
.open-info .container .item .title{
  float: left;padding-left: 0.5rem;
}
.open-info .container .item .content{
  float: right;padding-right: 0.5rem;
}

.block-open-info{
  width: 100%;display: flex;height: 20rem;margin-top: 0.5rem;
}
.block-open-info .container{
  width: 85%;min-height: 20rem;margin:auto;
  background:url('../../../assets/qqc/lottery_bg_2_img.png');
  margin: auto;background-repeat: no-repeat;background-size: 100%;
}
.block-open-info .container .title{
  height: 1rem;line-height: 1rem;text-align: center;font-size: 0.5rem;color: rgb(218, 178, 121);margin-top: 1rem;
}
.block-open-info .container .tips{
  height: 0.6rem;line-height: 0.6rem;text-align: center;font-size: 0.25rem;color:#a9a9a9;
}
.block-open-info .container .block-item{
  height: 1rem;line-height: 1rem;width: 80%;margin: auto;
}
.block-open-info .container .block-item .time{
  float: left;
}
.block-open-info .container .block-item .id{
  float: right;
}
.select-off{
  font-size: 0.35rem;color: rgb(152, 127, 93);
}

/* 中奖明细 */
.win-type-list{
  width: 100%;height: auto;
}
.win-type-list .container{
  width: 85%;min-height: 6rem;margin:auto;
  background:url('../../../assets/qqc/det_bg_1_img.png');
  margin: auto;background-repeat: no-repeat;background-size: 100%;
}
.win-type-list .container .title{
  height: 0.8rem;line-height: 0.8rem;color: rgb(218, 178, 121);padding-top: 0.2rem;
}
.win-type-list .container .title .name{
  float: left;margin-left: 0.5rem;font-size: 0.4rem;
}
.win-type-list .container .title .win-list{
  float: right;margin-right: 0.5rem;
  padding: 0px 0.5rem 0 0.5rem;background-color: rgb(218, 178, 121);color: black;border-radius: 0.5rem;
}
.win-type-list .container .info{
  line-height: 0.8rem;padding-left: 0.5rem;color: rgb(218, 178, 121);
}
.win-type-list .container .win-count{
  height: 0.8rem;line-height: 0.8rem;color: rgb(218, 178, 121);padding-top: 0.2rem;
}
.win-type-list .container .win-count .win-title{
  float: left;margin-left: 0.5rem;font-size: 0.35rem;
}
.win-type-list .container .win-count .win-num{
  float: right;margin-right: 0.5rem;font-size: 0.35rem;
}
/* 中奖者名单 */
.winner-list{
  position:fixed;
  top:0;
  bottom:0;
  left:0;
  right:0;
  background-color:  rgba(0, 0, 0, 0.509803921568627);
  z-index:99;
  display:flex;
  align-items:center;
  justify-content: center;
}
.winner-list .container{
  width: 100%;height: 100%;
}
.winner-list .container .body{
  height: 85%;width: 100%;background-color: white;bottom: 0px;position: absolute;border-top-left-radius: 1rem;border-top-right-radius: 1rem;
}
.winner-list .container .body .winner-body{
  height: 80%;width: 100%;
}
.winner-list .container .body .winner-body .header{
  height: 1rem;line-height: 1rem;display: flex;
}
.winner-list .container .body .winner-body .header .item{
  width: 33.33%;text-align: center;
}
.winner-list .container .body .close-btn{
  height: 20%;width: 100%;display: flex;
}
.winner-list .container .body .close-btn .content{
  width: 70%;background-color: rgb(218, 178, 121);text-align: center;
  height: 1rem;line-height: 1rem;border-radius: 0.2rem;margin: auto;
}

</style>

<style>
.page__background{
  background-color: rgb(56, 56, 58);
}
</style>