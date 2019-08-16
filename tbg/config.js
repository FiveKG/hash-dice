module.exports = {
    "db" : {
        "host"    : "172.17.0.5",
        "database": "wallet_tbg_db",
        "user" : "wallet_tbg_user",
        "password" :  "pass_2019",
        "port"    : 5432,
    },
    "redis": {
        "host" : "172.17.0.6",
        "port" : 6379 ,
        "auth" : "redis_pass_2018"
    },
    "rabbitmq": {
        "host": "172.17.0.4",
        "port" : 5672,
        "user" : "mq_user",
        "pwd" : "pass_2019"
    }
}