//@ts-check

const logger = require("@fjhb/logger").child({ '@': 'doListenChainTransferActionJob' });
async function testListenChain() {
    const listenChainTransferAction = require("./src/businessLogic/listenChainTransferAction.js");
    await listenChainTransferAction();
}

async function testRecharge() {
    const userRechargeBiz = require("./src/businessLogic/user_recharge.js");
    const {  user_recharge  } = require("@fjhb/mq-pub-sub");

    user_recharge.sub( async (data) => {        
        await userRechargeBiz(data);
    });
}

( async()=>{
    await testListenChain();
    // await testRecharge();
} )()

