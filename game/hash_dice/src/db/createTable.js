// @ts-check
const pool = require("./pools.js");
const logger = require("../common/logger").child({ "@db/createTable.js": "create table" });

async function createTable() {
    let createTableSql = `
        CREATE TABLE IF NOT EXISTS game(
            g_id TEXT PRIMARY KEY UNIQUE NOT NULL DEFAULT '',
            prize_pool TEXT  NOT NULL DEFAULT '',
            game_name TEXT NOT NULL DEFAULT '',
            key_count INTEGER NOT NULL DEFAULT '',
            quantity TEXT NOT NULL DEFAULT '',
        );
        comment on table game is '游戏';
        comment on column game.g_id is '游戏表主键';
        comment on column game.prize_pool is '全球彩奖池';
        comment on column game.game_name is '游戏名称';
        comment on column game.key_count is '所需 Key 数量';
        comment on column game.quantity is '一个 key 的额度';
        CREATE TABLE IF NOT EXISTS game_session (
            gs_id TEXT PRIMARY KEY UNIQUE NOT NULL DEFAULT '',
            creator TEXT NOT NULL DEFAULT '',
            g_id TEXT NOT NULL DEFAULT '',
            periods TEXT NOT NULL DEFAULT '',
            start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            end_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            game_state INTEGER NOT NULL DEFAULT now(),
            reward_num TEXT NOT NULL DEFAULT '',
            create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        comment on table game_session is '游戏期数信息';
        comment on column game_session.gs_id is '期数主键';
        comment on column game_session.creator is '创建人';
        comment on column game_session.g_tyle is '游戏类型';
        comment on column game_session.periods is '游戏期数';
        comment on column game_session.start_time is '开始时间';
        comment on column game_session.end_time is '结束时间';
        comment on column game_session.game_state is '游戏的状态';
        comment on column game_session.reward_num is '开奖号码';
        comment on column game_session.create_time is '创建时间'
        CREATE TABLE IF NOT EXISTS bet_order(
            bo_id TEXT PRIMARY KEY UNIQUE NOT NULL DEFAULT '',
            gs_id TEXT  NOT NULL DEFAULT '',
            extra JSON  NOT NULL DEFAULT '',
            account_name TEXT NOT NULL DEFAULT '',
            betting_time  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            bet_num  NUMERIC (20, 8) NOT NULL DEFAULT 0,
            key_count INTEGER NOT NULL DEFAULT '',
            betting_amount TEXT NOT NULL DEFAULT ''
            create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        comment on table bet_order  '用户投注记录';
        comment on table bet_order.bo_id '投注Id';
        comment on column bet_order.gs_id is '投注期数';
        comment on column bet_order.extra is '附加信息';
        comment on column bet_order.account_name is '用户 eos 帐号名称';
        comment on column bet_order.betting_time is '投注时间';
        comment on column bet_order.bet_num is '投注号码';
        comment on column bet_order.key_count is '投注数量';
        comment on column bet_order.betting_amount is '投注额度'
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