SELECT 'SELECT ' || array_to_string(
        ARRAY(SELECT 'o' || '.' || c.column_name 
                FROM information_schema.columns As c 
                WHERE table_name = 'book_list_detail' 
                AND  c.column_name 
                NOT IN('summary')
        ), ',') || ' FROM book_list_detail As o' As sqlstmt;

-- 生成插入语句
------------- node-pg
SELECT 'INSERT INTO game(' || array_to_string(
        ARRAY(SELECT '' || c.column_name 
                FROM information_schema.columns AS c 
                WHERE table_name = 'game' 
        ), ',') || ') VALUES (' || array_to_string(
                ARRAY(SELECT '$' || generate_series(1, (
                        SELECT count(column_name)
                        FROM information_schema.columns 
                        WHERE table_name = 'game'))
                ), ',') || ')' AS sqlstmt;

SELECT 'INSERT INTO game_session(' || array_to_string(
        ARRAY(SELECT '' || c.column_name 
                FROM information_schema.columns AS c 
                WHERE table_name = 'game_session' 
        ), ',') || ') VALUES (' || array_to_string(
                ARRAY(SELECT '$' || generate_series(1, (
                        SELECT count(column_name)
                        FROM information_schema.columns 
                        WHERE table_name = 'game_session'))
                ), ',') || ')' AS sqlstmt;

SELECT 'INSERT INTO bet_order(' || array_to_string(
        ARRAY(SELECT '' || c.column_name 
                FROM information_schema.columns AS c 
                WHERE table_name = 'bet_order' 
        ), ',') || ') VALUES (' || array_to_string(
                ARRAY(SELECT '$' || generate_series(1, (
                        SELECT count(column_name)
                        FROM information_schema.columns 
                        WHERE table_name = 'bet_order'))
                ), ',') || ')' AS sqlstmt;

SELECT 'INSERT INTO award_session(' || array_to_string(
        ARRAY(SELECT '' || c.column_name 
                FROM information_schema.columns AS c 
                WHERE table_name = 'award_session' 
        ), ',') || ') VALUES (' || array_to_string(
                ARRAY(SELECT '$' || generate_series(1, (
                        SELECT count(column_name)
                        FROM information_schema.columns 
                        WHERE table_name = 'award_session'))
                ), ',') || ')' AS sqlstmt;



---- 生成排除某个字段查询语句
SELECT 'SELECT ' || array_to_string(
        ARRAY(SELECT 'o' || '.' || c.column_name 
                FROM information_schema.columns As c 
                WHERE table_name = 'game' 
                AND  c.column_name 
                NOT IN('summary')
        ), ',') || ' FROM game As o' As sqlstmt;


----------
SELECT gs.periods, gs.gs_id, gs.game_state, game.game_name, game.key_count, gs.reward_code,
                game.quantity, bo.bet_code || bo.bet_code, bo.bonus_code, bo.bonus_amount, bo.amount, sum(bo.key_count) AS bet_key_count,
                bo.extra AS bet_extra, gs.extra AS gs_extra
                FROM game_session gs 
                JOIN game ON game.g_id = gs.g_id 
                JOIN bet_order bo ON bo.gs_id = gs.gs_id
                WHERE gs.g_id = 1
                AND gs.periods = 1
                AND bo.account_name = 'yujinsheng11';

SELECT gs.periods, gs.gs_id, gs.game_state, game.game_name, game.key_count, gs.reward_code,
                game.quantity, gs.extra AS gs_extra
                FROM game_session gs 
                JOIN game ON game.g_id = gs.g_id 
                WHERE gs.g_id = 1
                AND gs.periods = 1;

SELECT * FROM bet_order WHERE gs_id = '840ed882748194cc' AND account_name = 'yujinsheng11';