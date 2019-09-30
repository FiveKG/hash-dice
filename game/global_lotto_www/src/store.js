import Vue from 'vue'
import Vuex from 'vuex'
import { format, parse } from 'date-fns'
import {Decimal} from 'decimal.js';
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    wallet: {
      strict: true,
      namespaced: true,
      state: {
        //滚动区域
        block: [],
        // 账号名
        account: 'gametestuser',
        // 游戏token
        gameToken: '',
        // 私钥
        privateKey: '',
        // 基础配置
        config: {},
      },
      mutations: {
        //滚动区域
        setBlock(state, data) {
          if( state.block.length == 0){
            data.timestamp = format(data.timestamp, 'HH:mm:ss:S');
            data.id = '...'+ data.id.slice(45);
            state.block.unshift(data);
            state.block.splice(10);
          }else if(data.block_num != state.block[0].block_num){
            data.timestamp = format(data.timestamp, 'HH:mm:ss:S');
            data.id = '...'+ data.id.slice(45);
            state.block.unshift(data);
            state.block.splice(10);
          }
        },
        // 设置账号名
        setAccount(state, data) {
          state.account = data;
        },
        // 设置游戏token
        setGameToken(state, data) {
          state.gameToken = data;
        },
        // 设置私钥
        setPrivateKey(state, data) {
          state.privateKey = data;
        },
        // 设置基础配置
        setBaseConfig(state, data) {
          state.config = data;
        }
       }
    },
  }
})