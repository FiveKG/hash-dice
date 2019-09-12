setenv TBG_DB_HOST=172.17.0.2
setenv TBG_DB_PORT=5432
setenv TBG_DB_USER=hash_dice_user
setenv TBG_DB_PASS=pass_2019
setenv TBG_DB_NAME=hash_dice

setenv TBG_REDIS_HOST=172.17.0.4
setenv TBG_REDIS_PORT=7758
setenv TBG_REDIS_PASS=redis_pass_2019

setenv TBG_RABBIT_HOST=172.17.0.3
setenv TBG_RABBIT_PORT=5672
setenv TBG_RABBIT_USER=mq_user
setenv TBG_RABBIT_PASS=pass_2019

ex=$(which pm2)
if [ ! -e $ex ];
then
    npm i -g pm2
fi

pm2 start ./pm2.json