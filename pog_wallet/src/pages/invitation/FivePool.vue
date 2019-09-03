<template>
  <vpage>
    <slot>
      <div class="header">
        <div>
          <img src="@/assets/img/u14.png" @click="back">
          <span>三倍收益保障池</span>
        </div>
        <span class="rules">
        <svg class="icon" width="26px" height="26px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#999" d="M677.312 704l-384 0c-17.664 0-32 14.336-32 32s14.336 32 32 32l384 0c17.664 0 32-14.336 32-32S695.04 704 677.312 704zM677.312 512l-384 0c-17.664 0-32 14.336-32 32S275.648 576 293.312 576l384 0c17.664 0 32-14.336 32-32S695.04 512 677.312 512zM773.312 128l-128 0L645.312 96c0-17.664-14.336-32-32-32s-32 14.336-32 32L581.312 128l-192 0L389.312 96c0-17.664-14.336-32-32-32s-32 14.336-32 32L325.312 128l-128 0c-70.656 0-128 57.344-128 128l0 576c0 70.656 57.344 128 128 128l576 0c70.656 0 128-57.344 128-128L901.312 256C901.312 185.344 844.032 128 773.312 128zM837.312 832c0 35.392-28.608 64-64 64l-576 0c-35.392 0-64-28.608-64-64L133.312 256c0-35.392 28.608-64 64-64l128 0 0 32c0 17.664 14.336 32 32 32s32-14.336 32-32L389.312 192l192 0 0 32c0 17.664 14.336 32 32 32s32-14.336 32-32L645.312 192l128 0c35.392 0 64 28.608 64 64L837.312 832zM677.312 320l-384 0c-17.664 0-32 14.336-32 32S275.648 384 293.312 384l384 0c17.664 0 32-14.336 32-32S695.04 320 677.312 320z" />
        </svg>
        </span>
      </div>
      <div class="layout">
        <div>当前三倍收益保障池余额</div>
        <div class="total_amount">{{currentAmount}}</div>
        <div>UE</div>
        <div><img class="divider" src="@/assets/img/u8.png" alt=""></div>
        <div class="desc1">
          <div>每日发放保障金一次</div>
          <div>每日 00:00 按所有应发主账号与三倍收益差额</div>
          <div>计算每账号比例进行发放</div>
          <div>当前三倍收益保障池余额的 {{dividend_rate}}% 为每日发放总额</div>
        </div>
        <div><img class="divider" src="@/assets/img/u8.png" alt=""></div>
        <div>所有未达三倍收益的主账号均可获得保障金</div>
        <div class="my_income">我的主账号收益：{{my_income}} UE</div>
        <div>
          <div class="can_get">主账号收益未达三倍，还可获得保障金</div>
        </div>
        <div><img class="divider" src="@/assets/img/u8.png" alt=""></div>
        <div>累计已发放三倍保障金</div>
        <div class="sent_amount">{{sent}}</div>
        <div>UE</div>
        <div><img class="divider" src="@/assets/img/u8.png" alt=""></div>
        <div>三倍收益保障池累计收入</div>
        <div class="income_amount">{{total}}</div>
        <div>UE</div>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import api from '@/servers/invitation';

export default {
  components: {
    vpage: MyPage,
  },
  data() {
    return {
      currentAmount: '',
      sent: '',
      total: '',
      my_income: '',
      dividend_rate:''
    }
  },
  created() {
    api.poolSafe({account_name: this.$store.state.wallet.localFile.wallets[0].accountNames[0]}).then(res => {
      console.log(res)
      if (res.code === 1) {
        this.currentAmount = res.data.current_amount
        this.sent = res.data.issue
        this.total = res.data.total
        this.my_income = res.data.account_income
        this.dividend_rate = res.data.dividend_rate
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
