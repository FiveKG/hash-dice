//@ts-check
var option = {
    "name": "lucky-money",
    "base": {
    
    }
  };
  
  //如果有设置 LOG_LEVEL 环境变量， 则使用环境变量里的值
  if (process.env.LOG_LEVEL) {
    option.level = process.env.LOG_LEVEL;
  }
  else {
    //没有设置 ， 那么根据是否生产环境， 设置级别
    if (process.env.NODE_ENV === 'production') {
      option.level = "warn";
    }
    else {
      option.level = "debug";
    }
  }
  
  var pino = require("pino")(option);
  module.exports = pino;
  