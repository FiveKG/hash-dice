// @ts-check
const logger = require("@fjhb/logger");
const { get_status, captcha_helper } = require("../../common");

module.exports = function (req, res, next) {
  try {
    const req_data = req.query;
    if (!req_data.rand_code || typeof req_data.rand_code !== "string") {
      logger.debug(`参数不合法, rand_code: ${req_data.rand_code}`);
      return res.send(get_status("参数不合法"));
    }

    // logger.info("get image verify code");
    // logger.debug(`request params: ${JSON.stringify(req_data)}`);

    var cap = captcha_helper.generate_captcha(req_data.rand_code);

    res.set('Content-Type', 'image/*');

    // logger.info("get image verify code completed");

    res.send(get_status(1, cap.buf.toString("base64")));
  } catch (err) {
    logger.error(err, "get image verify code failed");
    next(err);
  }
}
