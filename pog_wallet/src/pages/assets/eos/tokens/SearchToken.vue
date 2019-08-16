<template>
  <vpage>
    <slot>
      <div class="header">
        <div class="item_search">
          <img src="@/assets/img/addToken_search.png">
          <input type="search" :placeholder="$t('assets.search_token')" class="text-input search" v-model="search">
        </div>
        <div class="item_cancel" @click="clickCancel">
          <span class="cancel">{{$t('common.cancel')}}</span>
        </div>
      </div>
      <div ref="mescroll" class="mescroll">
        <div>
          <div class="token" v-for="item in tokens">
            <img class="token_icon" :src="item.logo" v-if="item.logo">
            <img class="token_icon" src="@/assets/img/question.png" v-else>
            <div class="token_text">
              <div class="token_name">{{item.symbol}}</div>
              <div class="token_contract">{{item.account_name}}</div>
            </div>
            <img class="btn" src="@/assets/img/addToken_true.png" @click="clickCheck(item)" v-if="item.checked">
            <img class="btn" src="@/assets/img/addToken_add.png" @click="clickCheck(item)" v-else>
          </div>
        </div>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import MeScroll from 'mescroll.js'
import 'mescroll.js/mescroll.min.css'
import { getAllTokens } from '@/servers'
import { writeFile } from '@/storage.js'

export default {
  components: {
    vpage: MyPage
  },
  data() {
    return {
      mescroll: null,
      wallet: {},
      tokens: [],
      search: '',
      page: 0
    }
  },
  async mounted() {
    // console.log(this.$store.state.wallet.assets)
    this.wallet = this.$store.state.wallet.assets
    this.mescroll = new MeScroll(this.$refs.mescroll, {
      down: {
        auto: false,
        callback: this.downCallback
      },
      up: {
        callback: this.upCallback
      }
    })
  },
  destroyed() {
    this.$store.commit('wallet/setAssets', null)
  },
  watch: {
    search(newVal) {
      this.searchToken()
    }
  },
  methods: {
    async searchToken() {
      // 输入框变化时，重置页码和列表再发送请求
      this.page = 1
      this.tokens = []
      this.loadData()
    },
    async loadData() {
      try {
        
        const res = await getAllTokens({symbol:this.search.toUpperCase(),page:this.page, limit:20})
        for (let item of res.data) {
          const temp = this.wallet.tokens.find(ele => (ele.account_name === item.account_name && ele.symbol === item.symbol))
          if (temp) {
            item.checked = true
          } else {
            item.checked = false
          }
          this.tokens.push(item)
        }
        this.mescroll.endSuccess(res.data.length)
      } catch (error) {
        console.log(error)
      }
    },
    upCallback() {
      this.page += 1
      this.loadData()
    },
    downCallback() {
      this.page = 1
      this.loadData()
    },
    async clickCheck(item) {
      item.checked = !item.checked
      const localFile = this.$store.state.wallet.localFile
      const wallets = localFile.wallets
      const currentWallet = wallets.find(ele => ele.accountNames[0] === this.wallet.account)
      if (item.checked) {
        currentWallet.tokenList.push(item)
      } else {
        const index = currentWallet.tokenList.findIndex(ele => (ele.account_name === item.account_name && ele.symbol === item.symbol))
        if (index !== -1) {
          currentWallet.tokenList.splice(index,1)
        }
      }
      console.log(this.$store.state.wallet.localFile)
      localStorage.setItem('isecsp_wallet',JSON.stringify(localFile))
      // if (!this.$store.state.wallet.debug) {
      //   writeFile(localFile).then(res => {
      //     console.log(res)
      //   }).catch(err => {
      //     console.log(err)
      //   })
      // }
    },
    clickCancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.header {
  position: fixed;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  font-size: 30px;
  padding-left: 56px;
  box-sizing: border-box;
  border-bottom: 1PX solid #dfdfdf;
}
.item_search {
  flex: 1;
  display: flex;
  padding: 0 36px;
  align-items: center;
  background-color: #efefef;
  height: 76px;
  border-radius: 35px;
}
.item_search img {
  width: 40px;
  height: 40px;
}
.item_search input {
  height: 100%;
  width: 100%;
  font-size: 24px;
  margin-left: 18px;
}
.item_cancel {
  padding: 0 56px;
}
.mescroll {
  position: fixed;
  top: 100px;
  bottom: 0;
  height: auto;
}
.token {
  display: flex;
  align-items: center;
  padding: 38px 56px;
}
.token_text {
  margin-left: 38px;
  flex: 1;
}
.token_name {
  line-height: 1.5;
  font-size: 34px;
}
.token_contract {
  font-size: 22px;
  line-height: 1.5;
  color: grey;
}
.token_icon {
  width: 90px;
  height: 90px;
}
.btn {
  width: 52px;
  height: 52px;
}
</style>
