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
import eos from '@/plugins/pog'
import { constants } from 'crypto';
import { setInvitation } from '@/servers/invitation';

export default {
  components: {
    vpage: MyPage,
    vheader: MyHeader
  },
  data () {
    return {
      privateKey: '',
      creator: 'eoscreator1'
    }
  },
  created () {
    console.log(this.$route.query)
  },
  methods: {
    async clickBtn() {
      const query = this.$route.query
      if (this.privateKey === query.privateKey) {
        try {
          const res = await eos.transaction(tr => {
              tr.newaccount({
                  creator: query.creator != null ?  query.creator : 'eoscreator1',
                  name: query.account,
                  owner: query.publicKey,
                  active: query.publicKey,
              })
          },{keyProvider: "5JhnpFiHFmWR2ft2hL2vLA28TsfRHU5Nm98jvBDDVRimNsWqbjQ"});
          console.log(res);
          if (res.transaction_id) {
            this.$toast('账号创建成功')
      
            const localFile = this.$store.state.wallet.localFile
            const wallets = localFile.wallets
            
            let tokenList = []
            for (let item of wallets) {
              if (item.isDefault) {
                item.isDefault = false
              }
              if (item.chain === 'pog' && item.accountNames[0] === query.account) {
                tokenList = item.tokenList
              }
            }
            wallets.unshift({
              chain: 'pog',
              privateKey: query.encryptedPrivateKey,
              publicKey: query.publicKey,
              accountNames: [query.account],
              tokenList: tokenList,
              isDefault: true
            })
            localFile.invitationAccount = query.account;
            setInvitation({
              account_name: query.account
            }).then(res => {
              console.log(res)
            }).catch(err => {
              console.log(err)
            })
            localStorage.setItem('isecsp_wallet',JSON.stringify(localFile))
            this.$store.commit('wallet/setAssets', null)
            if (this.$store.state.wallet.selectedTab === 'invitation') {
              this.$store.commit('wallet/setSelectedTab', 'assets')
            }
            setTimeout(() => {
              const stack = this.$store.state.wallet.stack
              this.$router.go(0 - stack.length)
              stack.splice(0)
            }, 20);
            this.loading = false
          }
        } catch (error) {
          console.log(error)
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
