<template>
  <vpage>
    <slot>
      <vheader :title="$t('assets.add_wallet')"/>
      <div class="card_title">导入钱包</div>
      <div class="card_box">
        <img src="@/assets/img/addwallet_icon1.png">
        <div class="action_card import" @click="clickImport">导入钱包</div>
      </div>
      <div class="card_title create">创建钱包</div>
      <div class="card_box">
        <img src="@/assets/img/addwallet_icon2.png">
        <div class="action_card activation_code" @click="clickCreate">创建钱包</div>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import MyHeader from '@/components/MyHeader'

export default {
  components: {
    vpage: MyPage,
    vheader: MyHeader
  },
  methods: {
    clickImport() {
      this.$router.push({
        name: 'EthImportWallet',
        query: {
          back: 4
        }
      })
    },
    clickCreate() {
      this.$router.push({name: 'EthCreateWallet'})
    }
  },
}
</script>

<style scoped>
.card_title {
  margin-top: 52px;
  font-size: 44px;
  text-align: center;
}
.create {
  margin-top: 130px;
}
.card_box {
  margin-top: 50px;
  padding: 0 80px;
  display: flex;
  align-items: center;
}
.card_box img {
  width: 95px;
  height: 95px;
}
.action_card {
  flex: 1;
  margin-left: 47px;
  color: #fff;
  height: 95px;
  border-radius: 15px;
  font-size: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.import {
  background-color: #ed4c4f;
}
.activation_code {
  background-color: #6171ff;
}
.friend_creation {
  background-color: #fac439;
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