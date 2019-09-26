import axios from 'axios';
import store from '../store/store';
import Eos from 'eosjs';
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';

// 封装本地存储方法
const storage = {
  set(key,value){
      let val = value;
      if(typeof(val) === 'object'){
          val = JSON.stringify(val)
      }
      localStorage.setItem(key,val);
  },
  get(key){
      return localStorage.getItem(key);
  },
  remove(key){
      return localStorage.removeItem(key);
  }
}

let str = location.host.split(".");
// var baseURL = location.protocol + '//api.' + str[str.length - 2] + "." + str[str.length - 1];//公网根据路由地址获取API地址
var baseURL = location.protocol + '//192.168.1.141:8089';//App端接口服务器地址
// var baseURL = 'http://luckyhongbao.tbg.isecsp.com';//App端接口服务器地址

// 封装请求方法
const xhr = axios.create({
  baseURL,
  timeout:10000,
});
// post请求,needHeader参数用于判断是否需要认证
const postData = ( url, data, needHeader ) => {
  let headers = {};
  if(needHeader){
      headers = {
          token:storage.get('token')
      }
  }
  return new Promise((resolve,reject)=>{
      xhr({url, data, headers, method:'post'})
      .then(res => {
          resolve(res.data)
      })
      .catch(err => reject(err))
  })
}
// get请求,needHeader参数用于判断是否需要认证
const getData = ( url, params, needHeader ) => {
  let headers = {};
  if(needHeader){
      headers = {
          token:storage.get('token')
      }
  }
  return new Promise((resolve,reject)=>{
      xhr({url, params, headers})
      .then(res => resolve(res.data))
      .catch(err => reject(err))
  })
}

/**
 * Scatter连接
 */
const scatterConnect = () => {
  return new Promise((resolve,reject)=>{
    ScatterJS.scatter.connect("LuckyMoney").then(connected => {
      if(!connected){
        console.log("Scatter连接失败:", connected);
        resolve({code:-1 , desc:'Scatter连接失败'});//Scatter连接失败
      }else{
        store.state.scatter = ScatterJS.scatter;
        console.log("scatter连接成功:", store.state.scatter)
        resolve({code:1 , desc:'scatter连接成功'});
      }
    }).catch(err=>{
      console.log("Scatter连接失败:",err);
      resolve({code:-1 , desc:'Scatter连接失败'});//Scatter连接失败
    });
  })
}
/**
 * Scatter登录
 */
const scatterLogin = () => {
  return new Promise((resolve,reject)=>{
    store.state.scatter.getIdentity({accounts: [store.state.network]}).then(identity => {
      console.log("scatter登录成功:",identity)
      store.state.eosAccount = identity.accounts[0];
      resolve({code:1 , desc:'Scatter登录成功'});//Scatter登录成功
    }).catch(err =>{
      console.log("scatter登录失败:",err);
      if(err.code == 423){
        resolve({code:-2 , desc:'Scatter已锁定'});//Scatter已锁定
      }else if(err.code == 402){
        resolve({code:-3 , desc:'你拒绝了Scatter请求'});//你拒绝了Scatter请求
      }else{
        resolve({code:-4 , desc:'Scatter登录失败'});//Scatter登录失败
      }
    })
  })
}
/**
 * Scatter 获取 EOS余额
 */
const scatterGetBalance = () => {
  return new Promise((resolve,reject)=>{
    const eos = store.state.scatter.eos(store.state.network, Eos);
    eos.getCurrencyBalance(store.state.symbolAccountName, store.state.eosAccount.name, "CLUB").then(tx => {
      console.log("Scatter查询 EOS余额成功:",tx);
      if(tx.length > 0){
        store.state.scatterEosBalance = tx[0];
      }
      resolve({code:1 , desc:'Scatter 查询EOS余额成功'});//Scatter 查询EOS余额成功
    }).catch(error=>{
      console.log("Scatter查询 EOS余额失败:",error);
      resolve({code:-5 , desc:'Scatter 查询EOS余额失败'});//Scatter 查询EOS余额失败
    });
  })
}
/**
 * Scatter一站式操作
 */
const scatterOneStop = () => {
  console.log('执行了3');
  return new Promise( async (resolve,reject)=>{
    var connectResult = await scatterConnect();
    if(connectResult.code != 1){
      console.log('执行了2');
      return resolve(connectResult);//Scatter连接失败
    }
    var loginResult = await scatterLogin();
    if(loginResult.code != 1){
      console.log('执行了1');
      return resolve(loginResult);//Scatter登录失败
    }
    // Api接口登录
    let data = {
      account_name:store.state.eosAccount.name
    }
    // console.log(this.$route)
    // // 有推荐人就发送推荐人建立关系
    // if (this.$route.query.invite) {
    //   data.refer_name = this.$route.query.invite
    // }
    // accountLogin(data).then(res => {
    //   if(res.code == 1){
    //     console.log("Api接口登录成功:",res);
    //     storage.set('token',res.data);
    //     // 获取我的俱乐部
    //     console.log(889,data)
    //     getMyClub("").then(res => {
    //       if(res.code == 1){
    //         console.log("获取我的俱乐部成功:",res);
    //         store.state.myClubId = res.data.club_id;
    //       }else{
    //         console.log("获取我的俱乐部失败:",res)
    //       }
    //       // 获取我的余额
    //       getAccountBalance(data).then(res => {
    //         if(res.code == 1){
    //           console.log("获取用户账号余额成功:",res)
    //           store.state.eosBalance = res.data.balance;
    //         }else{
    //           console.log("获取用户账号余额失败:",res)
    //         }
    //         return resolve({code:1 , desc:'Api接口登录成功'});//Api接口登录成功
    //       }).catch(err =>{
    //         console.log("获取用户账号余额失败:",err);
    //         return resolve({code:1 , desc:'Api接口登录成功'});//Api接口登录成功
    //       });
    //     }).catch(err =>{
    //       console.log("获取我的俱乐部失败:",err);
    //       return resolve({code:1 , desc:'Api接口登录成功'});//Api接口登录成功
    //     });
    //   }else{
    //     console.log("Api接口登录失败:",res);
    //     return resolve({code:-6 , desc:'Api接口登录失败'});//Api接口登录失败
    //   }
    // }).catch( err => {
    //   return resolve({code:-6 , desc:'Api接口登录失败'});//Api接口登录失败
    // });
  })
}
/**
 * 格式化时间
 */
const  dateFormat = (date , fmt) => {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}
const  padLeftZero = (str) => {
  return ('00' + str).substr(str.length);
}
// 获取基础配置
const getConfig = (data) => {
  const url = '/common/config';
  return getData(url,data,false);
}
// 用户登录
const accountLogin = (data) => {
  const url = '/account/login';
  return postData(url,data,false);
}
// 获取用户账号余额
const getAccountBalance = (data) => {
  const url = '/account/get_balance';
  return getData(url,data,true);
}
// 获取用户俱乐部
const getMyClub = (data) => {
  const url = '/account/myclub';
  return getData(url,data,true);
}
// 获取用户加入的俱乐部信息
const getJoinedClub = (data) => {
  const url = '/club/get_account_club';
  return getData(url,data,true);
}
// 加入俱乐部
const joinClub = (data) => {
  const url = '/club/join';
  return postData(url,data,true);
}
// 获取官方俱乐部房间信息
const getOfficeRoomInfo = (data) => {
  const url = '/club/get_office_room';
  return getData(url,data,true);
}
// 获取俱乐部信息
const getClubInfo = (data) => {
  const url = '/club/summary';
  return getData(url,data,true);
}
// 获取房间中的红包
const getRoomRedPack = (data) => {
  const url = '/room/get_red_envelope';
  return getData(url,data,true);
}
// 创建俱乐部
const createClub = (data) => {
  const url = '/club/create';
  return postData(url,data,true);
}
// 创建红包房间
const createRoom = (data) => {
  const url = '/room/create';
  return postData(url,data,true);
}
// 检查用户是否已经抢过该红包
const checkPack = (data) => {
  const url = '/room/check_snatched';
  return getData(url,data,true);
}
// 抢红包
const openPack = (data) => {
  const url = '/room/snatch_red_envelope';
  return postData(url,data,true);
}
// 监听到 WebSocket 返回的抢红包结果后 , 发送调试信息
const debugTest = (data) => {
  const url = '/common/test_log';
  return getData(url,data,true);
}
// 邀请好友
const inviteFriend = (data) => {
  const url = '/account/add_referrer';
  return postData(url,data,true);
}
// 余额提现
const WithDraw = (data) => {
  const url = '/account/withdraw';
  return postData(url,data,true);
}
// 获取用户余额变动日志列表
const getAccountLog = (data) => {
  const url = '/account_balance_log/search';
  return getData(url,data,true);
}
// 获取我的下线
const getReferrals = (data) => {
  const url = '/account/get_lower_list';
  return getData(url,data,true);
}
// 获取图片验证码
const getVerifCode = (data) => {
  const url = '/common/verify_code';
  return getData(url,data,true);
}

// 检查是否有上线
const setCheckRelation = (data) => {
  const url = '/account/check_relation';
  return postData(url, data, true);
}
// 获取分红池
const getBonusPool = (data) => {
  const url = '/game/bonus_pool';
  return getData(url, data, true);
}
// 获取我的分红
const getMyBonus = (data) => {
  const url = '/account/my_bonus';
  return getData(url, data, true);
}
// 获取已空投的代币数量
const getAirdropAmount = (data) => {
  const url = '/game/airdrop_amount';
  return getData(url, data, true);
}
// 获取俱乐部排行榜
const getLeaderboard = (data) => {
  const url = '/club/leaderboard';
  return getData(url, data, true);
}
// 获取奖金排行榜
const getrewardLeaderboard = (data) => {
  const url = '/account/reward_leaderboard';
  return getData(url, data, true);
}
// 获取我的奖金列表
const getMyRewardList = (data) => {
  const url = '/account/my_reward_list';
  return getData(url, data, true);
}




// 导出
export {
  baseURL,//api服务器地址
  storage,// 本地存储方法
  getConfig,// 获取基础配置
  accountLogin,// 用户登录
  getAccountBalance,// 获取用户账号余额
  getMyClub ,// 获取用户俱乐部
  getJoinedClub,// 获取用户加入的俱乐部信息
  joinClub,// 加入俱乐部
  getOfficeRoomInfo,// 获取官方俱乐部房间信息
  getClubInfo,// 获取俱乐部信息
  getRoomRedPack,// 获取房间中的红包
  createClub,// 创建俱乐部
  createRoom,// 创建红包房间
  checkPack,// 检查用户是否已经抢过该红包
  openPack,// 抢红包
  debugTest,//监听到 WebSocket 返回的抢红包结果后 , 发送调试信息
  inviteFriend,//邀请好友
  WithDraw,// 余额提现
  getAccountLog,// 获取用户余额变动日志列表
  scatterOneStop,//Scatter一站式登录
  dateFormat,//格式化时间
  getReferrals,//获取我的下线
  getVerifCode,//获取图片验证码

  setCheckRelation, //检查是否有上线
  getBonusPool,// 获取分红池
  getMyBonus,// 获取我的分红
  getAirdropAmount,// 获取已空投的代币数量
  getLeaderboard,// 获取俱乐部排行榜
  getrewardLeaderboard,// 获取奖金排行榜
  getMyRewardList,// 获取我的奖金列表
}
