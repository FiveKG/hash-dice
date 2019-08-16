<template>
  <vpage>
    <slot>
      <div class="page_header">
        <img class="ion_back" src="@/assets/img/back_fff.png" @click="back"> 
        <span>{{$t('assets.activation_create')}}</span>
      </div>
      <div class="activation_code">
        <div>{{activationCode}}</div>
        <div class="my_code">我的激活码</div>
      </div>
      <div class="account_info">
        <img src="@/assets/img/activation_account.png">
        <span>账号名称：{{query.account}}</span>
      </div>
      <div class="wx_account">
        <span style="flex:1;">微信客服账号</span> <span class="name">{{wxAccount}}</span>
      </div>
      <div class="wx_qrcode">
        <div style="flex:1;">请联系我们的微信客服，提供激活码并支付激活费用，客服将帮您激活账号</div> 
        <div style="flex: 2;">
          <img :src="wxUrl">
        </div>
      </div>
      <div class="card">
        <div class="border item">
          <div>{{$t('assets.owner_authority')}}</div>
          <div class="publicKey">{{query.publicKey}}</div>
        </div>
        <div class="item">
          <div>{{$t('assets.active_authority')}}</div>
          <div class="publicKey">{{query.publicKey}}</div>
        </div>
      </div>
      <div class="btn_box">
        <span class="btn delete" @click="dialogVisible = true">删除订单</span>
        <!-- <span class="btn start" @click="clickUsing">开始使用</span> -->
      </div>
    </slot>
    <v-ons-dialog
        modifier="width"
        cancelable
        :visible.sync="dialogVisible">
        <div>
          <div class="delete_question">
            {{$t('common.delete_order')}}
          </div>
          <div class="dialog_action">
            <span class="btn_cancel" @click="dialogVisible = false">{{$t('common.cancel')}}</span>
            <span class="btn_delete" @click="clickDelete">{{$t('common.delete')}}</span>
          </div>
        </div>
      </v-ons-dialog>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import MyHeader from '@/components/MyHeader'
import QrcodeVue from 'qrcode.vue'

export default {
  components: {
    vpage: MyPage,
    vheader: MyHeader,
    QrcodeVue
  },
  data () {
    return {
      query: {},
      dialogVisible: false,
      activationCode: '',
      wxAccount: '',
      wxUrl: ''
    }
  },
  created() {
    console.log(this.$route.query)
    if (this.$route.query.type === 'order') {
      this.query = JSON.parse(this.$route.query.json)
    } else {
      this.query = this.$route.query
    }
    this.activationCode = this.query.activationCode.active_code
    this.wxAccount = this.query.activationCode.wx_account
    this.wxUrl = this.$store.state.wallet.config.base_data_address.img_host + this.query.activationCode.wx_qr_code
  },
  methods: {
    clickUsing() {
      this.$toast('The activation code is incorrect or has expired')
    },
    clickDelete() {
      localStorage.removeItem('activation_code')
      this.dialogVisible = false
      if (this.$route.query.back) {
        this.$router.go(1 - this.$route.query.back)
      } else {
        const stack = this.$store.state.wallet.stack
        this.$router.go(2 - stack.length)
        stack.splice(3)
      }
      // this.$toast('order has been deleted')
    },
    back() {
      if (this.$route.query.back) {
        this.$router.go(1 - this.$route.query.back)
      } else {
        this.$router.go(-1)
      }
    }
  },
}
</script>

<style scoped>
.page_header {
  padding: 55px;
  text-align: center;
  position: relative;
  font-size: 34px;
  background-color: #ec565a;
  color: #fff;
}
.ion_back {
  width: 42px;
  height: 32px;
  position: absolute;
  left: 55px;
  top: 57px;
}
.activation_code {
  font-size: 40px;
  font-weight: bold;
  background-color: #ec565a;
  color: #fff;
  text-align: center;
  padding-bottom: 56px;
}
.my_code {
  font-size: 30px;
  font-weight: normal;
  margin-top: 20px;
}
.account_info {
  background-color: #ed6e70;
  color: #fff;
  padding: 21px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.account_info img {
  width: 72px;
  height: 72px;
}
.account_info span {
  margin-left: 38px;
  font-size: 30px;
}
.wx_account {
  margin: 62px 57px 0 57px;
  font-size: 30px;
  display: flex;
  align-items: center;
}
.wx_account .name {
  margin-left: 24px;
  flex: 2;
}
.wx_qrcode {
  margin: 62px 57px 0 57px;
  margin-top: 52px;
  display: flex;
}
.wx_qrcode img {
  width: 254px;
  height: 254px;
  margin-left: 24px;
}
.card {
  margin: 50px 56px 0 56px;
  padding: 0 52px;
  box-shadow: 0px 0px 15px rgb(219, 219, 219);
  background: transparent;
  font-size: 30px;
}
.card .item {
  padding: 30px 0;
}
.publicKey {
  font-size: 24px;
  margin-top: 15px;
}
.border {
  border-bottom: 1PX solid #e4e4e4;
}
.btn_box {
  margin: 95px 0;
  /* display: flex; */
  text-align: center;
}
.btn_box div {
  flex: 1;
  text-align: center;
  box-sizing: border-box;
}
.btn {
  padding: 20px 40px;
  border-radius: 15px;
  font-size: 32px;
}
.delete {
  color: #5789e4;
  border: 1PX solid #5789e4;
}
.start {
  background-color: #ec565a;
  color: #fff;
  margin-left: 50px;
}
.delete_question {
  padding: 35px 30px;
  font-size: 32px;
}
.dialog_action {
  text-align: right;
  padding: 20px 25px;
  font-size: 32px;
}
.btn_cancel {
  color: grey;
}
.btn_delete {
  color: #027be3;
  margin-left: 50px;
}
</style>
