import ecc from 'eosjs-ecc'

export default class Hasher {

    /***
     * Hashes a cleartext using the SHA-256 algorithm.
     * This is INSECURE and should only be used for fingerprinting.
     * @param cleartext
     */
    static async unsaltedQuickHash(cleartext) {
        return ecc.sha256(cleartext);
    }
}
