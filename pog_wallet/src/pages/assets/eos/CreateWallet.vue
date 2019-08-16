<template>
  <vpage>
    <slot>
      <vheader :title="$t('assets.add_wallet')"/>
      <div class="card_title create">{{$t('assets.create_account')}}</div>
      <div class="card_box" @click="clickCreate('activation')">
        <img src="@/assets/img/addwallet_icon2.png">
        <div class="action_card activation_code">{{$t('assets.activation_code')}}</div>
      </div>
      <div class="card_box" @click="clickCreate('friend')">
        <img src="@/assets/img/addwallet_icon3.png">
        <div class="action_card friend_creation">{{$t('assets.friend_creation')}}</div>
      </div>
      <v-ons-dialog
        modifier="width"
        cancelable
        :visible.sync="dialogVisible">
        <div>
          <div class="delete_question">
            {{$t('common.outstanding_order')}}
          </div>
          <div class="dialog_action">
            <span class="btn_cancel" @click="clickDelete">{{$t('common.delete')}}</span>
            <span class="btn_delete" @click="clickConfirm">{{$t('common.confirm')}}</span>
          </div>
        </div>
      </v-ons-dialog>
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
      dialogVisible: false,
      type: '',
      json: ''
    }
  },
  methods: {
    clickImport() {
      this.$router.push({
        name: 'ImportWallet'
      })
    },
    clickConfirm() {
      if (this.type === 'friend') {
        this.$router.push({
          name: 'CreateAccount',
          query: {
            type: 'order',
            json: this.json,
            back: 2
          }
        })
      } else {
        // this.$router.push('createWallet/activationCodeCreate?type=order&json='+this.json)
        this.$router.push({
          name: 'ActivationCodeCreate',
          query: {
            type: 'order',
            json: this.json,
            back: 2
          }
        })
      }
      this.dialogVisible = false
    },
    clickDelete() {
      if (this.type === 'friend') {
        localStorage.removeItem('friend_create')
      } else {
        localStorage.removeItem('activation_code')
      }
      this.dialogVisible = false
    },
    clickCreate(type) {
      this.type = type
      switch (type) {
        case 'friend':
          // console.log(localStorage.getItem('friend_create'))
          let str = localStorage.getItem('friend_create')
          if (str) {
            this.dialogVisible = true
            this.json = str
          } else {
            // this.$router.push('createWallet/friendCreation?route=friend')
            this.$router.push({
              name: 'FriendCreation',
              query: {
                route: 'friend',
                back: 6
              }
            })
          }
          break;
        case 'activation':
          let activation_code = localStorage.getItem('activation_code')
          if (activation_code) {
            this.dialogVisible = true
            this.json = activation_code
          } else {
            // this.$router.push('createWallet/friendCreation?route=activation')
            this.$router.push({
              name: 'FriendCreation',
              query: {
                route: 'activation',
                back: 6
              }
            })
          }
          break;

        default:
          break;
      }
    }
  },
}
</script>

<style scoped>
.card_title {
  margin-top: 52px;
  font-size: 44px;
  text-align: center;
}
.create {
  margin-top: 100px;
}
.card_box {
  margin-top: 50px;
  padding: 0 80px;
  display: flex;
  align-items: center;
}
.card_box img {
  width: 95px;
  height: 95px;
}
.action_card {
  flex: 1;
  margin-left: 47px;
  color: #fff;
  height: 95px;
  border-radius: 15px;
  font-size: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.import {
  background-color: #ed4c4f;
}
.activation_code {
  background-color: #6171ff;
}
.friend_creation {
  background-color: #fac439;
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
