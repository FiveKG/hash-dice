<template>
  <vpage>
    <slot>
      <div class="header">
        <img src="@/assets/img/u14.png" @click="back">
        <span>股东分红池</span>
        <svg class="icon" width="26px" height="26px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#999" d="M677.312 704l-384 0c-17.664 0-32 14.336-32 32s14.336 32 32 32l384 0c17.664 0 32-14.336 32-32S695.04 704 677.312 704zM677.312 512l-384 0c-17.664 0-32 14.336-32 32S275.648 576 293.312 576l384 0c17.664 0 32-14.336 32-32S695.04 512 677.312 512zM773.312 128l-128 0L645.312 96c0-17.664-14.336-32-32-32s-32 14.336-32 32L581.312 128l-192 0L389.312 96c0-17.664-14.336-32-32-32s-32 14.336-32 32L325.312 128l-128 0c-70.656 0-128 57.344-128 128l0 576c0 70.656 57.344 128 128 128l576 0c70.656 0 128-57.344 128-128L901.312 256C901.312 185.344 844.032 128 773.312 128zM837.312 832c0 35.392-28.608 64-64 64l-576 0c-35.392 0-64-28.608-64-64L133.312 256c0-35.392 28.608-64 64-64l128 0 0 32c0 17.664 14.336 32 32 32s32-14.336 32-32L389.312 192l192 0 0 32c0 17.664 14.336 32 32 32s32-14.336 32-32L645.312 192l128 0c35.392 0 64 28.608 64 64L837.312 832zM677.312 320l-384 0c-17.664 0-32 14.336-32 32S275.648 384 293.312 384l384 0c17.664 0 32-14.336 32-32S695.04 320 677.312 320z" />
        </svg>
      </div>
       
      <div class="layout">
        <div>{{periods}}期TBG分红额</div>
        <div class="total_amount">{{dividend_enable}}</div>
        <div>UE</div>
        <div class="total_amount">每1TBG{{bonus}}UE</div>
        <div><img class="divider" src="@/assets/img/u8.png" alt=""></div>
        <div>当前TBG股东分红池余额</div>
        <div class="income_amount">{{quantity}}</div>
        <div>UE</div>
        <div><img class="divider" src="@/assets/img/u8.png" alt=""></div>
        <div>累计已发放股东分红</div>
        <div class="income_amount">{{issue}}</div>
        <div>UE</div>
        <div><img class="divider" src="@/assets/img/u8.png" alt=""></div>
        <div class="lh">每天 00:00 分红一次</div>
        <div class="lh">按用户持有的TBG可售数量进行分红</div>
        <div class="lh">TBG股东分红池余额的 10% 为每天分红总额</div>
       <!-- <div v-if="level !== 3">尚未具备分红资格</div>
        <div><img class="divider" src="@/assets/img/u8.png" alt=""></div>
        <div class="layout_bottom">
          <div>每周分红一次</div>
          <div>周一 00:00 按钻石股东会员的直接推荐数比例进行分红</div>
          <div>当前股东分红池余额的 50% 为每周分红总额</div>
        </div>
      </div>-->
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
      periods: '',
      dividend_enable: '',
      bonus: '',
      quantity: '',
      issue:'',
      dividend_rate:''
    }
  },
  created() {
    api.poolShareholder({account_name: this.$store.state.wallet.localFile.wallets[0].accountNames[0]}).then(res => {
      console.log(res)
      if (res.code === 1) {
        this.periods = res.data.periods
        this.dividend_enable = res.data.dividend_enable
        this.bonus = res.data.bonus
        this.quantity = res.data.quantity
        this.issue = res.data.issue
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
  padding: 50px 0;
  text-align: center;
  font-size: 32px;
}
.total_amount {
  color: #ff9900;
  margin-top: 50px;
  font-size: 50px;
}
.divider {
  margin: 50px 0;
  height: 20px;
}
.sent_amount {
  font-size: 38px;
  margin-top: 30px;
}
.income_amount {
  font-size: 40px;
  margin-top: 30px;
}
.lh{
  margin-top: 20px;
}
.member_level {
  margin-top: 50px;
}
.member_level div {
  display: inline-block;
  padding: 10px 50px;
  border-bottom: 1PX solid #dddddd;
}
.layout_bottom {
  line-height: 2;
}
</style>
