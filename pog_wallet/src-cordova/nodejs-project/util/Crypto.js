const PluginRepository = require('../plugins/PluginRepository')
const ecc = require('eosjs-ecc')
const {PrivateKey} = ecc;

class Crypto {
  static async generatePrivateKey(){
    return (await PrivateKey.randomKey()).toBuffer();
  }

  static bufferToPrivateKey(buffer, blockchain){
      return PluginRepository.plugin(blockchain).bufferToHexPrivate(buffer);
  }

  static privateKeyToBuffer(privateKey, blockchain){
      return PluginRepository.plugin(blockchain).hexPrivateToBuffer(privateKey);
  }

  static bufferToHash(buffer){
      return ecc.sha256(buffer);
  }
}

module.exports = Crypto