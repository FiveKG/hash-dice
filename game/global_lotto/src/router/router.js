// @ts-check
const express = require("express");
const router = express.Router();
const config = require("../controllers/config");
const globalLotto = require("../controllers/global_lotto");

// 获取服务运行状态
router.get("/common/health", require("../common/health.js"));
// 获取配置信息
router.get("/config/get_config", config.getConfig);

/*****************************   **************************************/
// 获取全球彩奖池，倒计时，期数
router.get("/global_lotto/info", globalLotto.getInfo);
// 最新一期开奖情况
router.get("/global_lotto/latest_game_session", globalLotto.latestGameSession);
// 获取所有期数及开奖信息
router.get("/global_lotto/game_session", globalLotto.gameSession);
// 获取某一期开奖详情
router.get("/global_lotto/game_session_detail", globalLotto.gameSessionDetail);
// 获取当前用户投注的信息
router.get("/global_lotto/game_session_mine", globalLotto.gameSessionMine);
// 获取当前用户某一期投注的详情
router.get("/global_lotto/game_session_mine_detail", globalLotto.gameSessionMineDetail);
// 投注
router.post("/global_lotto/bet", globalLotto.bet);
// 随机投注
router.post("/global_lotto/random_bet", globalLotto.randomBet);
/*****************************   **************************************/

module.exports = router