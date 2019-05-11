module.exports = {
    "db" : {
        // "host"    : "192.168.1.102",
        // "database": "investment",
        // "user" : "invest_db_user",
        // "password" :  "pass@2019",
        // "port"    : 5432,
        "host"    : "127.0.0.1",
        "database": "investment",
        "user" : "invest_db_user",
        "password" :  "pass_2019",
        "port"    : 5432,
    },
    "redis": {
        "host" : "192.168.1.115",
        "port" : 6379 ,
        "auth" : "redis_pass_2018"
    },
    "rabbitmq": {
        "host": "192.168.1.115",
        "port" : 5672,
        "user" : "mq_user",
        "pwd" : "pass_2018"
    }
}