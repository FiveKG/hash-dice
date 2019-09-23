//@ts-check
const logger = require("@fjhb/logger").child({ [`@${ __filename }`]: 'doSyncRedEnvelopGameResult' });
const syncRedEnvelopTable = require("../businessLogic/syncRedEnvelopTable.js");

logger.debug(`doSyncRedEnvelopGameResult starting...`);

function doSyncRedEnvelopGameResult() {
    setTimeout(async () => {
        try {
            await syncRedEnvelopTable();
        } catch (err) {
            logger.error(err, 'doSyncRedEnvelopGameResult failed');
        }
        doSyncRedEnvelopGameResult()
    }, 2000 );
}

doSyncRedEnvelopGameResult();