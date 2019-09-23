// @ts-check

/**
 * 获取随机整数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 * @returns {Number} 随机整数
 */
function randInt(min, max) {
  return Math.random() * (max - min + 1) + min | 0;
}

module.exports = {
  randInt
};
