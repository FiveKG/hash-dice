const http = require('http');
const io = require('socket.io')();
const AppService = require('./AppService');
// const appModule = require('../models/AppModule');
// const cordova = require('cordova-bridge');

const socketHandler = (socket) => {

    socket.on('app', async request => {
        // console.log('app',request);
        const result = await AppService.handler(Object.assign({},request))
        // console.log('result',result)
        socket.emit(result);
    })

    socket.on('api', async request => {
        // console.log('api',request);
        socket.emit('api', await AppService.handleScatter(Object.assign(request.data, {plugin:request.plugin})));
    })

    socket.on('pair', async request => {
        // console.log('pair',request.data)
        socket.emit('paired', true);
    })
}

let instance
class SocketService {
    static async initialize() {
        const ip = '127.0.0.1';
        const httpServer = http.createServer();
        httpServer.listen(50005, ip);
        io.attach(httpServer,{ pingTimeout:600000000 });
        this.open()
    }

    static async open() {
        const namespace = io.of(`/scatter`);
        console.log("socket server open......");
        // cordova.channel.send('serverOpen')
        namespace.on('connection', socket => {
            console.log("client connection");
            socketHandler(socket);
        });
        io.of('/app').on('connection', socket => {
            console.log('my connection')
            // appModule.socket = socket
        })
    }

    static async close() {
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

module.exports = SocketService
