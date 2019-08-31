// const sb = require("@yz/yue-svc-base");
const request = require("request");

//@ts-check
module.exports = async function (req, res, next) {
    try {
        return res.send(1, { "now": new Date() });
    } catch (err) {
        next(err);
    }
}
