#include <eosio/eosio.hpp>
#include <eosio/time.hpp>
#include <eosio/contract.hpp>
#include <eosio/transaction.hpp>
#include <eosio/asset.hpp>
#include <eosio/action.hpp>
#include <eosio/symbol.hpp>
// #include <eosio/crypto.h>
#include <map>
#include <string>
#include <algorithm>

using namespace eosio;
using namespace std;

#define UE_SYMBOL symbol_code("UE")

CONTRACT luckymoney : public contract {
    public:
        using contract::contract;
        const uint32_t TIME_LIMIT = 60 * 24 * 7;
        luckymoney(name receiver, name code, datastream<const char*> ds):contract(receiver, code, ds) {}
        /**
         *  @brief 发红包
         *  @param packet_id 红包 id
         *  @param owner 发出红包的玩家
         *  @param amount  红包房间额度
         *  @param player_account 红包的个数
        */
        ACTION issue(
            uint64_t packet_id, 
            asset amount, 
            name owner, 
            uint64_t player_account
        );

        // @abi action 
        /**
         *  @brief 抢红包
         *  @param snatch_id  抢红包 id
         *  @param packet_id 红包 id
         *  @param player 玩家姓名
        */
        ACTION snatch(uint64_t snatch_id, uint64_t packet_id, name player);

        /**
         *  @brief 清除
         *  @param clubid 俱乐部 id
        */
        ACTION clear(uint64_t key, string opt, bool flag);

        /**
         *  @brief 生成随机数
         *  @param seed 执行当前区块的时间
         *  @param to   指定随机数范围
        */
        // uint64_t range(uint64_t seed, uint64_t to);
    private:
        TABLE redpacket {
            uint64_t packet_id;
            name owner;
            asset amount;
            vector<asset> issued;
            vector<asset> snatched;

            uint64_t primary_key() const { return packet_id; }
        };

        TABLE offer {
            uint64_t snatch_id;
            uint64_t packet_id;
            name offer_user;
            asset amount;

            uint64_t primary_key() const { return snatch_id; }
            uint64_t get_packet_id() const { return packet_id; }
        };

        typedef eosio::multi_index< "redpackets"_n, redpacket> redpackets;
        typedef eosio::multi_index< "offer"_n, offer, indexed_by< "byoffer"_n, const_mem_fun<offer, uint64_t, &offer::get_packet_id>>> offers;
};