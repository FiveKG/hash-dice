<template>
    <vpage >
     <slot>
       <transition name="gopage"><go v-if="goshow"></go></transition>
       <div style="background-color: rgb(40,40,40);height:100%;width:100%;">
        <div class="head" style="background: rgb(27,27,27);">
          <div class="float_left box"><img  class="ion_tbg" src="@/assets/invitation2/u3.png"></div>
          <p class="float_left orange" style="font-size: .5rem;margin: 0.45rem 0 .45rem 0;">夺宝</p>
          <div class="float_right" style="    width: 2.5rem;height: .8rem;border: 1px solid rgb(100, 100, 100);margin: 0.36rem 0.6rem 0.25rem 0px;border-radius: 30px;">
            <div class="display_ib" style="width: 49.5%;height: 100%;vertical-align: top;"><img @click="actionSheetVisible = true" style="width: 50%;height: 65%;margin: 11% 0px 0px 25%;" src="@/assets/img/assembly_ic_option@2x.png"></div>
            <div class="display_ib" style="width: 1%;height: 70%;background: rgb(100,100,100);vertical-align: top;margin-top: 5%;"></div>
            <div class="display_ib" style="width: 49.5%;height: 100%;vertical-align: top;"><img @click="back" src="@/assets/img/assembly_close_ic@2x.png" style="width: 55%;height: 80%;margin: 6% 0 0 21%;"></div>
          </div>
        </div>
        <!-- 区块滚动 -->
        <div class="recording"   >
            <transition-group name="scroll" mode="out-in">
              <div style="display:inline-block" class="row list-complete-item" v-for="item in items" :key='item.treasureKey'>
                  <div class="display_ib" style="width: 23%;height: 100%;"><p class=" font_four p_A" style="line-height: .64rem;text-align: center; ">{{item.block_num}}</p> </div>
                  <div class="display_ib" style="width: 54%;height: 100%;"><p class=" font_four p_A" style="line-height: .64rem;text-align: center; ">{{item.id}}</p></div>
                  <div class="display_ib" style="width: 23%;height: 100%;"><p class=" font_four p_A" style="line-height: .64rem;text-align: center; ">{{item.timestamp}}</p></div>
              </div>
            </transition-group> 
        </div>
        <div style="height: 1.4rem;">
          <div style="width:100%;height:.15rem;background: rgb(27, 27, 27);"></div>  
          <div style="width:100%;height:1.1rem;">
            <div class="display_ib" style="width:33.3%;height:1.1rem;"><p @click="selectTwenty(1)" :class="{orange:twenty==1}" class=" font_five" style="line-height:1.1rem;text-align: center;">{{GameData[0].game_name.substring(3)}}</p></div>
            <div class="display_ib" style="width:33.3%;height:1.1rem;"><p @click="selectTwenty(2)" :class="{orange:twenty==2}" class=" font_five" style="line-height:1.1rem;text-align: center;">{{GameData[1].game_name.substring(3)}}</p></div>
            <div class="display_ib" style="width:33.3%;height:1.1rem;"><p @click="selectTwenty(3)" :class="{orange:twenty==3}" class=" font_five" style="line-height:1.1rem;text-align: center;">{{GameData[2].game_name.substring(3)}}</p></div>
          </div>
          <div style="width:100%;height:.15rem;background: rgb(27, 27, 27);"></div>
        </div>
        <div style="width: 100%;">
        <div style="width: 80%;height: 3.4rem;border: 1px solid rgb(100,100,100);margin: 1rem auto .5rem auto;border-radius: 7px;position: relative;box-shadow: 5px 5px 5px rgba(94, 94, 94, 0.349019607843137);">
          <div style=" position: absolute;width: 50%;height: 1rem;background-color: rgb(40,40,40);right: 25%;top: -15%;">
            <p class="" style=" line-height: 1rem;text-align: center;font-size: .6rem;font-weight: 700;">夺宝 {{GameData[twenty-1].game_name.substring(3)}}</p>
          </div>
            <p class="Centered font_four p_A" style="margin: 25px auto 8px auto;"># {{TreasureBettin.periods}} 期</p>
            <div class="schedule_white"><div class="schedule_orange" :style="{ width: (TreasureBettin.bet_key/TreasureBettin.total_key)*100 + '%' }"></div></div>
            <div style="width:100%;margin-top:.3rem;">
              <div class="display_ib" style="width:33.3%;height:1.1rem;"><p class=" font_four" style="text-align: center;">{{TreasureBettin.bet_key}} Key</p><p class=" font_four" style="text-align: center;">已投</p></div>
              <div class="display_ib" style="width:33.3%;height:1.1rem;"><p class=" font_four" style="text-align: center;">{{TreasureBettin.total_key}} Key</p><p class=" font_four" style="text-align: center;">总需</p></div>
              <div class="display_ib" style="width:33.3%;height:1.1rem;"><p class=" font_four" style="text-align: center;">{{TreasureBettin.last_key}} Key</p><p class=" font_four" style="text-align: center;">剩余</p></div>
            </div>
        </div>
        <div style="width: 80%;height: 1rem;margin: 0 auto;border-radius: 5px;background: rgb(54,54,54);">
          <div class="display_ib vertical_top" style="width:1rem;height:1rem;"><img style="width:50%;height:50%;margin: 25% 25%;" src="@/assets/invitation2/u7.png"></div>
          <div class="display_ib vertical_top" style="width:1rem;height:1rem;background:rgb(67,67,67);"><p @click="reduceKey" class=" font_five" style="line-height:1rem;text-align: center;">-</p></div>
          <div class="display_ib vertical_top" style="width:1.8rem;height:1rem;"><p class=" font_five orange" style="line-height:1rem;text-align: center;">{{betKey}}</p></div>
          <div class="display_ib vertical_top" style="width:1rem;height:1rem;background:rgb(67,67,67);"><p @click="increaseKey" class=" font_five orange" style="line-height:1rem;text-align: center;">+</p></div>
          <div class="display_ib vertical_top" style="width:3rem;height:1rem;"><p class=" font_five" style="line-height:1rem;text-align: center;color: #E4E4E4;">@ {{TreasureBettin.quantity}} UE</p></div>
        </div>
        <p class="Centered font_four p_A" style="margin:8px auto;">1 key = {{TreasureBettin.quantity}} UE</p>
        <div style="width: 80%;height: 1.4rem;border: 1px solid rgba(255, 153, 51, 1);margin:0 auto;border-radius: 7px;"><p @click="betting" class="Centered orange font_five" style="line-height: 1.4rem;">投注</p></div>
        <p class="Centered p_A" style="font-size: .35rem;margin:15px auto;color: #949494;">若投注超出本期可投数量，超出部分将自动投注下期</p>
        <p></p>
        </div>
        <div style="width: 100%;background: rgb(27, 27, 27);height: 8rem;">
          <div style="width:100%;height:1.4rem;">
            <div class="display_ib" :class="{gray:!allMy}" @click="selectAllMy(true)" style="width:50%;height:1.4rem;line-height: .7rem;"><p  style="text-align: center;font-size: .45rem;">全部</p><p  style="text-align: center;font-size: .45rem;">{{GameData[twenty-1].game_name.substring(3)}}</p></div>
            <div class="display_ib" :class="{gray:allMy}" @click="selectAllMy(false)" style="width:50%;height:1.4rem;line-height: .7rem;"><p  style="text-align: center;font-size: .45rem;">我的</p><p  style="text-align: center;font-size: .45rem;">{{GameData[twenty-1].game_name.substring(3)}}</p></div>
          </div>
          <div v-if="allMy">
            <div style="" v-for="item in BettinAllData" :key='item.key'>
              <div style="width:100%;height:1.1rem;">
                <div class="display_ib vertical_top" style="width:33.3%;height:1.1rem;"><p  style="font-size: .45rem;line-height:1.1rem;text-align: center;"># {{item.periods}} 期</p></div>
                <div class="display_ib vertical_top" style="width:40%;height:1.1rem;"><p  style="font-size: .45rem;line-height:1.1rem;text-align: center;">幸运码 : {{item.reward_code}}</p></div>
                <div class="display_ib vertical_top" style="width:26.5%;height:1.1rem;" @click="jumpLottery(item.periods)"><img  style="width: .5rem;height: 0.5rem;margin: 0.35rem 0 0 50%;" src="@/assets/img/invitation_profitarrow.png"></div>
              </div>
            </div>
          </div>
          <div v-if="!allMy">
            <div style="" v-for="item in UserBetting" :key='item.key'>
              <div style="width:100%;height:1.1rem;">
                <div class="display_ib vertical_top" style="width:33.3%;height:1.1rem;"><p  style="font-size: .45rem;line-height:1.1rem;text-align: center;"># {{item.periods}} 期 <span class="orange" v-if="item.bonus_amount>0">- 中奖</span></p></div>
                <div class="display_ib vertical_top" style="width:40%;height:1.1rem;"><p  style="font-size: .45rem;line-height:1.1rem;text-align: center;">幸运码 : {{item.reward_code}}</p></div>
                <div class="display_ib vertical_top" style="width:26.5%;height:1.1rem;" @click="jumpBetting(item.periods)"><div class="display_ib vertical_top" style="width:60%;"><p style="color: rgb(188,188,188);font-size: 0.45rem;line-height: 1.1rem;text-align: center;">{{item.key_count}} key</p></div><img style="width: .5rem;height: 0.5rem;margin: .35rem 0 0 0;" src="@/assets/img/invitation_profitarrow.png"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 下拉框 -->
        <v-ons-action-sheet
          :visible.sync="actionSheetVisible"
          cancelable
        >
          <div class="selectwrap">
              <div class="wdclose" @click="actionSheetVisible = false">
              </div>
              <v-ons-row class="selectrow" >
                  <img class="people" src="@/assets/img/u9830.png" alt="">
                  <span>eoscheshieos</span>
                  <img class="pic" src="@/assets/img/u9827.png" alt="">
                  <img class="pic" src="@/assets/img/u9825.png" alt="">
              </v-ons-row>

              <v-ons-row class="selectrow" @click="jumpTreasureRule">
                  <img class="rule" src="@/assets/img/u9832.png" alt="">
                  <span>规则</span>
              </v-ons-row>
          </div>
        </v-ons-action-sheet> 

        <div v-if="betSuccess" class="success">
            <p style=" font-size: .5rem;color: #FFFFFF;margin-top: .2rem;">恭喜投注成功</p>
            <p style=" color: #FFFFFF;font-size: .5rem;">祝你好运常随</p>
        </div>
        <div v-if="betFailure" class="failure">
            <p style=" font-size: 0.5rem;color: rgb(51, 51, 51);margin-top: 0.4rem;">余额不足</p>
        </div>
         <!-- 键盘 -->
        <transition name="slide">
         <div class="keyboard"  v-if="keyboard">
          <div class="list_row">
            <div style="display:flex;justify-content: center;align-items: center;flex: 1;font-size:.6rem;"><span>请输入密码</span></div>
            <div style="display:flex;justify-content: center;align-items: center;flex: 1;font-size:.4rem;"><span> {{password}}</span></div>
            <div style="display:flex;justify-content: center;align-items: center;flex: 1;font-size:.6rem;"><span><span @click="handleConfirm">确认</span></span></div>
          </div>
          <div class="list_row">
            <div class="key" @click="enterAmount('1')">1</div>
            <div class="key" @click="enterAmount('2')">2</div>
            <div class="key" @click="enterAmount('3')">3</div>
          </div>
          <div class="list_row">
            <div class="key" @click="enterAmount('4')">4</div>
            <div class="key" @click="enterAmount('5')">5</div>
            <div class="key" @click="enterAmount('6')">6</div>
          </div>
          <div class="list_row">
            <div class="key" @click="enterAmount('7')">7</div>
            <div class="key" @click="enterAmount('8')">8</div>
            <div class="key" @click="enterAmount('9')">9</div>
          </div>
          <div class="list_row">
            <div @click="logKeyboard" class="key"  style="width:100%;">
              <img src="../../.././components/keyboard/icon-keyboard.svg" alt="">
            </div>
            <div class="key" @click="enterAmount('0')">0</div>
            <div class="key" @click="deleteAmout">
              <i class="iconfont icon-keyboard-delete del"></i>
            </div>
          </div>
         </div> 
        </transition>

       </div>
     </slot>
    </vpage>
    
</template>

<script>
import MyPage from '@/components/MyPage'
import { format, parse } from 'date-fns'
import {Decimal} from 'decimal.js'
import api from '@/pages/game/treasure/game'
import go from './TreasureGo'



//滚动区域
import ClientSocket from '@/socket/scrollClientSocket'
//转站
import MDialog from '@/components/MDialog'
import PasswordService from '@/services/PasswordService'
import CryptoAES from '@/util/CryptoAES'
import eos from '@/plugins/pog'
import serverApi from '@/servers/invitation'

export default {
  components: {
    vpage: MyPage,
     go:go
   },
  data() {
    return {
      goshow:true,   //进来开始页面的显示
      account_name:'',//账户ID
      treasureKey:1,  //滚动KEY
      twenty:1,      //模式选择  20*0.1为1  20*0.5为2  100*0.1为3
      allMy:true,   //区分我的 全部
      actionSheetVisible: false,   //下拉框
      betSuccess:false,        //成功显示
      betFailure:false,        //失败显示
      betKey:0,//投注 key 的的数量
      items:[    // 滚动
              // {timestamp:"15:23:02.0",block_num:33283278,
              //   id:'...'+"F7B195473D4F09BC8F1",treasureKey:1
              //   }
      ],   
      GameData:[],//获取游戏的种类和名称
      TreasureBettin:{},//获取游戏的种类和名称
      BettinAllData:[],//获取所有期数及开奖信息
      UserBetting:[   //获取当前用户投注的信息
        // {periods:1,reward_code:10000,key_count:1}
      ],
      socket:'',
      keyboard:false,  //下拉键盘
      //区块链转站
      reqParams: {
        account: '',
      },
      password: '',
    }
  },
  methods: {
       back() {
          this.$router.go(-1)
       },
       selectTwenty(index) {//切换模式
          this.twenty=index;
          api.getTreasureBettin({game_id:index}).then(res => {
            if (res.code === 1) {
                this.TreasureBettin=res.data;
              }
          })
          api.getAllData({game_id:index}).then(res => {
              if (res.code === 1) {
                  this.BettinAllData=res.data.detail;
                }
            })
          api.getUserBettingData({game_id:index,account_name:this.account_name}).then(res => {
            if (res.code === 1) {
                this.UserBetting=res.data.detail;
                }
            })
       },
       selectAllMy(index) {
         this.allMy=index;
       },
       jumpTreasureRule() {  //规则
         this.$router.push({
          name: 'TreasureRule',
        })
       },
       jumpLottery(data) {  //开奖详情
         this.$router.push({
          name: 'LotteryDetailsNoLottery',
          params: {
            game_id: this.twenty,
            periods: data,
          }
        })
       },
       jumpBetting(data) {  //投注详情
         this.$router.push({
          name: 'BettingDetails',
          params: {
            game_id: this.twenty,
            periods: data,
          }
        })
       },
       reduceKey(){   //减少key
        this.betKey>0?this.betKey-=1:this.betKey=0
       },
       increaseKey(){   //增加key
        this.betKey+=1
       },
       betting(){   //投注
        api.Betting({game_id:this.twenty,periods:this.TreasureBettin.periods,account_name:this.account_name,bet_key:this.betKey,bet_amount:this.betKey*this.TreasureBettin.quantity}).then(res => {
          console.log(res)
          if (res.code === 1) {
              this.betSuccess=true;
              setTimeout(() => {
                this.betSuccess=false;
                // this.logKeyboard();
              }, 2500);
            }else if(res.code === 1011){
              this.betSuccess=true;
              setTimeout(() => {
                this.betFailure=false;
                this.logKeyboard();
              }, 2500);
            }
        })
       },
        logKeyboard(){    //切换下拉键盘
          this.keyboard=!this.keyboard;
       },
       enterAmount(data){//  输入数字
        if(this.password.length<16){this.password+=data;}
       },
       deleteAmout(){//   删除数字
        this.password=this.password.substr(0,this.password.length-1);
       },
    //滚动区域
    initSocket() {
            ClientSocket.link().then(async connected => {
                // console.log('link',connected)
                if (connected) {
                    try {
                        this.socket=ClientSocket.getSocket();
                        let rewards = await ClientSocket.getReward({type:'less'})
                        if (rewards.type === 'reward_history') {
                            console.log(222,rewards)
                            let record = rewards.result
                            if (record) {
                                let list = []
                                for (let item of record) {
                                    if (item.open_code) {
                                        let second = format(parse(item.end_time), 'HH:mm') + ':00'
                                        list.push({
                                            session_id: item.session_id,
                                            award_num: item.open_code.replace(/,/g,' '),
                                            time: second
                                        })
                                    }
                                }
                                this.rewardRecord = list
                                this.sessionId = parseInt(list[0].session_id) + 1
                            }
                        }
                        const moreReward = await ClientSocket.getReward({type: 'more', page: this.page})
                        if (moreReward.type === 'reward_history') {
                            console.log(222,moreReward)
                            if (moreReward.result) {
                                for (let item of moreReward.result) {
                                    if (item.open_code) {
                                        let bigOrSmall,oddsOrEven
                                        let numbers = item.open_code.split(',')
                                        let lastNum = Number.parseInt(numbers[numbers.length - 1])
                                        if (lastNum > 5) {
                                            bigOrSmall = 'b'
                                        } else {
                                            bigOrSmall = 's'
                                        }
                                        if (lastNum % 2) {
                                            oddsOrEven = 'o'
                                        } else {
                                            oddsOrEven = 'e'
                                        }
                                        this.lotteryRecords.push({
                                            time: format(parse(item.end_time), 'MM/DD HH:mm'),
                                            phase: item.session_id,
                                            number: item.open_code.replace(/,/g,' '),
                                            bigOrSmall: bigOrSmall,
                                            oddsOrEven: oddsOrEven
                                        })
                                    }
                                }
                            }
                        }
                        // let betRecord = await ClientSocket.getBetRecord()
                        // if (betRecord.result) {
                        //     for (let item of betRecord.result) {
                        //         this.betRecord.unshift({
                        //             account_name: item.account_name,
                        //             quantity: item.quantity.split(' ')[0],
                        //             bet_id: item.session_id,
                        //             bet_time: format(parse(item.create_time), 'HH:mm:ss')
                        //         })
                        //     }
                        // }
                    } catch (error) {
                        console.log(error)
                    }
                }
            })
    },
    //区块链转站
      async verifyPassword() {        // 验证密码
        const seed = await PasswordService.encrypt(this.password);
        const wallets = this.$store.state.wallet.localFile.wallets;
        const current = wallets.find(ele => ele.accountNames[0] === this.reqParams.account);
        const privateKey = CryptoAES.decrypt(current.privateKey,seed);
        return privateKey
        // return '5KNoQXeFJp47dbtyifcCjJuhXjYmNvWPVcWYsHJJWZ8h7zAd78h';
      },
      async goPay(privateKey,quantity,memo ) {
        if (privateKey) {
          try {
            const config = await this.getConfig()
            const opts = { authorization:[`${this.reqParams.account}@active`], keyProvider: privateKey }
            // await eos.transfer(this.reqParams.account, config.wallet_receiver, `100.0000 UE`, `tbg_invest:${this.reqParams.account}`, opts)
            const adm = await eos.contract('uetokencoin')
            // account_name,price,trx_type,assets_package_id ==> fb,0.5,raise,4
            const trx = await adm.transfer(this.reqParams.account, config.trade_receiver, quantity.toFixed(4)+' UE', memo, opts)
            console.log(11221111,trx);
            return true
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
      async sellgoPay(privateKey,quantity,memo ) {
        if (privateKey) {
          try {
            const config = await this.getConfig()
            const opts = { authorization:[`${this.reqParams.account}@active`], keyProvider: privateKey }
            // await eos.transfer(this.reqParams.account, config.wallet_receiver, `100.0000 UE`, `tbg_invest:${this.reqParams.account}`, opts)
            const adm = await eos.contract('tbgtokencoin')
            // account_name,price,trx_type,assets_package_id ==> fb,0.5,raise,4
            const trx = await adm.transfer(this.reqParams.account, config.trade_receiver, quantity, memo, opts)
            console.log(11221111,trx);
            return true
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
      async getConfig() {
        try {
          const res = await serverApi.getConfig()
          if (res.code === 1) {
            console.log('getConfig',res)
            return res.data
          }
        } catch (error) {
          console.log(error)
        }
      },
      async handleConfirm() {
        const privateKey = await this.verifyPassword()
        if (privateKey) {
              let quantity=new Decimal(this.betKey).mul(this.TreasureBettin.quantity);
              let memo='treasure'+':'+this.account_name+':'+this.betKey+':'+quantity+':'+this.TreasureBettin.periods+':'+this.GameData[this.twenty-1].game_id
              this.goPay(privateKey,quantity,memo);
              this.logKeyboard();
        } 
      },
       
  },
  watch: {
        '$store.state.wallet.block': {
            handler(newVal, oldVal) {
                // console.log(12311111111111,this.$store.state.wallet.block);
                this.treasureKey+=1;
                this.items.unshift({timestamp:format(this.$store.state.wallet.block.timestamp, 'HH:mm:ss:S'),block_num:this.$store.state.wallet.block.block_num,
                id:'...'+this.$store.state.wallet.block.id.slice(45),treasureKey:this.treasureKey});
                this.items.splice(10);

            }
        },
    },
  created(){
    setTimeout(() => {
      this.goshow=false;
    }, 1500);
    this.account_name=this.$store.state.wallet.assets.account;
    this.reqParams.account = this.account_name;   //转站
    //滚动区域
    this.initSocket();
    //获取配置信息
    api.getConfig().then(res => {
        if (res.code === 1) {
          }
      })
    //获取游戏的种类和名称
    api.getGameData().then(res => {
        if (res.code === 1) {
            this.GameData=res.data;
          }
      })
    //获取夺宝期数信息
    api.getTreasureBettin({game_id:1}).then(res => {
        if (res.code === 1) {
            this.TreasureBettin=res.data;
          }
      })
    //获取所有期数及开奖信息
    api.getAllData({game_id:1}).then(res => {
        if (res.code === 1) {
            this.BettinAllData=res.data.detail;
            for(let i=0;i<this.BettinAllData.length;i++){
              if(this.BettinAllData[i].reward_code=='000000'){
                this.BettinAllData[i].reward_code='待开奖'
              }
            }
          }
      })
    //获取当前用户投注的信息
    api.getUserBettingData({game_id:1,account_name:this.account_name}).then(res => {
      if (res.code === 1) {
          this.UserBetting=res.data.detail;
          for(let i=0;i<this.UserBetting.length;i++){
              if(this.UserBetting[i].reward_code=='000000'){
                this.UserBetting[i].reward_code='待开奖'
              }
            }
          }
      })












  },
  destroyed(){
    this.socket.close();
  }
}
</script>

<style scoped>
.head{
  width: 100%;
  height:1.6rem;
  clear: both;
}
.box{
  background: rgba(255, 153, 51, 1);
  margin: 0 auto;
  width: .9rem;
  height:.9rem;
  margin:0.35rem 0.30rem .35rem 0.6rem;
  border-radius: 6px;
}
.ion_tbg{
  width: 80%;
  height:80%;
  padding: 10% 10%;
}
.schedule_white{
  width: 80%;
  height: 15px;
  border-radius: 20px;
  margin: 0 auto;
  background: rgb(54,54,54);
}
.schedule_orange{
  width: 80%;
  height: 100%;
  background:orange;
  border-radius: 20px;
}
/* 下拉框 */
.selectwrap{
  background-color: #fff;
  min-height: 200px;
  max-height: 100vh;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: scroll;
}
.wdclose{
  width:.6rem;
  height:.6rem;
  background:url("../../../assets/img/u102.png") no-repeat center center;
  background-size:1rem 1rem;
  position:absolute;
  right:.8rem;
  top:.65rem;
}
.selectrow{
  padding:.6rem;
  align-items:center;
  font-size:0.5rem;
  font-family: "Bahnschrift Regular", Bahnschrift;
  color:#FF9900;
  font-weight: 400;
}
.selectrow span{
  padding-right:1rem;
}
.pic{
  width: .7rem;
  height: .5rem;
  padding-right:.5rem;
}
.people{
  width:0.8rem;
  height:0.8rem;
  padding-right:.2rem;
}
.rule{
  width:0.8rem;
  height:0.8rem;
  padding-right:.2rem;
}

.success{
  position: absolute;
  background: rgb(225,6,6);
  width: 40%;
  height: 1.8rem;
  top: 62%;
  left: 30%;
  border-radius: 5px;
  text-align: center;
}
.failure{
  position: absolute;
  background: rgb(225,225,225);
  width: 40%;
  height: 1.5rem;
  top: 62%;
  left: 30%;
  border-radius: 5px;
  text-align: center;
}


/* div{
  background: #fff;
} */
.float_left{
  float: left;  
}
.float_right{
  float: right;
}
.font_b{
  font-family: 'Bahnschrift Regular', 'Bahnschrift';
}
.display_ib{
  display: inline-block;
}
.white{
  color: rgb(188,188,188);
}
.orange{
  color: rgba(255, 153, 51, 1);
}
.gray{
  background:rgb(67,67,67);
}
.font_four{
  font-size: .4rem;
}
.font_five{
  font-size: .5rem;
}
.Centered{
  text-align: center;
}
.vertical_top{
  vertical-align: top;
}
p{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
  color: rgb(188,188,188);
}   
.p_A{
  font-family: "Arial Normal", Arial;
}   
span{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
}   
   
/* 开始页面的显示 */
.gopage-enter-active, .gopage-leave-active {
  transition: all .8s;
}
.gopage-enter, .gopage-leave-to{
  transform: translateX(-100%);
}

/* 滚动样式    */
.recording{
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 4.48rem;
  margin: 0 0 1px 0;
}
.row{
  width: 100%;
  height: 0.64rem;
  position: relative;
}
.scroll-enter-active, .scroll-leave-active {
  transition: all .5s;
}
.scroll-enter, .scroll-leave-to{
  transform: translateY(-30px);
}
.scroll-move{
  transition:transform .5s;
}

/* 下拉键盘 */
.slide-enter-active, .slide-leave-active {
  transition: all .8s;
}
.slide-enter, .slide-leave-to{
  transform: translateY(100%);
}
.keyboard {
  height: 500px;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 10000;
  font-size: 50px;
  background-color: #fff;
}
.list_row {
  display: flex;
  height: 20%;
}
.key {
  flex: 1;
  border-right: 1PX solid #d6d6d6;
  border-top: 1PX solid #d6d6d6;
  display: flex;
  justify-content: center;
  align-items: center;
}
.key img {
  height: 60px;
}
.key:nth-child(3n) {
  border-right: none;
}
.del {
  font-size: 50px;
}



</style>