<template>
  <vpage>
    <slot>
      <div class="header">
        <div>
          <img src="@/assets/img/u14.png" @click="back">
          <span>五倍收益保障池</span>
        </div>
        <span class="rules">我的保障收益</span>
      </div>
      <div class="layout">
        <div>当前五倍收益保障池余额</div>
        <div class="total_amount">{{currentAmount}}</div>
        <div>EOS</div>
        <div><img class="divider" src="@/assets/img/u8.png" alt=""></div>
        <div class="desc1">
          <div>每日发放保障金一次</div>
          <div>每日 00:00 按所有应发主账号与五倍收益差额</div>
          <div>计算每账号比例进行发放</div>
          <div>当前五倍收益保障池余额的 30% 为每日发放总额</div>
        </div>
        <div><img class="divider" src="@/assets/img/u8.png" alt=""></div>
        <div>所有未达五倍收益的主账号均可获得保障金</div>
        <div class="my_income">我的主账号收益：{{my_income}} EOS</div>
        <div>
          <div class="can_get">主账号收益未达五倍，还可获得保障金</div>
        </div>
        <div><img class="divider" src="@/assets/img/u8.png" alt=""></div>
        <div>累计已发放五倍保障金</div>
        <div class="sent_amount">{{sent}}</div>
        <div>EOS</div>
        <div><img class="divider" src="@/assets/img/u8.png" alt=""></div>
        <div>五倍收益保障池累计收入</div>
        <div class="income_amount">{{total}}</div>
        <div>EOS</div>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import { poolSafe } from '@/servers/invitation';

export default {
  components: {
    vpage: MyPage,
  },
  data() {
    return {
      currentAmount: '',
      sent: '',
      total: '',
      my_income: ''
    }
  },
  created() {
    poolSafe({account_name: this.$route.query.account}).then(res => {
      console.log(res)
      if (res.code === 1) {
        this.currentAmount = res.data.current_amount
        this.sent = res.data.issue
        this.total = res.data.total
        this.my_income = res.data.account_income
      }
    })
  },
  methods: {
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
  font-size: 36px;
  background-color: #ececec;
}
.header img {
  width: auto;
  height: 50px;
}
.header div {
  flex: 1;
  display: flex;
  align-items: center;
}
.rules {
  color: #006699;
}
.layout {
  padding: 50px 0;
  font-size: 30px;
  text-align: center;
}
.total_amount {
  margin-top: 30px;
  font-size: 50px;
  font-weight: bold;
  color: #ff9900;
}
.divider {
  margin: 50px 0;
  height: 20px;
}
.desc1 {
  line-height: 2;
}
.my_income {
  margin-top: 30px;
}
.can_get {
  color: #ff9900;
  border-top: 1PX solid #dddddd;
  display: inline-block;
}
.sent_amount,.income_amount {
  margin-top: 30px;
  font-size: 40px;
}
</style>
