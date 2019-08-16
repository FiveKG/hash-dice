<template>
  <vpage>
    <slot>
      <vheader :title="$t('assets.backup_confirm')" />
      <v-ons-row class="title">{{$t('assets.backup_cypkfyw')}}</v-ons-row>
      <div class="desc">{{$t('assets.backup_pfitibatttpk')}}</div>
      <div class="private_key">
        <span class="mnemonic" v-for="item in mnemonic" @click="clickMnemonic(item)">{{item}}</span>
      </div>
      <div class="shuffle">
        <span class="mnemonic" v-for="item in shuffle" @click="clickShuffle(item)">{{item}}</span>
      </div>
      <v-ons-row style="margin-top: 30px;justify-content: center;">
        <span class="btn" @click="clickBtn">{{$t('common.finish')}}</span>
      </v-ons-row>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import MyHeader from '@/components/MyHeader'
import {ethers} from 'ethers'

export default {
  components: {
    vpage: MyPage,
    vheader: MyHeader
  },
  data () {
    return {
      privateKey: '',
      mnemonic: [],
      shuffle: []
    }
  },
  created () {
    console.log(this.$route.query.mnemonic)
    const arr = this.$route.query.mnemonic.split(' ').slice()
    for (let i = 1; i < arr.length; i++) {
      const random = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[random]] = [arr[random], arr[i]];
    }
    this.shuffle = arr
  },
  methods: {
    async clickBtn() {
      const query = this.$route.query
      if (this.mnemonic.join(' ') === query.mnemonic) {
        const localFile = this.$store.state.wallet.localFile
        const wallets = localFile.wallets
        const path = "m/44'/60'/0'/0"
        const wallet = ethers.Wallet.fromMnemonic(this.mnemonic.join(' '), path)
        for (let item of wallets) {
          if (item.isDefault) {
            item.isDefault = false
          }
        }
        wallets.unshift({
          chain: 'eth',
          privateKey: query.encryptedPrivateKey,
          address: wallet.address,
          name: query.name,
          tokenList: [],
          isDefault: true
        })
        localStorage.setItem('isecsp_wallet',JSON.stringify(localFile))
        this.$store.commit('wallet/setAssets', null)
        const stack = this.$store.state.wallet.stack
        this.$router.go(0 - stack.length)
      } else {
        this.$toast('助记词顺序错误')
      }
    },
    clickMnemonic(item) {
      this.mnemonic.splice(this.mnemonic.indexOf(item), 1)
      this.shuffle.push(item)
    },
    clickShuffle(item) {
      this.shuffle.splice(this.shuffle.indexOf(item), 1)
      this.mnemonic.push(item)
    }
  },
}
</script>

<style scoped>
.l_header {
  font-weight: bold;
}
.title {
  justify-content: center;
  margin-top: 72px;
  font-size: 36px;
}
.desc {
  margin-top: 50px;
  padding: 0 52px;
  font-size: 24px;
  text-align: center;
}
.private_key {
  height: 264px;
  margin: 30px 52px;
  padding: 38px 30px;
  background-color: #f1f1f1;
  word-break: break-all;
  text-align: left;
  font-size: 30px;
  border: none;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
}
.shuffle {
  display: flex;
  flex-wrap: wrap;
  margin: 0 52px;
  padding: 0 10px;
  font-size: 30px;
  line-height: 1.5;
}
.mnemonic {
  margin-right: 30px;
}
.btn {
  padding: 25px 35px;
  border-radius: 15px;
  background-color: #ec565a;
  font-size: 34px;
  font-weight: 450;
  color: #fff;
}
</style>
