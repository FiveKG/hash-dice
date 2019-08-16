import CryptoJS from 'crypto-js'

const iv = CryptoJS.enc.Utf8.parse('ABCDEF1234561234');

export default class CryptoAES {
    static decrypt(word,seed) {
        try {
            const key = CryptoJS.enc.Utf8.parse(seed);
            const encryptedHexStr = CryptoJS.enc.Hex.parse(word);
            const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
            const decrypt = CryptoJS.AES.decrypt(srcs, key, { 
                iv: iv, 
                mode: CryptoJS.mode.CBC, 
                padding: CryptoJS.pad.Pkcs7 
            });
            const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
            return decryptedStr.toString();
        } catch (error) {
            return ''
        }
    }

    static encrypt(word,seed) {
        const key = CryptoJS.enc.Utf8.parse(seed);
        const srcs = CryptoJS.enc.Utf8.parse(word);
        const encrypted = CryptoJS.AES.encrypt(srcs, key, { 
            iv: iv, 
            mode: CryptoJS.mode.CBC, 
            padding: CryptoJS.pad.Pkcs7 
        });
        return encrypted.ciphertext.toString().toUpperCase();
    }
}
