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



---- 生成排除某个字段查询语句
SELECT 'SELECT ' || array_to_string(
        ARRAY(SELECT 'o' || '.' || c.column_name 
                FROM information_schema.columns As c 
                WHERE table_name = 'game' 
                AND  c.column_name 
                NOT IN('summary')
        ), ',') || ' FROM game As o' As sqlstmt;