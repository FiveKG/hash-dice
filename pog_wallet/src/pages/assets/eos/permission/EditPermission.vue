<template>
  <vpage>
    <slot>
      <div class="page_header">
        <img class="ion_back" src="@/assets/img/back.png" @click="back"> 
        <span>{{account}}</span>
      </div>
      <div class="layout">
        <div class="permission_card">
          <div class="align_center">
            <div class="card_title">
              <span v-if="query.type === 'add'">{{query.perm_name === 'owner' ? $t('permission.add_owner') : $t('permission.add_active')}}</span>
              <span v-else>{{query.perm_name === 'owner' ? $t('permission.modify_owner') : $t('permission.modify_active')}}</span>
            </div>
            <div class="create_key" @click="clickGenerate"> <img src="@/assets/img/permission_key.png"> {{$t('permission.key_generator')}} </div>
          </div>
          <div class="public_key">
            <textarea class="textarea" rows="2" maxlength="64" :placeholder="$t('permission.ipt_place')" v-if="query.type === 'add'" v-model="publicKey"></textarea>
            <textarea class="textarea" rows="2" maxlength="64" disabled v-else v-model="publicKey"></textarea>
          </div>
        </div>
        <div class="btn_box">
          <span class="edit" v-if="query.type === 'add'" @click="clickBtn('add')">{{$t('permission.add')}}</span>
          <span class="edit" v-else @click="clickBtn('change')">{{$t('permission.modify')}}</span>
        </div>
        <div class="explain_card">
          <v-ons-row class="explain_item">
            <v-ons-row class="align_center">
              <span class="point"></span>
              <span class="question">{{$t('permission.question_wio')}}</span>
            </v-ons-row>
            <v-ons-row class="desc">{{$t('permission.desc_owner')}}</v-ons-row>
          </v-ons-row>
          <v-ons-row class="explain_item">
            <v-ons-row class="align_center">
              <span class="point"></span>
              <span class="question">{{$t('permission.question_wia')}}</span>
            </v-ons-row>
            <v-ons-row class="desc">{{$t('permission.desc_active')}}</v-ons-row>
          </v-ons-row>
          <v-ons-row class="explain_item">
            <v-ons-row class="align_center">
              <span class="point"></span>
              <span class="question">{{$t('permission.question_wit')}}</span>
            </v-ons-row>
            <v-ons-row class="desc">{{$t('permission.desc_threshold')}}</v-ons-row>
          </v-ons-row>
        </div>
      </div>
      <v-ons-action-sheet
        :visible.sync="actionSheetVisible"
        cancelable
      >
        <v-ons-row>
          <v-ons-col>
            <div class="key_sheet">
              <div class="sheet_header">
                <img src="@/assets/img/permission_close.png" @click="actionSheetVisible = false">
                <span>{{$t('permission.key_generator')}}</span>
                <img src="@/assets/img/permission_refresh.png" @click="clickGenerate">
              </div>
              <div class="sheet_item">
                <span>{{$t('permission.public_key')}}</span>
                <textarea class="textarea sheet_key" disabled>{{sheet.publicKey}}</textarea>
              </div>
              <div class="sheet_item">
                <span>{{$t('permission.private_key')}}</span>
                <textarea class="textarea sheet_key" disabled>{{sheet.privateKey}}</textarea>
              </div>
              <div class="sheet_tip">{{$t('permission.warm_hint')}}</div>
              <div style="text-align:center;">
                <div class="sheet_btn" @click="clickUse">{{$t('permission.go_use')}}</div>
              </div>
            </div>
          </v-ons-col>
        </v-ons-row>
      </v-ons-action-sheet>
      <v-ons-dialog
        modifier="width"
        cancelable
        :visible.sync="dialogVisible">
        <div>
          <div class="delete_question">
            {{$t('permission.confirm_private')}}
          </div>
          <div class="dialog_action">
            <span class="btn_cancel" @click="dialogVisible = false">{{$t('common.cancel')}}</span>
            <span class="btn_delete" @click="clickConfirm">{{$t('common.confirm')}}</span>
          </div>
        </div>
      </v-ons-dialog>
      <v-ons-dialog
        modifier="width_pwd"
        cancelable
        style="background-color: rgba(0, 0, 0, .5);"
        :visible.sync="showDialog">
        <m-dialog :showFingerprint="false" v-model="password" v-on:confirm="handleConfirm" v-on:cancel="handleCancel"></m-dialog>
      </v-ons-dialog>
      <v-ons-modal :visible="loading" >
        <loading></loading>
      </v-ons-modal>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import MDialog from '@/components/MDialog'
import PasswordService from '@/services/PasswordService'
import CryptoAES from '@/util/CryptoAES'
import eos from '@/plugins/eos'
import Eos from 'eosjs'

const {ecc} = Eos.modules
const {PrivateKey} = ecc

export default {
  components: {
    vpage: MyPage,
    MDialog
  },
  data() {
    return {
      loading: false,
      showDialog: false,
      dialogVisible: false,
      actionSheetVisible: false,
      query: {},
      account: '',
      publicKey: '',
      password: '',
      sheet: {
        privateKey: '',
        publicKey: ''
      }
    }
  },
  created() {
    console.log(this.$route.query)
    const query = this.$route.query
    this.query = query
    this.account = query.account
    if (this.query.type === 'change') {
      this.publicKey = query.permission.key.slice()
    }
  },
  methods: {
    handleCancel() {
      this.showDialog = false
    },
    async handleConfirm() {
      const assets = this.$store.state.wallet.assets
      const seed = await PasswordService.encrypt(this.password)
      const privateKey = CryptoAES.decrypt(assets.privateKey,seed)
      if (privateKey) {
        this.loading = true
        console.log(this.query.perm_name)
        const required_auth = {
          accounts: [],
          keys: [],
          threshold: 1,
          waits: []
        }
        let permission = ''
        let parent = ''
        if (this.query.perm_name === 'active') {
          permission = 'active'
          parent = 'owner'
        }
        if (this.query.perm_name === 'owner') {
          permission = 'owner'
        }
        required_auth.keys = this.query.keys.slice()
        if (this.action === 'add') {
          required_auth.keys.push({
            key: this.publicKey,
            weight: 1
          })
          console.log(required_auth)
        }
        if (this.action === 'change') {
          const index = required_auth.keys.findIndex(ele => ele.key === this.query.permission.key)
          if (index !== -1) {
            required_auth.keys[index] = {
              key: this.publicKey,
              weight: 1
            }
          }
        }
        
        try {
          const res = await eos.transaction(tr => {
            tr.updateauth({
              account: this.account,
              permission: permission,
              parent: parent,
              auth: required_auth
            }, {authorization: `${this.account}@owner`})
          },{keyProvider: privateKey})
          console.log(res)
          if (res.transaction_id) {
            setTimeout(() => {
              this.$router.go(-1)
            }, 300);
          }
        } catch (error) {
          console.log(error)
        }
        this.loading = false
      } else {
        this.$toast(this.$t('common.wrong_pwd'))
      }
    },
    clickBtn(type) {
      if (!this.publicKey) return
      switch (type) {
        case 'add':
          this.action = 'add'
          this.showDialog = true
          break;
        case 'change':
          this.action = 'change'
          this.showDialog = true
          break;
      
        default:
          break;
      }
    },
    clickUse() {
      this.dialogVisible = true
    },
    clickConfirm() {
      this.publicKey = this.sheet.publicKey
      this.dialogVisible = false
      this.actionSheetVisible = false
    },
    async clickGenerate() {
      this.actionSheetVisible = true
      const buff = (await PrivateKey.randomKey()).toBuffer()
      this.sheet.privateKey = ecc.PrivateKey.fromBuffer(new Buffer(buff)).toString()
      this.sheet.publicKey = ecc.PrivateKey(this.sheet.privateKey).toPublic().toString('EOS')
    },
    back() {
      this.$router.go(-1)
    }
  },
}
</script>

<style scoped>
.align_center {
  display: flex;
  align-items: center;
}
.page_header {
  padding: 30px 55px;
  text-align: center;
  position: relative;
  font-size: 34px;
}
.ion_back {
  width: 42px;
  height: 32px;
  position: absolute;
  left: 55px;
  top: 50%;
  transform: translate(0, -50%);
}
.layout {
  padding: 50px 32px;
}
.permission_card {
  padding: 52px 34px;
  border-radius: 15px;
  background-color: #ec565a;
}
.card_title {
  color: #fff;
  font-size: 28px;
  flex: 1;
}
.create_key {
  color: #3d3d3d;
  font-size: 22px;
  text-align: right;
}
.create_key img {
  width: 28px;
  height: 28px;
}
.public_key {
  margin-top: 47px;
  padding: 35px 30px;
  font-size: 28px;
  border-radius: 15px;
  background-color: #f7bcbd;
  color: #5c5c5c;
  /* word-break: break-all; */
}
.textarea {
  background-color: transparent;
  width: 100%;
  border: none;
  padding: 0;
  color: #5c5c5c;
  font-size: 28px;
}
.textarea:disabled {
  opacity: 1;
}
.key_sheet {
  padding: 0 40px;
  background-color: #fff;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
}
.sheet_header {
  padding-top: 44px;
  font-size: 34px;
  display: flex;
  align-items: center;
}
.sheet_header span {
  flex: 1;
  text-align: center;
}
.sheet_header img {
  width: 44px;
  height: 44px;
}
.sheet_item {
  margin-top: 59px;
  display: flex;
  align-items: center;
  font-size: 28px;
}
.sheet_key {
  padding: 37px;
  color: #000;
  background-color: #ebebeb;
  border-radius: 10px;
  margin-left: 28px;
  flex: 1;
  word-break: break-all;
  user-select: text;
  -webkit-user-select: text;
}
.sheet_tip {
  margin-top: 52px;
  font-size: 28px;
  color: #ec565a;
}
.sheet_btn {
  display: inline-block;
  margin: 84px auto;
  padding: 20px 70px;
  font-size: 34px;
  color: #5789e4;
  border: 2px solid #5789e4;
  border-radius: 15px;
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
.btn_box {
  margin-top: 83px;
  text-align: center;
}
.edit {
  padding: 15px 50px;
  font-size: 34px;
  background-color: #5789e3;
  color: #fff;
  border-radius: 15px;
}
.explain_card {
  margin-top: 200px;
  padding: 30px 34px;
  box-shadow: 0 0 15px #e9e9e9;
  border-radius: 10px;
}
.explain_item {
  padding: 38px 0;
  border-bottom: 1PX solid #d6d6d6;
}
.explain_item:last-child {
  border: none;
}
.point {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #ec565a;
}
.question {
  margin-left: 20px;
  font-size: 28px;
}
.desc {
  padding-left: 38px;
  margin-top: 20px;
  font-size: 22px;
}
.key_sheet {
  background-color: #fff;
  height: 800px;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
  position: relative;
  display: flex;
  flex-direction: column;
}
</style>
