<template>
  <vpage>
    <slot>
      <div class="page_header">
        <img class="ion_back" src="@/assets/img/back.png" @click="back"> 
        <span>{{$t('me.manage_wallet')}}</span>
      </div>
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else>
        <div class="wallet_card" v-for="item in wallets" @click="clickItem(item)">
          <div>
            <span class="wallet_name">{{item.chain === 'eth' ? item.name : item.accountNames[0]}}</span>
            <span class="current" v-if="item.isDefault">{{$t('me.current_wallet')}}</span>
          </div>
          <div class="wallet_key">{{item.shortKey}}</div>
          <div>
            <span class="amount">{{item.balance}}</span>
            <span class="chain">{{item.chain === 'eth' ? 'ETH' : (item.chain === 'eos' ? 'EOS':'POG')}}</span>
          </div>
        </div>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import eos from '@/plugins/eos'
import pog from '@/plugins/pog'
import {ethers} from 'ethers'

export default {
  components: {
    vpage: MyPage
  },
  data() {
    return {
      loading: false,
      wallets: []
    }
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      let wallets = this.$store.state.wallet.localFile.wallets.slice()
      try {
        this.loading = true
        for (const item of wallets) {
          if (item.chain === 'eos') {
            item.shortKey = item.publicKey.substr(0,17) + '...' + item.publicKey.substr(item.publicKey.length - 17)
            const balances = await eos.getTableRows({
              json:true,
              code:'eosio.token',
              scope:item.accountNames[0],
              table:'accounts',
              limit:5
            })
            console.log(balances)
            item.balance = balances.rows.length ? balances.rows[0].balance.split(' ')[0] : '0.0000'
          }
          if (item.chain === 'eth') {
            const provider = ethers.getDefaultProvider(this.ethNet)
            const balance = await provider.getBalance(item.address)
            const estr = ethers.utils.formatEther(balance)
            item.balance = estr
          }
          if (item.chain === 'pog') {
            item.shortKey = item.publicKey.substr(0,17) + '...' + item.publicKey.substr(item.publicKey.length - 17)
            const balances = await pog.getTableRows({
              json:true,
              code:'eosio.token',
              scope:item.accountNames[0],
              table:'accounts',
              limit:5
            })
            console.log(balances)
            item.balance = balances.rows.length ? balances.rows[0].balance.split(' ')[0] : '0.0000'
          }
        }
        this.wallets = wallets
        this.loading = false
      } catch (error) {
        console.log(error)
      }
    },
    clickItem(item) {
      console.log(item)
      if (item.chain === 'eth') {
        this.$router.push({
          name: 'EthWalletInfo',
          query: {
            account: item.name,
            balance: parseFloat(item.balance),
            // shortKey: item.shortKey,
            privateKey: item.privateKey,
            publicKey: item.address
          }
        })
      }
      if (item.chain === 'eos') {
        this.$router.push({
          name: 'WalletInfo',
          query: {
            account: item.accountNames[0],
            balance: parseFloat(item.balance),
            shortKey: item.shortKey,
            privateKey: item.privateKey,
            publicKey: item.publicKey
          }
        })
      }
      if (item.chain === 'pog') {
        this.$router.push({
          name: 'PogWalletInfo',
          query: {
            account: item.accountNames[0],
            balance: parseFloat(item.balance),
            shortKey: item.shortKey,
            privateKey: item.privateKey,
            publicKey: item.publicKey
          }
        })
      }
    },
    back() {
      this.$router.go(-1)
    }
  },
  watch: {
    '$store.state.wallet.localFile.wallets'(newVal) {
      this.initData()
    }
  },
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
.loading {
  margin-top: 40vh;
  text-align: center;
  color: #b0b0b0;
  font-size: 30px;
}
.wallet_card {
  margin: 40px 26px;
  padding: 44px 46px;
  background-color: #fff;
  box-shadow: 0 0 20px #e9e9e9;
  border-radius: 15px;
}
.wallet_name {
  font-size: 34px;
  font-weight: bold;
}
.current {
  background-color: #5789e3;
  color: #fff;
  margin-left: 78px;
  padding: 10px;
  border-radius: 15px;
  font-size: 16px;
}
.wallet_key {
  margin: 36px 0;
  color: #b0b0b0;
  font-size: 26px;
}
.amount {
  font-size: 34px;
}
.chain {
  color: #b0b0b0;
  font-size: 28px;
  margin-left: 24px;
}
</style>
