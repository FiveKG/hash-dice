class Wallet {
    constructor() {
        this.chain = '';
        this.privateKey = '';
        this.publicKey = '';
        this.accountNames = [];
        this.contacts = [];
        this.tokenList = [];
        this.isDefault = false;
    }

    static placeholder(){ return new Wallet(); }

    static fromJson(json){
        let p = Object.assign(this.placeholder(), json);
        return p;
    }

}

module.exports = Wallet