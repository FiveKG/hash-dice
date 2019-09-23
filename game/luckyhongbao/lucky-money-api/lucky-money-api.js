//@ts-check
require("./initEnv")();
const express = require('express');
var isError = require("util").types.isNativeError;
const logger = require("@fjhb/logger").child({ "@": "server" });
logger.info(`init server of lucky-money.`);

const app = module.exports = express();
app.set("x-powered-by", false);
app.use(function (req, res, next) {
    logger.info(`${req.method} ${req.path}`);
    res.set({
        'Access-Control-Allow-Origin': "*",
        'Access-Control-Allow-Headers': "Content-Type , token"
    });
    if (req.method == 'OPTIONS') {
        return res.send();
    }
    next();
});

app.set('trust proxy', function (ip) {
    return ip === "127.0.0.1";
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 配置路由
app.use(require('./src/router'));

app.use(function (err, req, res, next) {
    if (isError(err)) {
        logger.error(err.message, { "stack": err.stack, "url": req.originalUrl });
        const err_msg = {};
        res.status(500).send(err_msg);
    } else {
        logger.error(JSON.stringify(err));
        res.send(err);
    }
});

// @ts-ignore
if (!module.parent) {
    const port = 8089;

    const server = app.listen(port, "0.0.0.0");

    // require("../test/socket/socket")(server);
    server.on('listening', function () {
        logger.info(`**** server of lucky-money running at http://localhost:${port}/  ****`);
        require("./src/websocket/socket-main.js")(server);
    });

    server.on("close", function () {
        logger.info(`**** server of lucky-money listening on ${port} stopped ****`);
    });
}
