declare namespace API {
    
}

declare namespace DB {
    interface Account {
         "id": string,
         "account_name": string,
         "create_time": Date,
         "refer_count": number,
         "refer_code": string,
         "account_type": string,
         "state": number,
    }

    interface SubAccount {
         "id": string,
         "pid": string,
         "root_node": string,
         "main_account": string,
         "sub_account_name": string,
         "level": string,
         "position": string,
         "create_time": Date,
    }

    interface Balance {
         "id": string,
         "account_name": string,
         "amount": number,
         "withdraw_enable": number,
         "repeat_currency": number,
         "lotto_currency": number,
         "game_currency": number,
         "create_time": Date,
    }

    interface TbgBalance {
        "id": string,
        "account_name": string,
        "release_amount": number,
        "sell_amount": number,
        "active_amount": number,
        "create_time": Date,
   }

    interface Referrer {
        "id": string,
        "referrer_name": string,
        "account_name": string,
        "create_time": Date,
    }

    interface AccountBalanceLog {
        "id": string,
        "account_name": string,
        "change_amount": number,
        "current_balance": number,
        "extra": {
            "symbol": string,
            "tr_id": string,
            "op_type": string
        },
        "op_type": string,
        "remark": string,
        "create_time": Date,
    }

    interface SystemPools {
         "id": string,
         "pool_type": string,
         "pool_symbol": string,
         "pool_amount": number,
    }

    interface SystemOpLog {
        "id": string,
        "change_amount": number,
        "current_balance": number,
        "op_type": string,
        "remark": string,
        "create_time": Date,
    }

    interface AccountOp {
        "id": string,
        "account_name": string,
        "op_type": string,
        "remark": string,
        "create_time": Date,
    }

    interface AssetsPackage {
        "id": number,
        "amount": number,
        "saleable_multiple": number,
        "mining_multiple": number,
        "preset_days": number,
        "release_multiple": number,
        "amount_type": string,
    }

    /** 交易 TBG */
    interface Trade {
        /** 交易 id */
        "id": string,
        /** 用户账户名 */
        "account_name": string,
        /** 交易类型 */
        "trade_type": string,
        /** 交易额外信息 */
        "extra": {
            "ap_id": number
        },
        /** 交易数量 */
        "amount": number, 
        /** 成交的数量 */
        "trx_amount": number,
        /** 交易价格 */
        "price": number,
        /** 交易状态 */
        "state": string,
        /** 交易创建时间 */
        "create_time": Date,
        /** 交易完成时间 */
        "finished_time": Date
    }

    /** 交易日志  */
    interface Trade_log {
        /** 交易日志 id  */
        "id": string,
        /** 交易 id  */
        "tr_id": string,
        /** 交易类型  */
        "trade_type": string,
        /** 交易数量  */
        "amount": number,
        /** 备注  */
        "memo": string, 
        /** 交易价格  */
        "price": number,
        /** 成交金额 价格 * 数量  */
        "volume": number,
        "create_time": Date
    }
}