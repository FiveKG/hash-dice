
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    navigator: {
      strict: true,
      namespaced: true,
      state: {
        stack: []
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
        discoverSwiper: []
      },
      mutations: {
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
        }
      }
    }
  }
})