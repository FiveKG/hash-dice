// @ts-check
const userInvestment = require("../../businessLogic/account/userInvestment.js");

async function testUserInvestment() {
    try {
        for (let i = 1; i < 10; i ++) {
            let accountName = 'systemwallet';
            accountName = "raypx2gtfq.t"
            let investAmount = 100;
            let statusCode = await userInvestment(investAmount, accountName, "");
            console.log("statusCode: ", statusCode); 
        }
    } catch (err) {
        throw err;
    }
}

testUserInvestment()