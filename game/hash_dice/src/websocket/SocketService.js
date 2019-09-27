// @ts-check
const logger = require("../common/logger.js").child({ "@": "socket server" });
const io = require('socket.io')();
const { rpc } = require("../job/getTrxAction");
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
    io.attach(server,options);
    this.open();

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



module.exports =  {
  socketService: socketService
}
