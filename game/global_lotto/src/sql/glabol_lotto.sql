CREATE USER global_lotto_user WITH PASSWORD 'pass_2019';
CREATE DATABASE global_lotto OWNER global_lotto_user;
grant select,insert,update,delete on all tables in schema public to global_lotto_user; 
grant select,usage,update on all sequences in schema public to global_lotto_user;
grant execute on all functions in schema public to global_lotto_user;
grant references, trigger on all tables in schema public to global_lotto_user;
grant create on schema public to global_lotto_user;
grant usage on schema public to global_lotto_user;

--------------------- 
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
    extra JSON NOT NULL DEFAULT '{}'::JSONB,
    account_name TEXT NOT NULL DEFAULT '',
    bet_num TEXT NOT NULL DEFAULT '',
    key_count INTEGER NOT NULL DEFAULT 0,
    amount NUMERIC (20, 8) NOT NULL DEFAULT 0,
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
    extra JSON NOT NULL DEFAULT '{}'::JSONB,
    account_name TEXT NOT NULL DEFAULT '',
    bet_num TEXT NOT NULL DEFAULT '',
    win_key INTEGER NOT NULL DEFAULT 0,
    win_type TEXT NOT NULL DEFAULT '',
    one_key_bonus NUMERIC (20, 8) NOT NULL DEFAULT 0,
    create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    bonus_amount NUMERIC (20, 8) NOT NULL DEFAULT 0
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
CREATE TABLE IF NOT EXISTS prize_pool_log(
    id serial PRIMARY KEY UNIQUE NOT NULL,
    gs_id TEXT UNIQUE NOT NULL DEFAULT '',
    pool_type TEXT NOT NULL DEFAULT '',
    change_amount NUMERIC (20, 8) NOT NULL DEFAULT 0,
    current_balance NUMERIC (20, 8) NOT NULL DEFAULT 0,
    op_type TEXT NOT NULL DEFAULT '',
    extra JSON NOT NULL DEFAULT '{}'::JSONB,
    remark TEXT NOT NULL DEFAULT '',
    create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    
);
comment on table prize_pool_log is '变动表 id(自增)';
comment on column prize_pool_log.id is '变动表 id(自增)';
comment on column prize_pool_log.gs_id is '游戏期数信息 id';
comment on column prize_pool_log.pool_type is '奖池类型';
comment on column prize_pool_log.change_amount is '变动额度';
comment on column prize_pool_log.current_balance is '变动后的余额';
comment on column prize_pool_log.op_type is '操作类型';
comment on column prize_pool_log.extra is '附加信息';
comment on column prize_pool_log.remark is '操作备注';
comment on column prize_pool_log.create_time is '创建时间';