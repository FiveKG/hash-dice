// @ts-check
const express = require("express");
const router = express.Router();
const config = require("../controllers/config");
const tbg = require("../controllers/tbg");

// 获取服务运行状态
router.get("/common/health", require("../common/health.js"));
// 获取配置信息
router.get("/config/get_config", config.getConfig);



module.exports = router