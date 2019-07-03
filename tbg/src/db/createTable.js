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
            create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
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
        CREATE TABLE IF NOT EXISTS balance(
            id TEXT PRIMARY KEY UNIQUE NOT NULL DEFAULT '',
            account_name TEXT UNIQUE NOT NULL DEFAULT '',
            amount NUMERIC (12, 8) NOT NULL DEFAULT 0,
            withdraw_enable NUMERIC (12, 8) NOT NULL DEFAULT 0,
            repeat_currency NUMERIC (12, 8) NOT NULL DEFAULT 0,
            lotto_currency  NUMERIC (12, 8) NOT NULL DEFAULT 0,
            game_currency  NUMERIC (12, 8) NOT NULL DEFAULT 0,
            create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        CREATE TABLE IF NOT EXISTS referrer(
            id TEXT PRIMARY KEY UNIQUE NOT NULL DEFAULT '',
            referrer_name TEXT,
            account_name TEXT UNIQUE NOT NULL DEFAULT '',
            create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        CREATE TABLE IF NOT EXISTS balance_log(
            id serial PRIMARY KEY UNIQUE NOT NULL,
            account_name TEXT NOT NULL DEFAULT '',
            change_amount NUMERIC (12, 8) NOT NULL DEFAULT 0,
            current_balance NUMERIC (12, 8) NOT NULL DEFAULT 0,
            op_type TEXT NOT NULL DEFAULT '',
            remark TEXT NOT NULL DEFAULT '',
            create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        CREATE TABLE IF NOT EXISTS system_pools(
            id TEXT PRIMARY KEY UNIQUE NOT NULL DEFAULT '',
            pool_type TEXT UNIQUE NOT NULL DEFAULT '',
            pool_amount NUMERIC (12, 8) NOT NULL DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS system_op_log(
            id serial PRIMARY KEY UNIQUE NOT NULL,
            change_amount NUMERIC (12, 8) NOT NULL DEFAULT 0,
            current_balance NUMERIC (12, 8) NOT NULL DEFAULT 0,
            op_type TEXT NOT NULL DEFAULT '',
            remark TEXT NOT NULL DEFAULT '',
            create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        CREATE TABLE IF NOT EXISTS account_op(
            id serial PRIMARY KEY UNIQUE NOT NULL,
            account_name TEXT NOT NULL DEFAULT '',
            op_type TEXT NOT NULL DEFAULT '',
            remark TEXT NOT NULL DEFAULT '',
            create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
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
                'yujinsheng12',
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