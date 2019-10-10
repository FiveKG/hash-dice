--------------------- 
comment on table account is '账号表';
comment on column account.id is '账户表 id';
comment on column account.account_name is '用户 eos 帐号名称';
comment on column account.refer_count is '账户创建时间';
comment on column account.refer_code is '用户推荐的人数';
comment on column account.state is '用户的推荐号';
comment on column account.account_type is '账号类型';
comment on column account.create_time is '状态';
CREATE TABLE IF NOT EXISTS account(
    id TEXT PRIMARY KEY UNIQUE NOT NULL DEFAULT '',
    account_name TEXT UNIQUE NOT NULL DEFAULT '',
    refer_count INTEGER NOT NULL DEFAULT 0,
    refer_code TEXT NOT NULL DEFAULT '',
    state INTEGER NOT NULL DEFAULT 0,
    account_type TEXT NOT NULL DEFAULT '',
    create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

comment on table sub_account is '子帐号表'
comment on column sub_account.id is '子帐号表 id';
comment on column sub_account.pid is '子帐号在三三公排中对应的父 id';
comment on column sub_account.root_node is '三三公排某个根节点帐号';
comment on column sub_account.main_account is '子帐号对应的 eos 帐号';
comment on column sub_account.sub_account_name is '子帐号名称';
comment on column sub_account.level is '在三三公排的层级';
comment on column sub_account.position is '子帐号在三三公排对应层级的位置';
comment on column sub_account.create_time is '子帐号创建时间';
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

comment on table balance is '用户资产表'
comment on column balance.id is '用户资产表 id';
comment on column balance.account_name is '用户 eos 帐号名称';
comment on column balance.withdraw_enable is '可提现资产';
comment on column balance.repeat_currency is '复投资产';
comment on column balance.lotto_currency is '全球彩彩码';
comment on column balance.game_currency is '游戏资产';
comment on column balance.create_time is '创建时间';
CREATE TABLE IF NOT EXISTS balance(
    id TEXT PRIMARY KEY UNIQUE NOT NULL DEFAULT '',
    account_name TEXT UNIQUE NOT NULL DEFAULT '',
    withdraw_enable NUMERIC (12, 8) NOT NULL DEFAULT 0,
    repeat_currency NUMERIC (12, 8) NOT NULL DEFAULT 0,
    lotto_currency  NUMERIC (12, 8) NOT NULL DEFAULT 0,
    game_currency  NUMERIC (12, 8) NOT NULL DEFAULT 0,
    create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

comment on table referrer is '推荐表'
comment on column referrer.id is '推荐表 id';
comment on column referrer.referrer_name is '推荐人帐号名称';
comment on column referrer.account_name is '被推荐人的账户名称';
comment on column referrer.create_time is '创建时间';
CREATE TABLE IF NOT EXISTS referrer(
    id TEXT PRIMARY KEY UNIQUE NOT NULL DEFAULT '',
    referrer_name TEXT,
    account_name TEXT UNIQUE NOT NULL DEFAULT '',
    create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

comment on table balance_log is '用户账户余额变动表'
comment on column balance_log.id is '变动表 id(自增)';
comment on column balance_log.account_name is '用户 eos 帐号名称';
comment on column balance_log.change_amount is '变动额度';
comment on column balance_log.current_balance is '变动后的余额';
comment on column balance_log.op_type is '操作类型';
comment on column balance_log.remark is '操作备注';
comment on column balance_log.create_time is '创建时间';
CREATE TABLE IF NOT EXISTS balance_log(
    id serial PRIMARY KEY UNIQUE NOT NULL,
    account_name TEXT NOT NULL DEFAULT '',
    change_amount NUMERIC (12, 8) NOT NULL DEFAULT 0,
    current_balance NUMERIC (12, 8) NOT NULL DEFAULT 0,
    op_type TEXT NOT NULL DEFAULT '',
    remark TEXT NOT NULL DEFAULT '',
    create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

comment on table system_pools is '系统奖池表'
comment on column system_pools.id is '系统奖池表的 id';
comment on column system_pools.pool_type is '奖池的类型';
comment on column system_pools.pool_amount is '奖池的金额';
CREATE TABLE IF NOT EXISTS system_pools(
    id TEXT PRIMARY KEY UNIQUE NOT NULL DEFAULT '',
    pool_type TEXT UNIQUE NOT NULL DEFAULT '',
    pool_amount NUMERIC (12, 8) NOT NULL DEFAULT 0
);

comment on table system_op_log is '系统总账变动日志表'
comment on column system_op_log.id is '奖池变动表的 id';
comment on column system_op_log.change_amount is '变动的额度';
comment on column system_op_log.current_balance is '变动后的额度';
comment on column system_op_log.op_type is '操作类型';
comment on column system_op_log.remark is '备注';
comment on column system_op_log.create_time is '创建时间';
CREATE TABLE IF NOT EXISTS system_op_log(
    id serial PRIMARY KEY UNIQUE NOT NULL,
    change_amount NUMERIC (12, 8) NOT NULL DEFAULT 0,
    current_balance NUMERIC (12, 8) NOT NULL DEFAULT 0,
    op_type TEXT NOT NULL DEFAULT '',
    remark TEXT NOT NULL DEFAULT '',
    create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

comment on table account_op is '用户操作记录'
comment on column account_op.id is '用户的操作记录表的 id';
comment on column account_op.account_name is '用户帐号名称';
comment on column account_op.op_type is '用户的操作记录';
comment on column account_op.remark is '备注';
comment on column account_op.create_time is '创建时间';
CREATE TABLE IF NOT EXISTS account_op(
    id serial PRIMARY KEY UNIQUE NOT NULL,
    account_name TEXT NOT NULL DEFAULT '',
    op_type TEXT NOT NULL DEFAULT '',
    remark TEXT NOT NULL DEFAULT '',
    create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

comment on table trade_tbg is '账号表'
comment on column trade_tbg.id is '主键 id';
comment on column trade_tbg.account_name is '用户帐号名称';
comment on column trade_tbg.buy_or_sell is '买或卖';
comment on column trade_tbg.amount is '请求交易的数量';
comment on column trade_tbg.price is '价格';
comment on column trade_tbg.state is '状态';
comment on column trade_tbg.create_time is '创建时间';
CREATE TABLE IF NOT EXISTS trade_tbg(
    id serial PRIMARY KEY UNIQUE NOT NULL,
    account_name TEXT NOT NULL DEFAULT '',
    buy_or_sell TEXT NOT NULL DEFAULT '',
    amount TEXT NOT NULL DEFAULT '',
    price NUMERIC (12, 8) NOT NULL DEFAULT '',
    state TEXT NOT NULL DEFAULT '',
    create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

comment on table trade_log is '账号表'
comment on column trade_log.id is '主键 id';
comment on column trade_log.tr_id is '请求 id';
comment on column trade_log.buy_or_sell is '买或卖';
comment on column trade_log.amount is '数量';
comment on column trade_log.price is '备注说明';
comment on column trade_log.volume is '价格';
comment on column trade_log.memo is '成交金额';
comment on column trade_log.create_time is '创建时间';
CREATE TABLE IF NOT EXISTS trade_log(
    id serial PRIMARY KEY UNIQUE NOT NULL,
    tr_id TEXT NOT NULL DEFAULT '',
    buy_or_sell TEXT NOT NULL DEFAULT '',
    amount TEXT NOT NULL DEFAULT '',
    price NUMERIC (12, 8) NOT NULL DEFAULT '',
    volume NUMERIC (12, 8) NOT NULL DEFAULT '',
    memo TEXT NOT NULL DEFAULT '',
    create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

comment on table tbg_balance is '用户 TBG 资产表'
comment on column tbg_balance.id is '用户资产表';
comment on column tbg_balance.account_name is '用户帐号名称';
comment on column tbg_balance.release_amount is '释放池资产';
comment on column tbg_balance.sell_amount is '可售额度';
comment on column tbg_balance.active_amount is '可售余额';
comment on column tbg_balance.create_time is '创建时间';
CREATE TABLE IF NOT EXISTS tbg_balance(
    id serial PRIMARY KEY UNIQUE NOT NULL,
    account_name TEXT NOT NULL DEFAULT '',
    release_amount NUMERIC (12, 8) NOT NULL DEFAULT 0,
    sell_amount NUMERIC (12, 8) NOT NULL DEFAULT 0,
    active_amount  NUMERIC (12, 8) NOT NULL DEFAULT 0,
    create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

----------------------------
-- 插入 account
insert into account(id, account_name, refer_count, state, refer_code, create_time) 
values ('f0a0c5e8-612a-44ed-acbc-5c284f964a74', 'systemwallet', 0, 0, '279888', 'now()'), 
('928f02c9-28bd-41a4-92cb-a9258fafb781', 'yujinsheng11', 0, 0, '687203', 'now()'), 
('4e29c59a-0564-4ad8-86a4-3db1ebc08296', '5tj5ywfrjooy', 0, 0, '678081', 'now()'), 
('9ba1a9c4-da63-4dc0-b22f-2e2a813a8cc3', 'uxjjz4fypm3.', 0, 0, '896730', 'now()'), 
('abae0548-eb65-4135-8297-5e420a6b4c9d', 'jb2lgkgqfpsn', 0, 0, '456756', 'now()'), 
('f868a13f-cf5a-4f3c-8098-26d0cd9e4b27', 'vmbutqnxy.sb', 0, 0, '729264', 'now()'), 
('4052fc18-7037-4c4b-9e4e-511d80e69d86', 'oeazmerpqye2', 0, 0, '277809', 'now()') 
on conflict(account_name) do nothing; 

-- 插入 referrer
insert into referrer 
values ('670d467d-807c-4413-b271-dc664bf1f2b4', '', 'systemwallet', 'now()'), 
('d6ce0584-a29b-4605-acc0-a7b847bd8b73', 'systemwallet', 'yujinsheng11', 'now()'), 
('a2c74a85-a0f8-4488-a1f9-b6e2e024fab3', 'yujinsheng11', 'a4zmzxc3lylv', 'now()'), 
('8b81f231-f170-4f52-a685-da23c9bd7cb4', 'yujinsheng11', '5tj5ywfrjooy', 'now()'), 
('aedea2d1-fa8a-4e85-a962-339222ee8f80', '5tj5ywfrjooy', 'uxjjz4fypm3.', 'now()'), 
('a6635a66-cd07-47ea-b072-86ad0015fe51', 'uxjjz4fypm3.', 'jb2lgkgqfpsn', 'now()'), 
('aff93b3c-89e8-41a9-a69a-6e25fb460eb7', 'jb2lgkgqfpsn', 'vmbutqnxy.sb', 'now()'), 
('6df17dd8-8030-45a9-b8ac-4472d69a4151', 'vmbutqnxy.sb', 'oeazmerpqye2', 'now()') 
on conflict(account_name) do nothing; 

-- 插入 balance
insert into balance(id, account_name, create_time)  
values ('76b998db-5bb0-4b91-b6ca-878faf2eb39b', 'systemwallet', 'now()'), 
('0af3a723-077a-4796-b422-06eeddf3fff7', 'yujinsheng11', 'now()'), 
('1704af02-a19c-4a41-9221-08d7dd0d8291', 'a4zmzxc3lylv', 'now()'), 
('63e494f3-bd38-47fd-ace9-51dff9483c91', '5tj5ywfrjooy', 'now()'), 
('cbfe28f1-1512-4f80-88c3-c34268986056', 'uxjjz4fypm3.', 'now()'), 
('f229d888-235f-4c44-a6f9-ccae22290a7c', 'jb2lgkgqfpsn', 'now()'), 
('86f3dd0c-c61d-4ad9-86f8-a794166683d3', 'vmbutqnxy.sb', 'now()'), 
('a21898c8-b4f6-48bd-bdf9-ed2558ab5bb8', 'oeazmerpqye2', 'now()') 
on conflict(account_name) do nothing; 

-- 更新推荐人数
update account set refer_count = 2 where account_name = 'yujinsheng11'; 
update account set refer_count = 1 
where account_name in ('5tj5ywfrjooy', 'uxjjz4fypm3.', 'jb2lgkgqfpsn', 'vmbutqnxy.sb', 'oeazmerpqye2');

--- 查询某个表是否存在
select count(1)::INTEGER from pg_class where relname = $1;

----
INSERT INTO snapshot(account_name, invite_count_week, tree_level, invite_member_count, standard_v, 
                    standard_v1, standard_v2, standard_v3, standard_v4, standard_v5, effective_member, create_time)
    VALUES ('yujinsheng11', 1, '{}'::JSONB, 1, 0, 0, 0, 0, 0, 0, 1, now())
    ON CONFLICT (account_name)
    DO UPDATE SET invite_count_week = EXCLUDED.invite_count_week + 1, 
        invite_member_count = EXCLUDED.invite_member_count + 1, 
        standard_v = EXCLUDED.standard_v + 0, 
        standard_v1 = EXCLUDED.standard_v1 + 0, 
        standard_v2 = EXCLUDED.standard_v2 + 0, 
        standard_v3 = EXCLUDED.standard_v3 + 0, 
        standard_v4 = EXCLUDED.standard_v4 + 0, 
        standard_v5 = EXCLUDED.standard_v5 + 0,
        effective_member = EXCLUDED.effective_member + 1;