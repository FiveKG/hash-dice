// @ts-check
const express = require("express");
const router = express.Router();
const pools = require("../controllers/pools");
const account = require("../controllers/account");
const balance = require("../controllers/balance");
const income = require("../controllers/income");
const team = require("../controllers/team");
const config = require("../controllers/config");

// 获取服务运行状态
router.get("/common/health", require("../common/health.js"));
router.get("/config/get_config", config.getConfig);

router.get("/account/show_account_name_by_code", account.show_account_name_by_code);
router.get("/account/is_activated", account.is_activated);
router.get("/account/sub_account", account.sub_account);
router.get("/account/invest_code", account.invest_code);
router.get("/account/is_bind", account.is_bind);
router.get("/account/level", account.get_account_member);
router.get("/account/investment_index", account.investment_index);
// router.post("/account/set_invitation", account.generate_refer_code);
router.post("/account/bind_referrer", account.bind_referrer);
router.post("/account/self_invest", account.self_invest);
router.post("/account/friend_invest", account.friend_invest);

router.get("/balance/balance_info", balance.balance_info);
router.post("/balance/withdraw", balance.withdraw);
router.get("/balance/withdraw_history", balance.withdrawHistory);

router.get("/team/invite", team.invite);
router.get("/team/sort", team.staticSort);
router.get("/team/mode", team.staticMode);

router.get("/income/dividend", income.dividend);
router.get("/income/safe", income.safe);
router.get("/income/other", income.other);
router.get("/income/mode", income.staticMode);
router.get("/income/sort", income.staticSort);
router.get("/income/referrer", income.referrer);
router.get("/income/income_detail", income.income_detail);
router.post("/income/income_gain", income.income_gain);

router.get("/pools/bingo", pools.bingo);
router.get("/pools/shareholders", pools.shareholders);
router.get("/pools/safe", pools.safe);
router.get("/pools/pk", pools.pk);

module.exports = router