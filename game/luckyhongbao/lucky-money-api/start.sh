#!/bin/bash
#Description: run tbg service
unset LUCKY_MONEY_DB_HOST
unset LUCKY_MONEY_DB_PORT
unset LUCKY_MONEY_DB_USER
unset LUCKY_MONEY_DB_PASS
unset LUCKY_MONEY_DB_NAME

unset LUCKY_MONEY_REDIS_HOST
unset LUCKY_MONEY_REDIS_PORT
unset LUCKY_MONEY_REDIS_PASS

unset LUCKY_MONEY_RABBIT_HOST
unset LUCKY_MONEY_RABBIT_PORT
unset LUCKY_MONEY_RABBIT_USER
unset LUCKY_MONEY_RABBIT_PASS

export TBG_SERVER=http://192.168.1.141:9527/
export LUCKY_MONEY_SERVER_HOST=0.0.0.0
export LUCKY_MONEY_SERVER_PORT=8089

postgreshost=$(docker inspect postgres | grep IPAddress | grep -E -o "([0-9]{1,3}[\.]){3}[0-9]{1,3}" | sed -n '1p')
redishost=$(docker inspect redis | grep IPAddress | grep -E -o "([0-9]{1,3}[\.]){3}[0-9]{1,3}" | sed -n '1p')
rabbitmqhost=$(docker inspect rabbitmq | grep IPAddress | grep -E -o "([0-9]{1,3}[\.]){3}[0-9]{1,3}" | sed -n '1p')

dbname=lucky_money
dbuser=lucky_money_user

cat > ./envConfig.js <<-EOF
module.exports = {
    "db" : {
        "host"    : "$postgreshost",
        "database": "$dbname",
        "user" : "$dbuser",
        "password" :  "pass_2019",
        "port"    : 5432,
    },
    "redis": {
        "host" : "$redishost",
        "port" : 6379 ,
        "auth" : "redis_pass_2018"
    },
    "rabbitmq": {
        "host": "$rabbitmqhost",
        "port" : 5672,
        "user" : "mq_user",
        "pwd" : "pass_2019"
    }
}
EOF

export LUCKY_MONEY_DB_HOST=$postgreshost
export LUCKY_MONEY_DB_PORT=5432
export LUCKY_MONEY_DB_USER=$dbuser
export LUCKY_MONEY_DB_PASS=pass_2019
export LUCKY_MONEY_DB_NAME=$dbname

export LUCKY_MONEY_REDIS_HOST=$redishost
export LUCKY_MONEY_REDIS_PORT=6379
export LUCKY_MONEY_REDIS_PASS=redis_pass_2018

export LUCKY_MONEY_RABBIT_HOST=$rabbitmqhost
export LUCKY_MONEY_RABBIT_PORT=5672
export LUCKY_MONEY_RABBIT_USER=mq_user
export LUCKY_MONEY_RABBIT_PASS=pass_2019


npm run start