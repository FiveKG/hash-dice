<template>
  <vpage>
    <slot>
      <!-- <vheader :title="$t('assets.create_eos')" :color="'#fff'" :background="'#ec565a'" white /> -->
      <div class="header" :style="{background: '#ec565a', color: '#fff'}">
        <div> 
          <img class="ion_back" src="@/assets/img/back_fff.png" @click="back">
        </div>
        <div class="select_title">{{$t('assets.create_eos')}}</div>
      </div>
      <div class="qrcode_box">
        <div class="tips">{{$t('assets.create_ceancet')}}</div>
        <qrcode-vue style="display: inline;margin-left:10px;" :value="qrcode" :size="120" level="H"></qrcode-vue>
      </div>
      <div class="layout">
        <v-ons-row class="info_label">{{$t('assets.account_name')}}</v-ons-row>
        <v-ons-row class="info_detail">{{query.account}}</v-ons-row>
        <v-ons-row class="info_label">{{$t('assets.owner_authority')}}</v-ons-row>
        <v-ons-row class="info_detail">{{query.publicKey}}</v-ons-row>
        <v-ons-row class="info_label">{{$t('assets.active_authority')}}</v-ons-row>
        <v-ons-row class="info_detail">{{query.publicKey}}</v-ons-row>
        <div class="btn_box">
          <div>
            <span class="btn red" @click="clickBtn('delete')">{{$t('assets.delete_order')}}</span>
          </div>
          <!-- <div>
            <span class="btn blue">{{$t('assets.request_create')}}</span>
          </div> -->
          <div>
            <span class="btn blue" @click="clickBtn('active')">{{$t('assets.active_account')}}</span>
          </div>
        </div>
      </div>
      <v-ons-dialog
        modifier="width"
        cancelable
        :visible.sync="dialogVisible">
        <div>
          <div class="delete_question">
            {{$t('common.delete_order')}}
          </div>
          <div class="dialog_action">
            <span class="btn_cancel" @click="dialogVisible = false">{{$t('common.cancel')}}</span>
            <span class="btn_delete" @click="clickDelete">{{$t('common.delete')}}</span>
          </div>
        </div>
      </v-ons-dialog>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import MyHeader from '@/components/MyHeader'
import QrcodeVue from 'qrcode.vue'
import eos from '@/plugins/eos'

export default {
  components: {
    vpage: MyPage,
    vheader: MyHeader,
    QrcodeVue
  },
  data () {
    return {
      query: {},
      qrcode: '',
      dialogVisible: false
    }
  },
  mounted () {
    if (this.$route.query.type === 'order') {
      let json = JSON.parse(this.$route.query.json)
      this.qrcode = JSON.stringify({
        account: json.account,
        action: 'create_account'
      })
      this.query = json
      this.query.publicKey = json.owner
    } else {
      this.query = this.$route.query
      const obj = {
        account: this.query.account,
        owner: this.query.publicKey,
        active: this.query.publicKey,
        cpu: '0.1',
        net: '0.1',
        ram: '1',
        action: 'create_account'
      }
      // this.qrcode = JSON.stringify(obj)
      this.qrcode = JSON.stringify({
        account: this.query.account,
        action: 'create_account'
      })
      // console.log(this.qrcode)
      localStorage.setItem('friend_create', JSON.stringify(obj))
    }
  },
  methods: {
    back() {
      if (this.$route.query.back) {
        this.$router.go(1 - this.$route.query.back)
      } else {
        this.$router.go(-1)
      }
    },
    clickBtn(type) {
      switch (type) {
        case 'delete':
          this.dialogVisible = true
          break;
        case 'active':
          eos.getAccount(this.query.account).then(res => {
            this.$toast('账号已激活')
            localStorage.removeItem('friend_create')
            setTimeout(() => {
              if (this.$route.query.back) {
                this.$router.go(1 - this.$route.query.back)
              } else {
                const stack = this.$store.state.wallet.stack
                this.$router.go(2 - stack.length)
                stack.splice(3)
              }
            }, 1000);
          }).catch(err => {
            this.$toast('账号不存在')
          })
          break;
      
        default:
          break;
      }
    },
    clickDelete() {
      localStorage.removeItem('friend_create')
      this.dialogVisible = false
      if (this.$route.query.back) {
        this.$router.go(1 - this.$route.query.back)
      } else {
        const stack = this.$store.state.wallet.stack
        this.$router.go(2 - stack.length)
        stack.splice(3)
      }
    }
  },
}
</script>

<style scoped>

.header {
  padding: 55px;
  border-bottom: 1px solid rgb(202, 202, 202);
  position: relative;
}
.select_title {
  margin-top: 70px;
  font-size: 34px;
}
.ion_back {
  width: 42px;
  height: 32px;
}
.qrcode_box {
  margin-top: 54px;
  padding: 0 42px;
  display: flex;
}
.tips {
  font-size: 28px;
  flex: 1;
}
.layout {
  padding: 0 37px;
}
.info_label {
  margin-top: 36px;
  font-size: 32px;
}
.info_detail {
  word-break: break-all;
  background-color: #efefef;
  margin-top: 10px;
  padding: 26px 36px;
  font-size: 26px;
}
.btn_box {
  margin-top: 60px;
  display: flex;
}
.btn_box div {
  flex: 1;
  text-align: center;
}
.btn {
  width: 192px;
  color: #fff;
  font-size: 28px;
  padding: 20px 35px;
  border-radius: 15px;
}
.red {
  background-color: #ec565a;
}
.blue {
  background-color: #4e80e1;
}
.delete_question {
  padding: 35px 30px;
  font-size: 32px;
}
.dialog_action {
  text-align: right;
  padding: 20px 25px;
  font-size: 32px;
}
.btn_cancel {
  color: grey;
}
.btn_delete {
  color: #027be3;
  margin-left: 50px;
}
</style>
