<template>
  <vpage>
    <slot>
      <vheader :title="$t('assets.backup_wallet')" />
      <v-ons-row class="title">立即备份你的助记词</v-ons-row>
      <v-ons-row class="desc">抄写助记词，并保存在安全的地方。千万不要保存在网络上。然后尝试转入转出小额资产开始使用。</v-ons-row>
      <v-ons-row>
        <div class="private_key">
          <span class="mnemonic" v-for="item in mnemonic">{{item}}</span>
        </div>
      </v-ons-row>
      <v-ons-row style="margin-top: 30px;justify-content: center;">
        <span class="btn" @click="clickBtn">{{$t('common.next_step')}}</span>
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
  data() {
    return {
      query: {},
      mnemonic: []
    }
  },
  created () {
    this.query = this.$route.query
    this.mnemonic = this.query.mnemonic.split(' ')
  },
  methods: {
    clickBtn() {
      this.$router.push({
        name: 'EthConfrimMnemonic',
        query: this.query
      })
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
.mnemonic {
  margin-right: 20px;
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
