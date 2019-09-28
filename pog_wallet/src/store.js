
import Vue from 'vue'
import Vuex from 'vuex'
import Api from '@/servers/invitation';
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    navigator: {
      strict: true,
      namespaced: true,
      state: {
        stack: [],
        
      },
      mutations: {
        reset (state, page) {
          state.stack = Array.isArray(page) ? page : [page || state.stack[0]];
        },
        push (state, page) {
          state.stack.push(page);
        }
      }
    },
    wallet: {
      strict: true,
      namespaced: true,
      state: {
        tbgIsBind: false,

        fingerprintAuth: false,
        fingerprintToken: '',
        cacheFingerprint: [],
        localFile: {
          wallets: [],
          contacts: []
        },
        stack: [],
        walletChain: 'EOS',
        schemaChain: '',
        selectedTab: 'assets',
        signatureData: null,
        signatureRequest: null,
        config: {},
        currency: 'USD',
        assets: null,
        selectToken: {
          symbol: 'EOS'
        },
        selectEthToken: {
          symbol: 'ETH'
        },
        discoverSwiper: [],

        //滚动区域
        block: {},
      },
      mutations: {
        setTbgBindStatus(state, status) {
          state.tbgIsBind = status;
        },
        setSchemaChain(state, schemaChain) {
          state.schemaChain = schemaChain;
        },
        setFingerprintAuth(state, fingerprintAuth) {
          state.fingerprintAuth = fingerprintAuth;
        },
        setFingerprintToken(state, fingerprintToken) {
          const wallets = state.cacheFingerprint
          for (let item of wallets) {
            if (state.assets.chain === 'eos') {
              if (item.publicKey === state.assets.publicKey) {
                item.fingerprintToken = fingerprintToken
                state.fingerprintToken = fingerprintToken;
              }
            }
            if (state.assets.chain === 'eth') {
              if (item.address === state.assets.address) {
                item.fingerprintToken = fingerprintToken
                state.fingerprintToken = fingerprintToken;
              }
            }
          }
        },
        changeFingerprintToken(state, fingerprintToken) {
          state.fingerprintToken = fingerprintToken
        },
        setLocalFile(state, localFile) {
          state.localFile = localFile;
        },
        setCacheFingerprint(state, cacheFingerprint) {
          state.cacheFingerprint = cacheFingerprint;
        },
        setStack(state, stack) {
          state.stack = stack;
        },
        setWalletChain(state, walletChain) {
          state.walletChain = walletChain;
        },
        setSelectedTab(state, selectedTab) {
          state.selectedTab = selectedTab;
        },
        setSignatureData(state, signatureData) {
          state.signatureData = signatureData;
        },
        setSignatureRequest(state, signatureRequest) {
          state.signatureRequest = signatureRequest;
        },
        setConfig(state, config) {
          state.config = config;
        },
        setCurrency(state, currency) {
          state.currency = currency;
        },
        setAssets(state, assets) {
          state.assets = assets;
        },
        setSelectToken(state, selectToken) {
          state.selectToken = selectToken;
        },
        setSelectEthToken(state, selectEthToken) {
          state.selectEthToken = selectEthToken;
        },
         //滚动区域
         setBlock(state, data) {
          state.block = data;
        }
      }
    },
    gameMinuteLottery: {
      strict: true,
      namespaced: true,
      state: {
        // 区块列表
        blockList:[],
      },
      mutations: {
        // 添加区块信息
        pushBlock(state, block) {
          var date = new Date(block.result.timestamp);
          var hour = Number(date.getHours()+8) < 10 ? "0" + Number(date.getHours()+8) : Number(date.getHours()+8);
          var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
          var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
          var minsecond = String(date.getMilliseconds()).substr(0, 1);
          block.result.timestamp = `${hour}:${minute}:${second}.${minsecond}`;
          state.blockList.push(block.result);
        },
      }
    },
    welcomePage: {
      strict: true,
      namespaced: true,
      state: {
        // 是不是第一次启动
        isFirst: true
      },
      mutations: {
        setWelcomeStatus (state, status) {
          state.isFirst = status
        }
      }
    },
    profit: {
      strict: true,
      namespaced: true,
      state: {
        // 是不是第一次启动
        refferIncome: '',
        modeIncome: '',
        sortIncome: '',
        otherIncome: '',
        totalIncome: ''
      },
      mutations: {
        setRefferIncome (state, income) {
          state.refferIncome = income
        },
        setModeIncome (state, income) {
          state.modeIncome = income
        },
        setSortIncome (state, income) {
          state.sortIncome = income
        },
        setOtherIncome (state, income) {
          state.otherIncome = income
        },
        setTotalIncome (state, income) {
          state.totalIncome = income
        }
      },
      actions: {
        fetchRefferIncome ({commit}, accName) {
          Api.incomeReferrer({account_name: accName})
          .then( res => {
            if (res.code === 1) {
              commit('setRefferIncome', res.data)
            }
          })
        },
        setModeIncome ({commit}, accName) {
          Api.incomeMode({account_name: accName})
          .then( res => {
            if (res.code === 1) {
              commit('setModeIncome', res.data)
            }
          })
        },
        setSortIncome ({commit}, accName) {
          Api.incomeSort({account_name: accName})
          .then( res => {
            if (res.code === 1) {
              commit('setSortIncome', res.data)
            }
          })
        },
        setOtherIncome ({commit}, accName) {
          Api.incomeOther({account_name: accName})
          .then( res => {
            if (res.code === 1) {
              commit('setOtherIncome', res.data)
            }
          })
        },
      }
    }
  }
})