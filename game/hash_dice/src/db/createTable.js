// @ts-check
const pool = require("./pools.js");
const logger = require("../common/logger").child({ "@db/createTable.js": "create table" });

async function createTable() {
    let createTableSql = `
        CREATE TABLE IF NOT EXISTS game(
            g_id TEXT PRIMARY KEY UNIQUE NOT NULL DEFAULT '',
            game_name TEXT NOT NULL DEFAULT ''
        );
        comment on table game is '游戏';
        comment on column game.g_id is '游戏表主键';
        comment on column game.game_name is '游戏名称';
        CREATE TABLE IF NOT EXISTS bet_order(
            id TEXT PRIMARY KEY UNIQUE NOT NULL DEFAULT '',
            bet_block_num TEXT NOT NULL DEFAULT '',
            reward_block_num TEXT NOT NULL DEFAULT '',
            account_name TEXT NOT NULL DEFAULT '',
            bet_num  TEXT NOT NULL DEFAULT 0,
            betting_amount TEXT NOT NULL DEFAULT '',
            reward TEXT NOT NULL DEFAULT '',
            game_rate TEXT NOT NULL DEFAULT '',  
            agent_account TEXT NOT NULL DEFAULT '',
            pay_type TEXT NOT NULL DEFAULT '',
            create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        comment on table bet_order is '用户投注记录';
        comment on column bet_order.id is '投注Id';
        comment on column bet_order.bet_block_num is '投注区块号';
        comment on column bet_order.reward_block_num is '中奖区块号';
        comment on column bet_order.account_name is '用户 eos 帐号名称';
        comment on column bet_order.bet_num is '投注号码';
        comment on column bet_order.betting_amount is '投注额度';
        comment on column bet_order.reward is '奖金';
        comment on column bet_order.game_rate is '中奖赔率';
        comment on column bet_order.agent_account is '代投账号';
        comment on column bet_order.pay_type is '付款类型';
        comment on column bet_order.create_time is '投注时间';

        CREATE TABLE IF NOT EXISTS reward(
            reward_block_num TEXT  PRIMARY KEY UNIQUE NOT NULL DEFAULT '',
            reward_block_id TEXT NOT NULL DEFAULT '',
            reward_num TEXT NOT NULL DEFAULT '',
            create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        comment on table reward is '区块中奖信息';
        comment on column reward.reward_block_num is '开奖区块编号';
        comment on column reward.reward_block_id is '开奖区块ID';
        comment on column reward.reward_num is '开奖数字';
        comment on column reward.create_time is '开奖时间';
    `

    try {
        logger.info("init all database table");
        let { rows } = await pool.query(createTableSql);
        logger.debug(`create table success, create result: ${ rows }`);
    } catch (err) {
        logger.error(`create table error: ${ err }`);
        throw Error(`create table error: ${ err }`);
    }    
}

module.exports = createTable;