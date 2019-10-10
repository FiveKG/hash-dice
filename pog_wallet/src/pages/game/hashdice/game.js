import axios from 'axios';

// var baseURL = 'http://172.81.224.11/api';
// var baseURL = 'http://192.168.1.135:9527';

// var baseURL = 'http://192.168.1.145:13022';//本地
var baseURL = 'http://hash_dice.tbg.isecsp.com';//测试

const xhr = axios.create({
    baseURL,
    timeout: 10000,
});

// post请求,needHeader参数用于判断是否需要认证
const postData = (url, data, needHeader) => {
    let headers = {};
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
// 获取庄家的额度
const bankerQuota = (reqData) => {
  const url = '/hash_dice/banker';
  const data = reqData;
  return getData(url, data);
}
//获取当前用户的信息
const getCurrentUser = (reqData) => {
  const url = '/hash_dice/game_rate';
  const data = reqData;
  return getData(url, data);
}
//获取所有的投注
const getAllBets = (reqData) => {
  const url = '/hash_dice/bet_list';
  const data = reqData;
  return getData(url, data);
}
//获取某个用户投注的列表
const getSomeUserBettingList = (reqData) => {
  const url = '/hash_dice/bet_list_mine';
  const data = reqData;
  return getData(url, data);
}
//获取用户某个投注的详情
const getSomeUserBettingListBetting = (reqData) => {
  const url = '/hash_dice/bet_list_mine';
  const data = reqData;
  return getData(url, data);
}
//投注
const Betting = (reqData) => {
  const url = '/hash_dice/bet';
  const data = reqData;
  return postData(url, data);
}










export default{
  getConfig,
  bankerQuota,
  getCurrentUser,
  getAllBets,
  getSomeUserBettingList,
  getSomeUserBettingListBetting,
  Betting,

  
}