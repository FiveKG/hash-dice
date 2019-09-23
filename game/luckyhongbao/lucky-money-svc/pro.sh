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

cat > ./config.js <<-EOF
module.exports = {
    "db" : {
        "host"    : "127.0.0.1",
        "database": "wallet_tbg_db",
        "user" : "wallet_tbg_user",
        "password" :  "pass_2019",
        "port"    : 54321,
    },
    "redis": {
        "host" : "127.0.0.1",
        "port" : 6380 ,
        "auth" : "iueksefPOSDds123DW"
    },
    "rabbitmq": {
        "host": "172.18.0.2",
        "port" : 5672,
        "user" : "mq_user",
        "pwd" : "pass_2019"
    }
}
EOF

export LUCKY_MONEY_DB_HOST=127.0.0.1
export LUCKY_MONEY_DB_PORT=54321
export LUCKY_MONEY_DB_USER=lucky_money_user
export LUCKY_MONEY_DB_PASS=pass_2019
export LUCKY_MONEY_DB_NAME=lucky_money

export LUCKY_MONEY_REDIS_HOST=127.0.0.1
export LUCKY_MONEY_REDIS_PORT=6380
export LUCKY_MONEY_REDIS_PASS=iueksefPOSDds123DW

export LUCKY_MONEY_RABBIT_HOST=172.18.0.2
export LUCKY_MONEY_RABBIT_PORT=5672
export LUCKY_MONEY_RABBIT_USER=mq_user
export LUCKY_MONEY_RABBIT_PASS=pass_2019

ex=$(which pm2)
if [ ! -e $ex ];
then
    npm i -g pm2
fi

pm2 start ./pm2.json