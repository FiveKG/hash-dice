module.exports = {
    "db" : {
        "host"    : "172.17.0.5",
        "database": "global_lotto",
        "user" : "global_lotto_user",
        "password" :  "pass_2019",
        "port"    : 5432,
    },
    "redis": {
        "host" : "172.17.0.2",
        "port" : 6379 ,
        "auth" : "redis_pass_2018"
    },
    "rabbitmq": {
        "host": "172.17.0.3",
        "port" : 5672,
        "user" : "mq_user",
        "pwd" : "pass_2019"
    }
}
