<template>
  <v-ons-page>
    <div class="layout">
      <div class="page_header">
        <img class="ion_back" src="@/assets/img/back_fff.png" @click="back"> 
        <span>私钥</span>
      </div>
      <div class="page_card">
        <span class="question">什么是私钥？</span>
        <br>
        <br>
        <span>我们常说, 你对钱包中资金的控制取决于相应私钥的所有权和控制权。在区块链交易中, 私钥用于生成支付货币所必须的签名, 以证明资金的所有权。私钥必须始终保持机密, 因为一旦泄露给第三方, 相当于该私钥保护下的资产也拱手相让了。它不同于Keystore, Keystore 是加密过后的私钥文件, 只要密码强度足够强, 即使黑客得到 Keystore, 破解难度也足够大。</span>
        <br>
        <br>
        <span>私钥实际上并不是存储在网络中, 而是由用户生成并存储在一个文件或者简单的数据库中, 称为钱包。存储在用户钱包中的私钥完全独立, 可由用户的钱包软件生成并管理, 无需区块链或者网络连接。用户的钱包地址就是由私钥通过椭圆曲线加密生成公钥, 进而生成以0x开头的42位地址。 私钥的样式为 64 位 16 进制的哈希值字符串, 例如: 56f759ece75f0ab1b783893cbe390288978d4d4ff24dd233245b4285fcc31cf6</span>
      </div>
    </div>
  </v-ons-page>
</template>

<script>
export default {
  methods: {
    back() {
      this.$router.go(-1)
    }
  },
}
</script>

<style scoped>
.layout {
  height: 100%;
  background-color: #f6f6f6;
}
.page_header {
  padding: 30px 55px;
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
  top: 50%;
  transform: translate(0, -50%);
}
.page_card {
  margin: 40px 25px;
  padding: 30px;
  box-shadow: 1px 1px 6px rgb(192, 192, 192);
  word-break: break-all;
  font-size: 28px;
  line-height: 1.6;
}
.question {
  font-size: 34px;
}
</style>
