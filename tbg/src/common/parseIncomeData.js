// @ts-check
const { Decimal } = require("decimal.js");

/**
 * 
 * @param { any[] } detailArr  
 * @param { String } incomeJsonIfy
 * @param { String } info 
 */
async function parseIncomeData(detailArr, incomeJsonIfy, info) {
    let incomeArr = JSON.parse(incomeJsonIfy);
    let income = new Decimal(0);
    incomeArr.forEach(item => {
        console.log(item);
        income = income.add(item.change_amount);
    });
    let data = {
        "income_type": info,
        "income_detail": income.toFixed(8)
    }
    detailArr.push(data);
    return detailArr;
}

async function startParse(incomeMap) {
    let detailArr = []
    for (let key in incomeMap) {
        await parseIncomeData(detailArr, incomeMap[key], key);
        // let info = ``;
        // if (key === "bingo") {
        //     info = "Bingo奖金";
        //     await parseIncomeData(detailArr, incomeMap[key], info);
        // } else if (key === "pk") {
        //     info = "直接推荐PK奖金";
        //     await parseIncomeData(detailArr, incomeMap[key], info);
        // } else if (key === "safe") {
        //     info = "五倍收益保障金";
        //     await parseIncomeData(detailArr, incomeMap[key], info);
        // } else if (key === "holder") {
        //     info = "股东池分红";
        //     await parseIncomeData(detailArr, incomeMap[key], info);
        // } else if (key === "game") {
        //     info = "游戏推荐奖金";
        //     await parseIncomeData(detailArr, incomeMap[key], info);
        // } else if (key === "sort") {
        //     info = "一条静态";
        //     await parseIncomeData(detailArr, incomeMap[key], info);
        // } else if (key === "mode") {
        //     info = "三三静态";
        //     await parseIncomeData(detailArr, incomeMap[key], info);
        // } else if (key === "invite") {
        //     info = "直接推荐";
        // } else {
        //     info = "other";
        // }
    }

    return detailArr;
}

module.exports = {
    startParse: startParse,
    parseIncomeData: parseIncomeData
}