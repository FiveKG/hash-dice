<template>
  <vpage>
    <slot>
      <vheader :title="$t('assets.backup_confirm')" />
      <v-ons-row class="title">{{$t('assets.backup_cypkfyw')}}</v-ons-row>
      <div class="desc">{{$t('assets.backup_pfitibatttpk')}}</div>
      <v-ons-row>
        <textarea class="textarea private_key" rows="2" v-model="privateKey"></textarea>
      </v-ons-row>
      <v-ons-row style="margin-top: 30px;justify-content: center;">
        <span class="btn" @click="clickBtn">{{$t('common.finish')}}</span>
      </v-ons-row>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import MyHeader from '@/components/MyHeader'
import {activeApply} from '@/servers'

export default {
  components: {
    vpage: MyPage,
    vheader: MyHeader
  },
  data () {
    return {
      privateKey: ''
    }
  },
  created () {
    console.log(this.$route.query)
  },
  methods: {
    async clickBtn() {
      const query = this.$route.query
      if (this.privateKey === query.privateKey) {
        if (query.route === 'friend') {
          this.$router.push({
            name: 'CreateAccount',
            query: query
          })
        }
        if (query.route === 'activation') {
          try {
            let activation_code = localStorage.getItem('activation_code')
            if (activation_code) {
              // 已有本地订单
              query = JSON.parse(activation_code)
            } else {
              // 获取激活码
              const res = await activeApply({account_name: query.account, owner_public_key: query.publicKey, active_public_key: query.publicKey})
              if (res.code === 1) {
                query.activationCode = res.data
                localStorage.setItem('activation_code', JSON.stringify(query))
              }
            }
            this.$router.push({
              name: 'ActivationCodeCreate',
              query: query
            })
          } catch (error) {
            console.log(error)
          }
        }
      } else {
        this.$toast('Private key input error,please confirm')
      }
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
  text-align: center;
}
.private_key {
  height: 264px;
  margin: 30px 54px;
  padding: 38px 20px;
  background-color: #f1f1f1;
  max-width: 100%;
  word-break: break-all;
  font-size: 28px;
  display: block;
  border: none;
  width: 100%;
}
.private_key:disabled {
  opacity: 1;
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
