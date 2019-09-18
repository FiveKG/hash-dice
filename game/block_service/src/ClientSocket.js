// import store from '../store/store'
// @ts-check
const WebSocket = require('ws');
// const url = 'ws://localhost:8080'
// const connection = new WebSocket(url)
const suffix = '/socket.io/?EIO=3&transport=websocket';
let socket = null;
let pairingPromise = null;
let connError = false;

const send = (data = null) => {
if(data === null) {
    socket.send('40/scatter');
    socket.send('40/block');
  } else {
    socket.send('42/scatter,' + JSON.stringify(['api', data]));
  }
}

class ClientSocket {
	static getSocket() {
		return socket
	}
	 
	static link() {
		return new Promise(async (resolve, reject) => {
			const setupSocket = () => {
				socket.onmessage = msg => {
					if (msg.data.indexOf('42/block') !== -1) {
						console.log("msg.data: ", msg.data);
						const [ block ] = JSON.parse(msg.data.replace('42/block,', ''));
						// console.log("block: ", block);
						if (block.type == 'block') {
							console.log('block', block)
							// socket.send('setBlock', block.result)
						}
					}
					if(msg.data.indexOf('42/scatter') === -1) return false;
					const [ data ] = JSON.parse(msg.data.replace('42/scatter,', ''));
					console.debug("data: ", data);
					if (data.type) {
						if ( data.type == 'reward') {
							// 开奖号码
							// let rewards = data.rewards
							// rewards.award_num = data.rewards.award_num.join(' ')
							// console.log(rewards)
							// socket.commit('setReward', rewards)
						}
						if (data.type == 'transfer') {
							// store.commit('setTransfer', data.result)
						}
						if (data.type == 'bet') {
							// store.commit('setBetRecord', data.result)
						}
						
					}
					if (pairingPromise) {
						// console.log(data.type)
						pairingPromise.resolve(data);
					}
				}
			}

			const trySocket = () => {
				// const host = `wss://lottery-api.eoscrown.com${suffix}`;
				// const host = `ws://192.168.1.141:13021${suffix}`;
				// const host = `ws://global_lotto.tbg.isecsp.com${suffix}`;
				const host = `ws://hash_dice.tbg.isecsp.com${suffix}`;
				// const host = `ws://treasure.tbg.isecsp.com${suffix}`;
				// global_lotto: hash_dice.tbg.isecsp.com
				// hash_dice: global_lotto.tbg.isecsp.com
				// snatch_treasure: treasure.tbg.isecsp.com
				const s = new WebSocket(host);
				// const s = io.connect(host);
		
		        s.onerror = err => {
		          console.log('err',err);
		          connError = true;
		          resolve(false);
				}
				
				s.on("data", () => {

				});
				
		        s.onopen = () => {
		        	// console.log('client-> connected');
		        	socket = s;
		        	send();
		        	setupSocket();
		        	resolve(true);
				}

		        s.onclose = () => {
		        	
		        }
			};
			await trySocket();
		})
	}

	static checkCanBet(){
		
		return new Promise((resolve, reject) => {
			pairingPromise = {resolve, reject};
			send({type: 'checkCanBet', data: ''});
		})
	}

	static bet(data){
		return new Promise((resolve, reject) => {
			pairingPromise = {resolve, reject};
			send({type: 'bet', data: data});
		})
	}

	static getReward(data) {
		return new Promise((resolve, reject) => {
			pairingPromise = {resolve, reject};
			send({type: 'getRewardRecord', data: data});
		})
	}

	static getUserRecord(data) {
		return new Promise((resolve, reject) => {
			pairingPromise = {resolve, reject};
			send({type: 'getUserRecord', data: data});
		})
	}

	static getBetRecord() {
		return new Promise((resolve, reject) => {
			pairingPromise = {resolve, reject};
			send({type: 'getBetRecord', data: ''});
		})
	}
}

module.exports = ClientSocket;