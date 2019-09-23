// @ts-check

/**
 * 获取随机万分比权重列表
 * @param {Number} peopleNumber 玩家数
 */
function randomRate(peopleNumber) {
  if (peopleNumber > 100) return null;
  
  const totalNumber = 10000;  // 总数量
  const maxNumber = 0.5 * totalNumber;  // 上限
  let remainNumber = maxNumber - peopleNumber;  // 保留

  let list = [];

  let randomFindCount = 0;

  while (peopleNumber > 0) {
    let randomNumber = getRandomNumber(remainNumber);  // 有可能获取到 0
    if (randomNumber <= maxNumber) {
      if (list.indexOf(randomNumber + 1) == -1) {
        list.push(randomNumber + 1);
        remainNumber -= randomNumber;
        peopleNumber--;
        randomFindCount = 0;
      } else {
        randomFindCount++;
      }
      if (randomFindCount > 5) { // 如果存在次数大于 5, 将最大值干掉
        let max = Math.max(...list);
        list.splice(list.indexOf(max), 1);
        peopleNumber++;
        remainNumber += max - 1;
        randomFindCount = 0;
      }
    }
  }
  let total = list.reduce((s, n) => s + n);  // 累加获取到的总数

  if (totalNumber > total) {
    let disparity = totalNumber - total;
    let index = list.length - 1;
    while (disparity > 0) {
      let newValue = list[index] + 1;
      if (list.indexOf(newValue) == -1) {
        list[index] = newValue;
        disparity--;
      }
      if (index > 0) {
        index--;
      } else {
        index = list.length - 1;
      }
    }
  }

  list = list.sort((a, b) => a - b);

  return list;
}

function getRandomNumber(value) {
  return Math.random() * value * (Math.min(0.45, Math.max(0.1, Math.random()))) >> 0
}

module.exports = randomRate;
