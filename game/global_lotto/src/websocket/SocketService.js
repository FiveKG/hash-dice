// @ts-check
const logger = require("../common/logger.js").child({ "@": "socket server" });
const io = require('socket.io')();
const { rpc } = require("../job/getTrxAction");
const ApiService = require('./ApiService');
const { psGlobalLottoOpen } = require("../db");
const df = require("date-fns");

/**
 * @type { SocketIO.Namespace }
 */
let block_server;

class SocketService {
  constructor () {
    // this.block_server
  }

  getSocket() {
    // return this.block_server;
  }

  /**
   * 初始化 socket server
   * @param { any } server 
   */
  async initialize(server) {
    const options = { pingTimeout: 100000000 };
    io.attach(server, options);
    this.open();
    await getBlockInfo();
  }

  async open() {
    const namespace = io.of(`/scatter`);
    block_server = io.of(`/block`);
    logger.debug("socket server open......");
    namespace.on('connection', async socket => {
        socketHandler(socket);
    });

    block_server.on('connection', async socket => {
        socket.join('block')
    });
  }

  async close() {
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
}

/**
 * 发送, 监听消息
 * @param { SocketIO.Socket } socket 
 */
function socketHandler(socket) {
  socket.emit('connected');
  socket.on('api', async request => {
    logger.debug("request: ", request);
    // let result = await ApiService.handler(Object.assign({}, request))
    // logger.debug("socketHandler: ", result);
    // socket.emit(result)
  })
}

const socketService = new SocketService();

async function getBlockInfo() {
  try {
    // 获取区块链信息
    const { head_block_num } = await rpc.get_info();
    getBlocks(head_block_num)
  } catch(err) {
    logger.debug('getBlockInfo',err)
    throw err;
  }
}


const openFlag = false;
const openCount = 0;

/**
 * 获取区块链信息
 * @param { number } block_num 
 */
async function getBlocks(block_num) {
  rpc.get_block(block_num).then(res => {
    try {
      // logger.debug("res: ", res.block_num, res.id, res.timestamp);
      block_num++;
      if (!!block_server) {
        block_server.to('block').emit({ type: 'block', result: res });
      }

      const timestamp = df.format(res.timestamp, "mm:ss:SSS");
      if (timestamp === "00:00:000") {
          logger.debug("open: ", timestamp);
          psGlobalLottoOpen.pub({ block_num: block_num });
      }
      // logger.debug("timestamp: ", timestamp);
      // const timestamp = df.format(res.timestamp, "ss:SSS");
      // // 整点开奖
      // if (timestamp === "00:000") {
      //   logger.debug("open: ", timestamp);
      //   psGlobalLottoOpen.pub({ block_num: block_num });
      // }

      getBlocks(block_num);
    } catch (error) {
      // logger.error('getBlocks', error);
    }
  }).catch(err => {
    // logger.error("get_block: ", err);
    getBlocks(block_num);
  })
}

module.exports =  {
  socketService: socketService
}
