import axios from 'axios';

// var baseURL = 'http://172.81.224.11/api';
// var baseURL = 'http://192.168.1.135:9527';

var baseURL = 'http://192.168.1.141:13025';//本地
// var baseURL = 'http://treasure.tbg.isecsp.com';//测试

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
// 获取游戏的种类和名称
const getGameData = (reqData) => {
  const url = '/snatch_treasure/game_name';
  const data = reqData;
  return getData(url, data);
}
//获取夺宝期数信息
const getTreasureBettin = (reqData) => {
  const url = '/snatch_treasure/game_session';
  const data = reqData;
  return getData(url, data);
}
//获取所有期数及开奖信息
const getAllData = (reqData) => {
  const url = '/snatch_treasure/game_session_info';
  const data = reqData;
  return getData(url, data);
}
//获取某一期开奖详情
const getSomeLotteryDetails = (reqData) => {
  const url = '/snatch_treasure/game_session_detail';
  const data = reqData;
  return getData(url, data);
}
//获取当前用户投注的信息
const getUserBettingData = (reqData) => {
  const url = '/snatch_treasure/game_session_mine';
  const data = reqData;
  return getData(url, data);
}
//获取当前用户某一期投注的详情
const getSomeUserBettingData = (reqData) => {
  const url = '/snatch_treasure/game_session_mine_detail';
  const data = reqData;
  return getData(url, data);
}
//投注
const Betting = (reqData) => {
  const url = '/snatch_treasure/bet';
  const data = reqData;
  return postData(url, data);
}










export default{
  getConfig,
  getGameData,
  getTreasureBettin,
  getAllData,
  getSomeLotteryDetails,
  getUserBettingData,
  getSomeUserBettingData,
  Betting,

  
}