// @ts-check
const express = require("express");
const logger = require("./src/common/logger.js");

const app = express();
const nginx_host = `127.0.0.1`;

logger.info(`init server of pools server.`);
app.set("x-powered-by", false);

app.use(function (req, res, next) {
  logger.info(`${req.method} ${req.path}`);
  res.set({
    'Access-Control-Allow-Origin': "*",
    'Access-Control-Allow-Headers': "Content-Type,token,req_id,client_id,lang"
  });
  if (req.method == 'OPTIONS') {
    return res.end();
  }
  next();
});

app.set('trust proxy', function (ip) {
  //除非 trust proxy 设置正确，否则应用会误将代理服务器的 IP 地址注册为客户端 IP 地址。
  //http://www.expressjs.com.cn/guide/behind-proxies.html
  if (!nginx_host) {
    return false; //未设置，就认为当前程序直接面对互联网。
  } else {
    return ip === nginx_host;
  }
});

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(require("./src/router/router"));

const port = 9527
const hostname = "0.0.0.0"
const server = module.exports = app.listen(port, hostname);
server.on('listening', async () => {
  // require("./src/build/initServer.js");
  logger.info(`**** server of pools running at http://localhost:${port}/  ****`)
});

server.on("close", () => {
  logger.info(`**** server of pools listening on ${port} stopped ****`);
});
