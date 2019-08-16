<template>
  <vpage>
    <slot>
      <div class="page_header">
        <img class="ion_back" src="@/assets/img/back.png" @click="back"> 
        <span>{{$t('me.language')}}</span>
      </div>
      <div class="page_content">
        <div class="item" @click="clickI18n('cn')">
          <span class="item_label">简体中文</span>
          <img class="item_icon" src="@/assets/img/mine_right.png" v-if="i18n === 'cn'">
        </div>
        <div class="item" @click="clickI18n('en')">
          <span class="item_label">English</span>
          <img class="item_icon" src="@/assets/img/mine_right.png" v-if="i18n === 'en'">
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
      i18n: ''
    }
  },
  created() {
    this.i18n = this.$i18n.locale
  },
  methods: {
    clickI18n(local) {
      this.$i18n.locale = local
      this.i18n = local
      localStorage.setItem('lang_type', local)
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
