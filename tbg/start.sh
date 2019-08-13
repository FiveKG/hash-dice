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

export TBG_DB_HOST=172.17.0.2
export TBG_DB_PORT=5432
export TBG_DB_USER=wallet_tbg_user
export TBG_DB_PASS=pass_2019
export TBG_DB_NAME=wallet_tbg_db

export TBG_REDIS_HOST=172.17.0.5
export TBG_REDIS_PORT=6379
export TBG_REDIS_PASS=redis_pass_2018

export TBG_RABBIT_HOST=172.17.0.4
export TBG_RABBIT_PORT=5672
export TBG_RABBIT_USER=mq_user
export TBG_RABBIT_PASS=pass_2019

pm2 start ./pm2.json