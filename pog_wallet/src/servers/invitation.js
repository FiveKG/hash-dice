import axios from 'axios';

// var baseURL = 'http://172.81.224.11/api';
// var baseURL = 'http://192.168.1.135:9527';
// var baseURL = 'http://192.168.1.141:9527';
var baseURL = 'http://pog.tbg.isecsp.com';

const xhr = axios.create({
    baseURL,
    timeout: 10000,
});

// post请求,needHeader参数用于判断是否需要认证
const postData = (url, data, needHeader) => {
    let headers = {};
    return new Promise((resolve, reject) => {
        xhr({ url, data, headers, method: 'post' })
            .then(res => {
                resolve(res.data)
            })
            .catch(err => reject(err))
    })
}

// get请求,needHeader参数用于判断是否需要认证
const getData = (url, params, needHeader) => {
    let headers = {};
    return new Promise((resolve, reject) => {
        xhr({ url, params, headers })
            .then(res => resolve(res.data))
            .catch(err => reject(err))
    })
}

// 获取配置
const getConfig = (reqData) => {
        const url = '/config/get_config';
        const data = reqData;
        return getData(url, data);
    }
    // 设置推荐码
const setInvitation = (reqData) => {
        const url = '/account/set_invitation';
        const data = reqData;
        return postData(url, data);
    }
    // 获取推荐码
const getInvitation = (reqData) => {
        const url = '/account/invest_code';
        const data = reqData;
        return getData(url, data);
    }
    // 根据填写的邀请码显示出帐号名称
const getCodeByAccount = (reqData) => {
        const url = '/account/show_account_name_by_code';
        const data = reqData;
        return getData(url, data);
    }
    // 邀请绑定
const bindReferrer = (reqData) => {
        const url = '/account/bind_referrer';
        const data = reqData;
        return postData(url, data);
    }
    // 是否已经绑定
const isBind = (reqData) => {
        const url = '/account/is_bind';
        const data = reqData;
        return getData(url, data);
    }
    // 帐号是否激活
const isActive = (reqData) => {
        const url = '/account/is_activated';
        const data = reqData;
        return getData(url, data);
    }
    // 会员等级
const level = (reqData) => {
        const url = '/account/level';
        const data = reqData;
        return getData(url, data);
    }
    // 子帐号
const subAccount = (reqData) => {
        const url = '/account/sub_account';
        const data = reqData;
        return getData(url, data);
    }
    // 投资首页
const investmentIndex = (reqData) => {
        const url = '/account/investment_index';
        const data = reqData;
        return getData(url, data);
    }
    // 帮朋友投资 EOS
const friendInvest = (reqData) => {
        const url = '/account/friend_invest';
        const data = reqData;
        return postData(url, data);
    }
    // 显示投资收益
const incomeDetail = (reqData) => {
        const url = '/income/income_detail';
        const data = reqData;
        return getData(url, data);
    }
    // 点击收取收益
const incomeGain = (reqData) => {
        const url = '/income/income_gain';
        const data = reqData;
        return postData(url, data);
    }
    // 查看推荐收益
const incomeReferrer = (reqData) => {
        const url = '/income/referrer';
        const data = reqData;
        return getData(url, data);
    }
    // 查看三三收益
const incomeMode = (reqData) => {
        const url = '/income/mode';
        const data = reqData;
        return getData(url, data);
    }
    // 查看一行公排收益
const incomeSort = (reqData) => {
        const url = '/income/sort';
        const data = reqData;
        return getData(url, data);
    }
    // 查看我的分红收益
const incomeDividend = (reqData) => {
        const url = '/income/dividend';
        const data = reqData;
        return getData(url, data);
    }
    // 查看我的保障收益
const incomeSafe = (reqData) => {
        const url = '/income/safe';
        const data = reqData;
        return getData(url, data);
    }
    // 查看其他收益
const incomeOther = (reqData) => {
        const url = '/income/other';
        const data = reqData;
        return getData(url, data);
    }
    // 我的团队 直接推荐
const teamInvite = (reqData) => {
        const url = '/team/invite';
        const data = reqData;
        return getData(url, data);
    }
    // 我的团队 三三排位
const teamMode = (reqData) => {
        const url = '/team/mode';
        const data = reqData;
        return getData(url, data);
    }
    // 我的团队 一条公排
const teamSort = (reqData) => {
        const url = '/team/sort';
        const data = reqData;
        return getData(url, data);
    }
    // bingo 奖金池
const poolBingo = (reqData) => {
        const url = '/pools/bingo';
        const data = reqData;
        return getData(url, data);
    }
    // 股东分红池
const poolShareholder = (reqData) => {
        const url = '/pools/shareholders';
        const data = reqData;
        return getData(url, data);
    }
    // 五倍收益保障池
const poolSafe = (reqData) => {
        const url = '/pools/safe';
        const data = reqData;
        return getData(url, data);
    }
    // 直接推荐 pk 池
const poolPk = (reqData) => {
        const url = '/pools/pk';
        const data = reqData;
        return getData(url, data);
    }
    // 提现信息
const balanceInfo = (reqData) => {
        const url = '/balance/balance_info';
        const data = reqData;
        return getData(url, data);
    }
    // 提现
const withdraw = (reqData) => {
        const url = '/balance/withdraw';
        const data = reqData;
        return postData(url, data);
    }
    // 提现历史
const withdrawHistory = (reqData) => {
    const url = '/balance/withdraw_history';
    const data = reqData;
    return getData(url, data);
}



// 获取账号类型
const getType= (reqData) => {
    const url = '/account/info';
    const data = reqData;
    return getData(url, data);
}
// 获取全球合伙人私募信息
const partnerPlacement= (reqData) => {
    const url = '/trade/raise_buy';
    const data = reqData;
    return getData(url, data);
}
// 私募交易列表
const PlacementTransactionList= (reqData) => {
    const url = '/trade/raise_list';
    const data = reqData;
    return getData(url, data);
}
// 正常和合伙人历史买入列表数据
const getSellHistoryList= (reqData) => {
    const url = '/trade/buy_assets_history';
    const data = reqData;
    return getData(url, data);
}
// 全球合伙人私募
const globalPartnerPlacement = (reqData) => {
    const url = '/trade/global_raise_buy';
    const data = reqData;
    return postData(url, data);
}
// 买入资产
const buyAsset = (reqData) => {
    const url = '/trade/user_buy_assets';
    const data = reqData;
    return postData(url, data);
}
// 卖出资产
const sellAsset = (reqData) => {
    const url = '/trade/user_sell_assets';
    const data = reqData;
    return postData(url, data);
}
// 获取普通买入交易信息
const getGeneralBuy = (reqData) => {
    const url = '/trade/buy_assets';
    const data = reqData;
    return getData(url, data);
}
// 买入交易列表
const normalTransactionList = (reqData) => {
    const url = '/trade/buy_list';
    const data = reqData;
    return getData(url, data);
}
// 获取普通卖出交易信息
const getGeneralSell = (reqData) => {
    const url = '/trade/sell_assets';
    const data = reqData;
    return getData(url, data);
}
// 卖出交易列表
const sellTransactionList = (reqData) => {
    const url = '/trade/sell_list';
    const data = reqData;
    return getData(url, data);
}
// 资产包卖出记录
const getSellList = (reqData) => {
    const url = '/trade/sell_history';
    const data = reqData;
    return getData(url, data);
}




//有效资产包矿机
const effectiveAssets= (reqData) => {
    const url = '/mine_pool/mining';
    const data = reqData;
    return getData(url, data);
}
// 已结束资产包矿机
const overAssets= (reqData) => {
    const url = '/mine_pool/mined';
    const data = reqData;
    return getData(url, data);
}
//资产包挖矿详情
const assetMiningDetails= (reqData) => {
    const url = '/mine_pool/detail';
    const data = reqData;
    return getData(url, data);
}
//资产包挖矿收益收取
const assetMiningCharge= (reqData) => {
    const url = '/mine_pool/collect';
    const data = reqData;
    return postData(url, data);
}
//线性释放池
const LinearReleasePool= (reqData) => {
    const url = '/release_pool/account';
    const data = reqData;
    return getData(url, data);
}
//线性释放池明细
const LinearReleaseDetail= (reqData) => {
    const url = '/release_pool/detail';
    const data = reqData;
    return getData(url, data);
}
//可售余额
const SaleableBalance= (reqData) => {
    const url = '/saleable_balance';
    const data = reqData;
    return getData(url, data);
}
//可售额度
const SaleableAmount= (reqData) => {
    const url = '/saleable_amount';
    const data = reqData;
    return getData(url, data);
}
//签到奖励明细
const CheckIn= (reqData) => {
    const url = '/check_in/detail';
    const data = reqData;
    return getData(url, data);
}
//交易价格
const getTradePrice= (reqData) => {
    const url = '/trade/price';
    const data = reqData;
    return getData(url, data);
}
//会员等级
const getLevel= (reqData) => {
    const url = '/account/level';
    const data = reqData;
    return getData(url, data);
}

//TBG销毁数量
const getDestory= (reqData) => {
    const url = '/tbg/destroy';
    const data = reqData;
    return getData(url, data);
}
const getBalanceAlloc = (reqData) => {
    const url = '/balance/balance_alloc';
    const data = reqData;
    return getData(url, data);
}
//系统公告
const getSystemNtf= (reqData) => {
    const url = '/tbg/system_notification';
    const data = reqData;
    return getData(url, data);
}


export default{
    getConfig,
    setInvitation,
    getInvitation,
    getCodeByAccount,
    bindReferrer,
    isBind,
    isActive,
    level,
    subAccount,
    incomeDetail,
    incomeGain,
    teamInvite,
    teamMode,
    teamSort,
    incomeReferrer,
    incomeMode,
    incomeSort,
    incomeOther,
    incomeDividend,
    incomeSafe,
    poolBingo,
    poolShareholder,
    poolSafe,
    poolPk,
    investmentIndex,
    balanceInfo,
    withdraw,
    friendInvest,
    withdrawHistory,

    getType,
    partnerPlacement,
    PlacementTransactionList,
    getSellHistoryList,
    getGeneralBuy,
    normalTransactionList,
    getGeneralSell,
    sellTransactionList,
    getSellList,
    globalPartnerPlacement,
    buyAsset,
    sellAsset,
    getLevel,

    effectiveAssets,
    overAssets,
    assetMiningDetails,
    assetMiningCharge,
    LinearReleasePool,
    LinearReleaseDetail,
    SaleableBalance,
    SaleableAmount,
    CheckIn,
    getTradePrice,
    getDestory,
    getBalanceAlloc,
    getSystemNtf
}