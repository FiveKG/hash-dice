<template>
  <vpage>
    <slot>
      <vheader :title="$t('assets.backup_wallet')" />
      <div class="card">
        <img src="@/assets/img/dont_screen.png">
        <div class="card_text">
          <div class="card_title">{{$t('assets.backup_dntas')}}</div>
          <div class="attention">
            <span>• </span>
            <span style="margin-left:5PX;">{{$t('assets.backup_iagypk')}}</span>
          </div>
          <div class="attention" style="margin-top:0;">
            <span>• </span>
            <span style="margin-left:5PX;">{{$t('assets.backup_pwpkopas')}}</span>
          </div>
        </div>
      </div>
      <div style="margin-top:50px;text-align:center;">
        <span class="btn" @click="clickBtn">{{$t('assets.backup_wallet')}}</span>
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
  data () {
    return {
      query: {}
    }
  },
  created () {
    this.query = this.$route.query
  },
  methods: {
    clickBtn() {
      this.$router.push({
        name: 'PogBackupKey',
        query: this.query
      })
    }
  },
}
</script>

<style scoped>

.card {
  margin: 42px 36px;
  padding: 68px;
  background-color: #f6f6f6;
  box-shadow: 0 0 20px rgb(223, 223, 223);
  display: flex;
  align-items: center;
}
.card img {
  width: 100px;
  height: 100px;
}
.card_text {
  flex: 1;
  margin-left: 80px;
}
.card_title {
  text-align: center;
  font-size: 32px;
}
.attention {
  font-size: 24px;
  display: flex;
  margin-top: 44px;
}
.btn {
  padding: 25px 35px;
  border-radius: 15px;
  background-color: #ec565a;
  font-size: 34px;
  font-weight: 450;
  color: #fff;
}
</style>
