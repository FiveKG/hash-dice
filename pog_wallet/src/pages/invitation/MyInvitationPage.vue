<template>
  <vpage>
    <slot>
      <div class="header">
        <img src="@/assets/img/u14.png" @click="back">
        <span>我的邀请专页</span>
        <img src="@/assets/img/u124.png">
      </div>
      <div class="layout">
        <div>
          <div class="qrcode">
            <qrcode-vue :value="qrcode" :size="120" level="H"></qrcode-vue>
            <div class="qrcode_desc">扫码下载小鲸钱包</div>
          </div>
        </div>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import QrcodeVue from 'qrcode.vue'

export default {
  components: {
    vpage: MyPage,
    QrcodeVue
  },
  data() {
    return {
      qrcode: 'jsdfhbjsnkl'
    }
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
  margin-top: 20vh;
  text-align: center;
}
.qrcode {
  display: inline-block;
  background-color: #fff;
  padding: 30px 35px;
  border-radius: 10px;
  box-shadow: 0 0 10px #c9c9c9;
}
.qrcode_desc {
  margin-top: 10px;
  font-size: 30px;
  color: gray;
}
</style>
