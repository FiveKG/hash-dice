#!/bin/bash

TBG_DB_HOST=172.17.0.5
TBG_DB_PORT=5432
TBG_DB_USER=wallet_tbg_user
TBG_DB_PASS=pass_2019
TBG_DB_NAME=wallet_tbg_db

start=`data +%s`
psql "host=${TBG_DB_HOST} user=${TBG_DB_USER} port=${TBG_DB_PORT} password=${TBG_DB_PASS} dbname=${TBG_DB_NAME} sslmode=disable" <<- EOF

EOF
end=`date +%s`
dif=$[ end - start ] 
echo $dif
