const sb = require("@yz/yue-svc-base");
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

        return res.send(sb.status(1, true));
    } catch (err) {
        next(err);
    }
}
