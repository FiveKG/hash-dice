<template>
  <vpage>
    <slot>
      <div class="layout">
        <div style="flex:1;">
          <div class="page_header">
            <img class="ion_back" src="@/assets/img/back.png" @click="back"> 
            <span>{{$t('me.contact')}}</span>
          </div>
          <div class="item">
            <div>{{$t('me.contact_name')}}</div>
            <div class="ipt">
              <input type="text" class="text-input" :placeholder="$t('me.contact_ipt1')" v-model="account" >
            </div>
          </div>
          <div class="item">
            <div>{{$t('me.contact_remarks')}}</div>
            <div class="ipt">
              <input type="text" class="text-input" :placeholder="$t('me.contact_ipt2')" v-model="memo" >
            </div>
          </div>
        </div>
        <div class="btn">
          <span @click="clickSave">{{$t('common.save')}}</span>
        </div>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import { defaultCoreCipherList } from 'constants';

export default {
  components: {
    vpage: MyPage
  },
  data() {
    return {
      account: '',
      memo: '',
      contacts: []
    }
  },
  methods: {
    clickSave() {
      if (this.account) {
        const localFile = this.$store.state.wallet.localFile
        const wallets = localFile.wallets
        let default_chain = '';
        for(let item of wallets){
          if(item.isDefault == true){
            if(item.chain == 'eth'){
              default_chain = 'ETH';
            }else if (item.chain == 'eos'){
              default_chain = 'EOS';
            }else {
              default_chain = 'POG';
            }
          }
        }
        console.log(wallets,default_chain);

        localFile.contacts.push({
          account: this.account,
          memo: this.memo,
          chain: default_chain
        })
        localStorage.setItem('isecsp_wallet',JSON.stringify(localFile))
        this.account = ''
        this.memo = ''
        this.$toast(this.$t('common.saved'))
      }
    },
    back() {
      this.$router.go(-1)
    }
  },
}
</script>

<style scoped>
.layout {
  height: 100%;
  display: flex;
  flex-direction: column;
}
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
.item {
  margin-top: 22px;
  padding: 38px 56px;
  font-size: 30px;
  background-color: #fff;
}
.item .ipt {
  margin-top: 30px;
}
.item input {
  font-size: 30px;
  width: 100%;
  min-height: 38px;
}
.btn {
  text-align: center;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn span {
  padding: 15px 40px;
  margin: 20px 0;
  font-size: 30px;
  border-radius: 50px;
  background-color: #ec565a;
  color: #fff;
}
</style>
