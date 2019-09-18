#include "hashdice.hpp"

/***
 * @brief 开始投注
 * @param bet_name    投注用户
 * @param bet_num     投注号码
 * @param quantity    投注总额
 * @param bet_time    投注时间
 */
void hashdice::bet(name bet_name, string bet_num, asset& quantity, time_point_sec bet_time) {
    require_auth( get_self() );
    bets bets_table( get_self(), get_self().value );
    bets_table.emplace( get_self(), [&](auto& b) {
        b.id = bets_table.available_primary_key();
        b.bet_num = bet_num;
        b.bet_name = bet_name;
        b.bet_time = bet_time;
        b.amount = quantity;
    });
};

/***
 * @brief 开奖
 * @param reward_num    开奖号码
 * @param bet_num    投注号码
 * @param reward_time    开奖时间
 * @param bet_block    投注区块
 * @param reward_block    开奖区块
 */
void hashdice::open(string reward_num, string bet_num, uint64_t bet_block, uint64_t reward_block, time_point_sec reward_time) {
    require_auth( get_self() );
    rewards rewards_table( get_self(), get_self().value );
    rewards_table.emplace( get_self(), [&](auto& re) {
        re.id = rewards_table.available_primary_key();
        re.bet_num = bet_num;
        re.reward_block = reward_block;
        re.bet_block = bet_block;
        re.reward_num = reward_num;
        re.creator = get_self();
        re.reward_time = reward_time;
    });
};