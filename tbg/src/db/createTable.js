// @ts-check
const pool = require("./pools.js");
const logger = require("../common/logger").child({ "@db/createTable.js": "create table" });

async function createTable() {
    let createTableSql = `
        CREATE TABLE IF NOT EXISTS account(
            id TEXT PRIMARY KEY UNIQUE NOT NULL DEFAULT '',
            account_name TEXT UNIQUE NOT NULL DEFAULT '',
            refer_count INTEGER NOT NULL DEFAULT 0,
            refer_code TEXT NOT NULL DEFAULT '',
            state INTEGER NOT NULL DEFAULT 0,
            account_type TEXT NOT NULL DEFAULT '',
            create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        comment on table account is '账号表';
        comment on column account.id is '账户表 id';
        comment on column account.account_name is '用户 eos 帐号名称';
        comment on column account.refer_count is '账户创建时间';
        comment on column account.refer_code is '用户推荐的人数';
        comment on column account.state is '用户的推荐号';
        comment on column account.account_type is '账号类型';
        comment on column account.create_time is '状态';
        CREATE TABLE IF NOT EXISTS sub_account (
            id TEXT PRIMARY KEY UNIQUE NOT NULL DEFAULT '',
            pid TEXT NOT NULL DEFAULT '',
            root_node TEXT NOT NULL DEFAULT '',
            main_account TEXT NOT NULL DEFAULT '',
            sub_account_name TEXT NOT NULL DEFAULT '',
            level INTEGER NOT NULL DEFAULT 0,
            position INTEGER NOT NULL DEFAULT 0,
            create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        comment on table sub_account is '子帐号表';
        comment on column sub_account.id is '子帐号表 id';
        comment on column sub_account.pid is '子帐号在三三公排中对应的父 id';
        comment on column sub_account.root_node is '三三公排某个根节点帐号';
        comment on column sub_account.main_account is '子帐号对应的 eos 帐号';
        comment on column sub_account.sub_account_name is '子帐号名称';
        comment on column sub_account.level is '在三三公排的层级';
        comment on column sub_account.position is '子帐号在三三公排对应层级的位置';
        comment on column sub_account.create_time is '子帐号创建时间';
        CREATE TABLE IF NOT EXISTS balance(
            id TEXT PRIMARY KEY UNIQUE NOT NULL DEFAULT '',
            account_name TEXT UNIQUE NOT NULL DEFAULT '',
            withdraw_enable NUMERIC (20, 8) NOT NULL DEFAULT 0,
            repeat_currency NUMERIC (20, 8) NOT NULL DEFAULT 0,
            lotto_currency  NUMERIC (20, 8) NOT NULL DEFAULT 0,
            game_currency  NUMERIC (20, 8) NOT NULL DEFAULT 0,
            create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        comment on table balance is '用户资产表';
        comment on column balance.id is '用户资产表 id';
        comment on column balance.account_name is '用户 eos 帐号名称';
        comment on column balance.withdraw_enable is '可提现资产';
        comment on column balance.repeat_currency is '复投资产';
        comment on column balance.lotto_currency is '全球彩彩码';
        comment on column balance.game_currency is '游戏资产';
        comment on column balance.create_time is '创建时间';
        CREATE TABLE IF NOT EXISTS referrer(
            id TEXT PRIMARY KEY UNIQUE NOT NULL DEFAULT '',
            referrer_name TEXT,
            account_name TEXT UNIQUE NOT NULL DEFAULT '',
            create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        comment on table referrer is '推荐表';
        comment on column referrer.id is '推荐表 id';
        comment on column referrer.referrer_name is '推荐人帐号名称';
        comment on column referrer.account_name is '被推荐人的账户名称';
        comment on column referrer.create_time is '创建时间';
        CREATE TABLE IF NOT EXISTS balance_log(
            id serial PRIMARY KEY UNIQUE NOT NULL,
            account_name TEXT NOT NULL DEFAULT '',
            change_amount NUMERIC (20, 8) NOT NULL DEFAULT 0,
            current_balance NUMERIC (20, 8) NOT NULL DEFAULT 0,
            op_type TEXT NOT NULL DEFAULT '',
            remark TEXT NOT NULL DEFAULT '',
            create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        comment on table balance_log is '用户账户余额变动表';
        comment on column balance_log.id is '变动表 id(自增)';
        comment on column balance_log.account_name is '用户 eos 帐号名称';
        comment on column balance_log.change_amount is '变动额度';
        comment on column balance_log.current_balance is '变动后的余额';
        comment on column balance_log.op_type is '操作类型';
        comment on column balance_log.remark is '操作备注';
        comment on column balance_log.create_time is '创建时间';
        CREATE TABLE IF NOT EXISTS system_pools(
            id TEXT PRIMARY KEY UNIQUE NOT NULL DEFAULT '',
            pool_type TEXT UNIQUE NOT NULL DEFAULT '',
            pool_amount NUMERIC (20, 8) NOT NULL DEFAULT 0
        );
        comment on table system_pools is '系统奖池表';
        comment on column system_pools.id is '系统奖池表的 id';
        comment on column system_pools.pool_type is '奖池的类型';
        comment on column system_pools.pool_amount is '奖池的金额';
        CREATE TABLE IF NOT EXISTS system_op_log(
            id serial PRIMARY KEY UNIQUE NOT NULL,
            change_amount NUMERIC (20, 8) NOT NULL DEFAULT 0,
            current_balance NUMERIC (20, 8) NOT NULL DEFAULT 0,
            op_type TEXT NOT NULL DEFAULT '',
            remark TEXT NOT NULL DEFAULT '',
            create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        comment on table system_op_log is '系统总账变动日志表';
        comment on column system_op_log.id is '奖池变动表的 id';
        comment on column system_op_log.change_amount is '变动的额度';
        comment on column system_op_log.current_balance is '变动后的额度';
        comment on column system_op_log.op_type is '操作类型';
        comment on column system_op_log.remark is '备注';
        comment on column system_op_log.create_time is '创建时间';
        CREATE TABLE IF NOT EXISTS account_op(
            id serial PRIMARY KEY UNIQUE NOT NULL,
            account_name TEXT NOT NULL DEFAULT '',
            op_type TEXT NOT NULL DEFAULT '',
            remark TEXT NOT NULL DEFAULT '',
            create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        comment on table account_op is '用户操作记录';
        comment on column account_op.id is '用户的操作记录表的 id';
        comment on column account_op.account_name is '用户帐号名称';
        comment on column account_op.op_type is '用户的操作记录';
        comment on column account_op.remark is '备注';
        comment on column account_op.create_time is '创建时间';
        CREATE TABLE IF NOT EXISTS trade(
            id serial PRIMARY KEY UNIQUE NOT NULL,
            account_name TEXT NOT NULL DEFAULT '',
            trade_type TEXT NOT NULL DEFAULT '',
            extra JSON NOT NUll DEFAULT '{}'::JSONB,
            amount NUMERIC (20, 8) NOT NULL DEFAULT 0,
            trx_amount NUMERIC (20, 8) NOT NULL DEFAULT 0，
            price NUMERIC (20, 8) NOT NULL DEFAULT 0,
            state TEXT NOT NULL DEFAULT '',
            create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            finished_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        comment on table trade is '交易 TBG';
        comment on column trade.id is '主键 id';
        comment on column trade.account_name is '用户帐号名称';
        comment on column trade.trade_type is '交易类型';
        comment on column trade.extra is '资产包 id，用于记录用户购买资产包';
        comment on column trade.amount is '请求交易的数量';
        comment on column trade.trx_amount is '成交的数量';
        comment on column trade.price is '价格';
        comment on column trade.state is '状态';
        comment on column trade.create_time is '创建时间';
        CREATE TABLE IF NOT EXISTS trade_log(
            id serial PRIMARY KEY UNIQUE NOT NULL,
            tr_id TEXT NOT NULL DEFAULT '',
            trade_type TEXT NOT NULL DEFAULT '',
            amount NUMERIC (20, 8) NOT NULL DEFAULT 0,
            price NUMERIC (20, 8) NOT NULL DEFAULT 0,
            volume NUMERIC (20, 8) NOT NULL DEFAULT 0,
            memo TEXT NOT NULL DEFAULT '',
            create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        comment on table trade_log is '交易日志';
        comment on column trade_log.id is '主键 id';
        comment on column trade_log.tr_id is '请求 id';
        comment on column trade_log.trade_type is '交易类型';
        comment on column trade_log.amount is '数量';
        comment on column trade_log.price is '备注说明';
        comment on column trade_log.volume is '价格';
        comment on column trade_log.memo is '成交金额';
        comment on column trade_log.create_time is '创建时间';
        CREATE TABLE IF NOT EXISTS tbg_balance(
            id serial PRIMARY KEY UNIQUE NOT NULL,
            account_name TEXT NOT NULL DEFAULT '',
            release_amount NUMERIC (20, 8) NOT NULL DEFAULT 0,
            sell_amount NUMERIC (20, 8) NOT NULL DEFAULT 0,
            active_amount  NUMERIC (20, 8) NOT NULL DEFAULT 0,
            create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        comment on table tbg_balance is '用户 TBG 资产表';
        comment on column tbg_balance.id is '用户资产表';
        comment on column tbg_balance.account_name is '用户帐号名称';
        comment on column tbg_balance.release_amount is '释放池资产';
        comment on column tbg_balance.sell_amount is '可售额度';
        comment on column tbg_balance.active_amount is '可售余额';
        comment on column tbg_balance.create_time is '创建时间';
        CREATE TABLE IF NOT EXISTS assets_package(
            id serial PRIMARY KEY UNIQUE NOT NULL,
            amount NUMERIC (20, 8) NOT NULL DEFAULT 0,
            saleable_multiple NUMERIC (3, 2) NOT NULL DEFAULT 0,
            mining_multiple NUMERIC (3, 2) NOT NULL DEFAULT 0,
            release_multiple NUMERIC (3, 2) NOT NULL DEFAULT 0,
            amount_type TEXT NOT NULL DEFAULT ''
        );
        comment on table assets_package is '资产包表';
        comment on column assets_package.id is '资产包主键 id';
        comment on column assets_package.amount is '资产包额度';
        comment on column assets_package.saleable_multiple is '购买资产包获得的可售额度比例';
        comment on column assets_package.mining_multiple is '矿池产币倍数';
        comment on column assets_package.release_multiple is '资产包进入线性释放池倍数';
        comment on column assets_package.amount_type is '资产包类型，私募(raise)，普通(common)';
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

async function insert() {
    try {
        let sql = `
            insert into account_op(account_name, op_type, remark, create_time) values (
                'yujinsheng11',
                'insert name',
                'insert',
                now()
            ),
            (
                'yujinsheng20',
                'insert a text',
                'insert',
                now()
            ),
            (
                'yujinsheng13',
                'no thx',
                'insert',
                now()
            );
        `
        logger.info(`before insert`);
        await select()
        logger.info("begin insert data to account_op");
        let { rows } = await pool.query(sql);
        logger.debug(`insert text success, the result: ${ JSON.stringify(rows) }`);
    } catch (err) {
        logger.error(`insert text error: ${ err }`);
        throw err;
    }
}

async function select() {
    let sql = `
        select * from account_op;
    `
    try {
        logger.info("query from account_op");
        let { rows } = await pool.query(sql);
        logger.debug(`query result: ${ JSON.stringify(rows) }`);
    } catch (err) {
        logger.error(`query error: ${ err }`);
        throw err;
    }
}

async function update() {
    let sql = `
        update account_op set account_name = 'love-death-robots' where account_name = 'yujinsheng13';
    `
    try {
        logger.info(`after update`);
        await select();
        logger.info("update one");
        let { rows } = await pool.query(sql);
        logger.debug(`after update result: ${ JSON.stringify(rows) }`);
    } catch (err) {
        logger.error(`update error: ${ err }`);
        throw err;
    }
}

async function del() {
    let sql = `
        delete from account_op where account_name = 'yujinsheng11';
    `
    try {
        logger.info(`after delete`);
        await select();
        logger.info("delete one from account_op");
        let { rows } = await pool.query(sql);
        logger.debug(`after delete result: ${ JSON.stringify(rows) }`);
    } catch (err) {
        logger.error(`delete error: ${ err }`);
        throw err;
    }
}

async function alter() {
    let addCol = `
        alter table account_op add ip;
    `
    // delete column => alter table account_op drop column ip;
    try {
        logger.info("alter a column to account_op");
        let { rows } = await pool.query(addCol);
        logger.debug(`after alter result: ${ JSON.stringify(rows) }`);
    } catch (err) {
        logger.error(`add column error: ${ err }`);
        throw err;
    }
}

module.exports = createTable;

(async () => {
    // await createTable();
    // await insert();
    // await select()
    // await update()
    // await del()
})()