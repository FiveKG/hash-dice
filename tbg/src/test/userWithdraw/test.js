// @ts-check
const userInvestment = require("../../businessLogic/account/userInvestment.js");

;(async () => {

})();

async function testUserInvestment() {
    try {
        let accountName = 'systemwallet';
        let investAmount = 100;
        const remark = `user ${ accountName } invest ${ investAmount } UE`
        await userInvestment(investAmount, accountName, remark);
    } catch (err) {
        throw err;
    }
}