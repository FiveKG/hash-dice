// @ts-check
const logger = require("@fjhb/logger").child({ "@": "lucky_money_service/club/summary" });
const { club, room } = require("@fjhb/db-op");
const { get_status } = require("../../common");
const redis = require("@fjhb/lm-redis");
const lodash = require("lodash");

module.exports = async function(req, res, next) {
    try {
        const club_id = Number(req.query.club_id);
        if (isNaN(club_id)) {
            logger.info(`参数不合法, club_id: ${club_id}, ip: ${req.ip}`);
            return res.send(get_status("参数不合法"));
        }
        if (club_id !== 1 && !/^[1-9][0-9]{5}$/.test(club_id.toString())) {
            logger.info(`参数不合法, club_id: ${club_id}, ip: ${req.ip}`);
            return res.send(get_status("参数不合法"));
        }

        const [club_info, room_list] = await Promise.all([
            club.get_by_club_id(club_id),
            room.get_by_club_id(club_id)
        ]);

        if (club_info == null) {
            logger.info(`can not find club, club_id: ${club_id}, ip: ${req.ip}`);
            return res.send(get_status(2001, "can not find club"));
        }

        const roomGroupObj = lodash.groupBy(room_list, (roomInfo) => { return roomInfo.quantity });
    
        let responseData = {
            "club_id": club_info.club_id,
            "club_name": club_info.club_name,
            "type_list": []
        };
        for (let key in roomGroupObj) {
            let list = [];
            for (let roomInfo of roomGroupObj[key]) {
                list.push({
                    "room_id"     : roomInfo.room_id,
                    "amount"      : Number(roomInfo.amount).toFixed(4),
                    "online_count": (await redis.keys(`lm:online_count:club_${club_id}:${roomInfo.room_id}:*`)).length
                });
            }

            responseData.type_list.push({
                "type"     : Number(key),
                "room_list": lodash.orderBy(list, [(o) => Number(o.amount)], ['asc'])
            });
        }
        
        res.send(get_status(1, responseData));
    } catch (error) {
        logger.error(error, "club_id error");
        next(error);
    }
};
