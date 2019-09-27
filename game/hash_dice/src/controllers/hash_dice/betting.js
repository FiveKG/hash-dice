// @ts-check
const logger = require("../../common/logger").child({ [__filename]: "betting" });
const { get_status, inspect_req_data, xhr,generate_primary_key } = require("../../common/index.js");
const {  psBet} = require("../../db");
const { Decimal } = require("decimal.js");
const url = require("url");
const {AGENT_ACCOUNT} = require('../../common/constant/eosConstants')
const {GAME_RATE} = require('./config')
const getCurrencyBalance = require("../../job/getCurrencyBalance")

/**
 * 获取所有的投注
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 */
async function betting(req,res,next){
    try {
        let reqData = await inspect_req_data(req);
        let resData
        logger.debug(`the param is: %j`,reqData);


        let {account_name,bet_num,bet_amount} = reqData;
        let odds_rate                         = null;
        //@ts-ignore
        if(GAME_RATE[bet_num]){
            //@ts-ignore
           odds_rate = GAME_RATE[bet_num].odds_rate
        }else
        {
            resData = get_status(2000, "错误值");
            res.send(resData);
            return
        }

        


        //查出玩家余额
        const TBG_SERVER = process.env.TBG_SERVER || "http://192.168.1.141:9527/";
        const opts = { data: { account_name: account_name} };

        const { data: [resp] } = await xhr.get(url.resolve(TBG_SERVER, "/balance/game_balance"), opts);
        let eos_currency =(await getCurrencyBalance(account_name)).pop().replace(' UE','')
        
        // 可提现余额，游戏码,区块链余额
        const withdrawEnable = new Decimal(resp.withdraw_enable);
        const gameCurrency   = new Decimal(resp.game_currency);
        const eosCurrency    = new Decimal(eos_currency)
        //保留下注总数小数点后4位，取消四舍五入
        bet_amount = new Decimal(bet_amount).toFixed(4)
    
        let psData = {
                "account_name" : account_name,
                "bet_num"      : bet_num,
                "odds_rate"    : odds_rate,
                "bet_amount"   : bet_amount,
                "agent_account": AGENT_ACCOUNT,
        };

        
        console.debug(`用户${account_name},余额：${withdrawEnable},游戏码:${gameCurrency},区块链余额:${eosCurrency}`)
        //如果游戏码额度小于下注额度
        if(gameCurrency.lessThan(bet_amount)){
            //如果余额额度小于下注额度
            if(withdrawEnable.lessThan(bet_amount))
            {   
                //如果区块链余额小于下注额度
                if(eosCurrency.lessThan(bet_amount)){
                    //提示所有账户没钱
                    resData =  res.send(get_status(1011, "完全不够钱"));
                }else{
                    //仅剩区块链有钱
                    resData = get_status(1011, "只有区块链够钱");
                }
            }else{
                //用余额下注
                //@ts-ignore
                psData['pay_type'] = 'withdraw_enable';
                //提交投注信息到消息队列
                await psBet.pub(psData);
                resData = get_status(1, "余额下注");
            }
        }
        else{
            //用游戏码下注
            //@ts-ignore
            psData["pay_type"]= "game_currency"
            //提交投注信息到消息队列
            await psBet.pub(psData);
            resData = get_status(1, "游戏码下注");
            
        }  
        res.send(resData);
        
        // //test
        // await psBet.pub(psData);
 
    } catch (err) {
        logger.error("request bet error, the error stock is %O", err);
        throw err;
    }
}

module.exports = betting;