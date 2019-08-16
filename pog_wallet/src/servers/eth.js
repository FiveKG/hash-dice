import axios from 'axios';

var baseURL = 'https://api.etherscan.io/api';

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
const getData = (params, needHeader) => {
  let headers = {};
  return new Promise((resolve, reject) => {
    xhr({params, headers })
      .then(res => resolve(res.data))
      .catch(err => reject(err))
  })
}

const getabi = reqData => {
  const data = {
    module: 'contract',
    action: 'getabi',
    apikey: 'VUDCK19I8D3NNT5Y9UHKIGC12MZ16ZS91C',
    address: reqData.address
  }
  return getData(data);
}

export {
  getabi
}