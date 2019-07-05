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