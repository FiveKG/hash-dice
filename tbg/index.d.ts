namespace API {
    
}

namespace DB {
    interface Account {
         "id": string,
         "account_name": string,
         "create_time": Date,
         "refer_count": number,
         "refer_code": string,
         "main_id": string,
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
         "refer_income": number,
         "mode_income": number,
         "sort_income": number,
         "other_income": number,
         "withdraw_enable": number,
         "repeat_currency": number,
         "lotto_currency": number,
         "game_currency": number,
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
        "op_type": string,
        "remark": string,
        "create_time": Date,
    }

    interface SystemPools {
         "id": string,
         "pool_type": string,
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
}