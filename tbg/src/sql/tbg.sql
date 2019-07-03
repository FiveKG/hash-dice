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