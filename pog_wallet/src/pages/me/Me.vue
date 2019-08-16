<template>
  <div>
    <div class="header">{{$t('me.me')}}</div>
    <div class="layout">
      <!-- <div class="item">
        <img class="icon" src="@/assets/img/mine_assets.png">
        <span>资金总览</span>
        <img class="next" src="@/assets/img/mine_next.png" alt="">
      </div> -->
      <div class="item" @click="clickItem('manage')">
        <img class="icon" src="@/assets/img/mine_wallet.png">
        <span>{{$t('me.manage_wallet')}}</span>
        <img class="next" src="@/assets/img/mine_next.png" alt="">
      </div>
      <div class="item" @click="clickItem('records')">
        <img class="icon" src="@/assets/img/mine_records.png">
        <span>{{$t('me.transaction_records')}}</span>
        <img class="next" src="@/assets/img/mine_next.png" alt="">
      </div>
      <div class="item" @click="clickItem('contacts')">
        <img class="icon" src="@/assets/img/mine_contacts.png">
        <span>{{$t('me.contact')}}</span>
        <img class="next" src="@/assets/img/mine_next.png" alt="">
      </div>
      <div class="item" @click="clickItem('setting')">
        <img class="icon" src="@/assets/img/mine_setting.png">
        <span>{{$t('me.settings')}}</span>
        <img class="next" src="@/assets/img/mine_next.png" alt="">
      </div>
      <div class="item" @click="clickItem('invitation')">
        <img class="icon" src="@/assets/img/mine_setting.png">
        <span>推荐给好友</span>
        <img class="next" src="@/assets/img/mine_next.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>

export default {
  components: {
    
  },
  methods: {
    clickItem(type) {
      switch (type) {
        case 'manage':
          // 管理钱包
          if (!this.$store.state.wallet.localFile.wallets.length) {
            this.$toast('您还未导入钱包')
            return
          }
          this.$router.push({
            name: 'ManageWallet'
          })
          break;
        case 'records':
          // 交易记录
          if (!this.$store.state.wallet.localFile.wallets.length) {
            this.$toast('您还未导入钱包')
            return
          }
          this.$router.push({
            name: 'Records'
          })
          break;
        case 'contacts':
          // 联系人
          this.$router.push({
            name: 'Contacts'
          })
          break;
        case 'setting':
          // 系统设置
          this.$router.push({
            name: 'Setting'
          })
          break;
        case 'invitation':
          // 系统设置
          this.$router.push({
            name: 'Invitation'
          })
          break;
      
        default:
          break;
      }
    }
  },
}
</script>

<style scoped>
.flex {
  display: flex;
  align-items: center;
}
.header {
  background-color: #fff;
  text-align: center;
  padding: 30px 0;
  font-size: 34px;
  font-weight: bold;
}
.layout {
  
}
.item {
  background-color: #fff;
  margin: 30px 24px;
  padding: 35px 45px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  box-shadow: 1px 1px 10px #e9e9e9;
}
.item span {
  flex: 1;
  margin-left: 30px;
}
.icon {
  width: 62px;
  height: 62px;
}
.next {
  width: 18px;
  height: 24px;
}
</style>
