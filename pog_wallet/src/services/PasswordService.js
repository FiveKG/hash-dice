import Mnemonic from '../util/Mnemonic'

export default class PasswordService {

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
