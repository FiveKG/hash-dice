namespace API {
    
}

namespace DB {
    interface Account {
         "id": String,
         "account_name": String,
         "create_time": Date,
         "refer_count": Number,
         "refer_code": String,
         "main_id": String,
    }

    interface SubAccount {
         "id": String,
         "pid": String,
         "root_node": String,
         "main_account": String,
         "sub_account_name": String,
         "level": String,
         "position": String,
         "create_time": Date,
    }

    interface Balance {
         "id": String,
         "account_name": String,
         "amount": Number,
         "refer_income": Number,
         "mode_income": Number,
         "sort_income": Number,
         "other_income": Number,
         "withdraw_enable": Number,
         "repeat_currency": Number,
         "lotto_currency": Number,
         "game_currency": Number,
         "create_time": Date,
    
    }

    interface Referrer {
        "id": String,
        "referrer_name": String,
        "account_name": String,
        "create_time": Date,
    }

    interface AccountBalanceLog {
        "id": String,
        "account_name": String,
        "change_amount": Number,
        "current_balance": Number,
        "op_type": String,
        "remark": String,
        "create_time": Date,
    }

    interface SystemPools {
         "id": String,
         "pools_type": String,
         "pools_amount": Number,
    }

    interface SystemOpLog {
        "id": String,
        "change_amount": Number,
        "current_balance": Number,
        "op_type": String,
        "remark": String,
        "create_time": Date,
    }

    interface AccountOp {
        "id": String,
        "account_name": String,
        "op_type": String,
        "remark": String,
        "create_time": Date,
    }
}