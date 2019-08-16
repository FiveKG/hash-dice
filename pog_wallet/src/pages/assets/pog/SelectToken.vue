<template>
  <vpage>
    <slot>
      <div class="page_header">
        <img class="ion_back" src="@/assets/img/back.png" @click="back"> 
        <span>{{$t('assets.select_token')}}</span>
      </div>
      <div class="card" @click="clickToken('pog')">
        <img src="@/assets/img/system_pog.png">
        <div class="symbol">POG</div>
        <div>
          <div class="balance">{{balance}}</div>
          <div class="balance_usd">≈ $ 0.00</div>
        </div>
      </div>
      <div class="card" v-for="item in tokens" @click="clickToken(item)">
        <img :src="item.logo" v-if="item.logo">
        <img src="@/assets/img/question.png" v-else>
        <div class="symbol">{{item.symbol}}</div>
        <div>
          <div class="balance">{{item.balance ? item.balance : '0.0000'}}</div>
          <div class="balance_usd">≈ $ 0.00</div>
        </div>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import MyHeader from '@/components/MyHeader'
import pog from '@/plugins/pog'

export default {
  components: {
    vpage: MyPage,
    vheader: MyHeader
  },
  data () {
    return {
      balance: '0.0000',
      tokens: []
    }
  },
  async created() {
    console.log(this.$store.state.wallet.assets)
    const assets = this.$store.state.wallet.assets
    // this.tokens = assets.tokens
    const balances = await pog.getTableRows({
      json:true,
      code:'eosio.token',
      scope:assets.account,
      table:'accounts',
      limit:500
    })
    let token = {
      logo: '',
      symbol: '',
      balance: ''
    }
    this.balance = balances.rows.length ? balances.rows[0].balance.split(' ')[0] : '0.0000'
    // for (let item of this.tokens) {
    //   eos.getTableRows({
    //     json:true,
    //     code:item.account_name,
    //     scope:assets.account,
    //     table:'accounts',
    //     limit:500
    //   }).then(res => {
    //     token.balance = res.rows.length ? res.rows[0].balance.split(' ')[0] : '0.0000'
    //   })
    // }
  },
  methods: {
    clickToken(token) {
      if (token === 'pog') {
        this.$store.commit('wallet/setSelectToken', {
          account_name: 'eosio.token',
          balance: this.balance,
          symbol: 'POG'
        })
      } else {
        this.$store.commit('wallet/setSelectToken', token)
      }
      this.$router.go(-1)
    },
    back() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.page_header {
  padding: 30px 55px;
  text-align: center;
  position: relative;
  font-size: 34px;
  background-color: #fff;
}
.ion_back {
  width: 42px;
  height: 32px;
  position: absolute;
  left: 55px;
  top: 50%;
  transform: translate(0, -50%);
}
.card {
  margin: 20px 24px 0 24px;
  padding: 42px 65px;
  border-radius: 15px;
  background-color: #fff;
  display: flex;
  align-items: center;
}
.card img {
  height: 78px;
}
.symbol {
  flex: 1;
  margin-left: 45px;
  font-size: 34px;
}
.balance {
  font-size: 36px;
}
.balance_usd {
  font-size: 30px;
  color: #b3b3b3;
}
</style>
