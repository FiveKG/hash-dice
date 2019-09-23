//@ts-check

/**
 * 把 originalStr 的长度，使用 padString 补充到指定长度。
 *
 * @param {string} originalStr
 * @param {number} targetLength
 * @param {string} padString
 * @returns {string}
 */
function padStart(originalStr , targetLength, padString) {
    targetLength = targetLength >> 0; //truncate if number, or convert non-number to 0;
    padString = String(typeof padString !== 'undefined' ? padString : ' ');
    if (originalStr.length >= targetLength) {
        return String(originalStr);
    } else {
        targetLength = targetLength - originalStr.length;
        if (targetLength > padString.length) {
            padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
        }
        return padString.slice(0, targetLength) + String(originalStr);
    }
}

module.exports = padStart;