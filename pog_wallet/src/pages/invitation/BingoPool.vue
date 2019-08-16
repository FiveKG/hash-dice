<template>
  <vpage>
    <slot>
      <div class="header">
        <img src="@/assets/img/u14.png" @click="back">
        <span>Bingo 奖金池</span>
      </div>
      <div class="layout">
        <div>第 1 期</div>
        <div> <img class="line"> </div>
        <div class="countdown_label">倒计时</div>
        <div class="countdown_time">{{countdownStr}}</div>
        <div> <img class="line"> </div>
        <div class="no_invest">无新投资</div>
        <div> <img class="line line50"> </div>
        <div class="bingo_pool">
          <div>Bingo 奖池</div>
          <div>{{total}}</div>
          <div class="symbol">EOS</div>
          <div>{{poolRate}}</div>
        </div>
        <div> <img class="line"> </div>
        <div class="bonus_amount">{{currentBonus}}</div>
        <div class="bonus_symbol">EOS</div>
        <div>为本期奖金</div>
        <div> <img class="line"> </div>
        <div class="last_invest">
          <div>当前最后一名投资者</div>
          <div class="last_account">{{lastAccount}}</div>
          <div>可独得{{lastRate}}奖金</div>
          <div class="bonus_amount">{{lastBonus}}</div>
          <div>EOS</div>
        </div>
        <div> <img class="line"> </div>
        <div class="other_invest">
          <div>当前最后2-30名投资者</div>
          <div>余下奖金均分</div>
          <div>每账户可获奖金</div>
          <div class="bonus_amount">{{otherBonus}}</div>
          <div>EOS</div>
        </div>
        <div><img class="divider" src="@/assets/img/u8.png" alt=""></div>
        <div class="table_title">当前最后三十名投资主账户</div>
        <div class="account_layout">
          <div class="account_list">
            <div class="account_item" v-for="item in accountList">{{item}}</div>
          </div>
        </div>
        <div><img class="divider" src="@/assets/img/u8.png" alt=""></div>
        <div class="rules">
          <div class="rule_title">规则</div>
          <div>
            <div class="rule_label"> <span>倒计时</span> </div>
            <div class="rule_text">Bingo奖金池倒计时时长为 24 小时，每当有新投资（包含复投子账号）时，重置为 24小时倒计时</div>
          </div>
          <div>
            <div class="rule_label"> <span>分配</span> </div>
            <div class="rule_text">倒计时结束时无新投资（包含复投子账号），当前 Bingo 奖金池余额的 70% 作为本期 Bingo奖金，最后一名投资账号独得本期 Bingo 奖金的 50%，另 50% 由最后 2-30 名投资账号均分，奖金在倒计时结束后 1 小时内发放</div>
          </div>
          <div>
            <div class="rule_label"> <span>异常处理</span> </div>
            <div class="rule_text">
              <ol>
                <li>当受到黑客恶意攻击无法投资，平台处置后重新进行倒计时，本轮 Bingo 奖金不进行分配；</li>
                <li>当不可预见的其他因素导致无法投资时时，平台处置后重新进行倒计时，本轮Bingo奖金不进行分配</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import { poolBingo } from '@/servers/invitation';

export default {
  components: {
    vpage: MyPage,
  },
  data() {
    return {
      countdown: '',
      countdownStr: '',
      total: '',
      poolRate: '',
      currentBonus: '',
      lastAccount: '',
      lastBonus: '',
      lastRate: '',
      otherBonus: '',
      accountList: []
    }
  },
  created() {
    this.poolBingo()
  },
  methods: {
    poolBingo() {
      poolBingo({account_name: this.$route.query.account}).then(res => {
        console.log('poolBingo',res)
        if (res.code === 1) {
          this.countdown = res.data.bingo_countdown
          this.bingoCountdown()
          this.total = res.data.total
          this.poolRate = res.data.this_period_rate
          this.currentBonus = res.data.this_period_bonus
          this.lastAccount = res.data.last_invest_account
          this.lastBonus = res.data.last_invest_bonus
          this.lastRate = res.data.last_invest_rate
          this.otherBonus = res.data.other_invest_bonus
          this.accountList = res.data.bonus_account
        }
      })
    },
    bingoCountdown() {
      // 时间差(过期时间-当前时间)
      const bingo_countdown = Number(this.countdown) - Date.now()
      if (bingo_countdown) {
        const formatTime = time => {
          return time > 9 ? time : '0' + time
        }
        // 剩余小时(时间差/60*60*1000)
        const remainHour = formatTime(Math.floor(bingo_countdown/(60*60*1000)))
        // 剩余分钟(利用取余计算，时间差除以60*60*1000的余数就是减去小时后的毫秒数，再除以60*1000得到剩余分钟数)
        const remainMinute = formatTime(Math.floor(bingo_countdown%(60*60*1000)/(60*1000)))
        // 剩余秒数
        const remainSecond = formatTime(Math.floor(bingo_countdown%(60*60*1000)%(60*1000)/1000))
        this.countdownStr = remainHour + ':' + remainMinute + ':' + remainSecond
        setTimeout(() => {
          this.bingoCountdown()
        }, 500);
      } else {
        this.poolBingo()
      }
    },
    back() {
      this.$router.go(-1)
    }
  },
}
</script>

<style scoped>
.header {
  padding: 30px 35px;
  display: flex;
  align-items: center;
  font-size: 38px;
  background-color: #ececec;
}
.header img {
  width: auto;
  height: 50px;
}
.header span {
  flex: 1;
  margin-left: 20px;
}
.layout {
  padding-top: 50px;
  font-size: 30px;
  text-align: center;
}
.line {
  width: 1PX;
  height: 30px;
  background-color: #dddddd;
  display: block;
  margin: 20px auto;
}
.line50 {
  height: 50px;
}
.countdown_label {
  color: #aaaaaa;
  font-size: 32px;
  font-weight: bold;
}
.countdown_time {
  color: rgb(0, 204, 102);
  font-size: 45px;
  font-weight: bold;
}
.no_invest {
  font-size: 35px;
}
.bingo_pool {
  font-size: 35px;
  line-height: 1.5;
}
.symbol {
  font-size: 28px;
}
.bonus_amount {
  color: #ff9900;
  font-size: 45px;
}
.bonus_symbol {
  color: #ff9900;
  font-size: 28px;
}
.last_invest, .other_invest {
  line-height: 1.5;
}
.last_account {
  color: rgb(0, 204, 102);
}
.divider {
  margin: 50px 0;
  height: 20px;
}
.table_title {
  font-size: 34px;
}
.account_layout {
  padding: 20px 30px;
}
.account_list {
  display: flex;
  flex-wrap: wrap;
}
.account_item {
  background-color: #fff;
  width: calc((100vw - 60px)/3);
  padding: 20px;
  box-sizing: border-box;
  border: 1PX solid #999999;
}
.rules {
  text-align: left;
  padding: 0 30px;
}
.rule_title {
  color: #ff9900;
  margin-bottom: 20px;
  font-size: 35px;
}
.rule_label {
  margin-top: 20px;
}
.rule_label span {
  color: #ff9900;
  padding: 10px 0;
  border-bottom: 1PX solid #ff9900;
}
.rule_text {
  margin-top: 20px;
}
ol {
  padding-left: 30px;
}
</style>
