import store from '../store'

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

export default class ClientSocket {
	static getSocket() {
		return socket
	}
  static link() {
		return new Promise(async (resolve, reject) => {

			const setupSocket = () => {
				socket.onmessage = msg => {
					if (msg.data.indexOf('42/block') !== -1) {
						// console.log(msg.data)
						const [block] = JSON.parse(msg.data.replace('42/block,', ''));
						// console.log(block)
						if (block.type == 'block') {
							// console.log('block',block.result)
							store.commit('wallet/setBlock', block.result)
						}
					}
					if(msg.data.indexOf('42/scatter') === -1) return false;
					const [data] = JSON.parse(msg.data.replace('42/scatter,', ''));
					if (data.type) {
						if ( data.type == 'reward') {
							// 开奖号码
							let rewards = data.rewards
							rewards.award_num = data.rewards.award_num.join(' ')
							console.log(rewards)
							store.commit('setReward', rewards)
						}
						if (data.type == 'transfer') {
							store.commit('setTransfer', data.result)
						}
						if (data.type == 'bet') {
							store.commit('setBetRecord', data.result)
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
				// const host = `ws://172.81.224.11:13022${suffix}`;
				const host = `ws://hash_dice.tbg.isecsp.com${suffix}`;
		        const s = new WebSocket(host);
		        s.onerror = err => {
		          console.log('err',err);
		          connError = true;
		          resolve(false);
		        }
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