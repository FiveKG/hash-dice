<template>
  <div class="layout">
    <div class="p_header">
      <div class="row_account ">
        <div class="account"> 
          <div @click="clickAccount">
            <span>{{account}}</span> 
            <img src="@/assets/img/invitation_arrow_d.png" />
          </div>
        </div>
        <div class="flex_center">
          <span>{{level === 1 ? '未激活': level === 2 ? '黄金会员':'钻石股东会员'}}</span>
          <img src="@/assets/img/invitation_arrow_r.png" />
        </div>
      </div>
      <div class="row_logo flex_center">
        <div v-if="showProfitTotal">
          <div class="profit_total">收益总计</div>
          <div class="profit_amount">{{profitTotal.front}} &nbsp; <span style="color:gray;">{{profitTotal.end}}</span></div>
          <div class="profit_token">EOS</div>
          <div class="profit_detail" @click="clickProfit">收益详情 <img src="@/assets/img/invitation_profitarrow.png" alt=""> </div>
        </div>
        <div class="profit_graphics" v-else>
          <div class="u130 flex_center" @click="clickGraphics('all')">
            <div class="u132 flex_center">
              <div class="u134 flex_center">
                <div class="graphice_total" v-if="profitTotal2.front" @click="clickGraphics('total')">
                  <div>{{profitTotal2.front}}</div>
                  <div>{{profitTotal2.end}}</div>
                </div>
                <div v-else>
                  <div>点击</div>
                  <div>收取</div>
                </div>
              </div>
            </div>
          </div>
          <transition name="profit_type">
            <div class="one_static" @click="clickGraphics('one')" v-if="profitDetail.oneStatic.length">
              <div>一条静态</div>
              <div class="u136 flex_center">
                <div class="graphics_amount">
                  <div>+ {{profitDetail.oneStatic[1]}} </div>
                  <div class="graphics_ffc671">{{profitDetail.oneStatic[2]}} </div>
                </div>
              </div>
            </div>
          </transition>
          <transition name="profit_type">
            <div class="one_static" @click="clickGraphics('holder')" v-if="profitDetail.holderBonus.length && !profitDetail.oneStatic.length">
              <div>股东池分红</div>
              <div class="u136 flex_center">
                <div class="graphics_amount">
                  <div>+ {{profitDetail.holderBonus[1]}} </div>
                  <div class="graphics_ffc671">{{profitDetail.holderBonus[2]}} </div>
                </div>
              </div>
            </div>
          </transition>
          <transition name="profit_type">
            <div class="three_static" @click="clickGraphics('three')" v-if="profitDetail.threeStatic.length">
              <div>三三静态</div>
              <div class="u136 flex_center">
                <div class="graphics_amount">
                  <div>+ {{profitDetail.threeStatic[1]}} </div>
                  <div class="graphics_ffc671">{{profitDetail.threeStatic[2]}} </div>
                </div>
              </div>
            </div>
          </transition>
          <transition name="profit_type">
            <div class="three_static" @click="clickGraphics('bingo')" v-if="profitDetail.bingoBonus.length && !profitDetail.threeStatic.length">
              <div>Bingo奖金</div>
              <div class="u136 flex_center">
                <div class="graphics_amount">
                  <div>+ {{profitDetail.bingoBonus[1]}} </div>
                  <div class="graphics_ffc671">{{profitDetail.bingoBonus[2]}} </div>
                </div>
              </div>
            </div>
          </transition>
          <transition name="profit_type">
            <div class="five_static" @click="clickGraphics('five')" v-if="profitDetail.fiveStatic.length">
              <div>五倍收益保障</div>
              <div class="u136 flex_center">
                <div class="graphics_amount">
                  <div>+ {{profitDetail.fiveStatic[1]}} </div>
                  <div class="graphics_ffc671">{{profitDetail.fiveStatic[2]}} </div>
                </div>
              </div>
            </div>
          </transition>
          <transition name="profit_type">
            <div class="five_static" @click="clickGraphics('pk')" v-if="profitDetail.pkBonus.length && !profitDetail.fiveStatic.length">
              <div>推荐PK奖金</div>
              <div class="u136 flex_center">
                <div class="graphics_amount">
                  <div>+ {{profitDetail.pkBonus[1]}} </div>
                  <div class="graphics_ffc671">{{profitDetail.pkBonus[2]}} </div>
                </div>
              </div>
            </div>
          </transition>
          <transition name="profit_type">
            <div class="game_invitation" @click="clickGraphics('game')" v-if="profitDetail.gameInvitation.length">
              <div>游戏推荐</div>
              <div class="u136 flex_center graphics_amount">
                  <div>+ {{profitDetail.gameInvitation[1]}} </div>
                  <div class="graphics_ffc671">{{profitDetail.gameInvitation[2]}} </div>
              </div>
            </div>
          </transition>
          <transition name="profit_type">
            <div class="straight_invitation" @click="clickGraphics('straight')" v-if="profitDetail.straightInvitation.length">
              <div>直接推荐</div>
              <div class="u136 flex_center graphics_amount">
                  <div>+ {{profitDetail.straightInvitation[1]}} </div>
                  <div class="graphics_ffc671">{{profitDetail.straightInvitation[2]}} </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <div class="p_content">
      <div class="row_card">
        <div class="item_card" @click="clickItem('invitation_page')">我的邀请专页</div>
        <div class="item_card" :style="{background: level !== 1 ? '#fff':'#ff8e05'}">
          <div v-if="level !== 1" @click="clickSubAccount">子账号数量 :   {{subAccountTotal}}</div>
          <div class="active_account" @click="clickActive" v-else>激活我的账号</div>
        </div>
        <div class="item_card" @click="clickFAQ">规则及常见问题</div>
      </div>
      <div class="row_card">
        <div class="item_card" @click="clickItem('team')">我的团队与排位</div>
        <div class="item_card" @click="clickItem('friend')">帮助我的伙伴投资</div>
      </div>
      <div class="row_card">
        <div class="item_card line_height" @click="clickItem('withdraw')">
          <div>可提现余额</div>
          <div class="item_amount">{{withdrawTotal.front}}  &nbsp; <span style="color:gray;">{{withdrawTotal.end}}</span></div>
          <div>EOS</div>
        </div>
        <div class="item_card line_height">
          <div>复投余额</div>
          <div class="item_amount">{{repeatTotal.front}}  &nbsp; <span style="color:gray;">{{repeatTotal.end}}</span></div>
          <div>EOS</div>
        </div>
      </div>
      <div class="row_card">
        <div class="item_card line_height">
          <div>全球彩彩码</div>
          <div class="item_amount">{{bingoTotal.front}}  &nbsp; <span style="color:gray;">{{bingoTotal.end}}</span></div>
          <div>EOS</div>
        </div>
        <div class="item_card line_height">
          <div>游戏筹码</div>
          <div class="item_amount">{{gameTotal.front}}  &nbsp; <span style="color:gray;">{{gameTotal.end}}</span></div>
          <div>EOS</div>
        </div>
      </div>
      <div class="bouns_pool" @click="clickItem('bingo')">
        <div class="bouns_item">
          <div>Bingo 奖金池</div>
          <div class="bouns_amount">{{bingoPool.countdownStr}}</div>
          <div>倒计时</div>
        </div>
        <div class="bouns_item">
          <div>最后1位投资者</div>
          <div class="bouns_amount">{{bingoPool.lastInvest}}</div>
          <div>EOS</div>
        </div>
        <div class="bouns_item">
          <div>最后2-30位投资者</div>
          <div class="bouns_amount noborder">{{bingoPool.otherInvest}}</div>
          <div>EOS</div>
        </div>
      </div>
      <div class="row_card">
        <div class="item_card line_height" @click="clickItem('holder')">
          <div>股东分红池</div>
          <div class="item_amount">{{shareholderBonus}}</div>
          <div>EOS</div>
        </div>
        <div class="item_card line_height" @click="clickItem('five')">
          <div>五倍收益保障池</div>
          <div class="item_amount">{{safeBonus}}</div>
          <div>EOS</div>
        </div>
        <div class="item_card line_height" @click="clickItem('pk')">
          <div>直接推荐PK池</div>
          <div class="item_amount noborder">{{pkBonus}}</div>
          <div>EOS</div>
        </div>
      </div>
    </div>
    <v-ons-action-sheet
      :visible.sync="actionSheetVisible"
      cancelable
      style="background: rgba(0,0,0,0.5);"
    >
      <div class="action_layout">
        <div class="btn_active" @click="showDialog = true">支付 30EOS 激活账号</div>
      </div>
    </v-ons-action-sheet>
    <v-ons-dialog
      modifier="width_pwd"
      cancelable
      style="background-color: rgba(0, 0, 0, .5);z-index: 10000;"
      :visible.sync="showDialog">
      <m-dialog v-model="password" v-on:confirm="handleConfirm" v-on:cancel="handleCancel"></m-dialog>
    </v-ons-dialog>
    <v-ons-modal :visible="loading" >
      <loading></loading>
    </v-ons-modal>
  </div>
</template>

<script>
import MDialog from '@/components/MDialog'
import PasswordService from '@/services/PasswordService'
import CryptoAES from '@/util/CryptoAES'
import eos from '@/plugins/eos'
import {Decimal} from 'decimal.js'
// import { isActive,investmentIndex,incomeDetail,incomeGain,getConfig } from '@/servers/invitation';
import api from '@/servers/invitation';

export default {
  components: {
    MDialog
  },
  props: ['account'],
  data() {
    return {
      password: '',
      actionSheetVisible: false,
      showDialog: false,
      loading: false,
      showProfitTotal: true,
      level: 1,
      subAccountTotal: 0,
      profitTotal: {
        front: '0.0000',
        end: '0000',
      },
      withdrawTotal: {
        front: '0.0000',
        end: '0000',
      },
      repeatTotal: {
        front: '0.0000',
        end: '0000',
      },
      bingoTotal: {
        front: '0.0000',
        end: '0000',
      },
      gameTotal: {
        front: '0.0000',
        end: '0000',
      },
      bingoPool: {
        countdown: 0,
        countdownStr: '00:00:00',
        lastInvest: '0.0000',
        otherInvest: '0.0000',
      },
      shareholderBonus: '0.0000',
      safeBonus: '0.0000',
      pkBonus: '0.0000',
      profitTotal2: {
        front: '',
        end: ''
      },
      profitDetail: {
        oneStatic: [],
        threeStatic: [],
        fiveStatic: [],
        gameInvitation: [],
        straightInvitation: [],
        holderBonus: [],
        bingoBonus: [],
        pkBonus: [],
      }
    }
  },
  created() {
    this.getActiveState()
  },
  methods: {
    // 验证密码
    async verifyPassword() {
      const seed = await PasswordService.encrypt(this.password)
      const wallets = this.$store.state.wallet.localFile.wallets
      const current = wallets.find(ele => ele.accountNames[0] === this.account)
      const privateKey = CryptoAES.decrypt(current.privateKey,seed)
      return privateKey
    },
    // 支付30EOS激活账号
    async goPay(privateKey) {
      if (privateKey) {
        this.showDialog = false
        try {
          const config = await this.getConfig()
          const opts = { authorization:[`${this.account}@active`], keyProvider: privateKey }
          await eos.transfer(this.account, config.wallet_receiver, `0.0001 EOS`, `tbg_invest:${this.account}`, opts)
          const getState = () => {
            return new Promise(resolve => {
              const func = () => {
                setTimeout(async () => {
                  await this.getActiveState()
                  if (this.level === 1) {
                    func()
                  } else {
                    resolve(true)
                  }
                }, 1000);
              }
              func()
            })
          }
          const state = await getState()
          return state
        } catch (error) {
          console.log(error)
          error = JSON.parse(error)
          if (error.error.code == 3050003) {
            this.$toast(this.$t('common.overdrawn_balance'))
          }
          if (error.error.code == 3080004) {
            this.$toast('CPU资源受限')
          }
          return false
        }
      } else {
        this.$toast(this.$t('common.wrong_pwd'))
      }
    },
    // dialog confirm
    async handleConfirm() {
      this.loading = true
      const privateKey = await this.verifyPassword()
      if (privateKey) {
        const res = await this.goPay(privateKey)
        if (res) this.$toast('激活成功')
        this.loading = false
        this.showDialog = false
        this.actionSheetVisible = false
      } else {
        this.$toast(this.$t('common.wrong_pwd'))
        this.loading = false
      }
    },
    // dialog cancel
    handleCancel() {
      this.showDialog = false
    },
    // 显示投资收益
    async getIncomeDetail() {
      try {
        const res = await api.incomeDetail({account_name: this.account})
        console.log('getIncomeDetail',res)
        if (res.code === 1 && res.data.length) {
          this.showProfitTotal = false
          const formatIncome = income => {
            const arr = []
            arr.push(income)
            arr.push(income.split('.')[0] + '.' + income.split('.')[1].substr(0,4))
            arr.push(income.split('.')[1].substr(4))
            return arr
          }
          for (const item of res.data) {
            switch (item.income_type) {
              case 'sort':
                this.profitDetail.oneStatic = formatIncome(item.income_detail)
                break;
              case 'mode':
                this.profitDetail.threeStatic = formatIncome(item.income_detail)
                break;
              case 'safe':
                this.profitDetail.fiveStatic = formatIncome(item.income_detail)
                break;
              case 'game':
                this.profitDetail.gameInvitation = formatIncome(item.income_detail)
                break;
              case 'invite':
                this.profitDetail.straightInvitation = formatIncome(item.income_detail)
                break;
              case 'holder':
                this.profitDetail.holderBonus = formatIncome(item.income_detail)
                break;
              case 'bingo':
                this.profitDetail.bingoBonus = formatIncome(item.income_detail)
                break;
              case 'pk':
                this.profitDetail.pkBonus = formatIncome(item.income_detail)
                break;
            
              default:
                break;
            }
          }
        } else {
          this.showProfitTotal = true
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 投资首页
    async getInvestmentIndex() {
      try {
        const res = await api.investmentIndex({account_name: this.account})
        console.log('getInvestmentIndex',res)
        if (res.code === 1) {
          this.subAccountTotal = res.data.sub_account_count
          const total_income = res.data.total_income.split('.')
          this.profitTotal.front = total_income[0] + '.' + total_income[1].substr(0,4)
          this.profitTotal.end = total_income[1].substr(4)
          const withdraw_enable = res.data.withdraw_enable.split('.')
          this.withdrawTotal.front = withdraw_enable[0] + '.' + withdraw_enable[1].substr(0,4)
          this.withdrawTotal.end = withdraw_enable[1].substr(4)
          const repeat_currency = res.data.repeat_currency.split('.')
          this.repeatTotal.front = repeat_currency[0] + '.' + repeat_currency[1].substr(0,4)
          this.repeatTotal.end = repeat_currency[1].substr(4)
          const bingo_currency = res.data.bingo_currency.split('.')
          this.bingoTotal.front = bingo_currency[0] + '.' + bingo_currency[1].substr(0,4)
          this.bingoTotal.end = bingo_currency[1].substr(4)
          const game_currency = res.data.game_currency.split('.')
          this.gameTotal.front = game_currency[0] + '.' + game_currency[1].substr(0,4)
          this.gameTotal.end = game_currency[1].substr(4)
          this.bingoPool.countdown = res.data.bingo_countdown
          this.bingoPool.lastInvest = res.data.last_invest
          this.bingoPool.otherInvest = res.data.other_invest
          this.bingoCountdown()
          this.shareholderBonus = res.data.shareholders_bonus
          this.safeBonus = res.data.safe_bonus
          this.pkBonus = res.data.pk_bonus
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 获取激活状态
    async getActiveState() {
      try {
        const res = await api.isActive({account_name: this.account})
        console.log('getActiveState',res)
        if (res.code === 1) {
          this.level = res.data.is_activated
            this.getInvestmentIndex()
            this.getIncomeDetail()
          // if (this.level !== 1) {
          // }
        }
      } catch (error) {
        console.log(error)
      }
    },
    bingoCountdown() {
      // 时间差(过期时间-当前时间)
      const bingo_countdown = Number(this.bingoPool.countdown) - Date.now()
      if (bingo_countdown) {
        const formatTime = time => {
          return time > 9 ? time : '0' + time
        }
        // 剩余小时(时间差/60*60*1000)
        const remainHour = formatTime(Math.floor(bingo_countdown/(60*60*1000)))
        // 剩余分钟(利用取余计算，时间差除以60*60*1000的余数就是减去小时后的毫秒数，再除以60*1000得到剩余分钟数)
        const remainMinute = formatTime(Math.floor(bingo_countdown%(60*60*1000)/(60*1000)))
        // 剩余秒数
        const remainSecond = formatTime(Math.floor(bingo_countdown%(60*60*1000)%(60*1000)/1000))
        this.bingoPool.countdownStr = remainHour + ':' + remainMinute + ':' + remainSecond
        setTimeout(() => {
          this.bingoCountdown()
        }, 500);
      } else {
        this.getInvestmentIndex()
      }
    },
    async getIncomeGain(type) {
      try {
        const res = await api.incomeGain({
          account_name: this.account,
          income_type: type
        })
        console.log('getIncomeGain',res)
        if (res.code === 1) {
          const arr = res.data.total_income.split('.')
          return {
            front: arr[0] + '.' + arr[1].substr(0,4),
            end: arr[1].substr(4)
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getConfig() {
      try {
        const res = await api.getConfig()
        if (res.code === 1) {
          console.log('getConfig',res)
          return res.data
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 点击收益
    async clickGraphics(type) {
      console.log('clickGraphics')
      this.loading = true
      let profitDetail = this.profitDetail
      switch (type) {
        case 'all':
          this.profitTotal2 = await this.getIncomeGain('all')
          profitDetail.oneStatic = []
          profitDetail.threeStatic = []
          profitDetail.fiveStatic = []
          profitDetail.gameInvitation = []
          profitDetail.straightInvitation = []
          profitDetail.holderBonus = []
          profitDetail.bingoBonus = []
          profitDetail.pkBonus = []
          break;
        case 'one':
          this.profitTotal2 = await this.getIncomeGain('sort')
          profitDetail.oneStatic = []
          break;
        case 'three':
          this.profitTotal2 = await this.getIncomeGain('mode')
          profitDetail.threeStatic = []
          break;
        case 'five':
          this.profitTotal2 = await this.getIncomeGain('safe')
          profitDetail.fiveStatic = []
          break;
        case 'game':
          this.profitTotal2 = await this.getIncomeGain('game')
          profitDetail.gameInvitation = []
          break;
        case 'straight':
          this.profitTotal2 = await this.getIncomeGain('invite')
          profitDetail.straightInvitation = []
          break;
        case 'holder':
          this.profitTotal2 = await this.getIncomeGain('holder')
          profitDetail.holderBonus = []
          break;
        case 'bingo':
          this.profitTotal2 = await this.getIncomeGain('bingo')
          profitDetail.bingoBonus = []
          break;
        case 'pk':
          this.profitTotal2 = await this.getIncomeGain('pk')
          profitDetail.pkBonus = []
          break;
        case 'total':
          if (!profitDetail.oneStatic.length && !profitDetail.threeStatic.length && !profitDetail.fiveStatic.length && !profitDetail.gameInvitation.length && !profitDetail.straightInvitation.length && !profitDetail.holderBonus.length && !profitDetail.bingoBonus.length && !profitDetail.pkBonus.length) {
            this.showProfitTotal = true
            this.getInvestmentIndex()
          }
          break;
      
        default:
          break;
      }
      this.loading = false
    },
    // 点击卡片
    clickItem(type) {
      switch (type) {
        case 'invitation_page':
          this.$router.push({name: 'MyInvitationPage'})
          break;
        case 'team':
          this.$router.push({
            name: 'MyTeam',
            query: {
              account: this.account
            }
          })
          break;
        case 'friend':
          this.$router.push({
            name: 'HelpFriend',
            query: {
              account: this.account
            }
          })
          break;
        case 'withdraw':
          this.$router.push({
            name: 'Withdraw',
            query: {
              account: this.account
            }
          })
          break;
        case 'bingo':
          this.$router.push({
            name: 'BingoPool',
            query: {
              account: this.account
            }
          })
          break;
        case 'holder':
          this.$router.push({
            name: 'ShareholderPool',
            query: {
              account: this.account
            }
          })
          break;
        case 'five':
          this.$router.push({
            name: 'FivePool',
            query: {
              account: this.account
            }
          })
          break;
        case 'pk':
          this.$router.push({
            name: 'PkPool',
            query: {
              account: this.account
            }
          })
          break;
      
        default:
          break;
      }
    },
    // 点击收益详情
    clickProfit() {
      if (this.level !== 1) {
        this.$router.push({
          name: 'Profit',
          query: {
            account: this.account
          }
        })
      }
    },
    // 点击账号名称
    clickAccount() {
      this.$emit('showWallets', true)
    },
    // 点击子账号
    clickSubAccount() {
      this.$router.push({
        name: 'SubAccount',
        query: {
          account: this.account
        }
      })
    },
    // 点击规则
    clickFAQ() {
      this.$router.push({
        name: 'TBGFAQ'
      })
    },
    // 点击激活账号
    clickActive() {
      this.actionSheetVisible = true
    }
  },
  watch: {
    showDialog(newVal, oldVal) {
      if (!newVal) this.password = ''
    },
  },
}
</script>

<style scoped>
.profit_type-enter-active, .profit_type-leave-active {
  transition: opacity .5s;
}
.profit_type-enter, .profit_type-leave-to {
  opacity: 0;
}
.flex_center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  padding-bottom: 120px;
  box-sizing: border-box;
}
.p_header {
  height: 45vh;
  background-image: url('~@/assets/img/invitation.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
}
.row_account {
  display: flex;
  align-items: center;
  color: #fff;
  padding: 0 30px;
  margin-top: 30px;
  font-size: 34px;
  font-weight: 800;
}
.row_account img {
  height: 40px;
  margin-left: 10px;
}
.account {
  flex: 1;
  display: flex;
  align-items: center;
}
.row_logo {
  flex: 1;
  background-color: rgba(255, 255, 255, 0.8);
  margin: 20px;
  border-radius: 15px;
  position: relative;
  text-align: center;
  line-height: 1.6;
}
.profit_total {
  font-size: 32px;
  font-weight: 450;
}
.profit_amount {
  font-size: 50px;
  font-weight: 500;
}
.profit_token {
  font-size: 33px;
}
.profit_detail {
  font-size: 28px;
  font-weight: 450;
  color: gray;
  display: flex;
  align-items: center;
  justify-content: center;
}
.profit_detail img {
  height: 38px;
}
.profit_graphics {
  color: #ff8e05;
  font-size: 27px;
  font-weight: 450;
  line-height: 1;
}
.graphice_total {
  font-size: 28px;
}
.graphics_amount {
  font-size: 30px;
  line-height: 1.2;
}
.graphics_ffc671 {
  color:#FFC671;
}
.one_static {
  position: absolute;
  top: 15px;
  left: 25px;
}
.three_static {
  position: absolute;
  top: 120px;
  left: 0;
}
.five_static {
  position: absolute;
  bottom: 0;
  left: 40px;
}
.game_invitation {
  position: absolute;
  top: 50px;
  right: 0;
}
.straight_invitation {
  position: absolute;
  bottom: 35px;
  right: 20px;
}
.get_all {
  position: absolute;
  bottom: 10px;
  width: 240px;
  font-size: 28px;
  color: rgb(70, 70, 70);
  text-align: center;
}
.u130 {
  width: 240px;
  height: 240px;
  background: url('~@/assets/img/u130.png') center/contain;
  color: #ff8e05;
  font-size: 36px;
  font-weight: 450;
  line-height: 1.3;
}
.u132 {
  width: 210px;
  height: 210px;
  background: url('~@/assets/img/u132.png') center/contain;
}
.u134 {
  width: 180px;
  height: 180px;
  background: url('~@/assets/img/u134.png') center/contain;
}
.u136 {
  width: 250px;
  height: 90px;
  background: url('~@/assets/img/u136.png') center/contain no-repeat;
  margin-top: -8px;
}
.p_content {
  padding-bottom: 15px;
  overflow: scroll;
}
.row_card {
  display: flex;
  padding-right: 15px;
}
.item_card {
  flex: 1;
  background-color: #fff;
  margin-top: 15px;
  margin-left: 15px;
  padding: 30px 0;
  border-radius: 10px;
  box-shadow: 0 0 15px #d6d6d6;
  font-size: 29px;
  font-weight: 450;
  text-align: center;
}
.active_account {
  color: #fff;
}
.line_height {
  line-height: 1.5;
  padding: 15px 0;
}
.item_amount {
  font-size: 36px;
  font-weight: 450;
}
.bouns_pool {
  display: flex;
  background-color: #fff;
  margin: 15px 15px 0 15px;
  padding: 30px 0;
  border-radius: 10px;
  box-shadow: 0 0 15px #d6d6d6;
  font-size: 28px;
}
.bouns_item {
  flex: 1;
  text-align: center;
  line-height: 1.6;
}
.bouns_amount {
  color: #ff8e05;
  font-size: 32px;
  font-weight: 450;
  border-right: 1PX solid #eeeeee;
}
.noborder {
  border: none;
}
.action_layout {
  background-color: #fff;
  padding: 35px 50px;
}
.btn_active {
  background-color: #ff8e05;
  color: #fff;
  text-align: center;
  padding: 30px;
  border-radius: 10px;
  font-size: 36px;
  font-weight: bold;
}
</style>
