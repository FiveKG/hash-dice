#include <eosio/eosio.hpp>
#include <eosio/time.hpp>
#include <eosio/contract.hpp>
#include <eosio/system.hpp>
#include <eosio/asset.hpp>
#include <string>
#include <vector>

using namespace eosio;
using namespace std;

using std::string;
using eosio::print;
using eosio::time_point_sec;

class [[eosio::contract("minlottery")]] minlottery : public contract {
  public:
    using contract::contract;
    minlottery(name receiver, name code, datastream<const char*> ds):contract(receiver, code, ds) {};

    /***
     * @brief 初始化游戏
     * @param game_id    游戏的期数 id
     * @param create_time    这一期游戏的开始时间
     * @param dead_line      这一期游戏的结束时间
     */
    ACTION init(uint64_t game_id, time_point_sec create_time, time_point_sec dead_line);

    /***
     * @brief 修改游戏的状态
     * @param game_id    游戏的期数 id
     * @param state      游戏的期数状态
     */
    ACTION setstate(uint64_t game_id, uint64_t state);

    /***
     * @brief 开始投注
     * @param bet_id      投注 id
     * @param bet_name    投注用户
     * @param bet_num     投注号码
     * @param quantity    投注总额
     * @param game_id     游戏的期数 id
     * @param bet_time    投注时间
     */
    ACTION bet(uint64_t bet_id, name bet_name, string bet_num, asset& quantity, uint64_t game_id, time_point_sec bet_time);

    /***
     * @brief 开奖
     * @param reward_num    开奖号码
     * @param game_id    游戏的期数 id
     * @param reward_time    开奖时间
     */
    ACTION open(string reward_num, uint64_t game_id, time_point_sec reward_time);
    
private:
    // 一期的时间
    const uint32_t ONE_PHASE = 60 * 60; // one phase of the time
    // 定义游戏
    TABLE game {
        uint64_t game_id;       // 游戏期数 id
        uint64_t game_state;    // 游戏状态 0: 初始化, 1: 
        name creator;           // 游戏创建者
        time_point_sec created;       // 创建时间
        time_point_sec deadline;      // 截止时间

        uint64_t primary_key() const { return game_id; }
    };

    //  投注
    TABLE betlotto {
        uint64_t bet_id;    // 投注 id
        string bet_num;     // 投注号码
        name bet_name;      // 投注用户
        time_point_sec bet_time;    // 投注时间
        asset amount;       // 投注额度
        uint64_t game_id;   // 期数

        uint64_t primary_key() const {
            return bet_id;
        }

        uint64_t get_game_id() const { return game_id; }
    };

    // 开奖
    TABLE rewardlotto {
        uint64_t game_id;   // 期数
        string reward_num;  // 开奖号码
        time_point_sec reward_time; // 开奖时间
        name creator;   // 开奖用户
        asset bonus;    // 奖金
        
        uint64_t primary_key() const { return game_id; }
    };

    typedef eosio::multi_index<"lottogame"_n, game> lottogames;
    typedef eosio::multi_index<
        "betlotto"_n, betlotto, 
        indexed_by<"bybetlotto"_n, const_mem_fun<betlotto, uint64_t, &betlotto::get_game_id>>
    > betlottos;
    typedef eosio::multi_index<"rewardlotto"_n, rewardlotto> rewards;
};