grant select,insert,update,delete on all tables in schema public to wallet_tbg_user; 
grant select,usage,update on all sequences in schema public to wallet_tbg_user;
grant execute on all functions in schema public to wallet_tbg_user;
grant references, trigger on all tables in schema public to wallet_tbg_user;
grant create on schema public to wallet_tbg_user;
grant usage on schema public to wallet_tbg_user;

with recursive all_level as (
    select referrer_name, account_name, array[referrer_name] as account, 1 as depth from referrer 
    where referrer_name = '' and length(account_name) > 12 or length(referrer_name) > 12
    union
    select r.referrer_name, r.account_name, l.account || l.account_name, l.depth + 1 as depth 
    from referrer r inner join all_level l on r.referrer_name = l.account_name
)
select array_append(account, account_name) as user_level
from all_level where depth = (select max(depth) from all_level);

with recursive all_level as (
    select referrer_name, account_name, array[referrer_name] as account, 1 as depth from referrer 
    where referrer_name = ''
    union
    select r.referrer_name, r.account_name, l.account || l.account_name, l.depth + 1 as depth 
    from referrer r inner join all_level l on r.referrer_name = l.account_name
)
select array_append(account, account_name) as user_level
from all_level where depth = (select max(depth) from all_level);

with res as (
    with recursive all_level as (
        select referrer_name, account_name, array[referrer_name] as account, 1 as depth from referrer 
        where referrer_name = ''
        union
        select r.referrer_name, r.account_name, l.account || l.account_name, l.depth + 1 as depth 
        from referrer r inner join all_level l on r.referrer_name = l.account_name
    )
    select referrer_name, account_name, array_append(account, account_name) as user_level, depth 
        from all_level where length(account_name) > 12
)
select * from res where depth = (select max(depth) from res);

with recursive all_level as (
    select referrer_name, account_name, array[referrer_name] as account, 1 as depth from referrer 
    where referrer_name = ''
    union
    select r.referrer_name, r.account_name, l.account || l.account_name, l.depth + 1 as depth 
    from referrer r inner join all_level l on r.referrer_name = l.account_name
)
select * from all_level where depth = (select max(depth) from all_level);


with tmp_main as (
    select distinct main_account from sub_account 
    where sub_account_name = 'systemwallet-1'
)
select t.main_account, b.op_type, b.account_name, sum(current_balance) as amount 
from tmp_main t
left join balance_log b on t.main_account = b.account_name 
   group by b.op_type, b.account_name, t.main_account;

select s.main_account, b.op_type, b.account_name, sum(current_balance) as amount
            from balance_log b right join (
                    select distinct main_account, sub_account_name from sub_account 
                    where sub_account_name = 'systemwallet-1'
                ) s on s.main_account = b.account_name 
                group by b.op_type, b.account_name, s.main_account;

-- sort
 WITH res AS (
    WITH RECURSIVE all_level AS (
        SELECT referrer_name, account_name, ARRAY[referrer_name] AS account, 1 AS depth 
            FROM referrer 
            WHERE referrer_name = ''
        UNION
        SELECT r.referrer_name, r.account_name, l.account || l.account_name, l.depth + 1 AS depth 
            FROM referrer r 
            INNER JOIN all_level l ON r.referrer_name = l.account_name
    )
    SELECT referrer_name, account_name, array_append(account, account_name) AS user_level, depth 
        FROM all_level 
        WHERE length(account_name) > 12
)
SELECT * FROM res WHERE depth = (select max(depth) from res);

-- 
WITH RECURSIVE mode AS (
    SELECT a.id, a.pid, array[a.sub_account_name] AS account FROM sub_account a
    UNION ALL
    SELECT s.id, s.pid, m.account || s.sub_account_name  FROM sub_account s INNER JOIN mode m ON m.id = s.pid
)
SELECT account FROM mode 
WHERE account[array_length(account, 1)] = 'yujinsheng11-11'
ORDER BY array_length(account, 1) DESC
LIMIT 1;

-- 
SELECT * 
FROM sub_account 
WHERE level = 1
AND root_node = (SELECT DISTINCT root_node FROM sub_account WHERE main_account = 'yujinsheng11');

-- 
SELECT s.main_account, s.level, s.position 
FROM referrer r 
JOIN sub_account s ON s.main_account = r.account_name 
WHERE r.referrer_name = 'yujinsheng11';

-- 
WITH res AS(
    SELECT op_type, account_name, sum(current_balance) as amount 
        FROM balance_log
        WHERE account_name = any($1)
        AND op_type = 'sort income'
        GROUP BY op_type, account_name
)
SELECT * FROM res WHERE amount <= $2;

--
SELECT create_time, change_amount, remark 
    FROM balance_log 
    WHERE account_name = 'yujinsheng11'
    AND op_type = 'invite income'
    ORDER BY create_time DESC

select distinct account_name, create_time
    from account_op 
    where op_type = 'investment' 
    order by create_time desc 
    limit 30;

with tmp as (
    select * from account_op 
    where op_type = 'investment' 
    order by create_time desc
)
select distinct account_name from tmp limit 30;

WITH new_values (amount, saleable_multiple, mining_multiple, preset_days, release_multiple, amount_type) 
AS (VALUES (50, 1.3, 2, 500, 4, 'common'),
    (100, 1.4, 2.5, 500, 4.5, 'common'),
    (200, 1.5, 3, 500, 5, 'common'),
    (10000, 0, 3, 500, 5, 'raise'),
    (20000, 0, 3, 500, 5, 'raise'),
    (30000, 0, 3, 500, 5, 'raise')
)
SELECT amount, saleable_multiple, mining_multiple, preset_days, release_multiple, amount_type
        FROM new_values;


SELECT (SELECT count(1) as count FROM referrer r
                        JOIN account a ON r.account_name = a.account_name
                        AND a.state != 0
                    ) AS count, *
                FROM account

select account_name 
    from account 
    where account_name != 'yujinsheng11'
    and account_type = 'general'
    order by random() limit 1;


SELECT * FROM trade WHERE account_name = 'gametestuser' AND trade_type != 'sell' ORDER BY create_time DESC;