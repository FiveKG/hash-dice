//@ts-check
const redis = require("@fjhb/lm-redis");
const logger = require("@fjhb/logger");

/**
 * 调用 ccap 模块， 生成图片验证码。并使用随机数指定的值作为key，把生成的验证码的字符串，存储到 redis里，过期时间是60秒。
 * @param {string} rand_key 随机数
 */
function generate_captcha(rand_key) {
    var ccap = require('ccap');
    var captcha = ccap({
        width: 120,//set width,default is 256
        height: 50,//set height,default is 60
        offset: 30,//set text spacing,default is 40
        quality: 100,//set pic quality,default is 50
        fontsize: 36,//set font size,default is 57
        generate: get_rand
    });
    var ary = captcha.get();
    var txt = ary[0];
    var buf = ary[1];
    redis.set("captcha:" + rand_key, txt, 'EX', 60);
    return { "txt": txt, "buf": buf };
}

/**
 * 检查图片验证码是否合法
 * @param {string} key 生成验证码时的随机数
 * @param {string} captcha_code 用户输入的验证码的字符串
 * @returns {Promise<boolean>} 
 */
async function check_captcha(key, captcha_code) {
    logger.info(`check_captcha ${key},${captcha_code}`);

    if (captcha_code == "1111") {
        //todo: 开发时 可用 1111 作为万能验证码
        return true;
    }
    try {
        var result = await redis.get("captcha:" + key);
        logger.info(`图片验证码, result: ${result}`);
        if (!result) {
            return false;
        }
        else {
            logger.info(`图片验证码, ${captcha_code}, ${result}`);
            if (result.toLowerCase() === captcha_code.toLowerCase()) {
                return true;
            }
            else {
                return false;
            }
        }
    } catch (error) {
        logger.error("check_captcha 时，redis 出错.", error);
        throw error;
    }
}


/**
 * 验证码字符的值域
 */
var char_ary = [
    '2', '3', '4', '5', '6', '7', '8', '9',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j',
    'k', 'm', 'n', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J',
    'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y', 'Z'
];

/**
 * 生成 4位的随机字符
 */
function get_rand() {
    var result = [];
    for (var i = 0; i <= 3; i++) {
        var tmp_idx = Math.floor(Math.random() * 100) % 55;
        result.push(char_ary[tmp_idx]);
    }
    var rand = result.join("");

    return rand;
}

module.exports = {
    "generate_captcha": generate_captcha,
    "check_captcha": check_captcha
};