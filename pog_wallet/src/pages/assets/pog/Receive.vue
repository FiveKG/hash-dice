<template>
  <vpage>
    <slot>
      <div class="page_header">
        <img class="ion_back" src="@/assets/img/back.png" @click="back"> 
        <span>{{$t('assets.receive')}}</span>
      </div>
      <div class="qrcode_layout">
        <!-- <div class="qrcode_title">扫一扫，向我转账</div> -->
        <qrcode-vue class="qrcode" :value="qrcode" :size="160" level="H"></qrcode-vue>
        <div class="amount">
          <span>{{$t('assets.receive_amount')}}</span>
          <input type="text" class="text-input text_amount" :placeholder="$t('assets.receive_ipt')" v-model="amount">
          <span>{{token}}</span>
        </div>
      </div>
      <div class="receipt_account">
        <div class="account">
          <span>{{account}}</span>
          <span class="copy" :data-clipboard-text="account" @click="copy">{{$t('assets.receipt_account')}}</span>
        </div>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import MyHeader from '@/components/MyHeader'
import QrcodeVue from 'qrcode.vue'
import Clipboard from 'clipboard'

export default {
  components: {
    vpage: MyPage,
    vheader: MyHeader,
    QrcodeVue
  },
  data() {
    return {
      qrcode: '',
      account: '',
      amount: '',
      token: 'POG'
    }
  },
  created() {
    // console.log(this.$store.state.wallet.assets)
    this.account = this.$store.state.wallet.assets.account
    this.token = this.$route.query.token
    this.generateQrcode()
  },
  methods: {
    copy() {
      const copyBoard = new Clipboard('.copy')
      copyBoard.on('success', (e) => {
        // console.info('Action:', e.action); // 动作名称，比如：Action: copy
        // console.info('Text:', e.text); // 内容，比如：Text：hello word
        copyBoard.destroy();
        this.$toast(this.$t('assets.toast_twahbcttc'));
      })
    },
    generateQrcode() {
      this.qrcode = JSON.stringify({
        account: this.account,
        amount: this.amount,
        token: this.token,
        action: 'pogreceive'
      })
    },
    back() {
      this.$router.go(-1)
    }
  },
  watch: {
    amount() {
      this.generateQrcode()
    }
  },
}
</script>

<style scoped>
.l_header {
  font-weight: bold;
}
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
.qrcode_layout {
  margin: 22px 0;
  padding: 38px 56px;
  background-color: #fff;
}
.qrcode_title {
  text-align: center;
  font-size: 28px;
}
.qrcode {
  margin-top: 42px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.amount {
  margin-top: 82px;
  display: flex;
  align-items: center;
  font-size: 30px;
}
.text_amount {
  margin-left: 47px;
  flex: 1;
  font-size: 28px;
}
.receipt_account {
  padding: 41px;
  background-color: #fff;
  text-align: center;
}
.account {
  font-size: 28px;
}
.copy {
  color: #5789e4;
  margin-left: 60px;
}
</style>
