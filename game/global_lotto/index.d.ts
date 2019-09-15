declare namespace API {
    
}

declare namespace DB {
    interface Game {
        "g_id": string,
        "prize_pool": number,
        "game_name": string,
        "bottom_pool": number,
        "reserve_pool": number,
        "create_time": string

    }

    interface GameSession {
        "gs_id": string,
        "g_id": string,
        "creator": string,
        "periods": number,
        "start_time": Date,
        "end_time": Date,
        "reward_time": Date,
        "extra": any,
        "game_state": number,
        "reward_num": string,
        "create_time": Date,
    }
}