-- 生成插入语句
------------- node-pg
SELECT 'INSERT INTO prize_pool_log(' || array_to_string(
        ARRAY(SELECT '' || c.column_name 
                FROM information_schema.columns AS c 
                WHERE table_name = 'prize_pool_log' 
        ), ',') || ') VALUES (' || array_to_string(
                ARRAY(SELECT '$' || generate_series(1, (
                        SELECT count(column_name)
                        FROM information_schema.columns 
                        WHERE table_name = 'prize_pool_log'))
                ), ',') || ')' AS sqlstmt;


---- 生成排除某个字段查询语句
SELECT 'SELECT ' || array_to_string(
        ARRAY(SELECT 'o' || '.' || c.column_name 
                FROM information_schema.columns As c 
                WHERE table_name = 'game_session' 
                AND  c.column_name 
                NOT IN('create_time', 'reward_time', 'start_time', 'end_time')
        ), ',') || ' FROM game_session As o' As sqlstmt;

--- 
SELECT 'SELECT ' || array_to_string(
        ARRAY(SELECT 'o' || '.' || c.column_name 
                FROM information_schema.columns As c 
                WHERE table_name = 'prize_pool_log' 
                AND  c.column_name 
                NOT IN('summary')
        ), ',') || ' FROM prize_pool_log As o' As sqlstmt;

--- 
SELECT 'SELECT ' || array_to_string(
        ARRAY(SELECT 'o' || '.' || c.column_name 
                FROM information_schema.columns As c 
                WHERE table_name = 'award_session' 
                AND  c.column_name 
                NOT IN('extra')
        ), ',') || ' FROM award_session As o' As sqlstmt;

--- 
SELECT 'SELECT ' || array_to_string(
        ARRAY(SELECT 'o' || '.' || c.column_name 
                FROM information_schema.columns As c 
                WHERE table_name = 'prize_pool_log' 
                AND  c.column_name 
                NOT IN('summary')
        ), ',') || ' FROM prize_pool_log As o' As sqlstmt;

------------ 查询表的字段名
SELECT column_name
        FROM information_schema.columns 
        WHERE table_name = 'prize_pool_log'

---- 查询某个表的字段数
SELECT count(column_name)
        FROM information_schema.columns 
        WHERE table_name = 'prize_pool_log';

--- 生成序列
SELECT '$' || generate_series(1, 5);

-- 获取表的行数
------
SELECT relname, reltuples
FROM pg_class r JOIN pg_namespace n
ON (relnamespace = n.oid)
WHERE relkind = 'r' AND n.nspname = 'public'; 


SELECT gs.gs_id, gs.periods, gs.reward_num, bo.create_time, gs.game_state, bo.key_count, CAST()
                FROM game_session gs 
                JOIN bet_order bo ON gs.gs_id = bo.gs_id
                WHERE bo.account_name = 'yujinsheng11'
                ORDER BY create_time DESC;

SELECT gs.gs_id, bo.bo_id, gs.periods, gs.reward_num, bo.create_time, gs.game_state, bo.key_count, aw.win_type
                FROM game_session gs 
                JOIN bet_order bo ON gs.gs_id = bo.gs_id
                JOIN award_session aw ON aw.bo_id = bo.bo_id
                WHERE bo.account_name = 'yujinsheng11'
                GROUP BY bo.bo_id, gs.gs_id, gs.periods, gs.reward_num, bo.create_time, gs.game_state, bo.key_count, aw.win_type
                ORDER BY create_time DESC;

SELECT gs.gs_id, bo.bo_id, gs.periods, gs.reward_num, bo.create_time, gs.game_state, bo.key_count, aw.win_type
                FROM game_session gs 
                JOIN bet_order bo ON gs.gs_id = bo.gs_id
                JOIN award_session aw ON aw.bo_id = bo.bo_id
                WHERE bo.account_name = 'yujinsheng11'
                ORDER BY create_time DESC;

SELECT o.bo_id, o.win_type,o.one_key_bonus 
        FROM award_session As o 
        WHERE o.account_name = 'yujinsheng11'
        GROUP BY o.bo_id, o.win_key,o.win_type,o.one_key_bonus,o.bonus_amount;

SELECT sum(one_key_bonus), o.bo_id FROM award_session GROUP BY o.bo_id; WHERE bo_id = any()