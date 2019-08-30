### 文件说明
* `job` 目录下的各文件

#### `bonusBingo.js`
* 每天 0：00 bingo 奖金池派奖

#### `bonusHolder.js`
* 股东分红池每周一 00:00 进行分配

#### `bonusPK.js`
* 直接推荐PK奖金池每周一 00:00 进行分配

#### `bonusSafe.js`
* 收益保障池每日 00:00 进行分配

#### `listenTransfer.js`
* 监听用户投资转帐（参加 TBG1）每秒钟监听一次

#### `listenTrade.js`
* 监听用户买入, 卖出 TBG 资产转帐（参加 TBG2）每秒钟监听一次

#### `AdjustPrice.js`
* 每天 0：00 按照一定的比例调整当天的交易价格

#### `releaseAssets.js`
* 每天 0：00 按用户的等级释放资产

#### `checkInAirdrop.js`
* 每天 0：00 将用户签到获得的金额转入用户账户

#### `mining.js`
* 每天 0：00 将用户挖矿获得的金额转入用户账户

#### `wringTrade.js`
* 交易时间内，平台撮合交易，根据比例，每五分钟撮合一次，交易量不足时由平台插单

#### `mqHandler.js`
* 消息监听，主要监听区块链转帐相关的消息