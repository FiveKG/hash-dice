// const sb = require("@yz/yue-svc-base");
const request = require("request");

//@ts-check
module.exports = async function (req, res, next) {
    try {
        // request({
        //     method: "get",
        //     url: "http://account_service.service.consul:13002/common/health"
        // }).on("data", function (data) {
        //     console.log("111", data.toString())
        // })

        return res.send(1, { "now": new Date() });
    } catch (err) {
        next(err);
    }
}
