// @ts-check
const accountConstant = require("../../common/constant/accountConstant.js");

/**
 * 生成 12 位的 eos 帐号
 */
function getRandEOSAccount() {
    let result = [];
    while(result.length < 12) {
        let tmpIdx = Math.floor(Math.random() * 31 + 1);
        if (result.includes(".") && tmpIdx === 5) {
            continue;
        }

        if (result[0] === ".") {
            result.pop();
            continue;
        }

        result.push(accountConstant.EOS_NAME_CONVENTIONS_CHAR[tmpIdx]);
    }
    // console.log("result: ", result, result.length)
    let rand = result.join("");

    return rand;
}

module.exports = {
    "getRandEOSAccount": getRandEOSAccount
}

