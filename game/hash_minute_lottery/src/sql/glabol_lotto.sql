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
    prize_pool NUMERIC (20, 8) NOT NULL DEFAULT 0,
    bottom_pool NUMERIC (20, 8) NOT NULL DEFAULT 0,
    reserve_pool NUMERIC (20, 8) NOT NULL DEFAULT 0,
    create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
comment on table game is '游戏表';
comment on column game.g_id is '游戏表 id';
comment on column game.prize_pool is '全球彩奖池';
comment on column game.bottom_pool is '全球彩底池';
comment on column game.reserve_pool is '全球彩储备池';;
comment on column game.create_time is '创建时间';
CREATE TABLE IF NOT EXISTS game_session (
    gs_id TEXT PRIMARY KEY UNIQUE NOT NULL DEFAULT '',
    g_id TEXT NOT NULL DEFAULT '',
    creator TEXT NOT NULL DEFAULT '',
    periods INTEGER NOT NULL DEFAULT 0,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    end_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
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
comment on column bet_order.extra is '投注投注时间';
comment on column bet_order.account_name is '投注时间';
comment on column bet_order.bet_num is '投注号码';
comment on column bet_order.key_count is '投注数量';
comment on column bet_order.amount is '投注额度';
comment on column bet_order.create_time is '创建时间';