module.exports = {
    "db" : {
        "host"    : "172.17.0.4",
        "database": "investment",
        "user" : "invest_db_user",
        "password" :  "pass_2019",
        "port"    : 5432,
    },
    "redis": {
        "host" : "172.17.0.3",
        "port" : 6379 ,
        "auth" : "redis_pass_2019"
    },
    "rabbitmq": {
        "host": "172.17.0.2",
        "port" : 5672,
        "user" : "mq_user",
        "pwd" : "pass_2019"
    }
}