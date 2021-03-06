// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger.js").child({ "@": "assets" });
const ASSETS_CONSTANTS = require("../../common/constant/assetsConstant");
const { Decimal } = require("decimal.js");

async function insertAssetsPackage() {
    try {
        const values = [ 
            { 
                "amount": ASSETS_CONSTANTS.ASSETS_PACKAGE_50, 
                "saleable_multiple": ASSETS_CONSTANTS.SALEABLE_50, 
                "mining_multiple": ASSETS_CONSTANTS.ASSETS_PACKAGE_MULTIPLE_50,
                "preset_days": ASSETS_CONSTANTS.PRESET_DAYS, 
                "release_multiple": ASSETS_CONSTANTS.RELEASE_POOL_MULTIPLE_50, 
                "amount_type": "common" 
            }, 
            { 
                "amount": ASSETS_CONSTANTS.ASSETS_PACKAGE_100, 
                "saleable_multiple": ASSETS_CONSTANTS.SALEABLE_100, 
                "mining_multiple": ASSETS_CONSTANTS.ASSETS_PACKAGE_MULTIPLE_100,
                "preset_days": ASSETS_CONSTANTS.PRESET_DAYS, 
                "release_multiple": ASSETS_CONSTANTS.RELEASE_POOL_MULTIPLE_100, 
                "amount_type": "common" 
            }, 
            { 
                "amount": ASSETS_CONSTANTS.ASSETS_PACKAGE_200, 
                "saleable_multiple": ASSETS_CONSTANTS.SALEABLE_200,
                "mining_multiple": ASSETS_CONSTANTS.ASSETS_PACKAGE_MULTIPLE_200, 
                "preset_days": ASSETS_CONSTANTS.PRESET_DAYS,
                "release_multiple": ASSETS_CONSTANTS.RELEASE_POOL_MULTIPLE_200, 
                "amount_type": "common" 
            },
            // { 
            //     "amount": ASSETS_CONSTANTS.RAISE_ASSETS_10K, 
            //     "saleable_multiple": 0, 
            //     "mining_multiple": ASSETS_CONSTANTS.RAISE_ASSETS_MULTIPLE_10K, 
            //     "preset_days": ASSETS_CONSTANTS.PRESET_DAYS,
            //     "release_multiple": ASSETS_CONSTANTS.RELEASE_POOL_MULTIPLE_10K, 
            //     "amount_type": "raise" 
            // }, 
            { 
                "amount": ASSETS_CONSTANTS.RAISE_ASSETS_20K, 
                "saleable_multiple": 0, 
                "mining_multiple": ASSETS_CONSTANTS.RAISE_ASSETS_MULTIPLE_20K, 
                "preset_days": ASSETS_CONSTANTS.PRESET_DAYS,
                "release_multiple": ASSETS_CONSTANTS.RELEASE_POOL_MULTIPLE_20K, 
                "amount_type": "raise" 
            }, 
            // { 
            //     "amount": ASSETS_CONSTANTS.RAISE_ASSETS_30K, 
            //     "saleable_multiple": 0, 
            //     "mining_multiple": ASSETS_CONSTANTS.RAISE_ASSETS_MULTIPLE_30K, 
            //     "preset_days": ASSETS_CONSTANTS.PRESET_DAYS,
            //     "release_multiple": ASSETS_CONSTANTS.RELEASE_POOL_MULTIPLE_30K, 
            //     "amount_type": "raise" 
            // }, 
            { 
                "amount": ASSETS_CONSTANTS.GLOBAL_PARTNER_ASSETS_PACKAGE_50, 
                "saleable_multiple": ASSETS_CONSTANTS.GLOBAL_PARTNER_SALEABLE_50, 
                "mining_multiple": ASSETS_CONSTANTS.GLOBAL_PARTNER_MULTIPLE_50, 
                "preset_days": ASSETS_CONSTANTS.PRESET_DAYS,
                "release_multiple": ASSETS_CONSTANTS.GLOBAL_PARTNER_RELEASE_POOL_50, 
                "amount_type": "global"
            },
            { 
                "amount": ASSETS_CONSTANTS.GLOBAL_PARTNER_ASSETS_PACKAGE_100, 
                "saleable_multiple": ASSETS_CONSTANTS.GLOBAL_PARTNER_SALEABLE_100, 
                "mining_multiple": ASSETS_CONSTANTS.GLOBAL_PARTNER_MULTIPLE_100, 
                "preset_days": ASSETS_CONSTANTS.PRESET_DAYS,
                "release_multiple": ASSETS_CONSTANTS.GLOBAL_PARTNER_RELEASE_POOL_100, 
                "amount_type": "global"
            },
            { 
                "amount": ASSETS_CONSTANTS.GLOBAL_PARTNER_ASSETS_PACKAGE_200, 
                "saleable_multiple": ASSETS_CONSTANTS.GLOBAL_PARTNER_SALEABLE_200, 
                "mining_multiple": ASSETS_CONSTANTS.GLOBAL_PARTNER_MULTIPLE_200, 
                "preset_days": ASSETS_CONSTANTS.PRESET_DAYS,
                "release_multiple": ASSETS_CONSTANTS.GLOBAL_PARTNER_RELEASE_POOL_200, 
                "amount_type": "global"
            },
            { 
                "amount": ASSETS_CONSTANTS.GLOBAL_PARTNER_ASSETS_PACKAGE_500, 
                "saleable_multiple": ASSETS_CONSTANTS.GLOBAL_PARTNER_SALEABLE_500, 
                "mining_multiple": ASSETS_CONSTANTS.GLOBAL_PARTNER_MULTIPLE_500, 
                "preset_days": ASSETS_CONSTANTS.PRESET_DAYS,
                "release_multiple": ASSETS_CONSTANTS.GLOBAL_PARTNER_RELEASE_POOL_500, 
                "amount_type": "global"
            },
        ]
        const valuesStrArr = values.map(it => {
            return `(${ it.amount }, ${ it.saleable_multiple }, ${ it.mining_multiple }, ${ it.preset_days }, ${ it.release_multiple }, '${ it.amount_type }')`
        });
        // 如果存在则不再重复插入
        const sql = `
            WITH new_values (amount, saleable_multiple, mining_multiple, preset_days, release_multiple, amount_type) 
                AS (values ${ valuesStrArr.join(",") })
              INSERT INTO assets_package (amount, saleable_multiple, mining_multiple, preset_days, release_multiple, amount_type)
              SELECT amount, saleable_multiple, mining_multiple, preset_days, release_multiple, amount_type
              FROM new_values
              WHERE NOT EXISTS (SELECT 1 
                                FROM assets_package
                                WHERE assets_package.amount = new_values.amount)
        `
        // logger.debug("sql: %j", sql);
        await pool.query(sql);
        logger.info("insert assets_package ok");
    } catch (err) {
        logger.error("insert assets_package error, the error stock is %O", err);
        throw err;
    }
}

// ( async () => {
//     await insertAssetsPackage();
// })();

module.exports = insertAssetsPackage;