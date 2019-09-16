// @ts-check
const express = require("express");
const router = express.Router();
const config = require("../controllers/config");
const snatchTreasure = require("../controllers/snatch_treasure");

// 获取服务运行状态
router.get("/common/health", require("../common/health.js"));
// 获取配置信息
router.get("/config/get_config", config.getConfig);

/*****************************   **************************************/
// 获取全球彩奖池，倒计时，期数
router.get("/snatch_treasure/info", snatchTreasure.getInfo);
// 最新一期开奖情况
router.get("/snatch_treasure/latest_game_session", snatchTreasure.latestGameSession);
// 获取所有期数及开奖信息
router.get("/snatch_treasure/game_session", snatchTreasure.gameSession);
// 获取某一期开奖详情
router.get("/snatch_treasure/game_session_detail", snatchTreasure.gameSessionDetail);
// 获取当前用户投注的信息
router.get("/snatch_treasure/game_session_mine", snatchTreasure.gameSessionMine);
// 获取当前用户某一期投注的详情
router.get("/snatch_treasure/game_session_mine_detail", snatchTreasure.gameSessionMineDetail);
// 投注
router.post("/snatch_treasure/bet", snatchTreasure.bet);
// 随机投注
router.post("/snatch_treasure/random_bet", snatchTreasure.randomBet);
/*****************************   **************************************/

module.exports = router