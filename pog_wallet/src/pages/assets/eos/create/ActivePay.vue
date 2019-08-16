<template>
  <vpage>
    <slot>
      <div>
        <div class="page_header">
          <img class="ion_back" src="@/assets/img/back.png" @click="back"> 
          <span>账号支付激活</span>
        </div>
        <div class="content">
          <div class="account">{{active.account}}</div>
          <div class="account_type">EOS账号</div>
          <div>
            <div class="resource_config">账号资源配置</div>
            <div  class="resource_item">
              <div>CPU抵押(EOS)</div>
              <input class="ipt" type="number" oninput="if(value.length>12)value=value.slice(0,12)" v-model="active.cpu">
              <span class="symbol">EOS</span>
            </div>
            <div class="resource_item">
              <div>网络抵押(EOS)</div>
              <input class="ipt" type="number" oninput="if(value.length>12)value=value.slice(0,12)" v-model="active.net">
              <span class="symbol">EOS</span>
            </div>
            <div class="resource_item">
              <div>分配内存(EOS)</div>
              <input class="ipt" type="number" oninput="if(value.length>12)value=value.slice(0,12)" v-model="active.ram">
              <span class="symbol">EOS</span>
            </div>
          </div>
          <div class="key_item">
            <div class="key_title">owner公钥</div>
            <div class="key_text">{{active.owner}}</div>
          </div>
          <div class="key_item">
            <div class="key_title">active公钥</div>
            <div class="key_text">{{active.active}}</div>
          </div>
          <div class="btn">
            <span @click="clickPay">确认支付</span>
          </div>
        </div>
      </div>
      <v-ons-dialog
        modifier="width_pwd"
        cancelable
        style="background-color: rgba(0, 0, 0, .5);"
        :visible.sync="showDialog">
        <m-dialog v-model="password" v-on:confirm="handleConfirm" v-on:cancel="handleCancel"></m-dialog>
      </v-ons-dialog>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import MDialog from '@/components/MDialog'
import PasswordService from '@/services/PasswordService'
import CryptoAES from '@/util/CryptoAES'
import eos from '@/plugins/eos'

export default {
  components: {
    vpage: MyPage,
    MDialog
  },
  data () {
    return {
      active: {},
      password: '',
      loading: false,
      showDialog: false
    }
  },
  created() {
    const str = "{\"account\":\"afafbhaqwiuu\",\"owner\":\"EOS61hkDMheKp7M72WziTTPueG1sd9oZcnrMwiNZ5bsNuoD2sX3H5\",\"active\":\"EOS61hkDMheKp7M72WziTTPueG1sd9oZcnrMwiNZ5bsNuoD2sX3H5\",\"cpu\":\"0.1\",\"net\":\"0.1\",\"ram\":\"1\",\"action\":\"createAccount\"}"
    this.active = JSON.parse(localStorage.getItem('friend_create'))
    console.log(this.active)
  },
  methods: {
    clickPay() {
      this.showDialog = true
    },
    async handleConfirm() {
      if (!this.active.cpu || !this.active.net || !this.active.ram) return
      const assets = this.$store.state.wallet.assets
      const seed = await PasswordService.encrypt(this.password)
      const privateKey = CryptoAES.decrypt(assets.privateKey,seed)
      if (privateKey) {
        this.showDialog = false
        try {
          const res = await eos.transaction(tr => {
              tr.newaccount({
                  creator: assets.account,
                  name: this.active.account,
                  owner: this.active.owner,
                  active: this.active.active,
              })
              tr.buyram({
                  payer: assets.account,
                  receiver: this.active.account,
                  quant: parseFloat(this.active.ram).toFixed(4) + ' EOS'
              })
              tr.delegatebw({
                  from: assets.account,
                  receiver: this.active.account,
                  stake_cpu_quantity: parseFloat(this.active.cpu).toFixed(4) + ' EOS',
                  stake_net_quantity: parseFloat(this.active.net).toFixed(4) + ' EOS',
                  transfer: 1
              })
          },{keyProvider: privateKey})
          if (res.transaction_id) {
            this.$toast('激活成功')
            localStorage.removeItem('friend_create')
            setTimeout(() => {
              const stack = this.$store.state.wallet.stack
              this.$router.go(0 - stack.length)
              stack.splice(0)
            }, 500);
          }
        } catch (error) {
          console.log(error)
        }
      } else {
        this.$toast(this.$t('common.wrong_pwd'))
      }
      this.loading = false
    },
    handleCancel() {
      this.showDialog = false
    },
    back() {
      const stack = this.$store.state.wallet.stack
      this.$router.go(0 - stack.length)
      stack.splice(0)
    }
  },
}
</script>

<style scoped>
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
.content {
  background-color: #fff;
  margin-top: 20px;
  padding: 20px 0;
}
.account {
  font-size: 36px;
  text-align: center;
}
.account_type {
  font-size: 26px;
  margin-top: 10px;
  text-align: center;
}
.resource_config {
  text-align:right;
  background-color: #f8f8f8;
  margin-top: 30px;
  padding: 15px 15px 0 0;
  font-size: 26px;
}
.resource_item {
  background-color: #f8f8f8;
  text-align: left;
  margin-bottom: 10px;
  padding: 10px 20px;
  position: relative;
  font-size: 28px;
}
.ipt {
  background-color: #f8f8f8;
  border: none;
  font-weight: normal;
  padding: 10px;
  margin-top: 10px;
}
.symbol {
  position: absolute;
  right: 20px;
  bottom: 20px;
  color: grey;
}
.key_title {
  margin-left: 20px;
  margin-top: 20px;
  font-size: 30px;
}
.key_text {
  color: gray;
  margin-left: 10px;
  word-break: break-all;
  line-height: 1.2;
  font-size: 28px;
  margin-left: 20px;
}
.btn {
  margin: 50px 0;
  text-align: center;
}
.btn span {
  border-radius: 30px;
  padding: 20px 50px;
  color: #fff;
  background-color: #446af9;
  font-size: 26px;
}
</style>
