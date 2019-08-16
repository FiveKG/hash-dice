<template>
  <vpage>
    <slot>
      <div class="page_header">
        <img class="ion_back" src="@/assets/img/back.png" @click="back"> 
        <span>{{$t('assets.transaction_details')}}</span>
      </div>
      <div class="icon">
        <img src="@/assets/img/transfer_success.png">
      </div>
      <div class="card">
        <div class="transfer_success">{{$t('assets.transfer_success')}}</div>
        <div class="quantity">{{query.type === 'in' ? '+' : '-'}} {{query.quantity}} {{query.symbol}}</div>
        <div class="info_up">
          <div class="info_item">
            <span class="info_left">{{$t('assets.payer')}}</span>
            <span class="info_right">{{query.sender}}</span>
          </div>
          <div class="info_item">
            <span class="info_left">{{$t('assets.payee')}}</span>
            <span class="info_right">{{query.receiver}}</span>
          </div>
          <div class="info_item">
            <span class="info_left">{{$t('assets.memo')}}</span>
            <span class="info_right">{{query.memo}}</span>
          </div>
        </div>
        <div class="info_down">
          <div class="info_item">
            <span class="info_left">{{$t('assets.trade_number')}}</span>
            <span class="info_right">{{query.trx_id}}</span>
          </div>
          <div class="info_item">
            <span class="info_left">{{$t('assets.block_number')}}</span>
            <span class="info_right">{{query.block_num}}</span>
          </div>
          <div class="info_item">
            <span class="info_left">{{$t('assets.trading_time')}}</span>
            <span class="info_right">{{query.time}}</span>
          </div>
        </div>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'

export default {
  components: {
    vpage: MyPage
  },
  data() {
    return {
      query: {}
    }
  },
  created() {
    this.query = this.$route.query
    const query = this.$route.query
    this.query.trx_id = query.trx_id.substr(0,10) + '...' + query.trx_id.substr(query.trx_id.length - 10)
  },
  methods: {
    back() {
      this.$router.go(-1);
    }
  },
}
</script>

<style scoped>
.page_header {
  height: 130px;
  padding: 45px 55px;
  text-align: center;
  position: relative;
  font-size: 34px;
  background-color: #fff;
  box-sizing: border-box;
}
.ion_back {
  width: 42px;
  height: 32px;
  position: absolute;
  left: 55px;
  top: 50%;
  transform: translate(0, -50%);
}
.icon {
  margin-top: 28px;
  text-align: center;
}
.icon img {
  width: 96px;
  height: 96px;
}
.card {
  border-radius: 15px;
  margin: 32px;
}
.transfer_success {
  text-align: center;
  margin-top: 44px;
  font-size: 28px;
  color: #b1b1b1;
}
.quantity {
  margin-top: 50px;
  font-size: 38px;
  text-align: center;
}
.info_up {
  margin: 118px 72px 0 72px;
  padding-bottom: 92px;
  border-bottom: 1PX solid #dddddd;
}
.info_down {
  margin: 92px 72px 0 72px;
  padding-bottom: 62px;
  /* border-bottom: 1PX solid #dddddd; */
}
.info_item {
  display: flex;
  font-size: 28px;
  margin-top: 56px;
}
.info_left {
  color: #b1b1b1;
}
.info_right {
  flex: 1;
  text-align: right;
}
</style>
