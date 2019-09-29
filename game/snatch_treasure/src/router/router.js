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
// 获取游戏信息
router.get("/snatch_treasure/game_name", snatchTreasure.getInfo);
// 获取夺宝期数信息
router.get("/snatch_treasure/game_session", snatchTreasure.gameSession);
// 获取所有期数及开奖信息
router.get("/snatch_treasure/game_session_info", snatchTreasure.gameSessionInfo);
// 获取某一期开奖详情
router.get("/snatch_treasure/game_session_detail", snatchTreasure.gameSessionDetail);
// 获取当前用户投注的信息
router.get("/snatch_treasure/game_session_mine", snatchTreasure.gameSessionMine);
// 获取当前用户某一期投注的详情
router.get("/snatch_treasure/game_session_mine_detail", snatchTreasure.gameSessionMineDetail);

// 检查token
router.use(require("../controllers/config/check_token.js"));

// 投注
router.post("/snatch_treasure/bet", snatchTreasure.bet);
/*****************************   **************************************/

module.exports = router