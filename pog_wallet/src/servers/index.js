import axios from 'axios';

// var baseURL = 'http://app-api.service.consul';
var baseURL = 'http://wallet.tbg.isecsp.com/api';

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

// 获取配置
const getConfig = (reqData) => {
  const url = '/common/config';
  const data = reqData;
  return getData(url, data);
}

// 汇率
const getCoinRate = (reqData) => {
  const url = '/eos/coin_rate';
  const data = reqData;
  return getData(url, data);
}

// 获取EOS主网的所有代币
const getAllTokens = (reqData) => {
  const url = '/eos/all_tokens';
  const data = reqData;
  return getData(url, data);
}

// EOS转账记录
const getEosTransfers = (reqData) => {
  const url = '/eos/transfer_records';
  const data = reqData;
  return getData(url, data);
}

// 获取激活码和微信客服账号
const activeApply = (reqData) => {
  const url = '/eos/active_apply';
  const data = reqData;
  return postData(url, data);
}

// 获取行情
const getMarkets = (reqData) => {
  const url = '/eos/quotes';
  const data = reqData;
  return getData(url, data);
}

// 获取轮播图
const getAdImg = (reqData) => {
  const url = '/cms/get_carousel_img';
  const data = reqData;
  return getData(url, data);
}

// 获取热门推荐
const getPopular = (reqData) => {
  const url = '/app/popular';
  const data = reqData;
  return getData(url, data);
}

// 获取Dapp列表
const getDappList = (reqData) => {
  const url = '/app/get_type_list';
  const data = reqData;
  return getData(url, data);
}

export {
  getConfig,
  getCoinRate,
  getAllTokens,
  getEosTransfers,
  activeApply,
  getMarkets,
  getAdImg,
  getPopular,
  getDappList,
}