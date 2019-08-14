// const uuidv4 = require("uuid/v4");
const instauuid = require('instauuid');

// /**
//  * 生成主键值
//  * @returns {String}
//  */
// function generate_primary_key(){    
//   return uuidv4();
// }

function generate_primary_key() {
  return instauuid('hex');
}

module.exports = generate_primary_key;