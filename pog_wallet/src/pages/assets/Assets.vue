<template>
  <div >
    <v-ons-row class="row_header" ref="header">
      <input type="text" :placeholder="$t('assets.search_assets')" maxlength="10" v-model="search">
      <img src="@/assets/img/select_wallet.png" class="select_wallet" @click="clickAddWallet('select')">
      <img src="@/assets/img/scanner.png" class="scanner" @click="clickScanner">
    </v-ons-row>
    <div>
      <!-- 我的资产 -->
      <div class="assets_bg"></div>
      <div class="assets_card">
        <div style="display: flex;">
          <div class="account_name" style="flex:1;" @click="clickAccount">{{wallet.account}} <img src="@/assets/img/arrow_right.png"> </div>
          <div class="action_transfer align_center" @click="clickTransfer">{{$t('assets.transfer')}} <img src="@/assets/img/transfer.png"> </div>
        </div>
        <div class="my_assets">( {{$store.state.wallet.currency === 'USD' ? '$':'￥'}} ) {{$t('assets.my_assets')}} 
          <img src="@/assets/img/eye_open.png" v-if="showAssets" @click="showAssets = false"> 
          <img src="@/assets/img/eye_close.png" v-else @click="showAssets = true"> 
        </div>
        <div style="display:flex;">
          <div class="balance" style="flex:1;">{{showAssets ? totalAssets:'***'}}</div>
          <div class="action_transfer align_center" @click="clickReceive">{{$t('assets.receive')}} <img src="@/assets/img/receive.png"> </div>
        </div>
      </div>
      <!-- 资源/权限/更多工具 -->
      <div v-if="wallet.chain === 'eos'">
        <div class="action_title">{{$t('assets.services')}} </div>
        <div class="action_card" @click="clickActions('resource')">
          <img class="action_img" src="@/assets/img/resource.png" >
          <div class="action_text">{{$t('assets.resource')}}</div>
          <div class="action_enter">Enter <img src="@/assets/img/enter.png"> </div>
        </div>
        <div class="action_card" @click="clickActions('permission')">
          <img class="action_img" src="@/assets/img/lock.png">
          <div class="action_text">{{$t('assets.permission')}}</div>
          <div class="action_enter">Enter <img src="@/assets/img/enter.png"> </div>
        </div>
        <!-- <div class="action_card">
          <img class="action_img" src="@/assets/img/more.png" >
          <div class="action_text">{{$t('assets.more')}}</div>
          <div class="action_enter">Enter <img src="@/assets/img/enter.png"> </div>
        </div> -->
      </div>
      <!-- 全部资产 -->
      <div ref="tokens">
        <div class="action_title align_center">
          <span>{{$t('assets.all_assets')}}</span>
          <div style="flex:1;display:flex;justify-content:flex-end;"> <img src="@/assets/img/add.png" @click="clickAddToken"> </div>
        </div>
        <div class="tokens_card">
          <div v-if="wallet.chain === 'eth'">
            <div class="token_item" @click="clickToken({symbol: 'ETH', address: ''})">
              <img src="@/assets/img/system_eth.png">
              <div class="token_symbol">ETH</div>
              <div>
                <div class="token_balance">{{showAssets ? wallet.balance:'***'}}</div>
                <div class="token_usd">{{showAssets ? currencySymbol+' '+ethConvert:'***'}}</div>
              </div>
            </div>
            <div class="token_item border" v-for="item in wallet.tokens" @click="clickToken(item)">
              <img :src="item.logo" v-if="item.logo">
              <img src="@/assets/img/question.png" v-else>
              <div class="token_symbol">{{item.symbol}}</div>
              <div>
                <div class="token_balance">{{showAssets ? item.balance : '***'}}</div>
                <div class="token_usd">{{showAssets ? currencySymbol+' 0.00':'***'}}</div>
              </div>
            </div>
          </div>
          <div v-else-if="wallet.chain === 'eos'">
            <div class="token_item" @click="clickToken({symbol: 'EOS',account_name: 'eosio.token'})">
              <img src="@/assets/img/eos.png">
              <div class="token_symbol">EOS</div>
              <div>
                <div class="token_balance">{{showAssets ? wallet.balance:'***'}}</div>
                <div class="token_usd">{{showAssets ? currencySymbol+' '+eosConvert:'***'}}</div>
              </div>
            </div>
            <div class="token_item border" v-for="item in wallet.tokens" @click="clickToken(item)">
              <img :src="item.logo" v-if="item.logo">
              <img src="@/assets/img/question.png" v-else>
              <div class="token_symbol">{{item.symbol}}</div>
              <div>
                <div class="token_balance">{{showAssets ? item.balance : '***'}}</div>
                <div class="token_usd">{{showAssets ? currencySymbol+' 0.00':'***'}}</div>
              </div>
            </div>
          </div>
          <div v-else-if="wallet.chain === 'pog'">
            <div class="token_item" @click="clickToken({symbol: 'POG', address: ''})">
              <img src="@/assets/img/system_pog.png">
              <div class="token_symbol">POG</div>
              <div>
                <div class="token_balance">{{showAssets ? wallet.balance:'***'}}</div>
                <div class="token_usd">{{showAssets ? currencySymbol+' '+pogConvert:'***'}}</div>
              </div>
            </div>
            <div class="token_item border" v-for="item in wallet.tokens" @click="clickToken(item)">
              <img :src="item.logo" v-if="item.logo">
              <img src="@/assets/img/question.png" v-else>
              <div class="token_symbol">{{item.symbol}}</div>
              <div>
                <div class="token_balance">{{showAssets ? item.balance : '***'}}</div>
                <div class="token_usd">{{showAssets ? currencySymbol+' 0.00':'***'}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div ref="blank"></div>
    </div>
      <!-- 已导入钱包列表(弹出框) -->
      <v-ons-action-sheet
        :visible.sync="actionSheetVisible"
        cancelable
      >
        <v-ons-row>
          <v-ons-col class="account_sheet">
            <div class="account_content">
              <div class="close_sheet">
                <img src="@/assets/img/sheet_arrow.png" @click="actionSheetVisible = false">
              </div>
              <div class="chain_type" v-if="wallet.ethWallets.length">ETH</div>
              <v-ons-row v-for="item in wallet.ethWallets" @click="clickWallet(item)">
                <div class="account_card">
                  <div class="account_info">
                    <div class="name">{{item.name}}</div>
                    <div class="publickey">{{item.shortAddress}}</div>
                  </div>
                  <div class="account_checked" v-if="item.isDefault">
                    <img src="@/assets/img/sheet_checked.png">
                  </div>
                </div>
              </v-ons-row>
              <div class="chain_type" v-if="wallet.eosWallets.length">EOS</div>
              <v-ons-row v-for="item in wallet.eosWallets" @click="clickWallet(item)">
                <div class="account_card">
                  <div class="account_info">
                    <div class="name">{{item.accountNames[0]}}</div>
                    <div class="publickey">{{item.shortKey}}</div>
                  </div>
                  <div class="account_checked" v-if="item.isDefault">
                    <img src="@/assets/img/sheet_checked.png">
                  </div>
                </div>
              </v-ons-row>
              <div class="chain_type" v-if="wallet.pogWallets.length">POG</div>
              <v-ons-row v-for="item in wallet.pogWallets" @click="clickWallet(item)">
                <div class="account_card">
                  <div class="account_info">
                    <div class="name">{{item.accountNames[0]}}</div>
                    <div class="publickey">{{item.shortKey}}</div>
                  </div>
                  <div class="account_checked" v-if="item.isDefault">
                    <img src="@/assets/img/sheet_checked.png">
                  </div>
                </div>
              </v-ons-row>
            </div>
            <div class="sheet_add">
              <!-- <img src="@/assets/img/sheet_add.png" @click="clickAddWallet('eos')"> -->
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
            该账号权限已经变更，当前私钥没有该账号的任何权限，是否删除？
          </div>
          <div class="dialog_action">
            <span class="btn_cancel" @click="dialogVisible = false">{{$t('common.cancel')}}</span>
            <span class="btn_delete" @click="clickDelete">{{$t('common.delete')}}</span>
          </div>
        </div>
      </v-ons-dialog>
  </div>
</template>

<script>
import ClientSocket from '@/socket/ClientSocket'
import eos from '@/plugins/eos'
import pog from '@/plugins/pog'
import {getCoinRate} from '@/servers'
import {getabi} from '@/servers/eth'
import {Decimal} from 'decimal.js'
import {ethers} from 'ethers'

export default {
  data () {
    return {
      actionSheetVisible: false,
      dialogVisible: false,
      showAssets: true,
      deleteKey: '',
      search: '',
      currencySymbol: '$',
      totalAssets: '0.00',
      ethConvert: '0.00',
      pogConvert: '0.00',
      eosConvert: '0.00',
      wallet: {
        chain: '',
        account: '',
        balance: '0.0000',
        tokens: [],
        eosWallets: [],
        ethWallets: [],
        pogWallets: [],
      },
    }
  },
  created () {
    this.currencySymbol = this.$store.state.wallet.currency === 'USD' ? '$':'￥'
    const assets = this.$store.state.wallet.assets
    console.log('assets-created', assets, document.documentElement.clientHeight)
    if (assets) {
      this.wallet = assets
      setTimeout(() => {
        this.initData()
      }, 1000);
    } else {
      this.initData()
    }
  },
  watch: {
    '$store.state.wallet.assets'(newVal) {
      console.log('assets-watch', newVal)
      this.initData()
    },
    search(newVal) {
      if (newVal) {
        console.log(document.documentElement.clientHeight,document.querySelector('.my_page').offsetHeight,this.$refs.tokens.offsetHeight, document.querySelector('.tabbar').offsetHeight,this.$refs.header.$el.offsetHeight)
        this.$refs.blank.style.height = document.querySelector('.my_page').offsetHeight - this.$refs.tokens.offsetHeight - document.querySelector('.tabbar').offsetHeight - this.$refs.header.$el.offsetHeight - 10 + 'px'
        console.log(this.$refs.blank.offsetHeight)
        document.querySelector('.my_page').scrollTop = this.$refs.blank.offsetHeight
      } else {
        document.querySelector('.my_page').scrollTop = 0
        this.$refs.blank.style.height = '0'
      }
    }
  },
  methods: {
    async initData() {
      const wallet = this.wallet
      const wallets = this.$store.state.wallet.localFile.wallets
      console.log('initData',wallets)
      wallet.eosWallets = []
      wallet.ethWallets = []
      wallet.pogWallets = []
      for (let item of wallets) {
        if (item.chain === 'eth') {
          const obj = Object.assign({}, item)
          obj.shortAddress = item.address.substr(0,6) + '...' + item.address.substr(item.address.length - 6)
          wallet.ethWallets.push(obj)
          if (item.isDefault) {
            wallet.chain = item.chain
            wallet.account = item.name
            wallet.address = item.address
            wallet.privateKey = item.privateKey
            // [{address: '0xd6c362873ec2dd480ab625425593862056d3ae7a', symbol: 'SRC', balance: '0.0'}] item.tokenList
            wallet.tokens = item.tokenList
            wallet.fingerprintToken = item.fingerprintToken
            if (item.fingerprintToken) {
              // 是永久指纹
              this.$store.commit('wallet/changeFingerprintToken', item.fingerprintToken)
            }
            const provider = ethers.getDefaultProvider(this.ethNet);
            provider.getBalance(item.address).then(balance => {
              const estr = ethers.utils.formatEther(balance);
              console.log('provider',balance,estr)
              wallet.balance = estr
              this.totalEthConvert()
              this.$store.commit('wallet/setAssets', wallet)
            })
            for (const token of wallet.tokens) {
              token.balance = '0.0'
              getabi({address: token.address}).then(async res => {
                // console.log('getabi',res)
                if (res.message === 'OK') {
                  const abi = JSON.parse(res.result)
                  const contract = new ethers.Contract(token.address,abi,provider)
                  const balance = await contract.balanceOf(wallet.address)
                  token.balance = ethers.utils.formatEther(balance)
                }
              })
            }
          }
        }
        if (item.chain === 'eos') {
          // 已导入钱包列表
          const obj = Object.assign({}, item)
          obj.balance = '0.0000'
          obj.shortKey = item.publicKey.substr(0,6) + '...' + item.publicKey.substr(item.publicKey.length - 6)
          wallet.eosWallets.push(obj)
          if (item.isDefault) {
            // 当前钱包
            wallet.chain = item.chain
            wallet.privateKey = item.privateKey
            wallet.publicKey = item.publicKey
            wallet.account = item.accountNames[0]
            wallet.tokens = item.tokenList
            wallet.fingerprintToken = item.fingerprintToken
            if (item.fingerprintToken) {
              // 是永久指纹
              this.$store.commit('wallet/changeFingerprintToken', item.fingerprintToken)
            }
            for (let token of wallet.tokens) {
              eos.getTableRows({
                json:true,
                code:token.account_name,
                scope:wallet.account,
                table:'accounts',
                limit:500
              }).then(res => {
                token.balance = res.rows.length ? res.rows[0].balance.split(' ')[0] : '0.0000'
              })
            }
            // 获取eos余额
            // const balances = await eos.getTableRows({
            //   json:true,
            //   code:'eosio.token',
            //   scope:wallet.account,
            //   table:'accounts',
            //   limit:500
            // })
            // wallet.balance = balances.rows.length ? balances.rows[0].balance.split(' ')[0] : '0.0000'
            const info = await eos.getAccount(wallet.account)
            wallet.balance = info.core_liquid_balance.split(' ')[0]
            wallet.permissions = info.permissions
            this.totalConvert()
            this.$store.commit('wallet/setAssets', wallet)
          }
        }
        if (item.chain === 'pog') {
          // 已导入钱包列表
          const obj = Object.assign({}, item)
          obj.balance = '0.0000'
          obj.shortKey = item.publicKey.substr(0,6) + '...' + item.publicKey.substr(item.publicKey.length - 6)
          wallet.pogWallets.push(obj)
          if (item.isDefault) {
            // 当前钱包
            wallet.chain = item.chain
            wallet.privateKey = item.privateKey
            wallet.publicKey = item.publicKey
            wallet.account = item.accountNames[0]
            wallet.tokens = item.tokenList
            wallet.fingerprintToken = item.fingerprintToken
            if (item.fingerprintToken) {
              // 是永久指纹
              this.$store.commit('wallet/changeFingerprintToken', item.fingerprintToken)
            }
            for (let token of wallet.tokens) {
              pog.getTableRows({
                json:true,
                code:'eosio.token',
                scope:wallet.account,
                table:'accounts',
                limit:500
              }).then(res => {
                token.balance = res.rows.length ? res.rows[0].balance.split(' ')[0] : '0.0000'
              })
            }
            // 获取pog余额
            const balances = await pog.getTableRows({
              json:true,
              code:'eosio.token',
              scope:wallet.account,
              table:'accounts',
              limit:500
            })
            wallet.balance = balances.rows.length ? balances.rows[0].balance.split(' ')[0] : '0.0000'
          
            this.totalPogConvert()
            this.$store.commit('wallet/setAssets', wallet)
          }
        }
      }
    },
    async totalConvert() {
      const rate = await getCoinRate({coin_id: 'EOS', convert: this.$store.state.wallet.currency})
      this.eosConvert = Decimal.mul(this.wallet.balance, rate.data.price).toFixed(2)
      this.totalAssets = this.eosConvert
    },
    async totalEthConvert() {
      const rate = await getCoinRate({coin_id: 'ETH', convert: this.$store.state.wallet.currency})
      this.ethConvert = Decimal.mul(this.wallet.balance, rate.data.price).toFixed(2)
      this.totalAssets = this.ethConvert
    },
    async totalPogConvert() {
      //const rate = await getCoinRate({coin_id: 'POG', convert: this.$store.state.wallet.currency})
      //按40元算
      this.pogConvert = Decimal.mul(this.wallet.balance, 40).toFixed(2)
      this.totalAssets = this.pogConvert
    },
    clickReceive() {
      if (this.wallet.chain === 'eth') {
        this.$router.push({
          name: 'EthReceive',
          query: {
            token: 'ETH'
          }
        })
      } else if(this.wallet.chain === 'pog'){
        this.$router.push({
          name: 'PogReceive',
          query: {
            token: 'POG'
          }
        })
      }else {
        this.$router.push({
          name: 'Receive',
          query: {
            token: 'EOS'
          }
        })
      }
    },
    clickTransfer() {
      this.$router.push({
        name: 'Transfer',
        query: {
          chain: this.wallet.chain
        }
      })
    },
    clickDelete() {
      const localFile = this.$store.state.wallet.localFile
      const wallets = localFile.wallets
      const index = wallets.findIndex(ele => ele.publicKey === this.deleteKey)
      wallets.splice(index, 1)
      localStorage.setItem('isecsp_wallet',JSON.stringify(localFile))
      this.dialogVisible = false
      this.actionSheetVisible = false
      this.initData()
    },
    // 切换钱包
    async clickWallet(wallet) {
      // console.log(wallet)
      const localFile = this.$store.state.wallet.localFile
      const wallets = localFile.wallets
      if (wallet.chain === 'eth') {
        for (let item of wallets) {
          if (item.chain === 'eth' && item.address === wallet.address) {
            item.isDefault = true
          } else {
            item.isDefault = false
          }
        }
        for (let item of this.$store.state.wallet.cacheFingerprint) {
          if (item.chain === 'eth' && item.address === wallet.address) {
            this.$store.commit('wallet/changeFingerprintToken', item.fingerprintToken)
          }
        }
      }
      if (wallet.chain === 'eos') {
        const account = await eos.getKeyAccounts(wallet.publicKey)
        if (!account.account_names.length) {
          // 权限已经变更
          this.deleteKey = wallet.publicKey
          this.dialogVisible = true
          return
        }
        for (let item of wallets) {
          if (item.chain === wallet.chain && item.publicKey === wallet.publicKey) {
            // 设置点击选中的钱包为默认
            item.isDefault = true
          } else {
            // 其他钱包取消默认
            item.isDefault = false
          }
        }
        for (let item of this.$store.state.wallet.cacheFingerprint) {
          if (item.chain === wallet.chain && item.publicKey === wallet.publicKey) {
            this.$store.commit('wallet/changeFingerprintToken', item.fingerprintToken)
          }
        }
      }
      if (wallet.chain === 'pog') {
        const account = await pog.getKeyAccounts(wallet.publicKey)
        if (!account.account_names.length) {
          // 权限已经变更
          this.deleteKey = wallet.publicKey
          this.dialogVisible = true
          return
        }
        for (let item of wallets) {
          if (item.chain === wallet.chain && item.publicKey === wallet.publicKey) {
            // 设置点击选中的钱包为默认
            item.isDefault = true
          } else {
            // 其他钱包取消默认
            item.isDefault = false
          }
        }
        for (let item of this.$store.state.wallet.cacheFingerprint) {
          if (item.chain === wallet.chain && item.publicKey === wallet.publicKey) {
            this.$store.commit('wallet/changeFingerprintToken', item.fingerprintToken)
          }
        }
      }
      localStorage.setItem('isecsp_wallet',JSON.stringify(localFile))
      this.actionSheetVisible = false
      this.initData()
    },
    clickActions(type) {
      switch (type) {
        case 'resource':
          this.$router.push({
            name: 'Resource',
            query: {
              account: this.wallet.account
            }
          })
          break;
        case 'permission':
          // console.log(this.wallet)
          this.$router.push({
            name: 'Permission',
            query: {
              account: this.wallet.account,
              publicKey: this.wallet.publicKey
            }
          })
          break;
      
        default:
          break;
      }
    },
    clickToken(token) {
      if (this.wallet.chain === 'eth') {
        this.$router.push({
          name: 'EthTransferRecords',
          query: {
            address: this.wallet.address,
            symbol: token.symbol,
            contract: token.address
          }
        })
      } else if (this.wallet.chain === 'pog'){
        this.$router.push({
          name: 'PogTransferRecords',
          query: {
            account: this.wallet.account,
            symbol: token.symbol,
            account_name: token.account_name
          }
        })
      }
      else {
        this.$router.push({
          name: 'TransferRecords',
          query: {
            account: this.wallet.account,
            symbol: token.symbol,
            account_name: token.account_name
          }
        })
      }
    },
    clickAddBtn() {
      this.actionSheetVisible = false
      setTimeout(() => {
        this.$router.push({
          name: 'AddWallet'
        })
      }, 50);
    },
    clickAddToken() {
      if (this.wallet.chain === 'eos') {
        this.$router.push({
          name: 'SearchToken'
        })
      } else if (this.wallet.chain === 'pog'){
        this.$router.push({
          name: 'PogSearchToken'
        })
      }
       else {
        this.$router.push({
          name: 'EthSearchToken'
        })
      }
    },
    clickAddWallet(type) {
      switch (type) {
        case 'select':
          this.$router.push({
            name: 'SelectBlockchain'
          })
          break;
      
        default:
          break;
      }
    },
    clickScanner() {
      this.$router.push({
        name: 'Scanner'
      })
    },
    clickAccount() {
      this.actionSheetVisible = true
      
    }
  }
}
</script>


<style scoped>
.layout {
  padding: 10px;
  height: 100%;
  box-sizing: border-box;
}
.align_center {
  display: flex;
  align-items: center;
}

.row_header {
  height: 150px;
  background-image: url('~@/assets/img/bg_header.png');
  background-size: cover;
  background-repeat: repeat;
  position: fixed;
  z-index: 100;
}
.row_header input {
  width: 476px;
  height: 60px;
  line-height: 60px;
  border-radius: 45px;
  border: none;
  outline: 0;
  margin: 58px 0 0 48px;
  padding-left: 80px;
  box-sizing: border-box;
  background-color: #fbfbfb;
  background-image: url('~@/assets/img/assets_search.png');
  background-repeat: no-repeat;
  background-position: 28px 10px;
  background-size: 42px;
}
.select_wallet {
  margin-left: 25px;
  margin-top: 58px;
  width: 70px;
  height: 59px;
}
.scanner {
  margin-left: 25px;
  margin-top: 58px;
  width: 59px;
  height: 59px;
}
.assets_bg {
  height: 338px;
  background: linear-gradient(to right,  #f53a3f, #e4272b);
}
.assets_card {
  background-color: #fff;
  margin: 0 30px;
  margin-top: -188px;
  border-radius: 15px;
  padding: 56px;
  color: #181818;
  font-size:32px;
  box-shadow: 0 0 1px #dbdbdb;
}
.account_name img{
  margin-left: 40px;
  width: 20px;
  height: 30px;
}
.action_transfer img {
  margin-left: 20px;
  width: 50px;
  height: 50px;
}
.my_assets {
  font-size: 34px;
  margin: 20px 0;
}
.my_assets img {
  width: 38px;
  height: 24px;
}
.assets_card .balance {
  color: #e4252a;
  font-size: 56px;
  font-weight: bold;
}
.action_title {
  margin: 24px 46px 0 46px;
  font-size: 26px;
}
.action_title img {
  width: 42px;
  height: 42px;
}
.action_card {
  padding: 35px 66px;
  margin: 0 30px;
  margin-top: 24px;
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  box-shadow: 1px 1px 10px #e9e9e9;
}
.action_text {
  flex: 1;
  margin-left: 28px;
}
.action_enter {
  font-size: 24px;
  color: #cdcdcd;
  display: flex;
  align-items: center;
}
.action_enter img {
  width: 16px;
  height: 24px;
  margin-left: 10px;
}
.tokens_card {
  padding: 0 20px;
  margin: 24px 30px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 1px 1px 10px #e9e9e9;
}
.token_item {
  display: flex;
  align-items: center;
  padding: 20px 0;
}
.token_item img {
  height: 70px;
}
.token_symbol {
  flex: 1;
  padding-left: 20px;
}
.token_balance {
  font-size: 26px;
  text-align: right;
}
.token_usd {
  font-size: 22px;
  color: #b0b0b0;
  text-align: right;
}
.border {
  border-top: 1px solid #f6f6f6;
}
.action_img {
  width: 60px;
  height: 60px;
}
.account_sheet {
  background-color: #fff;
  min-height: 900px;
  max-height: 100vh;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: scroll;
}
.account_content {
  flex: 1;
}
.sheet_add {
  padding: 100px 0;
  text-align: center;
}
.sheet_add img {
  width: 72px;
  height: 72px;
}
.close_sheet {
  margin-top: 32px;
  text-align: center;
}
.close_sheet img {
  width: 50px;
  height: 26px;
}
.chain_type {
  margin-top: 73px;
  margin-bottom: 21px;
  font-size: 38px;
  font-weight: 450;
  text-align: center;
}
.account_card {
  margin: 0 38px;
  margin-top: 34px;
  padding: 32px 48px;
  border-radius: 15px;
  box-shadow: 0 0 15px rgb(228, 228, 228);
  width: 100%;
  display: flex;
  align-items: center;
}
.account_info {
  flex: 1;
}
.account_info .name {
  font-size: 34px;
}
.account_info .publickey {
  font-size: 22px;
  margin-top: 20px;
  color: #b3b3b3;
}
.account_checked img{
  width: 46px;
  height: 32px;
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
