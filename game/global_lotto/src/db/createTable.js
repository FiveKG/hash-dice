// @ts-check
const pool = require("./pools.js");
const logger = require("../common/logger").child({ "@db/createTable.js": "create table" });

async function createTable() {
    let createTableSql = `
        CREATE TABLE IF NOT EXISTS game(
            g_id TEXT PRIMARY KEY UNIQUE NOT NULL DEFAULT '',
            game_name TEXT NOT NULL DEFAULT '',
            prize_pool NUMERIC (20, 8) NOT NULL DEFAULT 0,
            bottom_pool NUMERIC (20, 8) NOT NULL DEFAULT 0,
            reserve_pool NUMERIC (20, 8) NOT NULL DEFAULT 0,
            create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        comment on table game is '游戏表';
        comment on column game.g_id is '游戏表 id';
        comment on column game.game_name is '游戏名称';
        comment on column game.prize_pool is '全球彩奖池';
        comment on column game.bottom_pool is '全球彩底池';
        comment on column game.reserve_pool is '全球彩储备池';;
        comment on column game.create_time is '创建时间';
        CREATE TABLE IF NOT EXISTS game_session (
            gs_id TEXT PRIMARY KEY UNIQUE NOT NULL DEFAULT '',
            g_id TEXT NOT NULL DEFAULT '',
            creator TEXT NOT NULL DEFAULT '',
            periods INTEGER NOT NULL DEFAULT 0,
            extra JSON NOT NULL DEFAULT '{}'::JSONB,
            start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            end_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            reward_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            game_state INTEGER NOT NULL DEFAULT 0,
            reward_num TEXT NOT NULL DEFAULT '',
            create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        comment on table game_session is '游戏期数信息';
        comment on column game_session.gs_id is '游戏期数信息表 id';
        comment on column game_session.g_id is '游戏表 id';
        comment on column game_session.creator is '创建人';
        comment on column game_session.periods is '游戏期数';
        comment on column game_session.start_time is '开始时间';
        comment on column game_session.reward_time is '开奖时间';
        comment on column game_session.end_time is '结束时间';
        comment on column game_session.game_state is '游戏的状态';
        comment on column game_session.reward_num is '开奖号码';
        comment on column game_session.create_time is '创建时间';
        CREATE TABLE IF NOT EXISTS bet_order(
            bo_id TEXT PRIMARY KEY UNIQUE NOT NULL DEFAULT '',
            gs_id TEXT UNIQUE NOT NULL DEFAULT '',
            extra NUMERIC (20, 8) NOT NULL DEFAULT 0,
            account_name NUMERIC (20, 8) NOT NULL DEFAULT 0,
            bet_num  NUMERIC (20, 8) NOT NULL DEFAULT 0,
            key_count  NUMERIC (20, 8) NOT NULL DEFAULT 0,
            amount  NUMERIC (20, 8) NOT NULL DEFAULT 0,
            create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        comment on table bet_order is '用户投注记录';
        comment on column bet_order.bo_id is '用户资产表 id';
        comment on column bet_order.gs_id is '游戏期数信息 id';
        comment on column bet_order.extra is '附加信息';
        comment on column bet_order.account_name is '投注用户';
        comment on column bet_order.bet_num is '投注号码';
        comment on column bet_order.key_count is '投注数量';
        comment on column bet_order.amount is '投注额度';
        comment on column bet_order.create_time is '创建时间';
        CREATE TABLE IF NOT EXISTS award_session(
            aw_id TEXT PRIMARY KEY UNIQUE NOT NULL DEFAULT '',
            gs_id TEXT UNIQUE NOT NULL DEFAULT '',
            extra NUMERIC (20, 8) NOT NULL DEFAULT 0,
            account_name NUMERIC (20, 8) NOT NULL DEFAULT 0,
            bet_num  NUMERIC (20, 8) NOT NULL DEFAULT 0,
            win_key  NUMERIC (20, 8) NOT NULL DEFAULT 0,
            win_type  NUMERIC (20, 8) NOT NULL DEFAULT 0,
            one_key_bonus  NUMERIC (20, 8) NOT NULL DEFAULT 0,
            create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            bonus_amount  NUMERIC (20, 8) NOT NULL DEFAULT 0
        );
        comment on table award_session is '派奖表';
        comment on column award_session.aw_id is '用户资产表 id';
        comment on column award_session.gs_id is '游戏期数信息 id';
        comment on column award_session.extra is '附加信息';
        comment on column award_session.account_name is '投注用户';
        comment on column award_session.create_time is '创建时间';
        comment on column award_session.bet_num is '投注号码';
        comment on column award_session.win_key is '中奖 key 数';
        comment on column award_session.win_type is '中奖类别';
        comment on column award_session.one_key_bonus is '单注奖金';
        comment on column award_session.bonus_amount is '总金额';
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

// 删除所有的表
async function dropAllTable() {
    try {
        // 如果重复则不再插入，直接返回
        let querySql = `
            drop table if exists game;
            drop table if exists game_session;
            drop table if exists bet_order;
        `
        logger.info("drop all table");
        await pool.query(querySql);
        logger.info("drop ok");
    } catch (err) {
        throw err;
    }
}

module.exports = {
    createTable,
    dropAllTable
}