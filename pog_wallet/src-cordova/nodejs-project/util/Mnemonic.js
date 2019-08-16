const Hasher = require('./Hasher');
const bip39 = require('bip39');

class Mnemonic {

    /***
     * Generates a mnemonic from a password
     * @param password
     * @param salt
     * @returns {[string,string]}
     */
    static async generateMnemonic(password, salt = null) {
        const hash = await Hasher.secureHash(password, salt);
        let mnemonic = bip39.entropyToMnemonic(hash);
        return [mnemonic, bip39.mnemonicToSeedHex(mnemonic)];
    }

    static async mnemonicToSeed(mnemonic){
        return bip39.mnemonicToSeedHex(mnemonic);
    }
}

module.exports = Mnemonic