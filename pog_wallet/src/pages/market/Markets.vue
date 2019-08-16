<template>
  <vpage>
    <slot>
      <v-ons-row class="header_title">
        <v-ons-col class="label_token">资产名称</v-ons-col>
        <v-ons-col class="label_price">最新价格</v-ons-col>
        <v-ons-col class="label_amplitude">涨跌幅</v-ons-col>
      </v-ons-row>
      <div class="page_card">
        <v-ons-row class="card_item" v-for="item in tokens">
          <v-ons-col class="token_name">{{item.symbol}}</v-ons-col>
          <v-ons-col class="token_price">{{$store.state.wallet.currency === 'USD' ? '$':'￥'}} {{parseFloat(item.price).toFixed(4)}}</v-ons-col>
          <v-ons-col class="amplitude">
            <span :style="{background: item.fluctuation > 0 ? '#2bd42b':'#ec565a'}">{{item.fluctuation > 0 ? '+':''}}{{item.fluctuation}}%</span>
          </v-ons-col>
        </v-ons-row>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage';
import { getMarkets } from '@/servers';

export default {
  components: {
    vpage: MyPage
  },
  data() {
    return {
      tokens: []
    }
  },
  created() {
    getMarkets({convert: this.$store.state.wallet.currency}).then(res => {
      console.log(res)
      if (res.code === 1) {
        const arr = []
        for (const item of res.data) {
          let obj = Object.assign({}, item)
          obj.price = parseFloat(item.price).toFixed(4)
          obj.fluctuation = parseFloat(item.fluctuation).toFixed(2)
          arr.push(obj)
        }
        this.tokens = arr
      }
    })
  },
}
</script>

<style scoped>
.header_title {
  background-color: #fff;
  color: #a3a3a3;
  font-size: 26px;
  padding: 28px 76px 20px 76px;
  text-align: center;
}
.label_token {
  text-align: left;
}
.label_price {
  text-align: right;
}
.label_amplitude {
  text-align: right;
}
.page_card {
  margin: 24px;
  border-radius: 15px;
  background-color: #fff;
}
.card_item {
  padding: 64px 52px;
  font-size: 34px;
  border-bottom: 1PX solid rgb(230, 230, 230);
  text-align: center;
  align-items: center;
}
.card_item:last-child {
  border: none;
}
.token_name {
  text-align: left;
}
.token_price {
  font-size: 30px;
  text-align: right;
  /* background-color: #2bd42b; */
}
.amplitude {
  color: #fff;
  font-size: 26px;
  text-align: right;
}
.amplitude span {
  padding: 8px 15px;
  /* width: 143px;
  height: 53px; */
  border-radius: 15px;
}
</style>
