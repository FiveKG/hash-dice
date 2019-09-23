// @ts-check
// require("../initEnv")();
const logger = require("@fjhb/logger").child({ [`@${ __filename }`]: "doClubRankBonus" });
const { scheduleJob } = require("node-schedule");
const { db } = require("@fjhb/db-op");
const { bonus_config } = require("../common/sysConfig");
const { Decimal } = require("decimal.js");
const { subWeeks, startOfISOWeek, endOfISOWeek, format } = require("date-fns");
const EventEmitter = require('events');

const eventEmitter = new EventEmitter();

scheduleJob({ dayOfWeek: 1, hour: 0, minute: 0, second: 0 }, agent(doBonus, 5, 1000));

/**
 * 代理
 * @param {function(): Promise<void>} doBonus 执行的方法
 * @param {number} [retryNumber] 尝试次数
 * @param {number} [idleTime] 每次尝试需要等待的时间, ms 为单位
 */
function agent(doBonus, retryNumber, idleTime) {
  try {
    let currentRetryNumber = 0;
    retryNumber = retryNumber || 5;
    idleTime = idleTime || 10000;

    eventEmitter.on('error', (err) => {
      if (currentRetryNumber >= retryNumber) {
        logger.warn(`尝试 ${currentRetryNumber} 次后还是失败, 终止本次分红操作. 请分析错误原因, 检查业务逻辑, 找出原因, 并修复.`);

        currentRetryNumber = 0;
        return;
      }

      setTimeout(doBonus, idleTime);  // 执行程序

      currentRetryNumber++;
    });

    return doBonus;
  } catch (err) {
    logger.error(err, "无法预测的报错");
  }
}

/**
 * 分红
 */
async function doBonus() {
  try {
    logger.debug(`执行分红操作 begging... `);

    // 获取配置中的分红比例 和 启动事务
    const [
      { clubBonus, symbolBonus },
      trans
    ] = await Promise.all([
      bonus_config.get(),
      db.sequelize.transaction({ "isolationLevel": "SERIALIZABLE" })
    ]);
    logger.debug(`配置中的分红比例, clubBonus: ${JSON.stringify(clubBonus)}, symbolBonus: ${JSON.stringify(symbolBonus)}`);

    try {
      logger.info("开始执行分红操作");
      // 获取当前未分配的金额
      const unallocateBonusSql = `
      SELECT data_key, data_value 
      FROM common_data 
      WHERE data_key = 'bonus_pool_amount';`;

      const commonDataInfo = await db.sequelize.query(unallocateBonusSql, {
        type: db.sequelize.QueryTypes.SELECT,
        transaction: trans,
        plain: true
      });

      if (commonDataInfo == null) {
        await trans.rollback();
        logger.warn(`common_data 表中不存在 data_key = bonus_pool_amount 的信息, 请检查业务逻辑是否正确`);
        return;
      }

      const previousWeekTime = subWeeks(new Date(), 1);
      const startTime = format(startOfISOWeek(previousWeekTime), "YYYY-MM-DD HH:mm:ss");  // 周一 00:00:00
      const endTime = format(endOfISOWeek(previousWeekTime), "YYYY-MM-DD HH:mm:ss");  // 周日 23:59:59

      logger.debug(`当前时间, ${format(new Date(), "YYYY-MM-DD HH:mm:ss")}, 分红的时间范围, [${startTime}, ${endTime}]`);

      const unallocateBonusAmountTotal = Number(commonDataInfo.data_value);   // 当前时间 未分配的 总金额

      logger.debug(`未分红的金额, unallocateBonusAmountTotal: ${unallocateBonusAmountTotal}`);

      // 注意: NUMERIC(18,4) 和 Fixed(4) 等操作都会进行四舍五入, 所以当前的结果 跟 真实的结果 是有偏差的.
      // 至于为什么这么做, 主要是 EOS链上的 代币余额(如 EOS)的数量只是保留 小数点后 4 位. 
      // 获取前五名俱乐部
      const clubRankSql = `
      SELECT c.club_id, c.creator_name, SUM(r.amount)::NUMERIC(18,4) as produce_amount 
      FROM club c 
      JOIN room r 
        ON r.club_id = c.club_id AND r.is_enable = true 
      JOIN red_envelope_game reg 
        ON reg.room_id = r.room_id 
      WHERE c.is_enable = true 
        AND c.club_id != 1 
        AND reg.create_time >= '${startTime}' 
        AND reg.create_time <= '${endTime}' 
      GROUP BY c.club_id, c.creator_name 
      ORDER BY produce_amount DESC 
      LIMIT ${clubBonus.rankRate.length};`;

      // 获取所有用户的持有代币的数量占总发放的代币数量的比例 
      const symbolHoldRateSql = `
      SELECT account_name, 
        (SUM(amount) / (
            SELECT SUM(amount) 
            FROM system_symbol_log
          )
        )::NUMERIC(18,4) AS hold_rate 
      FROM system_symbol_log 
      WHERE create_time >= '${startTime}' 
        AND create_time <= '${endTime}' 
      GROUP BY account_name 
      ORDER BY hold_rate DESC;`;

      const [
        clubRankList,
        symbolHoldList
      ] = await Promise.all([
        db.sequelize.query(clubRankSql, {
          type: db.sequelize.QueryTypes.SELECT,
          transaction: trans
        }),
        db.sequelize.query(symbolHoldRateSql, {
          type: db.sequelize.QueryTypes.SELECT,
          transaction: trans
        })
      ]);

      let clubBonusDetailInfo = {};  // 保存俱乐部分红的数量
      for (let i = 0; i < clubRankList.length; i++) {
        const clubInfo = clubRankList[i];
        const rate = clubBonus.rankRate[i];  // 因为前N名是根据 rankRate.length 获取的, 有可能得到 俱乐部排名 数组长度少于 rankRate.length

        const accountName = clubInfo.creator_name;
        const allocateAmount = Number(Decimal.div(rate, 100).mul(unallocateBonusAmountTotal).toFixed(4));

        if (clubBonusDetailInfo[accountName]) {
          clubBonusDetailInfo[accountName] = Number(Decimal.add(clubBonusDetailInfo[accountName], allocateAmount).toFixed(4));
        } else {
          clubBonusDetailInfo[accountName] = allocateAmount;
        }
      }

      let symbolBonusDetailInfo = {};  // 保存代币分红的数量
      const shouldAllocateSymbolHoldAmount = Number(Decimal.div(symbolBonus.totalRate, 100).mul(unallocateBonusAmountTotal).toFixed(4));
      for (let symbolHoldInfo of symbolHoldList) {
        const accountName = symbolHoldInfo.account_name;
        const allocateAmount = Number(Decimal.mul(symbolHoldInfo.hold_rate, shouldAllocateSymbolHoldAmount).toFixed(4));

        if (symbolBonusDetailInfo[accountName]) {
          symbolBonusDetailInfo[accountName] = Number(Decimal.add(symbolBonusDetailInfo[accountName], allocateAmount).toFixed(4));
        } else {
          symbolBonusDetailInfo[accountName] = allocateAmount;
        }
      }

      // 分红分配完毕
      logger.debug(`分红分配完毕, 结果:`);
      logger.debug(`俱乐部分红, clubBonusDetailInfo: ${JSON.stringify(clubBonusDetailInfo)}`);
      logger.debug(`代币分红, symbolBonusDetailInfo: ${JSON.stringify(symbolBonusDetailInfo)}`)

      // 添加分红到每个用户的 余额 中
      const [...accountNames] = new Set(Object.keys(clubBonusDetailInfo).concat(Object.keys(symbolBonusDetailInfo)));

      const accountListSql = `
      SELECT account_name, balance 
      FROM eos_account 
      WHERE account_name in ('${accountNames.join("','")}')`;

      const accountList = await db.sequelize.query(accountListSql, {
        type: db.sequelize.QueryTypes.SELECT,
        transaction: trans
      });

      for (let accountInfo of accountList) {
        const accountName = accountInfo.account_name;

        // 日志写两条, 余额只更新一次
        let bonusAmount = 0;
        if (clubBonusDetailInfo[accountName]) {
          bonusAmount = Number(Decimal.add(bonusAmount, clubBonusDetailInfo[accountName]).toFixed(4));

          const addAccountLogSql = `
          INSERT INTO account_balance_log (
            account_name, change_amount, current_balance, op_type, remark, create_time
          ) 
          VALUES (
            '${accountName}', 
            ${clubBonusDetailInfo[accountName]}, 
            ${Number(Decimal.add(accountInfo.balance, bonusAmount).toFixed(4))}, 
            '分红', 
            '用户 ${accountName} 由于 [俱乐部分红] 得到 数量为 ${clubBonusDetailInfo[accountName]} 的分红', 
            '${format(new Date(), "YYYY-MM-DD HH:mm:ss.SSSZ")}'
          );`;

          await db.sequelize.query(addAccountLogSql, {
            type: db.sequelize.QueryTypes.INSERT,
            transaction: trans
          });
        }
        if (symbolBonusDetailInfo[accountName]) {
          bonusAmount = Number(Decimal.add(bonusAmount, symbolBonusDetailInfo[accountName]).toFixed(4));

          const addAccountLogSql = `
          INSERT INTO account_balance_log (
            account_name, change_amount, current_balance, op_type, remark, create_time
          ) 
          VALUES (
            '${accountName}', 
            ${symbolBonusDetailInfo[accountName]}, 
            ${Number(Decimal.add(accountInfo.balance, bonusAmount).toFixed(4))}, 
            '分红', 
            '用户 ${accountName} 由于 [代币分红] 得到 数量为 ${symbolBonusDetailInfo[accountName]} 的分红', 
            '${format(new Date(), "YYYY-MM-DD HH:mm:ss.SSSZ")}'
          );`;

          await db.sequelize.query(addAccountLogSql, {
            type: db.sequelize.QueryTypes.INSERT,
            transaction: trans
          });
        }

        const updateAccountSql = `
        UPDATE eos_account 
        SET balance = ${Number(Decimal.add(accountInfo.balance, bonusAmount).toFixed(4))} 
        WHERE account_name = '${accountName}';`;

        await db.sequelize.query(updateAccountSql, {
          type: db.sequelize.QueryTypes.UPDATE,
          transaction: trans
        });
      }
      
      await trans.commit();
      logger.info("执行分红操作完成, 提交事务");
    } catch (err) {
      await trans.rollback();
      logger.error(err, "执行俱乐部分红时报错了, 事务回滚");

      eventEmitter.emit("error", err);
    }

    logger.debug(`分红操作完成 stopping...`);
  } catch (err) {
    logger.error(err, "获取分红比例配置 或 启动事务 时报错了");
    
    eventEmitter.emit("error", err);
  }
}

/**
 * 俱乐部分红需求
 * 0. 每周分红一次，计算分红时间节点为每周一 00:00:00, 计算截止周日23:59:59时
 * 1. 俱乐部按每周最终排名前五名进行分红
 * 2. 当前未分配分红累计的20%为俱乐部每周分红额
 * 3. 将分红的EOS转入获得分红俱乐部创建玩家的预存账户余额
 * 4. 排名第1名的俱乐部获得分红额=当前未分配分红累计10%
 * 5. 排名第2名的俱乐部获得分红额=当前未分配分红累计5%
 * 6. 排名第3名的俱乐部获得分红额=当前未分配分红累计3%
 * 7. 排名第4名的俱乐部获得分红额=当前未分配分红累计1.5%
 * 8. 排名第5名的俱乐部获得分红额=当前未分配分红累计0.5%
 */

/**
 * 代币分红需求
 * 0. 玩家按每周一 00:00:00 持有的RB数量比例进行分红, 计算截止周日23:59:59时
 * 1. 当前未分配分红累计的50%为玩家每周分红额
 * 2. 玩家持有代币数量（不统计官方持币账号）并计算出玩家持币比例（总额按已空投额计算）
 * 3. 按玩家持币比例及未分配分红累计额计算出玩家应得分红额
 * 4. 将各玩家应得的分红转入玩家的预存账户余额内
 */
