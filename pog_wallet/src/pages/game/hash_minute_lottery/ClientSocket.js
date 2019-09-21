import store from '@/store'

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
						const [ block ] = JSON.parse(msg.data.replace('42/block,', ''));
						if (block.type == 'block') {
						//  console.log('区块信息:', block)
						 store.commit('gameMinuteLottery/pushBlock', block);
						 var div = document.getElementById('current-block-record');
						 div.scrollTop = div.scrollHeight;
						}
					}
				}
			}

			const trySocket = () => {
				// const host = `ws://192.168.1.141:50007${suffix}`;
				const host = `ws://global_lotto.tbg.isecsp.com${suffix}`;
				const s = new WebSocket(host);
				s.onerror = err => {
					console.log('err',err);
					connError = true;
					resolve(false);
				}
				s.onopen = () => {
					console.log('client-> connected');
					socket = s;
					send();
					setupSocket();
					resolve(true);
				}
				s.onclose = () => {
					console.log('client-> close');
				}
			};
			await trySocket();
		})
	}
}