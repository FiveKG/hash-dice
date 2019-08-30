import Eos from 'eosjs'

// const config = {
//     chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906', // 32 byte (64 char) hex string
//     httpEndpoint: 'https://nodes.get-scatter.com:443',
//     expireInSeconds: 60
// }

const config = {
    chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f', // 32 byte (64 char) hex string
    httpEndpoint: 'http://192.168.1.152:8888',
    expireInSeconds: 60
}

export default Eos(config)