/**
 * 设置分配比例
 * @param { number } position 
 */
function setRate(position) {
    if (position === 1) {
        return 50 / 100;
    } else if (position === 2) {
        return 20 / 100;
    } else if (position === 3) {
        return 1 / 100;
    } else if (position === 4) {
        return 1.5 / 100;
    } else if (position === 5) {
        return 2 / 100;
    } else if (position === 6) {
        return 2.5 / 100;
    } else if (position === 7) {
        return 3 / 100;
    } else if (position === 8) {
        return 5 / 100;
    } else {
        return 10 / 100;
    } 
}

module.exports = {
    setRate,
}