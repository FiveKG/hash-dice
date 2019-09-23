// @ts-check
const logger = require("@fjhb/logger").child({ "@": "lucky_money_service/club/create" });
const { club: clubBiz } = require("@fjhb/db-op");
const { get_status } = require("../../common");

async function create_club(req, res, next) {
    try {
        let req_data = req.body;
        logger.debug(`create club .request data: ${JSON.stringify(req_data)}`);

        // 检查请求参数
        const account_name = req.account_name;
        const club_name = req_data.club_name;
        const club_id = Number(req_data.club_id);
        if (isNaN(club_id) || !/^[1-9][0-9]{5}$/.test(club_id.toString())) {
            logger.info(`参数不合法, club_id: ${req_data.club_id}. account_name: ${account_name}, ip: ${req.ip}`);

            return res.send(get_status("参数不合法"));
        } else if (typeof club_name !== "string" || club_name.length < 2 || club_name.length > 15) {
            logger.info(`参数不合法, club_name: ${club_name}. account_name: ${account_name}, ip: ${req.ip}`);

            return res.send(get_status("参数不合法"));
        }

        let refer_club_id = req_data.refer_club_id;
        if (refer_club_id) {
            const refer_club_id_tmp = Number(refer_club_id);
            if (isNaN(refer_club_id_tmp) || !/^[1-9][0-9]{5}$/.test(refer_club_id_tmp.toString())) {
                logger.info(`参数不合法, refer_club_id: ${refer_club_id}. account_name: ${account_name}, ip: ${req.ip}`);
    
                return res.send(get_status("参数不合法"));
            }

            // 检查推荐的俱乐部是否存在
            const refer_club_info = await clubBiz.get_by_club_id(refer_club_id_tmp);
            if (refer_club_info == null) {
                logger.info(`推荐俱乐部不存在, refer_club_id: ${refer_club_id}`);

                return res.send(get_status("推荐俱乐部不存在"));
            }
        }

        //先检查俱乐部的参数 是否 冲突.  并行查询.
        let [
            by_club_id, 
            by_creator, 
            by_club_name
        ] = await Promise.all([
            clubBiz.get_by_club_id(club_id),
            clubBiz.get_by_creator(account_name),
            clubBiz.get_by_club_name(club_name)
        ]);

        if (by_club_id) {
            logger.info(`此俱乐部已经存在了, by_club_id, club_info: %j`, by_club_id);

            return res.send(get_status(2000, "this club already exist"));
        }
        if (by_creator) {
            logger.info(`此用户已经拥有俱乐部了, by_creator, club_info: %j`, by_creator);

            return res.send(get_status(2010, "You have created a club"));
        }
        if (by_club_name) {
            logger.info(`俱乐部名字已被使用, by_club_name, club_info: %j`, by_club_name);

            return res.send(get_status(2011, "club name already exist"));
        }
        
        //可以创建俱乐部了,
        let club_data = {
            "club_id"      : club_id,
            "club_name"    : club_name,
            "refer_club_id": refer_club_id,
            "creator_name" : account_name,
        };

        await clubBiz.createAndJoin(club_data);

        res.send(get_status(1, "create club successful"));
    } catch (error) {
        logger.error(error, "create club failed");
        next(error);
    }
};

module.exports = create_club;
