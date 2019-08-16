const Mnemonic = require('../util/Mnemonic')

class PasswordService {

    static async encrypt(password){
        return new Promise(async (resolve, reject) => {
            try {
                let seed = await Mnemonic.mnemonicToSeed(password);
                resolve(seed);
            } catch(e){
                resolve(null);
            }
        })
    }
}

module.exports = PasswordService