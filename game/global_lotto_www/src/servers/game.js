import axios from 'axios';
import store from '../store';

// var baseURL = 'http://172.81.224.11/api';
// var baseURL = 'http://192.168.1.135:9527';

var baseURL = 'http://global_lotto.tbg.isecsp.com';
// var baseURL = 'http://192.168.1.141:13021';

const xhr = axios.create({
    baseURL,
    timeout: 10000,
});

// post请求,needHeader参数用于判断是否需要认证
const postData = (url, data, needHeader) => {
    let headers = {};
    if(needHeader){
      headers = {
        token:store.state.wallet.gameToken
      }
    }
    return new Promise((resolve, reject) => {
        xhr({ url, data, headers, method: 'post' })
            .then(res => {
                resolve(res.data)
            })
            .catch(err => reject(err))
    })
}

// get请求,needHeader参数用于判断是否需要认证
const getData = (url, params, needHeader) => {
    let headers = {};
    if(needHeader){
      headers = {
        token:store.state.wallet.gameToken
      }
    }
    return new Promise((resolve, reject) => {
        xhr({ url, params, headers })
            .then(res => resolve(res.data))
            .catch(err => reject(err))
    })
}

// 获取配置
const getConfig = (reqData) => {
        const url = '/config/get_config';
        const data = reqData;
        return getData(url, data);
    }

// 获取当前用户的信息
const getUser = (reqData) => {
  const url = '/account/info';
  const data = reqData;
  return getData(url, data);
}

// 获取全球彩奖池，倒计时，期数
const getOpen= (reqData) => {
  const url = '/global_lotto/info';
  const data = reqData;
  return getData(url, data);
}


// 最新一期开奖情况
const getOneWeek = (reqData) => {
  const url = '/global_lotto/latest_game_session';
  const data = reqData;
  return getData(url, data);
}

// 获取所有期数及开奖信息
const getOpenlist = (reqData) => {
  const url = '/global_lotto/game_session';
  const data = reqData;
  return getData(url, data);
}

// 获取某一期开奖详情
const getMessageOne = (reqData) => {
  const url = '/global_lotto/game_session_detail';
  const data = reqData;
  return getData(url, data);
}

// 获取当前用户投注的信息
const getUserBet = (reqData) => {
  const url = '/global_lotto/game_session_mine';
  const data = reqData;
  return getData(url, data);
}

// 获取当前用户某一期投注的详情
const getUserBetWeek = (reqData) => {
  const url = '/global_lotto/game_session_mine_detail';
  const data = reqData;
  return getData(url, data);
}

// 投注
const getBetting = (reqData) => {
  const url = '/global_lotto/bet';
  const data = reqData;
  return postData(url, data , true);
}

// 随机投注
const getRandomBetting = (reqData) => {
  const url = '/global_lotto/random_bet';
  const data = reqData;
  return postData(url, data , true);
}








export default{
  getConfig,
  getUser,
  getOpen,
  getOneWeek,
  getOpenlist,
  getMessageOne,
  getUserBet,
  getUserBetWeek,
  getBetting,
  getRandomBetting,
}