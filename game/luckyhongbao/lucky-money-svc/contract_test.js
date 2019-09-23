var Eos = require('eosjs');

var chain = {
    main: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906', // main network
    jungle: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca', // jungle testnet
    internet: '88ca3601ca8c451c335b6b43b42b425254215990036d505740ff809fe3aeffe2', // internet developer
    local: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'   // localnet 
}

const network = {
        localnet: 'http://192.168.1.146:8888',
        internet: 'http://192.168.1.107:8888',
        mainnet: "https://eos.mns36.cn"
  };

  let privateKey = [
    "5J93HHPzLWHCW8FwTpZCBzHhD4UgG2dyAQM1CHESZ4EyEiC8vcH", //luckyhongbao
    "5Jgu99x5nT6xKbuyLELhNm7hjYvdaKkhK2NguaiMK9nhLgMNNaK", 
    "5HuD6jonPC6uK6QzWr5ANhVktUCVEgfennbFDGpaYrnpiL5NjWG",
    "5J7ooiZrHjitNLYbWcu7XkEDHWUnSr7AbjghwqCoszqkfLXCypc",
    "5KZNpiDLNYhh8mEhUBJDLy6qz9mH1VhG6bxxDBDeoZco383aRTb",
    "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3",
    "5JAujew5oJct6q9rVWHdQH35zMWaG7sFXWYWbLPRmGBM26zYK5F", // lottyplayman
    "5KZNpiDLNYhh8mEhUBJDLy6qz9mH1VhG6bxxDBDeoZco383aRTb",
    "5JaURqsAe3ZXqqAJCF6rzD9NWipDb83E3Md3vxwDW7SFrqUb9cU"
];

let config = {
    keyProvider: privateKey,
    httpEndpoint: network.mainnet,
    chainId: "https://eos.eoscrown.com:443",
}

let opt = {
    keyProvider: privateKey,
    httpEndpoint: network.localnet,
    chainId: chain.local,
}


/**
 * @breif 开始新一期游戏
 * @param { String } contractAccount 合约账户
 * @param { Object } config 节点连接配置
 * @param { Number } packet_id 游戏 id
 * @param { Asset } amount 红包房间额度，`asset` 类型为四位浮点加符号的字符串，如： `1.0000 EOS`
 * @param { String } owner 发红包的人
 * @param { Number } player_count 红包数量
 */
async function createGame(contractAccount, config, packet_id, amount, owner, player_count) {
    try {
        let contract = await getContract(contractAccount, config);
        let issue = contract.issue(packet_id, amount, owner, player_count, { authorization: [contractAccount] });
        console.log(issue);
    } catch (error) {
        throw error;
    }
}

async function snatch(contractAccount, config, packet_id, snatch_id, player, memo) {
    try {
        let contract = await getContract(contractAccount, config);
        let issue = contract.snatch(packet_id, snatch_id, player, memo, { authorization: [contractAccount] });
        console.log(issue);
    } catch (error) {
        throw error;
    }
}

async function clear(contractAccount, config, tableKey, tableName) {
    try {
        let contract = await getContract(contractAccount, config);
        let tableRow = await getTableRow(contractAccount, tableName, 0, 0);
        // console.log("contract: ", contract);
        // console.log("tableRow: ", tableRow);

        for (let i = 0; i < tableRow.length; i++) {
            let clear = await contract.clear(tableRow[i][tableKey], tableName, { authorization: [contractAccount] });
            console.log("clear: ", clear);
        }
    } catch (error) {
        throw error;
    }
}

async function getTableRow(contractAccount, tableName, lowerBound, upperBound) {
    let eos = Eos(config);
    let tableInfo = {
        code: contractAccount,
        scope: contractAccount,
        table: tableName,
        // lower_bound: "5580",
        // upper_bound: "5596",
        limit: 200,
        json: true,
    }
    let tableRow = await eos.getTableRows(tableInfo);
    // console.log("tableRow: ", tableRow);
    return tableRow.rows;
}

async function getContract(contractAccount, config) {
    try {
        let eos = Eos(config);
        let contract = await eos.contract(contractAccount);

        // console.log("eos: ", eos);
        // console.log("contract: ", contract);

        return contract;
    } catch (error) {
        throw error;
    }
}

(async () => {
    require("./src/initEnv.js")();
    const { startNewGame } = require("@fjhb/mq-pub-sub");
    let accountName = "luckyhongbao";
    let owner = "yuyunlong";
    
    let pub_start ={ 
        "room_id"      : 130,
        "account_name" : owner , 
        "amount"       : 130, 
        "quantity"     : 2,
        "symbol": "EOS",
        "balance_type" : "balance"
    };

    // @ts-ignore
    // await startNewGame.pub(pub_start);
    await clear(accountName, config, "snatch_id", "offer");
    await clear(accountName, config, "packet_id", "redpacket");
    // console.log(clear_result)
    // let game = await createGame(accountName, config, 130, "1.0000 EOS", owner, 2);

    // console.log(game);
})();