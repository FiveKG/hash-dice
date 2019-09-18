// @ts-check
module.exports = {
  get_status          : require("./get_status"),            // 获取状态信息
  inspect_req_data    : require("./inspect_req_data"),      // 检查请求数据
  generate_primary_key: require("./generate_primary_key"),  // 生成主键
  check_role          : require("./check_role"),            // 检查角色
  redis: require("./redis.js"),
  xhr: require("./xhr"),
};  