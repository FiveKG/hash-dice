import Vue from 'vue'
import Vuex from 'vuex';


Vue.use(Vuex);

const state = {
  scatter:null,//存放scatter对象
  sideBar:false,//控制是否展示侧边栏
  joinDialog:true,//控制是否展示快速加入弹窗
  rechargeDialog:false,//控制是否展示POG充值弹窗
  collectionAccount:'',//POG收款账号
  network:{
    blockchain:'eos',
    chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    host:'nodes.get-scatter.com',
    port:443,
    protocol:'https'
  },//链信息
  eosAccount:null,//eos账号信息
  eosBalance:0.0000,//eos账号余额
  rbBalance:0.0000,//rb余额
  clubId:'',//用户当前加入的俱乐部id
  roomId:'',//用户当前加入的红包房间Id
  roomType:'',//用户当前加入的红包房间类型 , 几人抢
  roomAmount:'',//用户当前加入的红包房间红包金额
  myClubId:'',//用户创建的俱乐部id
  socket: null,//websocket对象
  symbolAccountName: null,// 发行代币的用户
  scatterEosBalance:"0.0000 CLUB",// scatter 查询到的 eos 余额
  balanceChangeType:0,//
  configIsOk:0,//是否已获取到基础配置信息
}

let mutations = {
  setScatter(state, data) {
    state.scatter = data
  },
  setSideBar(state, data) {
    state.sideBar = data
  },
  setJoinDialog(state, data) {
    state.joinDialog = data
  },
  setRechargeDialog(state, data) {
    state.rechargeDialog = data
  },
  setCollectionAccount(state, data) {
    state.collectionAccount = data
  },
  setEosAccount(state, data) {
    state.eosAccount = data
  },
  setEosBalance(state, data) {
    state.eosBalance = data
  },
  setRbBalance(state, data) {
    state.rbBalance = data
  },
  setClubId(state, data) {
    state.clubId = data
  },
  setNetwork(state, data) {
    state.network = data
  },
  setMyClubId(state, data) {
    state.myClubId = data
  },
  setRoomId(state, data) {
    state.roomId = data
  },
  setSocket(state, data) {
    state.socket = data
  },
  setRoomType(state, data) {
    state.roomType = data
  },
  setRoomAmount(state, data) {
    state.roomAmount = data
  },
  setScatterEosBalance(state, data) {
    state.scatterEosBalance = data
  },
  setBalanceChangeType(state, data) {
    state.balanceChangeType = data
  },
  setConfigIsOk(state, data) {
    state.configIsOk = data
  },
  setSymbolAccountName(state, data) {
    state.symbolAccountName = data
  }

}


export default new Vuex.Store({
  state,
  mutations,
  // getters,
  // actions
})
