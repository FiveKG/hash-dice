const logger = require("../../common/logger.js").child({ "@controllers/hash_dice/getConfig.js": "get config" });

module.exports ={
    game_rate : [
        {
            "odds_rate"          : "2.0770",
            "winning_probability": "35%",
            "num_interval"       : "0-99",
            "bet_type"           : "smaller"
        },

        {
            "odds_rate"          : "2.1770",
            "winning_probability": "45%",
            "num_interval"       : "0-99",
            "bet_type"           : "big"
        },

        {
            "odds_rate"          : "2.1770",
            "winning_probability": "45%",
            "num_interval"       : "0-99",
            "bet_type"           : "small"
        },

        {
            "odds_rate"          : "9.8000",
            "winning_probability": "10%",
            "num_interval"       : "0-99",
            "bet_type"           : "twins"
        }
    ],
    bet_type :{
        big : 50,
        small : 50,
        twins : [0,11,22,33,44,55,66,77,88,99],
    }
}