
const suffix = '/socket.io/?EIO=3&transport=websocket';
let socket = null;
let pairingPromise = null;

const send = (data = null) => {
	if(data === null) {
    socket.send('40/scatter');
  } else {
    socket.send('42/scatter,' + JSON.stringify(['app', data]));
  }
}

export default class ClientSocket {

  	static link() {
		return new Promise(async (resolve, reject) => {

			const setupSocket = () => {
				socket.onmessage = msg => {
					if(msg.data.indexOf('42/scatter') === -1) return false;
					const [data] = JSON.parse(msg.data.replace('42/scatter,', ''));
					// console.log('setupSocket',data)
					if (pairingPromise) {
						pairingPromise.resolve(data);
					}
				}
			}

			const trySocket = () => {
				const host = `ws://127.0.0.1:50005${suffix}`;
		        const s = new WebSocket(host);
		        s.onerror = err => {
		          console.log('socket onerror',err);
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

	static setAccount(data){
		
		return new Promise((resolve, reject) => {
			pairingPromise = {resolve, reject};
			send({type: 'setAccount', data: data});
		})
	}
	static signTranstion(data){
		
		return new Promise((resolve, reject) => {
			pairingPromise = {resolve, reject};
			send({type: 'signTranstion', data: data});
		})
	}
	static simpleLogin(data){
		
		return new Promise((resolve, reject) => {
			pairingPromise = {resolve, reject};
			send({type: 'simpleLogin', data: data});
		})
	}
	
}