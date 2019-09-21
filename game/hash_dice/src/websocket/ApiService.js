// @ts-check
class ApiService {
  static async handler(request){
    if (!!request) {
      return await this[request.type](request.data);
    }
  }

  static async checkCanBet() {
    try {
      if (true) {
        return {type: 'can_bet', result: true}
      } else {
        return {type: 'can_bet', result: false}
      }
    } catch (error) {
      console.log('checkCanBet',error)
    }
  }

  static async getRewardRecord(data) {
    try {
      // console.log(data)
      if (data.type) {
        if (data.type === 'less') {
          return {type: 'reward_history', result: []}
        } else if (data.type === 'more'){
          return {type: 'reward_history', result: []}
        } else {

        }
      }
    } catch (error) {
      console.log('getRewardRecord',error)
    }
  }

  static async getBetRecord() {
    try {
      return {type: 'bet_history', result: []}
    } catch (error) {
      console.log('getBetRecord',error)
    }
  }

  static async getUserRecord(data) {
    try {
      return {type: 'user_rewards', result: [] }
    } catch (error) {
      console.log('getUserRecord',error)
    }
  }
}

module.exports = ApiService