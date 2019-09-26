<template>
    <vpage>
      <slot>
        <div class="container">
          <Header :HeaderTitlle="HeaderTitlle"></Header>
          <div class="record-title">开奖详情</div>
          <!-- 未开奖 -->
          <div class="not-open-title">
            <div class="container">
              <div class="title">待开奖-开奖倒计时:</div>
              <div class="content">08:00:00</div>
            </div>
          </div>
          <div class="not-open-info">
            <div class="container">
              <div class="item">
                <div class="title">本期</div>
                <div class="content">第 50 期</div>
              </div>
              <div class="item">
                <div class="title">开奖时间</div>
                <div class="content">09/24/19 17:57:34</div>
              </div>
              <div class="item">
                <div class="title">本期累计奖池</div>
                <div class="content">1213.113UE</div>
              </div>
            </div>
          </div>
          <!-- 已开奖 -->
          <div class="not-open-title">
            <div class="container">
              <div class="title">本期中奖号码:</div>
              <div class="content">1,1,1,1,1,1,1,1,1</div>
            </div>
          </div>
          <div class="open-info">
            <div class="container">
              <div class="item">
                <div class="title">本期:</div>
                <div class="content">第 50 期</div>
              </div>
              <div class="item">
                <div class="title">开奖时间:</div>
                <div class="content">09/24/19 17:57:34</div>
              </div>
              <div class="item">
                <div class="title">本期累计奖池:</div>
                <div class="content">1213.113UE</div>
              </div>
              <div class="item">
                <div class="title">本期共派奖:</div>
                <div class="content">213.113UE</div>
              </div>
              <div class="item">
                <div class="title">本期储备池拨出:</div>
                <div class="content">0.000UE</div>
              </div>
              <div class="item">
                <div class="title">底池拨入下一期奖池:</div>
                <div class="content">120.000UE</div>
              </div>
              <div class="item">
                <div class="title">第 50 期奖池初始额:</div>
                <div class="content">12790.000UE</div>
              </div>
            </div>
          </div>
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
          
        }
      })
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

</style>

<style>
.page__background{
  background-color: rgb(56, 56, 58);
}
</style>