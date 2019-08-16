<template>
  <vpage>
    <slot>
      <div class="page_header">
        <img class="ion_back" src="@/assets/img/back.png" @click="back"> 
        <span>{{$t('me.settings')}}</span>
      </div>
      <div class="page_content">
        <div class="item" @click="clickItem('i18n')">
          <span class="item_label">{{$t('me.language')}}</span>
          <img class="item_icon" src="@/assets/img/manage_arrow.png" alt="">
        </div>
        <div class="item" @click="clickItem('currency')">
          <span class="item_label">{{$t('me.currency')}}</span>
          <img class="item_icon" src="@/assets/img/manage_arrow.png" alt="">
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
  methods: {
    clickItem(type) {
      switch (type) {
        case 'i18n':
          this.$router.push({
            name: 'I18n'
          })
          break;
        case 'currency':
          this.$router.push({
            name: 'CurrencyUnit'
          })
          break;
      
        default:
          break;
      }
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
  width: 16px;
  height: 28px;
}
</style>
