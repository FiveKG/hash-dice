import Eos from 'eosjs'

const config = {
  chainId: '483c1c3c33ceaf2bd2264c2266807938addfe471ace2f7accda713d8c39b699d', // 32 byte (64 char) hex string
  httpEndpoint: 'http://45.251.109.187:8888',
  expireInSeconds: 60
}

export default Eos(config)