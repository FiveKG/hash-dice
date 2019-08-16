<template>
  <vpage>
    <slot>
      <div class="header">
        <img src="@/assets/img/u14.png" @click="back">
        <span>推荐小鲸给好友</span>
      </div>
      <div class="layout">
        <div class="wallet">小鲸钱包</div>
        <div class="wallet">poggy.me</div>
        <div class="desc">區塊鏈生態入口</div>
        <div class="desc">推荐码</div>
        <div class="invitation_code">{{code}}</div>
        <div class="qrcode">
          <qrcode-vue :value="qrcode" :size="120" level="H"></qrcode-vue>
          <div class="qrcode_desc">扫码下载</div>
        </div>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import QrcodeVue from 'qrcode.vue'
import { getInvitation } from '@/servers/invitation';

export default {
  components: {
    vpage: MyPage,
    QrcodeVue
  },
  data() {
    return {
      qrcode: 'jsdfhbjsnkljksb',
      code: ''
    }
  },
  created() {
    getInvitation({account_name: this.$store.state.wallet.localFile.invitationAccount}).then(res => {
      console.log('getInvitation',res)
      this.code = res.data.invest_code
    })
  },
  methods: {
    back() {
      this.$router.go(-1)
    }
  },
}
</script>

<style scoped>
.header {
  padding: 30px 35px;
  display: flex;
  align-items: center;
  font-size: 38px;
  background-color: #ececec;
}
.header img {
  width: auto;
  height: 50px;
}
.header span {
  flex: 1;
  margin-left: 20px;
}
.layout {
  margin-top: 60px;
  text-align: center;
}
.wallet {
  color: rgb(71, 105, 237);
  font-size: 80px;
  font-weight: 800;
}
.desc {
  margin-top: 40px;
  font-size: 40px;
}
.invitation_code {
  font-size: 40px;
  word-spacing: 20px;
  color: rgb(71, 105, 237);
}
.qrcode {
  margin-top: 30px;
  display: inline-block;
  background-color: #fff;
  padding: 30px 35px;
  border-radius: 10px;
  box-shadow: 0 0 10px #cfcfcf;
}
.qrcode_desc {
  margin-top: 10px;
  font-size: 30px;
}
</style>
