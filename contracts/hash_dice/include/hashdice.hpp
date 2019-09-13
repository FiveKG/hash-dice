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

class [[eosio::contract("hashdice")]] hashdice : public contract {
  public:
    using contract::contract;
    hashdice(name receiver, name code, datastream<const char*> ds):contract(receiver, code, ds) {};
    
    /***
     * @brief 开始投注
     * @param bet_name    投注用户
     * @param bet_num     投注号码
     * @param quantity    投注总额
     * @param bet_time    投注时间
     */
    ACTION bet(name bet_name, string bet_num, asset& quantity, time_point_sec bet_time);

    /***
     * @brief 开奖
     * @param reward_num    开奖号码
     * @param bet_num    投注号码
     * @param reward_time    开奖时间
     * @param bet_block    投注区块
     * @param reward_block    开奖区块
     */
    ACTION open(string reward_num, string bet_num, uint64_t bet_block, uint64_t reward_block, time_point_sec reward_time);

    // TODO 
    // 投注应该是可以撤销的
    
private:
    //  投注
    TABLE bet_table {
        uint64_t id;    // 投注 id
        string bet_num;     // 投注号码
        name bet_name;      // 投注用户
        time_point_sec bet_time;    // 投注时间
        asset amount;       // 投注额度

        uint64_t primary_key() const { return id; }
    };

    // 开奖
    TABLE reward {
        uint64_t id;   // 期数
        string bet_num;  // 投注号码
        uint64_t bet_block; // 投注所在区块
        uint64_t reward_block; // 开奖区块
        string reward_num;    // 开奖号码
        time_point_sec reward_time; // 开奖时间
        name creator;   // 开奖用户
        asset bonus;    // 奖金
        
        uint64_t primary_key() const { return id; }
    };

    typedef eosio::multi_index< "bet"_n, bet_table> bets;
    typedef eosio::multi_index<"reward"_n, reward> rewards;
};