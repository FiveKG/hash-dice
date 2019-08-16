<template>
  <vpage>
    <slot>
      <div class="page_header">
        <img class="ion_back" src="@/assets/img/back.png" @click="back"> 
        <span>{{$t('assets.select_token')}}</span>
      </div>
      <div class="card" @click="clickToken('eth')">
        <img src="@/assets/img/system_eth.png">
        <div class="symbol">ETH</div>
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
          <div class="balance">{{item.balance ? item.balance : '0.0'}}</div>
          <div class="balance_usd">≈ $ 0.00</div>
        </div>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import MyHeader from '@/components/MyHeader'
import {ethers} from 'ethers'
import {getabi} from '@/servers/eth'

export default {
  components: {
    vpage: MyPage,
    vheader: MyHeader
  },
  data () {
    return {
      balance: '0.0',
      assets: {},
      tokens: []
    }
  },
  async created() {
    console.log(this.$store.state.wallet.assets)
    this.assets = this.$store.state.wallet.assets
    this.tokens = this.assets.tokens
    this.getBalance()
  },
  methods: {
    getBalance() {
      const provider = ethers.getDefaultProvider(this.ethNet);
      provider.getBalance(this.assets.address).then(balance => {
        const estr = ethers.utils.formatEther(balance);
        console.log('provider',estr)
        this.balance = estr
      })
      for (const token of this.tokens) {
        getabi({address: token.address}).then(async res => {
          // console.log('getabi',res)
          if (res.message === 'OK') {
            const abi = JSON.parse(res.result)
            const contract = new ethers.Contract(token.address,abi,provider)
            const balance = await contract.balanceOf(this.assets.address)
            token.balance = ethers.utils.formatEther(balance)
            console.log(ethers.utils.formatEther(balance))
          }
        })
      }
    },
    clickToken(token) {
      if (token === 'eth') {
        this.$store.commit('wallet/setSelectEthToken', {
          symbol: 'ETH'
        })
      } else {
        this.$store.commit('wallet/setSelectEthToken', token)
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
  text-align: right;
}
.balance_usd {
  font-size: 30px;
  color: #b3b3b3;
  text-align: right;
}
</style>
