import Eos from 'eosjs'

const config = {
  chainId: '483c1c3c33ceaf2bd2264c2266807938addfe471ace2f7accda713d8c39b699d', // 32 byte (64 char) hex string
  httpEndpoint: 'http://45.251.109.187:8888',
  expireInSeconds: 60
}
// const config = {
//   keyProvider:["5J2GxxF4xCfAZjP9R26jwnVY8rp8FYqXRE1fJPq5KDMSxa5NRuW","5K3LFVo36rAYBuAGC1UQmrZtrtvLkuWVYQ6TyhzwBgB2DpHo4zB"],
//   chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f', // 32 byte (64 char) hex string
//   httpEndpoint: 'http://192.168.1.141:8888',
//   expireInSeconds: 60
// }
export default Eos(config)