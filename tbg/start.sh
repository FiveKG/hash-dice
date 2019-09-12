#!/bin/bash
#Description: run tbg service
unset TBG_DB_HOST
unset TBG_DB_PORT
unset TBG_DB_USER
unset TBG_DB_PASS
unset TBG_DB_NAME
unset TBG_REDIS_HOST
unset TBG_REDIS_PORT
unset TBG_REDIS_PASS
unset TBG_RABBIT_HOST
unset TBG_RABBIT_PORT
unset TBG_RABBIT_USER
unset TBG_RABBIT_PASS

postgreshost=$(docker inspect postgres | grep IPAddress | grep -E -o "([0-9]{1,3}[\.]){3}[0-9]{1,3}" | sed -n '1p')
redishost=$(docker inspect redis | grep IPAddress | grep -E -o "([0-9]{1,3}[\.]){3}[0-9]{1,3}" | sed -n '1p')
rabbitmqhost=$(docker inspect rabbitmq | grep IPAddress | grep -E -o "([0-9]{1,3}[\.]){3}[0-9]{1,3}" | sed -n '1p')

dbname=wallet_tbg_db
dbuser=wallet_tbg_user

cat > ./config.js <<-EOF
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

export TBG_DB_HOST=$postgreshost
export TBG_DB_PORT=5432
export TBG_DB_USER=$dbname
export TBG_DB_PASS=pass_2019
export TBG_DB_NAME=$dbuser

export TBG_REDIS_HOST=$redishost
export TBG_REDIS_PORT=6379
export TBG_REDIS_PASS=redis_pass_2018

export TBG_RABBIT_HOST=$rabbitmqhost
export TBG_RABBIT_PORT=5672
export TBG_RABBIT_USER=mq_user
export TBG_RABBIT_PASS=pass_2019

ex=$(which pm2)
if [ ! -e $ex ];
then
    npm i -g pm2
fi

# pm2 start ./pm2.json
node tbg_service.js