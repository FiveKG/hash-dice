// @ts-check
const http = require('http');
const io = require('socket.io')();
const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch');                                // node only
const { TextDecoder, TextEncoder } = require('util');               // node only
const { format } = require('date-fns')
const ApiService = require('./ApiService');
const https = require('https')

const config = {
  httpEndpoint: 'http://45.251.109.187:8888',
  chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  keyProvider: '5Hq8tWbkGxg4GxEb9zFJfnGzXQWv4yeub1gHbpPmoW6JvonHFvb'
}

// @ts-ignore
const rpc = new JsonRpc(config.httpEndpoint, { fetch });

let block_server;
let block_num = 0;

const getBlocks = async () => {
  rpc.get_block(block_num).then(res => {
    try {
      // console.debug("res: ", res);
      block_num++;
      if (block_server) {
        block_server.to('block').emit({type: 'block', result: res})
      }
      const block_time = convertUTCDateToLocalDate(new Date(res.timestamp));
      const second = format(block_time,'ss:S')
      getBlocks()
    } catch (error) {
      console.log('getBlocks',error)
    }
  }).catch(err => {
    getBlocks()
  })
}

const getBlockInfo = async () => {
  try {
    // 获取区块链信息
    const { head_block_num, head_block_time } = await rpc.get_info()
    block_num = head_block_num;
    getBlocks()
  } catch(err) {
    console.log('getBlockInfo',err)
  }
}

const convertUTCDateToLocalDate = (date) => {
  let newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
  let offset = date.getTimezoneOffset() / 60;
  let hours = date.getHours();

  newDate.setHours(hours - offset);

  return newDate;
}

const socketHandler = (socket) => {
  socket.emit('connected');
  socket.on('api', async request => {
    console.debug("request: ", request);
    // let result = await ApiService.handler(Object.assign({}, request))
    // console.log("socketHandler: ", result);
    // socket.emit(result)
  })
}

let SocketService = function() {
  
}

SocketService.prototype.initialize =  async function() {
  const options = { pingTimeout: 100000000 };
  const ip = '0.0.0.0';

  // HTTP protocol (port 50005)
  const httpServer = http.createServer();
  httpServer.listen(50007, ip);
  io.attach(httpServer,options);
  this.open()
}

SocketService.prototype.open = function(){
  const namespace = io.of(`/scatter`);
  block_server = io.of(`/block`)
  console.log("socket server open......");
  getBlockInfo();
  // getBlocks();

  namespace.on('connection', async socket => {
      socketHandler(socket);
  });
  block_server.on('connection', async socket => {
      // block_server = socket
      // socketHandler(socket);
      socket.join('block')
  });
}

SocketService.prototype.close = async function(){
  // Getting namespace
  if(!io) return;
  const socket = io.of(`/scatter`);

  // Disconnecting all active connections to this namespace
  Object.keys(socket.connected).map(socketId => {
      socket.connected[socketId].disconnect();
  });

  // Removing all event emitter listeners.
  socket.removeAllListeners();

  // Deleting the namespace from the array of
  // available namespaces for connections
  delete io.nsps[`/scatter`];

  return true;
}

module.exports =  {
  socketService: new SocketService()
}
