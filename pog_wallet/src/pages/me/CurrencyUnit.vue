<template>
  <vpage>
    <slot>
      <div class="page_header">
        <img class="ion_back" src="@/assets/img/back.png" @click="back"> 
        <span>货币单位</span>
      </div>
      <div class="page_content">
        <div class="item" v-for="item in currences" @click="clickCurrency(item)">
          <span class="item_label">{{item}}</span>
          <img class="item_icon" src="@/assets/img/mine_right.png" v-if="current === item">
        </div>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'

export default {
  components: {
    vpage: MyPage
  },
  data() {
    return {
      currences: ['CNY', 'USD'],
      current: ''
    }
  },
  created() {
    this.current = this.$store.state.wallet.currency
  },
  methods: {
    clickCurrency(item) {
      this.current = item
      this.$store.commit('wallet/setCurrency', item)
      localStorage.setItem('currency', item)
    },
    back() {
      this.$router.go(-1)
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
.page_content {
  margin-top: 22px;
  background-color: #fff;
}
.item {
  padding: 44px 56px;
  display: flex;
  align-items: center;
  border-bottom: 1PX solid #f6f6f6;
}
.item_label {
  flex: 1;
  font-size: 28px;
}
.item_icon {
  width: 40px;
  height: 28px;
}
</style>
