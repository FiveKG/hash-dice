<template>
  <div >

    <v-ons-row class="row_header" ref="header">
      <div class="head-user flx_default">
        <img class="head-user_avatar" src="../../assets/invitation2/avatar.jpg" alt="">
        <span @click="clickAccount">{{wallet.account}}</span>
        <img class="head-user_arrow" src="@/assets/assets/triangle.png">
      </div>
      <img class="head-serve" src="../../assets/assets/history.png" alt="">
      <div class="row_header_bg"></div>
    </v-ons-row>
    <!-- <v-ons-row class="row_header" ref="header">
      <input type="text" :placeholder="$t('assets.search_assets')" maxlength="10" v-model="search">
      <img src="@/assets/img/select_wallet.png" class="select_wallet" @click="clickAddWallet('select')">
      <img src="@/assets/img/scanner.png" class="scanner" @click="clickScanner">
    </v-ons-row> -->
    <div style="z-index:111">
      <div class="assets_card_wrapper">
        <div class="assets_card fd_cln">
          <div class="card_row_1 jc_sb-al_c">
            <div class="al_c">
              <span>总资产</span>
              <div class="my_assets">
                <img src="@/assets/img/eye_open.png" v-if="showAssets" @click="showAssets = false"> 
                <img src="@/assets/img/eye_close.png" v-else @click="showAssets = true"> 
              </div>  
            </div>
            <img src="../../assets/assets/ellipsis.png" alt="">
          </div>
          <div class="card_row_2 al_c">
            <div>{{showAssets ? totalAssets:'***'}}</div>
            <div>
              &nbsp;&nbsp;{{$store.state.wallet.currency === 'USD' ? '$':'￥'}}
            </div>
          </div>
          <div class="card_row_3 jc_sb-al_c">
            <div class="jc_sb-al_c" @click="clickReceive"><img src="@/assets/assets/receipt.png"><span>收款</span></div>
            <div class="jc_sb-al_c" @click="clickTransfer"><img src="@/assets/assets/transfer.png"><span>转账</span></div>
            <div class="jc_sb-al_c" @click="clickScanner"><img src="@/assets/assets/scan.png"><span>扫码</span></div>
          </div>
        </div>
      </div>
      <!-- 我的资产 -->
      <!-- <div class="assets_card">
        <div style="display: flex;">
          <div class="account_name" style="flex:1;" @click="clickAccount">{{wallet.account}} <img src="@/assets/img/arrow_right.png"> </div>
          <div class="action_transfer align_center" @click="clickTransfer">{{$t('assets.transfer')}} <img src="@/assets/img/transfer.png"> </div>
        </div>
        <div class="my_assets">
          <img src="@/assets/img/eye_open.png" v-if="showAssets" @click="showAssets = false"> 
          <img src="@/assets/img/eye_close.png" v-else @click="showAssets = true"> 
        </div>
        <div style="display:flex;">
          <div class="balance" style="flex:1;">{{showAssets ? totalAssets:'***'}}</div>
          <div class="action_transfer align_center" @click="clickReceive">{{$t('assets.receive')}} <img src="@/assets/img/receive.png"> </div>
        </div>
      </div> -->
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
        </div>
        <div class="tokens_card">
          <div v-if="wallet.chain === 'eth'">
            <div class="token_item" @click="clickToken({symbol: 'ETH', address: ''})">
              <img src="@/assets/assets/eth.png">
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
        <div class="addToken" @click="clickAddToken">添加资产</div>
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
                <div @click.stop="deleteWallet(item)" class="account_delete_btn">
                </div>
              </v-ons-row>
              <div @click="clickAddWallet('select')" class="account_add_btn">
              </div>
            </div>
            <div class="sheet_add">
              <!-- <div src="@/assets/img/sheet_add.png" @click="clickAddWallet('eos')"> -->
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
      <v-ons-dialog
        modifier="width"
        cancelable
        :visible.sync="deleteDialogVisible">
        <div>
          <div class="delete_question">
            您是否确认删除选中账号
          </div>
          <div class="dialog_action">
            <span class="btn_cancel" @click="deleteDialogVisible = false">{{$t('common.cancel')}}</span>
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
      deleteDialogVisible: false,
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
        // console.log(document.documentElement.clientHeight,document.querySelector('.my_page').offsetHeight,this.$refs.tokens.offsetHeight, document.querySelector('.tabbar').offsetHeight,this.$refs.header.$el.offsetHeight)
        this.$refs.blank.style.height = document.querySelector('.my_page').offsetHeight - this.$refs.tokens.offsetHeight - document.querySelector('.tabbar').offsetHeight - this.$refs.header.$el.offsetHeight - 10 + 'px'
        // console.log(this.$refs.blank.offsetHeight)
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
        console.log('item===============',item)
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
            // UE ===> code: uetokencoin | POG => code: eosio.token | TBG => code: tbgtokencoin
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
      // console.log('this.$store.state.wallet.assets',this.$store.state.wallet.assets)
      // console.log('this.$store.state.wallet.localFile',this.$store.state.wallet.localFile)
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
      if (this.$store.state.wallet.localFile.wallets.length > 0) {
        const currentWallet = this.$store.state.wallet.localFile.wallets[0]
        this.$store.commit('wallet/setAssets', wallet)
      } else {
        this.$store.commit('wallet/setAssets', null)
      }
      this.dialogVisible = false
      this.deleteDialogVisible = false
      this.actionSheetVisible = false
      this.initData()
    },
    // 用户主动删除钱包
    deleteWallet (wallet) {
      const localFile = this.$store.state.wallet.localFile
      const wallets = localFile.wallets
      this.deleteKey = wallet.publicKey
      this.deleteDialogVisible = true
      localStorage.setItem('isecsp_wallet',JSON.stringify(localFile))
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
.assets_card .balance {
  color: #e4252a;
  font-size: 56px;
  font-weight: bold;
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
  margin: 34px 28px 0 38px;
  padding: 32px 48px;
  border-radius: 15px;
  box-shadow: 0 0 15px rgb(228, 228, 228);
  width: 100%;
  display: flex;
  align-items: center;
  flex-shrink: 1;
}
ons-row {
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
}
.account_add_btn {
  height: .8rem;
  background: #1D4997;
  width: .8rem;
  border-radius: 50%;
  position: relative;
  margin: .4rem auto;
}
.account_add_btn::after,.account_add_btn::before {
  position: absolute;
  content: '';
  background: #fff;
  width: 50%;
  height: .1rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.account_add_btn::after{
  width: .1rem;
  height: 50%;
}
.account_delete_btn {
  height: .5rem;
  background: #e4252a;
  margin-right: .3rem;
  flex: 1 0 .5rem;
  border-radius: 50%;
  position: relative;
}
.account_delete_btn::after {
  position: absolute;
  content: '';
  background: #fff;
  width: 50%;
  height: .1rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
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

<style scoped>
.head-info{
    padding-top: constant(safe-area-inset-top);
    padding-right: constant(safe-area-inset-right);
    padding-left: constant(safe-area-inset-left);
    padding-top: env(safe-area-inset-top);
    padding-right: env(safe-area-inset-right);
    padding-left: env(safe-area-inset-left);
}
.row_header {
  height: 150px;
  background-size: cover;
  background-repeat: repeat;
  position: relative;
}
.row_header_bg {
  position: absolute;
  left: 0;
  top:0;
  border-radius: 0 0 1.2rem 1.2rem;
  background-color: rgb(81, 88, 236);
  height: 5.5rem;
  width: 100%;
  z-index: -1;
}
.head-user {
    padding: .5rem;
}
.head-user>.head-user_avatar{
    width: .9rem;
    border-radius: 50%;
    margin-right: .3rem;
}
.head-user>span{
    color: #eeeeee;
    font-size: .4rem;
    font-weight: bold;
    margin-right: .2rem;
}
.head-user>.head-user_arrow {
    width: .4rem;
}
.head-serve {
    margin-right: .5rem;
    width: .7rem;
}
.assets_card_wrapper{
  padding: 0 .5rem;
}
.assets_card {
  overflow: hidden;
  border-radius: .6rem;
  height: 5rem;
  padding: 0 .4rem;
  color: #fff;
  box-shadow: 0 0 .4rem rgb(81, 88, 236);
  background: url('../../assets/assets/card_bg.png') no-repeat;
  background-size: 100% 100%;
}
.card_row_1{
  padding-top: .4rem;
}
.card_row_1>span {
  color: rgb(228, 228, 228, .8);
  font-size: .4rem;
}
.card_row_1>img{
  width: .7rem;
}
.my_assets>img {
  margin-left: .2rem;
  width: .5rem;
}
.card_row_2{
  font-size: .8rem;
  font-weight: bold;
  padding: .2rem 0;
  margin-bottom: .55rem;
}
.card_row_3>div {
  width: 28%;
  padding: .2rem .3rem;
  box-sizing: border-box;
  border-radius: .4rem;
  background: rgb(228, 228, 228, .1);
  font-size: .4rem;
}
.card_row_3>div>img {
  max-width: 40%;
}

.action_title {
  margin-top: .6rem;
  padding: 0 .5rem;
  font-size: .5rem;
  font-weight: 600;
  color: rgb(64, 64, 64);
}
.tokens_card {
  padding: 0 20px;
  margin: 24px 30px;
  background-color: #fff;
  font-size: .5rem;
  font-weight: bold;
  color: rgb(64, 64, 64);
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
  font-size: .5rem;
  text-align: right;
}
.token_usd {
  font-size: .4rem;
  color: #b0b0b0;
  text-align: right;
}
.addToken{
  margin: 2rem .5rem 0 .5rem;
  background: rgb(81, 88, 236);
  padding: .4rem 0;
  text-align: center;
  color: #fff;
  font-size: .45rem;
  border-radius: .4rem;
}
  /* common style */
.jc_sb-al_c {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.jc_sa-al_c {
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.jc_c-al_c {
    display: flex;
    justify-content: center;
    align-items: center;
}
.al_c{
    display: flex;
    align-items: center;
}
.fd_cln {
    display: flex;
    flex-direction: column;
}
.flx_default {
    display: flex;
    align-items: center;
}
</style>