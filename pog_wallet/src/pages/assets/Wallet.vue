<template>
    <div class="layout">
      <div class="wallet_chain">
        <div>当前底层</div>
        <div class="card_chain" @click="clickChain" v-if="walletChain === 'ETH'">
          <img src="@/assets/img/system_eth.png" alt="">
          <span class="card_center">以太坊</span>
          <span class="card_right">点击切换</span>
        </div>
        <div class="card_chain" @click="clickChain" v-else-if="walletChain === 'EOS'">
          <img src="@/assets/img/eos.png" alt="">
          <span class="card_center">EOS</span>
          <span class="card_right">点击切换</span>
        </div>
        <div class="card_chain" @click="clickChain" v-else>
          <img src="@/assets/img/system_pog.png" alt="">
          <span class="card_center">POG</span>
          <span class="card_right">点击切换</span>
        </div>
      </div>
      <div class="question">
        {{$t('wallet.title')}}
      </div>
      <div class="action_card" style="background: #ec565a;" @click="clickImport">
        <div class="action_img">
          <img src="@/assets/img/account_import.png">
        </div>
        <div class="text_box">
          <div class="text1" style="font-weight:400;color:#fcf6f5;">{{$t('wallet.have_account')}}</div>
          <div class="text2 align_center" style="font-weight:400;color:#3c3b3c;">
            <span>
              {{$t('wallet.import_account')}}
            </span>
            <img src="@/assets/img/next.png" />
          </div>
        </div>
      </div>
      <div class="action_card" style="background: #78a2e9;" @click="clickCreate">
        <div class="action_img">
          <img src="@/assets/img/account_create.png">
        </div>
        <div class="text_box">
          <div class="text1" style="font-weight:400;color:#fcf6f5;">{{$t('wallet.no_account')}}</div>
          <div class="text2 align_center" style="font-weight:400;color:#3c3b3c;">
            <span>
              {{$t('wallet.create_account')}}
            </span>
            <img src="@/assets/img/next.png" />
          </div>
        </div>
      </div>
      <!--
      <v-ons-row class="action_card">
        <v-ons-col class="action_img">
          <img src="@/assets/cpu.png" style="height: 55px;">
        </v-ons-col>
        <v-ons-col class="action_text">
          <v-ons-row style="font-size: 1.2rem;font-weight: bold;">{{$t('wallet.visitor_mode')}}</v-ons-row>
          <v-ons-row style="font-size: 0.78rem;color: #027be3;">{{$t('wallet.observe')}}</v-ons-row>
        </v-ons-col>
      </v-ons-row> -->
    </div>
</template>

<script>

export default {
  data () {
    return {
      walletChain: 'POG'
    }
  },
  created() {
    this.walletChain = this.$store.state.wallet.walletChain
  },
  methods: {
    clickChain() {
      this.$router.push({
        name: 'SelectBlockchain',
        query: {
          type: 'wallet'
        }
      })
    },
    clickCreate() {
      if (this.walletChain === 'ETH') {
        this.$router.push({
          name: 'EthCreateWallet'
        })
      } else if(this.walletChain === 'POG'){
        this.$router.push({
          name: 'PogCreateWallet',
          query:{
            back: 2
          }
        })
      } 
      else {
        this.$router.push({
          name: 'CreateWallet'
        })
      }
    },
    clickImport() {
      if (this.walletChain === 'ETH') {
        this.$router.push({
          name: 'EthImportWallet',
          query: {
            back: 2
          }
        })
      } else if(this.walletChain === 'POG'){
        this.$router.push({
          name: 'PogImportWallet',
          query:{
            back: 2
          }
        })
      } else {
        this.$router.push({
          name: 'ImportWallet',
          query: {
            back: 2
          }
        })
      }
    }
  }
}
</script>


<style scoped>
.align_center {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.layout {
  padding: 0 52px;
}
.question {
  margin-top: 70px;
  margin-bottom: 20px;
  font-size: 35px;
  font-weight: bold;
}
.wallet_chain {
  font-size: 35px;
  font-weight: bold;
  margin-top: 70px;
}
.card_chain {
  display: flex;
  align-items: center;
  padding: 30px;
  margin-top: 20px;
  font-size: 26px;
  font-weight: normal;
  background-color: #fff;
  border-radius: 10px;
}
.card_chain img {
  height: 70px;
}
.card_center {
  flex: 1;
  margin-left: 20px;
}
.card_right {
  color: royalblue;
}
.action_card {
  margin-bottom: 72px;
  border-radius: 15px;
  padding: 72px 0;
  display: flex;
}
.action_img {
  display: flex;
  align-items: center;
  margin-left: 104px;
}
.action_img img {
  width: 112px;
  height: 112px;
}
.text_box {
  flex: 1;
  padding-right: 154px;
  text-align: right;
}
.text1 {
  font-size: 40px;
}
.text2 {
  font-size: 32px;
  margin-top: 20px;
  color: #444;
}
.text2 img {
  width: 22px;
  height: 32px;
  margin-left: 22px;
}
</style>
