
const ObjectHelpers = require('../../util/ObjectHelpers');
const Eos = require('eosjs');
let {ecc, Fcbuffer} = Eos.modules;

class EOS {

    constructor() {
        this.name = 'eos'
    }

    bufferToHexPrivate(buffer){
        return ecc.PrivateKey.fromBuffer(new Buffer(buffer)).toString()
    }
    hexPrivateToBuffer(privateKey){
        return new ecc.PrivateKey(privateKey).toBuffer();
    }

    privateToPublic(privateKey, prefix = null){ return ecc.PrivateKey(privateKey).toPublic().toString(prefix ? prefix : 'EOS'); }

    async getAbis(contracts, eos){
        const abis = {};
        await Promise.all(contracts.map(async contractAccount => {
            abis[contractAccount] = (await eos.contract(contractAccount)).fc;
        }))
        return abis;
    }

    async requestParser(payload, network){
        // if(payload.transaction.hasOwnProperty('serializedTransaction'))
        //     return this.parseEosjs2Request(payload, network);
        // else return this.parseEosjsRequest(payload, network);
        return this.parseEosjsRequest(payload);
    }

    async parseEosjsRequest(payload){
        const {transaction} = payload;

        const eos = Eos({httpEndpoint:'https://nodes.get-scatter.com:443', chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'});

        const contracts = ObjectHelpers.distinct(transaction.actions.map(action => action.account));
        const abis = await this.getAbis(contracts, eos);


        return await Promise.all(transaction.actions.map(async (action, index) => {
            const contractAccountName = action.account;

            let abi = abis[contractAccountName];

            const typeName = abi.abi.actions.find(x => x.name === action.name).type;
            const data = abi.fromBuffer(typeName, action.data);
            const actionAbi = abi.abi.actions.find(fcAction => fcAction.name === action.name);
            let ricardian = actionAbi ? actionAbi.ricardian_contract : null;

            if(transaction.hasOwnProperty('delay_sec') && parseInt(transaction.delay_sec) > 0){
                data.delay_sec = transaction.delay_sec;
            }

            return {
                data,
                code:action.account,
                type:action.name,
                authorization:action.authorization,
                ricardian
            };
        }));
    }

}

module.exports = EOS