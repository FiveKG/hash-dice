### docker 部署 `rabbitmq`
docker run -p 5672:5672 -d --name rabbitmq rabbitmq && \
docker exec -it rabbitmq /bin/bash 
rabbitmqctl add_user mq_user "pass_2019" && \
rabbitmqctl set_user_tags mq_user administrator && \
rabbitmqctl set_permissions mq_user -p / ".*" ".*" ".*" && \
echo "loopback_users = none
listeners.tcp.1 = 0.0.0.0:5672" > /etc/rabbitmq/rabbitmq.conf

docker run -d --name rabbitmq -e RABBITMQ_DEFAULT_USER=mq_user -e RABBITMQ_DEFAULT_PASS=password rabbitmq
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 -e RABBITMQ_DEFAULT_USER=mq_user -e RABBITMQ_DEFAULT_PASS=pass_2019 rabbitmq:3-management

### docker 部署 postgres

``` bash
docker pull postgres

printf "mkdir $PWD/postgresql/data\n"
mkdir $PWD/postgresql/data -p
printf "cd $PWD/postgresql\n"
cd $PWD/postgresql
printf "create and run postgres docker container\n"
docker run --name postgres -v $PWD/data:/var/lib/postgresql/data --privileged=true -d postgres

docker exec -it postgres bash
su postgres && psql
\password postgres pass_2019
CREATE USER invest_db_user WITH PASSWORD 'pass_2019';
CREATE DATABASE investment OWNER invest_db_user;
GRANT ALL ON DATABASE investment to invest_db_user;

# 导出
pg_dump -U lucky_money -h 172.17.0.4 -f ./lucky_money.sql lucky_money
# 导入
docker exec -i postgres psql -U lucky_money -d lucky_money < ./lucky_money.sql
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
sed -i 's/appendonly no/appendonly yes/' conf/redis.conf

docker run -p 6379:6379 -v $PWD/data:/data -v $PWD/conf/redis.conf:/etc/redis/redis.conf --privileged=true --name redis -d redis redis-server /etc/redis/redis.conf
```