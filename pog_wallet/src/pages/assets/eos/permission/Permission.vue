<template>
  <vpage>
    <slot>
      <div class="page_header">
        <img class="ion_back" src="@/assets/img/back.png" @click="back"> 
        <span>{{account}}</span>
      </div>
      <div class="item">
        <div class="item_header">
          <span class="item_title">{{$t('permission.owner')}}</span>
          <img class="ion_add" src="@/assets/img/add.png" @click="clickAdd('owner')">
        </div>
        <div class="item_card" v-for="item in owner">
          <div>
            <span class="current" v-if="item.key === publicKey">{{$t('permission.current_account')}}</span>
          </div>
          <div class="item_key">{{item.key}}</div>
          <div class="change">
            <span class="threshold">{{$t('permission.weight')}}:1</span>
            <span class="edit" @click="clickChange('owner', item)">{{$t('permission.modify')}}</span>
          </div>
          <img class="ion_delete" src="@/assets/img/permission_delete.png" @click="clickDelete('owner',item)">
        </div>
      </div>
      <div class="item">
        <div class="item_header">
          <span class="item_title">{{$t('permission.active')}}</span>
          <img class="ion_add" src="@/assets/img/add.png" @click="clickAdd('active')">
        </div>
        <div class="item_card" v-for="item in active">
          <div>
            <span class="current" v-if="item.key === publicKey">{{$t('permission.current_account')}}</span>
          </div>
          <div class="item_key">{{item.key}}</div>
          <div class="change">
            <span class="threshold">{{$t('permission.weight')}}:1</span>
            <span class="edit" @click="clickChange('active', item)">{{$t('permission.modify')}}</span>
          </div>
          <img class="ion_delete" src="@/assets/img/permission_delete.png" @click="clickDelete('active',item)">
        </div>
      </div>
      <!-- <div class="explain_title">说明</div> -->
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
      account: '',
      publicKey: '',
      type: '',
      password: '',
      deleteItem: null,
      owner: [],
      active: []
    }
  },
  created() {
    this.account = this.$route.query.account
    this.initData()
    this.updateData()
  },
  watch: {
    '$route'(to, from) {
      if (from.name === 'EditPermission') {
        this.updateData()
      }
    }
  },
  methods: {
    updateData() {
      setTimeout(() => {
        eos.getAccount(this.account).then(res => {
          console.log(res)
          this.$store.state.wallet.assets.permissions = res.permissions
          this.initData()
        })
      }, 1000);
    },
    initData() {
      this.publicKey = this.$store.state.wallet.assets.publicKey
      const permissions = this.$store.state.wallet.assets.permissions
      for (const item of permissions) {
        if (item.perm_name === 'owner') {
          this.owner = item.required_auth.keys
        }
        if (item.perm_name === 'active') {
          this.active = item.required_auth.keys
        }
      }
    },
    // 变更
    clickChange(type, item) {
      switch (type) {
        case 'owner':
          this.$router.push({
            name: 'EditPermission',
            query: {
              type: 'change',
              perm_name: 'owner',
              account: this.account,
              permission: item,
              keys: this.owner
            }
          })
          break;
        case 'active':
          this.$router.push({
            name: 'EditPermission',
            query: {
              type: 'change',
              perm_name: 'active',
              account: this.account,
              permission: item,
              keys: this.active
            }
          })
          break;
      
        default:
          break;
      }
    },
    // 添加
    clickAdd(type) {
      switch (type) {
        case 'owner':
          this.$router.push({
            name: 'EditPermission',
            query: {
              type: 'add',
              perm_name: 'owner',
              account: this.account,
              keys: this.owner
            }
          })
          break;
        case 'active':
          this.$router.push({
            name: 'EditPermission',
            query: {
              type: 'add',
              perm_name: 'active',
              account: this.account,
              keys: this.active
            }
          })
          break;
      
        default:
          break;
      }
    },
    handleCancel() {
      this.showDialog = false
    },
    async handleConfirm() {
      const assets = this.$store.state.wallet.assets
      const seed = await PasswordService.encrypt(this.password)
      const privateKey = CryptoAES.decrypt(assets.privateKey,seed)
      if (privateKey) {
        this.loading = true
        let permission = ''
        let parent = ''
        let required_auth = {
          accounts: [],
          keys: [],
          threshold: 1,
          waits: []
        }
        if (this.type === 'active') {
          required_auth.keys = this.active
          permission = 'active'
          parent = 'owner'
        }
        if (this.type === 'owner') {
          required_auth.keys = this.owner
          permission = 'owner'
        }
        const index = required_auth.keys.findIndex(ele => ele.key === this.deleteItem.key)
        if (index === -1) return
        required_auth.keys.splice(index, 1)
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
            this.updateData()
            this.$toast('删除成功')
          }
        } catch (error) {
          console.log(error)
        }
        this.loading = false
        this.showDialog = false
      } else {
        this.$toast(this.$t('common.wrong_pwd'))
      }
    },
    clickDelete(type,item) {
      
      switch (type) {
        case 'owner':
          this.type = 'owner'
          this.deleteItem = item
          this.showDialog = true
          break;
        case 'active':
          this.type = 'active'
          this.deleteItem = item
          this.showDialog = true
          break;
      
        default:
          break;
      }
      
    },
    back() {
      this.$router.go(-1)
    }
  },
}
</script>

<style scoped>
.align_center {
  align-items: center;
}
.page_header {
  padding: 30px 55px;
  text-align: center;
  position: relative;
  font-size: 34px;
  /* background-color: #fff; */
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
  margin: 28px 34px;
}
.item_header {
  display: flex;
  align-items: center;
}
.item_title {
  flex: 1;
  font-size: 28px;
}
.ion_add {
  width: 44px;
  height: 44px;
}
.item_card {
  margin-top: 26px;
  padding: 45px 50px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 0 10px #e9e9e9;
  position: relative;
}
.ion_delete {
  position: absolute;
  right: 32px;
  bottom: 26px;
  width: 38px;
  height: 38px;
}
.current {
  padding: 6px 15px;
  background-color: #ec565a;
  color: #fff;
  border-radius: 15px;
  font-size: 16px;
}
.item_key {
  color: #b0b0b0;
  margin-top: 20px;
  font-size: 28px;
  word-break: break-all;
}
.change {
  margin-top: 52px;
  text-align: center;
  position: relative;
}
.change .edit {
  padding: 10px 40px;
  font-size: 28px;
  background-color: #5789e3;
  color: #fff;
  border-radius: 15px;
}
.threshold {
  position: absolute;
  left: 0;
  color: #b0b0b0;
  font-size: 28px;
}
.permission_card {
  margin: 59px 32px;
  padding: 52px 34px;
  border-radius: 15px;
  background-color: #ec565a;
}
.card_title {
  color: #fff;
  font-size: 28px;
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
  padding: 28px;
  font-size: 28px;
  border-radius: 15px;
  background-color: #f7bcbd;
  color: #5c5c5c;
  word-break: break-all;
}
.explain_title {
  margin: 26px 34px;
  font-size: 28px;
}
.explain_card {
  margin: 0 34px 50px 34px;
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
