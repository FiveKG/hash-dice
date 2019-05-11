// @ts-check
const { JsonRpc } = require("eosjs");
const fetch = require("node-fetch");
const { WALLET_RECEIVER, SCATTER_NET } = require("../common/constant/eosConstants.js");

async function getTrxAction(actionSeq) {
    try {
        // @ts-ignore
        const rpc = new JsonRpc(SCATTER_NET, { fetch });
        const resp = await rpc.history_get_actions(WALLET_RECEIVER, actionSeq, 9);
        return resp.actions;
    } catch (err) {
        throw err;
    }
}

module.exports = getTrxAction;