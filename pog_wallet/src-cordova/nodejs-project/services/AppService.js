const appModule = require('../models/AppModule')
const EOS = require('../plugins/defaults/eos')

let signaturePromise = null
let signatureRequest = null

class AppService {
    static async handler(request){
        // console.log(request);
        return await this[request.type](request.data);
    }
    static async handleScatter(request){
        // console.log(request);
        return await this[request.type](request);
    }

    static async setAccount(data) {
        appModule.account = data
        console.log('setAccount',data)
    }

    static async simpleLogin(data) {
        console.log('simpleLogin',data)
        const obj = JSON.parse(data)
        // const obj = data
        const params = {
            protocol: obj.protocol,
            version: obj.version,
            // timestamp: timestamp,
            // sign: sign,
            uuID: obj.uuID,
            account: obj.account,
            ref: 'yzwallet'
        }
        var options = {
            method: 'POST',
            uri: obj.loginUrl,
            body: params,
            json: true // Automatically stringifies the body to JSON
        };
        const rp = require('request-promise');
        try {
            const res = await rp(options)
            console.log(res)
            return res
        } catch (error) {
            return { code: 500, error: error }
        }
    }

    static async signTranstion(data) {
        // console.log('signTranstion',data)
        if (!data) {
            signaturePromise.resolve({id:signatureRequest.id, result:null})
            return
        }
        signaturePromise.resolve({id:signatureRequest.id, result:{signatures:data, returnedFields:{}}})
    }

    /**
     * identityFromPermissions
     * @param {*} request 
     */
    static async identityFromPermissions(request) {
        return {id:request.id};
    }

    /**
     * 获取身份
     * @param {*} request 
     */
    static async getOrRequestIdentity(request) {
        return new Promise((resolve) => {
            if (appModule.account) {
                resolve({id:request.id, result: {accounts:[{name:appModule.account,authority:'active',blockchain:'eos'}]}})
            } else {
                resolve({id:request.id, result: {}})
            }
        })
    }

    /**
     * 请求签名
     * @param {*} request 
     */
    static async requestSignature(request) {
        // console.log('requestSignature')
        return new Promise(async (resolve, reject) => {
            signatureRequest = request
            signaturePromise = {resolve}
            const {payload} = request;
            // console.log(payload.transaction)
            const eos = new EOS()
            const messages = await eos.requestParser(payload)
            const socket = appModule.socket
            if (socket) {
                socket.emit({
                    type: 'requestSignature',
                    data: messages,
                    request
                })
            } else {
                console.log('socket',socket)
            }
        })
    }

    static async requestTransfer(request) {
        console.log('requestTransfer',request)
    }
}

module.exports = AppService