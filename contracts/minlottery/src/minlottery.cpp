#include "minlottery.hpp"

void minlottery::init(uint64_t game_id, time_point_sec create_time, time_point_sec dead_line) {
    // 验证合约帐号
    require_auth( get_self() );
    lottogames lottogames_table( _self, _self.value );
    // 如果这一期游戏不存在,添加一期
    if ( lottogames_table.find(game_id) == lottogames_table.end() ) {
        lottogames_table.emplace( get_self(), [&](auto& game) {
            game.game_id = game_id;
            game.game_state = 0; // 初始化时状态默认为 0
            game.creator = get_self();
            game.created = create_time;
            game.deadline = dead_line;
        });
    }
}

void minlottery::setstate(uint64_t game_id, uint64_t state) {    
    require_auth( get_self() );
    lottogames lottogames_table( _self, _self.value );
    auto itr = lottogames_table.find(game_id);
    // 修改状态值
    lottogames_table.modify(itr, get_self(), [&](auto &game) {
        game.game_state = state;
    });
}

// 开始投注
void minlottery::bet(uint64_t bet_id, name bet_name, string bet_num, asset& quantity, uint64_t game_id, time_point_sec bet_time) {
    require_auth( get_self() );
    lottogames lottogames_table( _self, _self.value );
    auto itr = lottogames_table.find(game_id);
    check( itr != lottogames_table.end(), "this one is not exist" );
    check( itr->game_state == 1, "game dose not begin" );
    check( time_point_sec() < itr->deadline, "time is out" );
    check( bet_num.size() > 0, "invalid bet number" );

    betlottos betlottos_table( _self, _self.value );
    if ( betlottos_table.find(game_id) == betlottos_table.end() ) {
        betlottos_table.emplace( get_self(), [&](auto& game) {
            game.bet_id = bet_id;
            game.bet_num = bet_num;
            game.bet_name = bet_name;
            game.bet_time = bet_time;
            game.amount = quantity;
            game.game_id = game_id;
        });
    }
}

// 开奖
void minlottery::open(string reward_num, uint64_t game_id, time_point_sec reward_time) {
    require_auth( get_self() );
    lottogames lottogames_table( _self, _self.value );
    auto itr = lottogames_table.find(game_id);
    // 检查这一期游戏是否存在
    check( itr != lottogames_table.end(), "this phase is not exist");
    // 检查这一期游戏是否开始
    check( itr->game_state == 1, "game dose not begin" );

    rewards rewards_table( _self, _self.value );

    if ( rewards_table.find(game_id) == rewards_table.end() ) {
        rewards_table.emplace( get_self(), [&](auto& game) {
            game.game_id = game_id;
            game.reward_num = reward_num;
            game.reward_time = reward_time;
            game.reward_time = reward_time;
        });

        // todo 开奖以后,结束这一期, 可以调用 setstate 方法设置
        // 修改状态值
        lottogames_table.modify(itr, get_self(), [&](auto &game) {
            game.game_state = 2;
        });
    }
}

// 清除数据
void minlottery::clear(uint64_t game_id, string table_name, bool flag) {
    require_auth( get_self() );
    if (table_name == "lottogame") {
        lottogames lottogames_table( _self, _self.value );
        if (!!flag) {
            for (auto itr = lottogames_table.begin(); itr != lottogames_table.end();) {
                itr = lottogames_table.erase(itr);
            }
        } else {
            auto itr = lottogames_table.find(game_id);
            if (itr != lottogames_table.end()) {
                lottogames_table.erase(itr);
            }
        }
    }

    if (table_name == "betlotto") {
        betlottos betlottos_table( _self, _self.value );
        if (!!flag) {
            for (auto itr = betlottos_table.begin(); itr != betlottos_table.end();) {
                itr = betlottos_table.erase(itr);
            }
        } else {
            auto itr = betlottos_table.find(game_id);
            if (itr != betlottos_table.end()) {
                betlottos_table.erase(itr);
            }
        }
    }

    if (table_name == "rewardlotto") {
        rewards rewards_table( _self, _self.value );
        if (flag) {
            for (auto itr = rewards_table.begin(); itr != rewards_table.end();) {
                itr = rewards_table.erase(itr);
            }
        } else {
            auto itr = rewards_table.find(game_id);
            if (itr != rewards_table.end()) {
                rewards_table.erase(itr);
            }
        }
    }
}