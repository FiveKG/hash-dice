#include "snatch.hpp"

/***
 * @brief 初始化游戏
 * @param game_id    游戏的期数 id
 * @param create_time    这一期游戏的开始时间
 * @param rule_id    规则 id
 */
void snatch::init(uint64_t game_id, time_point_sec create_time, snatchrule rule) {
    require_auth( get_self() );

    snatchgames games_table( get_self(), get_self().value );
    games_table.emplace( get_self(), [&](auto& ga) {
        ga.id = games_table.available_primary_key();
        ga.periods = game_id;
        ga.game_state = 0;
        ga.game_type = rule;
        ga.creator = get_self();
        ga.created = create_time;
    });
};

/***
 * @brief 修改游戏的状态
 * @param game_id    游戏的期数 id
 * @param state      游戏的期数状态
 * @param rule_id    规则 id
 */
void snatch::setstate(uint64_t game_id, uint64_t state, snatchrule rule) {
    require_auth( get_self() );
    
    snatchgames games_table( get_self(), get_self().value );

    auto game_index = games_table.get_index<"bysnatchgame"_n>();
    auto itr = game_index.find(game_id);
    for (; itr == game_index.end(); itr++) {
        if (itr->game_type.id == rule.id) {
            game_index.modify(itr, get_self(), [&](auto& ga) {
                ga.game_state = state;
            });
        }
    }
};

/***
 * @brief 开始投注
 * @param bet_name    投注用户
 * @param bet_num     投注号码
 * @param quantity    投注总额
 * @param key         投注 key 的数量
 * @param game_id     游戏的期数 id
 * @param bet_time    投注时间
 * @param rule_id    规则 id
 */
void snatch::bet(name bet_name, string snatch_code, asset& quantity, uint8_t key, uint64_t game_id, time_point_sec bet_time, snatchrule rule) {
    require_auth( get_self() );
    
    snatchgames games_table( get_self(), get_self().value );
    auto game_index = games_table.get_index<"bysnatchgame"_n>();
    auto itr = game_index.find(game_id);

    betsnatchs bets_table( get_self(), get_self().value );

    for (; itr == game_index.end(); itr++) {
        if (itr->game_type.id == rule.id) {
            check( itr->game_state == 1, "game dose not begin");
            bets_table.emplace(get_self(), [&](auto& b) {
                b.bet_id = bets_table.available_primary_key();
                b.key = key;
                b.snatch_code = snatch_code;
                b.bet_name = bet_name;
                b.amount = quantity;
                b.periods = game_id;
                b.bet_time = bet_time;
                b.game_type = rule;
            });
        }
    }
};

/***
 * @brief 开奖
 * @param lucky_code    开奖号码
 * @param game_id    游戏的期数 id
 * @param reward_time    开奖时间
 * @param rule_id    规则 id
 */
void snatch::open(string lucky_code, uint64_t game_id, time_point_sec reward_time, snatchrule rule) {
    require_auth( get_self() );
    
    snatchgames games_table( get_self(), get_self().value );
    auto game_index = games_table.get_index<"bysnatchgame"_n>();
    auto itr = game_index.find(game_id);

    rewardsnatchs rewards_table( get_self(), get_self().value );
    for (; itr == game_index.end(); itr++) {
        if (itr->game_type.id == rule.id) {
            check( itr->game_state == 1, "game dose not begin");
            rewards_table.emplace(get_self(), [&](auto& re) {
                re.id = rewards_table.available_primary_key();
                re.creator = get_self();
                re.lucky_code = lucky_code;
                re.periods = game_id;
                re.reward_time = reward_time;
                re.game_type = rule;
            });
        }
    }
};

// 清除数据
void snatch::clear(uint64_t game_id, snatchrule rule, string table_name, bool flag) {
    require_auth( get_self() );
    if (table_name == "snatchgame") {
        snatchgames games_table( get_self(), get_self().value );
        if (!!flag) {
            for (auto itr = games_table.begin(); itr != games_table.end();) {
                itr = games_table.erase(itr);
            }
        } else {
            auto game_index = games_table.get_index<"bysnatchgame"_n>();
            auto itr = game_index.find(game_id);
            for (; itr == game_index.end(); itr++) {
                if (itr->game_type.id == rule.id) {
                   auto itr = games_table.find(game_id);
                    if (itr != games_table.end()) {
                        games_table.erase(itr);
                    }
                }
            }
        }
    }

    if (table_name == "betsnatch") {
        betsnatchs bets_table( get_self(), get_self().value );
        if (!!flag) {
            for (auto itr = bets_table.begin(); itr != bets_table.end();) {
                itr = bets_table.erase(itr);
            }
        } else {
            auto itr = bets_table.find(game_id);
            bets_table.erase(itr);
        }
    }

    if (table_name == "rewardsnatch") {
        rewardsnatchs rewards_table( get_self(), get_self().value );
        if (flag) {
            for (auto itr = rewards_table.begin(); itr != rewards_table.end();) {
                itr = rewards_table.erase(itr);
            }
        } else {
            auto itr = rewards_table.find(game_id);
            rewards_table.erase(itr);
        }
    }
}