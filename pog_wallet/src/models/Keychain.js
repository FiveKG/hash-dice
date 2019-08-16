
export default class Keychain {
  constructor() {
    this.keypairs = ''
  }

  static placeholder(){ return new Keychain(); }
  static fromJson(json){
    let p = Object.assign(this.placeholder(), json);
    if(json.hasOwnProperty('keypairs')) p.keypairs = json.keypairs.map(x => Keypair.fromJson(x));
    if(json.hasOwnProperty('accounts')) p.accounts = json.accounts.map(x => Account.fromJson(x));
    if(json.hasOwnProperty('identities')) p.identities = json.identities.map(x => Identity.fromJson(x));
    if(json.hasOwnProperty('permissions')) p.permissions = json.permissions.map(x => Permission.fromJson(x));
    if(json.hasOwnProperty('apps')) p.apps = json.apps.map(x => AuthorizedApp.fromJson(x));
    return p;
}
}