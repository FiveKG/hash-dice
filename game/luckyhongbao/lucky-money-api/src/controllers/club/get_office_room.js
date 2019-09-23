// @ts-check
const logger = require("@fjhb/logger");
const { room } = require("@fjhb/db-op");
const { get_status } = require("../../common");
const redis = require("@fjhb/lm-redis");
const lodash = require("lodash");

module.exports = async function(req, res, next) {
    try {
        const office_room_list = await room.get_by_club_id(1);

        let list = [];
        for (let item of office_room_list) {
            list.push({
                "room_id": item.room_id,
                "amount": Number(item.amount).toFixed(4),
                "quantity": item.quantity,
                "online_count": (await redis.keys(`lm:online_count:club_${item.club_id}:${item.room_id}:*`)).length
            });
        }

        const responseData = lodash.orderBy(list, ['online_count', (o) => Number(o.amount)], ['asc', 'asc']);

        res.send(get_status(1, responseData));
    } catch (error) {
        logger.error(error, "club_id error");
        next(error);
    }
};
