import bip39 from 'bip39'

export default class Mnemonic {

    /***
     * Generates a mnemonic from a password
     * @param password
     * @param salt
     * @returns {[string,string]}
     */
    static async mnemonicToSeed(mnemonic){
      return bip39.mnemonicToSeedHex(mnemonic);
    }
}
