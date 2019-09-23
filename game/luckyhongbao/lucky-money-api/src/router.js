//@ts-check
const express = require("express");
const router = express.Router();

/*********************** 不需要登录 start **********************/

// 获取配置
router.get("/common/config", require("./controllers/common/config.js"));

// 用户登陆
router.post("/account/login", require("./controllers/account/login.js"));

// 获取用户俱乐部信息
router.get("/club/summary", require("./controllers/club/summary.js"));

// 获取官方俱乐部信息
router.get("/club/get_office_room", require("./controllers/club/get_office_room.js"));


// 获取官方俱乐部信息
router.get("/club/get_red_special_envelope", require("./controllers/club/get_red_special_envelope.js"));

// 分红池
router.get("/game/bonus_pool", require("./controllers/game/bonus_pool.js"));

// 已空投的代币数量
router.get("/game/airdrop_amount", require("./controllers/game/airdrop_amount.js"));

// 俱乐部排行榜
router.get("/club/leaderboard", require("./controllers/club/leaderboard.js"));

// 奖金排行榜
router.get("/account/reward_leaderboard", require("./controllers/account/reward_leaderboard.js"));

/*********************** 不需要登录 end **********************/
// 获取房间中的红包
router.get("/room/get_red_envelope", require("./controllers/room/get_red_envelope.js"));

// 检查token
// router.use(require("./controllers/common/check_token.js"));

/*********************** 需要登录 start **********************/

// 检查是否已建立推荐关系
router.post("/account/check_relation", require("./controllers/account/check_relation.js"));

// 添加推荐人
router.post("/account/add_referrer", require("./controllers/account/add_referrer.js"));

// 获取房间中的红包
router.get("/room/get_red_envelope", require("./controllers/room/get_red_envelope.js"));

// 获取用户加入的俱乐部信息
router.get("/club/get_account_club", require("./controllers/club/get_account_club.js"));

// 加入俱乐部
router.post("/club/join", require("./controllers/club/join.js"));

// 创建俱乐部
router.post("/club/create", require("./controllers/club/create.js"));

// 获取用户俱乐部
router.get("/account/myclub", require("./controllers/account/myclub.js"));

// 获取用户余额
router.get("/account/get_balance", require("./controllers/account/get_balance.js"));

// 创建房间
router.post("/room/create", require("./controllers/room/create.js"));

// 抢红包
router.post("/room/snatch_red_envelope", require("./controllers/room/snatch_red_envelope.js"));

// 检查用户是否已抢红包
router.get("/room/check_snatched", require("./controllers/room/check_snatched.js"));

// 用户提现
router.post("/account/withdraw", require("./controllers/account/withdraw"));

// 获取用户余额变动日志列表
router.get("/account_balance_log/search", require("./controllers/account_balance_log/search"));

// 获取用户下级列表
router.get("/account/get_lower_list", require("./controllers/account/get_lower_list"));

// 我的分红
router.get("/account/my_bonus", require("./controllers/account/my_bonus.js"));

// 我的奖金列表
router.get("/account/my_reward_list", require("./controllers/account/my_reward_list.js"));

/*********************** 需要登录 end **********************/

module.exports = router;