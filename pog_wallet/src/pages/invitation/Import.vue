<template>
  <div class="layout">
    <div class="action_card" style="background: #ec565a;" @click="clickImport">
      <div class="action_img">
        <img src="@/assets/img/account_import.png">
      </div>
      <div class="text_box">
        <div class="text1" style="font-weight:400;color:#fcf6f5;">{{$t('wallet.have_account')}}</div>
        <div class="text2 align_center" style="font-weight:400;color:#3c3b3c;">
          <span>
            {{$t('wallet.import_account')}}
          </span>
          <img src="@/assets/img/next.png" />
        </div>
      </div>
    </div>
    <div class="action_card" style="background: #78a2e9;" @click="clickCreate">
      <div class="action_img">
        <img src="@/assets/img/account_create.png">
      </div>
      <div class="text_box">
        <div class="text1" style="font-weight:400;color:#fcf6f5;">{{$t('wallet.no_account')}}</div>
        <div class="text2 align_center" style="font-weight:400;color:#3c3b3c;">
          <span>
            {{$t('wallet.create_account')}}
          </span>
          <img src="@/assets/img/next.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  methods: {
    clickCreate() {
      this.$router.push({
        name: 'CreateWallet'
      })
    },
    clickImport() {
      this.$router.push({
        name: 'ImportWallet',
        query: {
          back: 2
        }
      })
    }
  }
}
</script>

<style scoped>
.align_center {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.layout {
  padding: 20vh 52px;
  box-sizing: border-box;
}
.question {
  margin-top: 140px;
  font-size: 44px;
  text-align: center;
  margin-bottom: 140px;
}
.action_card {
  margin-top: 72px;
  border-radius: 15px;
  padding: 72px 0;
  display: flex;
}
.action_img {
  display: flex;
  align-items: center;
  margin-left: 104px;
}
.action_img img {
  width: 112px;
  height: 112px;
}
.text_box {
  flex: 1;
  padding-right: 154px;
  text-align: right;
}
.text1 {
  font-size: 40px;
}
.text2 {
  font-size: 32px;
  margin-top: 20px;
  color: #444;
}
.text2 img {
  width: 22px;
  height: 32px;
  margin-left: 22px;
}
</style>
