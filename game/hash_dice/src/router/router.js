// @ts-check
const express = require("express");
const router = express.Router();
const config = require("../controllers/config");
const hash_dice = require("../controllers/hash_dice");

// 获取服务运行状态
router.get("/common/health", require("../common/health.js"));
// 获取配置信息
router.get("/config/get_config", config.getConfig);
//获取庄家额度
router.get('/hash_dice/banker',hash_dice.getBanker);
//获取当前游戏赔率
router.get('/hash_dice/game_rate',hash_dice.getGameRate);
//获取所有投注
router.get('/hash_dice/bet_list',hash_dice.getAllBetList);
//获取玩家投注列表
router.get('/hash_dice/bet_list_mine',hash_dice.getUserBetList);
//获取用户某个投注详情
router.get('/hash_dice/bet_list_mine_detail',hash_dice.getUserBetDetail)
//下注
router.post('/hash_dice/bet',hash_dice.betting);
module.exports = router