### docker 部署 `rabbitmq`
docker run -d -p 5672:5672 --name rabbitmq rabbitmq && docker exec -it rabbitmq /bin/bash
rabbitmqctl add_user mq_user "pass_2019" && \
rabbitmqctl set_user_tags mq_user administrator && \
rabbitmqctl set_permissions mq_user -p / ".*" ".*" ".*" && \
echo "loopback_users = none
listeners.tcp.1 = 0.0.0.0:5672" > /etc/rabbitmq/rabbitmq.conf

### docker 部署 postgres

``` bash
docker pull postgres

printf "mkdir $PWD/postgresql/data\n"
mkdir $PWD/postgresql/data -p
printf "cd $PWD/postgresql\n"
cd $PWD/postgresql
printf "create and run postgres docker container\n"
docker run -d -p 5432:5432 --name postgres -v $PWD/data:/var/lib/postgresql/data --privileged=true  postgres 

docker exec -it postgres bash
sudo -u postgres psql
\password postgres pass_2019
CREATE USER hash_dice_user WITH PASSWORD 'pass_2019';
CREATE DATABASE hash_dice OWNER hash_dice_user;
GRANT ALL ON DATABASE hash_dice to hash_dice_user;

# 导出
pg_dump -U lucky_money -h 172.17.0.4 -f ./lucky_money.sql lucky_money
# 导入
docker exec -i postgres psql -U hash_dice_user -d hash_dice < ./hash_dice.sql
```

### docker 部署 redis
* 注意修改监听地址
> https://segmentfault.com/a/1190000014091287

``` bash
docker pull redis
mkdir $PWD/redis/{conf,data} -p
cd $PWD/redis
wget https://raw.githubusercontent.com/antirez/redis/3.2.12/redis.conf -O conf/redis.conf

sed -i 's/logfile ""/logfile "access.log"/' conf/redis.conf
sed -i 's/# requirepass foobared/requirepass redis_pass_2019/' conf/redis.conf

docker run -p 7758:7758 -v $PWD/data:/data -v $PWD/conf/redis.conf:/etc/redis/redis.conf --privileged=true --name redis -d redis redis-server /etc/redis/redis.conf
```