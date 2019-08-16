<template>
  <vpage>
    <slot>
      <vheader :title="$t('assets.backup_wallet')" />
      <v-ons-row class="title">{{$t('assets.backup_buypki')}}</v-ons-row>
      <v-ons-row class="desc">{{$t('assets.backup_ctpkakiiasp')}}</v-ons-row>
      <v-ons-row>
        <span class="private_key" >{{query.privateKey}}</span>
      </v-ons-row>
      <v-ons-row style="margin-top: 30px;justify-content: center;">
        <span class="btn" @click="clickBtn">{{$t('common.next_step')}}</span>
      </v-ons-row>
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
  data() {
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
        name: 'ConfrimKey',
        query: this.query
      })
    }
  },
}
</script>

<style scoped>
.l_header {
  font-weight: bold;
}
.title {
  justify-content: center;
  margin-top: 72px;
  font-size: 36px;
}
.desc {
  margin-top: 50px;
  padding: 0 52px;
  font-size: 24px;
}
.private_key {
  height: 264px;
  margin: 30px 52px;
  padding: 38px 30px;
  background-color: #f1f1f1;
  max-width: 100%;
  word-break: break-all;
  text-align: center;
  font-size: 28px;
  display: block;
  border: none;
  box-sizing: border-box;
  width: 100%;
  user-select: text;
  -webkit-user-select: text;
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
