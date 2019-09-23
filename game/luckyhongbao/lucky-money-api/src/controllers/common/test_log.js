// @ts-check
const logger = require("@fjhb/logger").child({"@":"test_log"});
const { get_status } = require("../../common");

// 添加用户推荐人
async function test_log(req, res, next) {
    try {
        logger.debug("console request: %j", req.query);
        return res.send(get_status(1, req.query));
    } catch (error) {
        logger.error(error, "find eos_account error");
        next(error);
    }
};

module.exports = test_log;