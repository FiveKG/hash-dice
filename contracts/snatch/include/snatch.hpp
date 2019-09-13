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

// 夺宝游戏合约
class [[eosio::contract("snatch")]] snatch : public contract {
  public:
    using contract::contract;
    snatch(name receiver, name code, datastream<const char*> ds):contract(receiver, code, ds) {};

    // 游戏类型
    struct snatchrule {
        uint8_t id;    // id
        asset quantity; // 每个 key 对应的资产额度
        uint8_t key;    // 所需要的 key 的数量
    };
    

    /***
     * @brief 初始化游戏
     * @param game_id    游戏的期数 id
     * @param create_time    这一期游戏的开始时间
     * @param rule_id    规则 id
     */
    ACTION init(uint64_t game_id, time_point_sec create_time, snatchrule rule);

    /***
     * @brief 修改游戏的状态
     * @param game_id    游戏的期数 id
     * @param state      游戏的期数状态
     * @param rule_id    规则 id
     */
    ACTION setstate(uint64_t game_id, uint64_t state, snatchrule rule);

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
    ACTION bet(name bet_name, string snatch_code, asset& quantity, uint8_t key, uint64_t game_id, time_point_sec bet_time, snatchrule rule);

    /***
     * @brief 开奖
     * @param lucky_code    开奖号码
     * @param game_id    游戏的期数 id
     * @param reward_time    开奖时间
     * @param rule_id    规则 id
     */
    ACTION open(string lucky_code, uint64_t game_id, time_point_sec reward_time, snatchrule rule);
    
  private:
    // 定义游戏
    TABLE snatchgame {
        uint64_t id;    // 开奖 id
        uint64_t periods;       // 游戏期数 id
        uint64_t game_state;    // 游戏状态 0: 初始化
        snatchrule game_type;     // 游戏的类型
        eosio::name creator;           // 游戏创建者
        time_point_sec created;       // 创建时间

        auto primary_key() const { return id; }
        uint64_t get_game_id() const { return periods; }
    };

    //  投注
    TABLE betsnatch {
        uint64_t bet_id;    // 投注 id
        uint8_t key;     // 投注 key 的数量
        name bet_name;      // 投注用户
        snatchrule game_type;     // 投注用户游戏的类型
        string snatch_code;  // 投注幸运码
        time_point_sec bet_time;    // 投注时间
        asset amount;       // 投注额度
        uint64_t periods;       // 游戏期数 id

        auto primary_key() const { return bet_id; }
    };

    // 开奖
    TABLE rewardsnatch {
        uint64_t id;    // 开奖 id
        uint64_t periods;   // 期数
        string lucky_code;  // 开奖幸运码
        snatchrule game_type;     // 游戏的类型
        time_point_sec reward_time; // 开奖时间
        name creator;   // 开奖用户
        asset bonus;    // 奖金
        
        auto primary_key() const { return id; }
    };

    typedef eosio::multi_index<"snatchgame"_n, snatchgame, indexed_by<"bysnatchgame"_n, const_mem_fun<snatchgame, uint64_t, &snatchgame::get_game_id>>> snatchgames;
    typedef eosio::multi_index<"betsnatch"_n, betsnatch> betsnatchs;
    typedef eosio::multi_index<"rewardsnatch"_n, rewardsnatch> rewardsnatchs;
};