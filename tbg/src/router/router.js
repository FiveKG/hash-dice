// @ts-check
const express = require("express");
const router = express.Router();
const pools = require("../controllers/pools");
const account = require("../controllers/account");
const balance = require("../controllers/balance");
const income = require("../controllers/income");
const team = require("../controllers/team");
const trade = require("../controllers/trade");
const config = require("../controllers/config");
const tbg = require("../controllers/tbg");
const minePool = require("../controllers/minePool");

// 获取服务运行状态
router.get("/common/health", require("../common/health.js"));
// 获取配置信息
router.get("/config/get_config", config.getConfig);

// 获取配置信息
router.get("/account/get_token", config.getToken);

/***************************  account  ***********************************/
// 根据填写的邀请码显示出帐号名称
router.get("/account/show_account_name_by_code", account.show_account_name_by_code);
// 获取用户的邀请码
router.get("/account/invest_code", account.invest_code);
// 帐号是否激活
router.get("/account/is_activated", account.is_activated);
// 帐号是否已经绑定
router.get("/account/is_bind", account.is_bind);
// 邀请绑定
router.post("/account/bind_referrer", account.bind_referrer);

// 获取当前用户的信息
router.get("/account/info", account.accountInfo);

// 获取用户的推荐人
router.get("/account/get_referrer", account.getAccountReferrer);

// 显示子账号的信息
router.get("/account/sub_account", account.sub_account);
// 会员等级
router.get("/account/level", account.get_account_member);
// 投资首页 tbg 主页的显示信息
router.get("/account/investment_index", account.investment_index);
// router.post("/account/set_invitation", account.generate_refer_code);

/***************************  balance  ***********************************/
// 收益分配
router.get("/balance/balance_alloc", balance.balanceAllocInfo);
// 提现信息
router.get("/balance/balance_info", balance.balance_info);

// 获取用户游戏余额信息
router.get("/balance/game_balance", balance.getGameBalance);

// 提现
router.post("/balance/withdraw", balance.withdraw);
// 提现历史
router.get("/balance/withdraw_history", balance.withdrawHistory);

/***************************  team  ***********************************/
// 我的团队 直接推荐
router.get("/team/invite", team.invite);
// 我的团队 三三排位
router.get("/team/sort", team.staticSort);
// 我的团队 一条公排
router.get("/team/mode", team.staticMode);

/***************************  income  ***********************************/
// 查看我的分红收益
router.get("/income/dividend", income.dividend);
// 查看我的保障收益
router.get("/income/safe", income.safe);
// 查看其他收益
router.get("/income/other", income.other);
// 查看三三收益
router.get("/income/mode", income.staticMode);
// 查看一行公排收益
router.get("/income/sort", income.staticSort);
// 查看推荐收益
router.get("/income/referrer", income.referrer);
// 显示投资收益
router.get("/income/income_detail", income.income_detail);
// 点击收取收益
router.post("/income/income_gain", income.income_gain);

/***************************  pools  ***********************************/
// bingo 奖金池
router.get("/pools/bingo", pools.bingo);
// 股东分红池
router.get("/pools/shareholders", pools.shareholders);
// 我的分红
router.get("/pools/my_dividend", pools.myDividend);
// 三倍收益保障池
router.get("/pools/safe", pools.safe);
// 直接推荐 pk 池
router.get("/pools/pk", pools.pk);

/***************************  trade  ***********************************/
// 获取交易价格
router.get("/trade/price", trade.getPrice);
// 获取全球合伙人私募信息
router.get("/trade/raise_buy", trade.getRaiseInfo);
// 全球合伙人私募
router.post("/trade/global_raise_buy", trade.raiseBuy);
// 私募交易列表
router.get("/trade/raise_list", trade.raiseList);
// 获取普通买入交易信息 
router.get("/trade/buy_assets", trade.getBuyAssetsInfo);
// 买入资产包 
router.post("/trade/user_buy_assets", trade.buyAssets);
// 资产包买入记录
router.get("/trade/buy_assets_history", trade.buyAssetsHistory);
// 买入交易列表
router.get("/trade/buy_list", trade.buyList);
// 获取普通卖出交易信息
router.get("/trade/sell_assets", trade.getSellAssetsInfo);
// 卖出 TBG
router.post("/trade/user_sell_assets", trade.sellAssets);
// 卖出交易列表
router.get("/trade/sell_list", trade.sellList);
// 资产包卖出记录
router.get("/trade/sell_history", trade.sellAssetsHistory);

/***************************  mine_pool  ***********************************/
// 有效资产包矿机
router.get("/mine_pool/mining", minePool.mining);
// 已结束资产包矿机
router.get("/mine_pool/mined", minePool.mined);
// 资产包挖矿详情
router.get("/mine_pool/detail", minePool.detail);
// 资产包挖矿收益收取
router.post("/mine_pool/collect", minePool.collect);

/***************************  saleable  ***********************************/
// 可售额度
router.get("/saleable_amount", tbg.saleableAmount);
// 可售余额
router.get("/saleable_balance", tbg.saleableBalance);

/***************************  release_pool  ***********************************/
// 线性释放池资料
router.get("/release_pool/account", tbg.releasePool);
// 线性释放池明细
router.get("/release_pool/detail", tbg.releasePoolDetail);


/***************************  check_in  ***********************************/
// 获取每日签到信息
router.get("/check_in", tbg.checkInDetail);

// 获取签到奖励明细
router.get("/check_in/detail", tbg.checkInInfo);

// 签到
router.post("/user_check_in", tbg.checkIn);

/***************************  tbg  ***********************************/
// TBG 概况
router.get("/tbg/info", tbg.tbgInfo);

// TBG 销毁数量
router.get("/tbg/destroy", tbg.destroy);

// 系统公告
router.get("/tbg/system_notification", tbg.notification);

// 创建系统公告
router.post("/tbg/add_notification", tbg.addNotification);

module.exports = router