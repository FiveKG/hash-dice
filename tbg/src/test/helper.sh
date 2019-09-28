# 批量删除键值
# 先进入容器
docker exec -it redis bash
# 再执行命令
redis-cli -a redis_pass_2018 -n 5 keys "tbg:income:*" | xargs redis-cli -a redis_pass_2018 -n 5 del
redis-cli -a redis_pass_2018 -n 5 keys "tbg:level:*" | xargs redis-cli -a redis_pass_2018 -n 5 del
redis-cli -a redis_pass_2018 -n 5 keys "tbg:invest:*" | xargs redis-cli -a redis_pass_2018 -n 5 del
redis-cli -a redis_pass_2018 -n 5 keys "tbg:buy:trx:*" | xargs redis-cli -a redis_pass_2018 -n 5 del
redis-cli -a redis_pass_2018 -n 5 keys "tbg:sell:trx:*" | xargs redis-cli -a redis_pass_2018 -n 5 del
redis-cli -a redis_pass_2018 -n 5 keys "tbg:subAccount:*" | xargs redis-cli -a redis_pass_2018 -n 5 del
redis-cli -a redis_pass_2018 -n 5 keys "tbg:subAccountSort:*" | xargs redis-cli -a redis_pass_2018 -n 5 del
redis-cli -a redis_pass_2018 -n 5 keys "tbg:position:*" | xargs redis-cli -a redis_pass_2018 -n 5 del



redis-cli -a iueksefPOSDds123DW -p 6380 -n 3 keys "lm:sys_config:*" | xargs redis-cli -a iueksefPOSDds123DW -p 6380 -n 3 del


# 也可以一步执行
docker exec -it redis bash