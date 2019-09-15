declare namespace API {
    
}

declare namespace DB {
    interface Game {
        "g_id": number,
        "prize_pool": number,
        "key_count": number,
        "game_name": number,
        "quantity": number
    }

    interface GameSession {
        "gs_id": string,
        "creator": string,
        "g_id": string,
        "periods": number,
        "extra": Object,
        "reward_code": string,
        "game_state": number,
        "create_time": Date,
    }
}