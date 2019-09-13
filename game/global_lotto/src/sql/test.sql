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
