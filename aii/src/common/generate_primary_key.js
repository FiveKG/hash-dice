const uuidv4 = require("uuid/v4");

/**
 * 生成主键值
 * @returns {String}
 */
function generate_primary_key(){    
  return uuidv4();
}

module.exports = generate_primary_key;