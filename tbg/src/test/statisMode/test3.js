// @ts-check
const userInvestment = require("../../businessLogic/account/userInvestment.js");

async function testUserInvestment() {
    try {
        let accountName = 'systemwallet';
        accountName = "yujinsheng11"
        let investAmount = 100;
        let statusCode = await userInvestment(investAmount, accountName, "");
        console.log("statusCode: ", statusCode); 
    } catch (err) {
        throw err;
    }
}

async function test(start, end) {
    for (let i = 1; i < 10; i ++) {
        await testUserInvestment()
    }
}

test()