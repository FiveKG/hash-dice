
export default class Wallet {
  constructor() {
    this.keychain = '' 
  }

  static placeholder() { return new Wallet(); }
  static fromJson(json) {
    let p = Object.assign(this.placeholder(), json);
    if(json.hasOwnProperty('keychain'))
      p.keychain = (typeof json.keychain === 'string')
          ? json.keychain : Keychain.fromJson(json.keychain);
    return p;
  }
}