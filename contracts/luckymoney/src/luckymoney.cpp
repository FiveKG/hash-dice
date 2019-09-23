#include "luckymoney.hpp"


/**
 *  @brief 发红包
 *  @param packet_id 红包 id
 *  @param owner 发出红包的玩家
 *  @param amount  红包房间额度
 *  @param player_account 红包的个数
*/
ACTION luckymoney::issue(uint64_t packet_id, asset amount, name owner, uint64_t player_account) {
    require_auth( get_self() );
    redpackets redpacket_table(_self, _self.value);
    auto paitr = redpacket_table.find(packet_id);
    check(paitr == redpacket_table.end(), "this redpacket has been sent");

    vector<uint64_t> vNodes;
    vector<asset> result;
    // uint64_t seed = current_time();

    for (auto itr = vNodes.begin(); itr != vNodes.end(); ++itr) {
        result.push_back(asset(0, symbol(UE_SYMBOL, 4)));
    }

    redpacket_table.emplace(_self, [&](auto& row) {
        row.packet_id = packet_id;
        row.amount = amount;
        row.owner = owner;
        row.issued = result;
    });
}

// @abi action 
/**
 *  @brief 抢红包
 *  @param snatch_id  抢红包 id
 *  @param packet_id 红包 id
 *  @param player 玩家姓名
*/
ACTION luckymoney::snatch(uint64_t snatch_id, uint64_t packet_id, name player) {
    require_auth( get_self() );

    redpackets redpacket_table(_self, _self.value);
    // 获取红包
    auto paitr = redpacket_table.find(packet_id);
    check(paitr != redpacket_table.end(), "this redpacket does not exist");

    auto issued = paitr->issued;
    // 如果红包被抢完,直接 return 掉.
    if (issued.size() == 0) {
        return ;
    }

    offers offer_table(_self, _self.value);
    auto offer_index = offer_table.template get_index<"byoffer"_n>();
    auto acitr = offer_index.find(packet_id);
    
    for (; acitr != offer_index.end() && acitr->packet_id == packet_id; ++acitr) {
        // 如果用户已经抢过这一期, return 出去
        if (acitr->offer_user == player) {
            return;
        }
    }

    // 生成新种子
    // auto seed = range(current_time(), issued.size());

    offer_table.emplace(_self, [&](auto& row) {
        row.snatch_id =  snatch_id;
        row.packet_id = packet_id;
        // 将第一个红包分配给用户, 之后打乱红包顺序
        row.amount = asset(0, symbol(UE_SYMBOL, 4)); // issued[0];  //2019-1-30 抢的时候是 0
        row.offer_user = player;
    });

    redpacket_table.modify(paitr, _self, [&](auto& row) {
        row.snatched.push_back(issued[0]);
        issued.erase(issued.begin());
        // 打乱红包顺序
        //swap_shuffle(current_time(), issued); //2019-1-30 
        row.issued = issued;
    });
}

/**
    *  @brief 清除
    *  @param clubid 俱乐部 id
*/
ACTION luckymoney::clear(uint64_t key, string opt, bool flag) {
    require_auth( get_self() );
    if (opt == "redpackets") {
        redpackets redpacket_table(_self, _self.value);
         if (!!flag) {
            for (auto itr = redpacket_table.begin(); itr != redpacket_table.end();) {
                itr = redpacket_table.erase(itr);
            }
        } else {
            auto itr = redpacket_table.find(key);
            if (itr != redpacket_table.end()) {
                redpacket_table.erase(itr);
            }
        }
    }

    if (opt == "offer") {
        offers offer_table(_self, _self.value);
        if (!!flag) {
            for (auto itr = offer_table.begin(); itr != offer_table.end();) {
                itr = offer_table.erase(itr);
            }
        } else {
            auto itr = offer_table.find(key);
            if (itr != offer_table.end()) {
                offer_table.erase(itr);
            }
        }
    }
}

/**
    *  @brief 生成随机数
    *  @param seed 执行当前区块的时间
    *  @param to   指定随机数范围
*/
// uint64_t luckymoney::range(uint64_t seed, uint64_t to) {
//     checksum256 result;
//     sha256((char *)&seed, sizeof(seed), &result);
//     seed = result.hash[1];
//     seed <<= 32;
//     seed |= result.hash[0];
//     return seed % to;
// }
