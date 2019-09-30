<template>
  <ons-page>
    <div class="wrap">
      <!-- 顶部(标题栏)(新版) -->
      <div class="pub-header">
        <div class="logo"><img src="@/assets/img/avatar.aa6fb79c.jpg" alt="" @click="$router.go(-1);"></div>
        <div class="title">{{$store.state.wallet.account}}</div>
        <div class="action">
          <div class="more" @click="actionSheetVisible = false"><img src="@/assets/img/assembly_ic_option@2x.png" alt=""></div>
          <div @click="$router.go(-3);" class="exit"><img src="@/assets/img/assembly_close_ic@2x.png" alt=""></div>
        </div>
      </div>

      <!-- (规则,我的投注,开奖记录)入口(新版) -->
      <div class="action-enter">
        <div class="action-item" @click="$router.push('GlovalLottoRule');">
          <div class="logo"><img src="@/assets/qqc/home_ic_rule.png" alt=""></div>
          <div class="text">规则</div>
        </div>
        <div class="action-item" @click="$router.push('MyBetRecordList');">
          <div class="logo"><img src="@/assets/qqc/home_ic_my.png" alt=""></div>
          <div class="text">我的投注</div>
        </div>
        <div class="action-item" @click="$router.push('OpenRecordList');">
          <div class="logo"><img src="@/assets/qqc/home_ic_record.png" alt=""></div>
          <div class="text">开奖记录</div>
        </div>
      </div>

      <!-- 全球彩(最新期数信息)(新版) -->
      <div class="current-bet-info">
        <div class="container">
          <!-- 期数 -->
          <div class="current-periods">第 {{CurrentGameInfo.periods}} 期</div>
          <!-- 奖池数量 -->
          <div class="bet-pool-title">本期累计奖池</div>
          <div class="bet-pool-total">{{CurrentGameInfo.prize_pool}} UE</div>
        </div>
      </div>

      <!-- 开奖倒计时(新版) -->
      <div class="bet-open-cut-time">
        <div class="container">
          <div class="title">开奖倒计时:</div>
          <div class="time">{{tiemer}}</div>
        </div>
      </div>

      <!-- 实时区块信息(新版) -->
      <div class="current-recording">
        <div class="container">
          <div class="recording">
            <!-- 实时区块记录 -->
            <div class="current-block-record" id="current-block-record">
              <div class="item" v-for="(item,index) in $store.state.wallet.block" :key="index">
                <div class="num">{{item.block_num}}</div>
                <div class="code">{{item.id}}</div>
                <div class="time">{{item.timestamp}}</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- 投注按钮(新版) -->
      <div class="bet-button">
        <div class="item" @click="randBetDialog = true">随机投注</div>
        <div class="item" @click="selfBetDialog = true">选号投注</div>
      </div>

      <!-- 随机投注弹窗(新版) -->
      <transition>
        <div class="rand-bet-dialog" v-if="randBetDialog">
          <div class="container">
            <!-- 关闭按钮 -->
            <div class="closeBtn"><img src="@/assets/qqc/bet_ic_close.png" alt="" style="float:right;" @click="randBetDialog = false"></div>
            <!-- 随机号码 -->
            <div class="rand-num" style="text-align: center;line-height: 1.2rem;font-size: 0.6rem;color:#A9A9A9;">0 1 2 3 4 5 6 7 8 9</div>
            <!-- 提示信息 -->
            <div class="tips">系统随机派号,无法修改</div>
            <!-- 投注数量 -->
            <div class="bet-count">
              <div class="action" @click="btnLess()">-</div>
              <div class="count">{{inputNumber}}</div>
              <div class="action" @click="btnAdd()">+</div>
            </div>
            <!-- 提示信息 -->
            <div class="tips">1 key = 0.1 UE</div>
            <!-- 余额不足时 , 输入钱包密码 -->
            <div class="bet-count" style="margin-top:0.3rem;border-radius: 0.3rem;" v-if="showWalletPwdInput">
              <input type="password" class="count" style="width:100%;border-radius: 0.3rem;padding: 0;border: none;" v-model="walletPwd">
            </div>
            <!-- 提示信息 -->
            <div class="tips" v-if="showWalletPwdInput">余额不足,请输入钱包密码</div>
            <!-- 确认投注 -->
            <div class="rand-bet" @click="randomBetting()">投注</div>
          </div>
        </div>
      </transition>

      <!-- 手动投注弹窗(新版) -->
      <transition>
        <div class="rand-bet-dialog" v-if="selfBetDialog">
          <div class="container">
            <!-- 关闭按钮 -->
            <div class="closeBtn"><img src="@/assets/qqc/bet_ic_close.png" alt="" style="float:right;" @click="selfBetDialog = false"></div>
            <!-- 随机号码 -->
            <div class="rand-num" style="display:flex;"><input type="number" v-model="betNumber" oninput="if(value.length > 9)value = value.slice(0, 9)"></div>
            <!-- 提示信息 -->
            <div class="tips">请输入9位数的投注号码</div>
            <!-- 投注数量 -->
            <div class="bet-count">
              <div class="action" @click="btnLess()">-</div>
              <div class="count">{{inputNumber}}</div>
              <div class="action" @click="btnAdd()">+</div>
            </div>
            <!-- 提示信息 -->
            <div class="tips">1 key = 0.1 UE</div>
            <!-- 余额不足时 , 输入钱包密码 -->
            <div class="bet-count" style="margin-top:0.3rem;border-radius: 0.3rem;" v-if="showWalletPwdInput">
              <input type="password" class="count" style="width:100%;border-radius: 0.3rem;padding: 0;border: none;" v-model="walletPwd">
            </div>
            <!-- 提示信息 -->
            <div class="tips" v-if="showWalletPwdInput">余额不足,请输入钱包密码</div>
            <!-- 确认投注 -->
            <div class="rand-bet" @click="postBetting()">投注</div>
          </div>
        </div>
      </transition>

      <!-- 投注成功弹窗(新版) -->
      <transition>
        <div class="bet-success-dialog" v-if="betSuccessDialog">
          <div class="container">
            <div class="tips">恭喜您, 投注成功!</div>
            <div class="continue" @click="continueBet()">继续投注</div>
            <div class="bet-detail">查看投注详情</div>
            <div class="delete"><img src="@/assets/qqc/success_ic_close.png" alt="" @click="closeSuccessDialog()"></div>
          </div>
        </div>
      </transition>
      
      <!-- 底部上拉框 -->
      <v-ons-action-sheet :visible.sync="actionSheetVisible" cancelable>
        <div class="selectwrap">
            <div class="wdclose" @click="actionSheetVisible = false">
            </div>
            <v-ons-row class="selectrow" >
                <img class="people" src="@/assets/img/u9830.png" alt="">
                <span>eoscheshieos</span>
                <img class="pic" src="@/assets/img/u9827.png" alt="">
                <img class="pic" src="@/assets/img/u9825.png" alt="">
            </v-ons-row>
            <v-ons-row class="selectrow">
                <img class="rule" src="@/assets/img/u9832.png" alt="">
                <span>规则</span>
            </v-ons-row>
        </div>
      </v-ons-action-sheet> 

    </div>
  </ons-page>
</template>

<script>

import ClientSocket from '@/socket/scrollClientSocket'
import api from '@/servers/game'
import { format, parse } from 'date-fns'
import {Decimal} from 'decimal.js';
import Eos from 'eosjs';
import PasswordService from '@/util/PasswordService';
import CryptoAES from '@/util/CryptoAES'
import { async } from 'q';

export default {
   name: '',
   data() {
    return {
      actionSheetVisible: false, //底部上拉框
      treasureKey:1, //滚动KEY
      tiemer:'', //倒计时
      inputNumber:1, //加减框数字(投注Key值)
      UEnumber:0, //投注UE总数
      BlockItems:[], //滚动区块数据
      CurrentGameInfo:{}, //最新一期开奖信息
      randBetDialog: false,//随机投注弹窗
      selfBetDialog: false,//手动投注弹窗
      betSuccessDialog: false,//投注成功弹窗
      betNumber: "",//投注数字
      eos: null,//eos实例
      walletPwd: '',//钱包密码
      showWalletPwdInput: false,//是否显示钱包密码输入
    }
  },
 
  methods:{
    //初始化Socket , 实时获取区块信息
    initSocket() {
      ClientSocket.link().then(async connected => {
        if (connected) {
          try {
            let rewards = await ClientSocket.getReward({type:'less'})
            if (rewards.type === 'reward_history') {
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
          } catch (error) {
            console.log(error)
          }
        }
      })
    },
    //获取最新一期开奖信息(全球彩奖池，倒计时，期数)
    getOpen(){
      api.getOpen().then(res => {
        console.log("最新一期开奖信息:",res);
        this.CurrentGameInfo = res.data
        this.UEnumber = this.CurrentGameInfo.quantity 
        //倒计时
        var allSecond =Math.abs(this.CurrentGameInfo.count_down) 
        if(!allSecond){
          return false 
        }
        var timeInerval=setInterval(()=>{
          let hour = parseInt(allSecond / 3600 % 24)
          if(hour<10){
            hour = '0' + hour
          }
          let minute = parseInt(allSecond / 60 % 60)
          if(minute<10){
            minute = '0' + minute
          }
          let second = parseInt(allSecond % 60)
          if(second<10){
            second = '0' + second
          }
          if(second == 0 && minute==0  && hour==0){
            clearInterval(timeInerval);
            this.getOpen();
          }
          this.tiemer = hour + ':' + minute + ':' + second
          allSecond--
        },1000)
      })
    },
    // 减少投注金额
    btnLess(){
      this.inputNumber--
      if(this.inputNumber<1){
        this.inputNumber = 1
      }
      this.UEnumber = new Decimal(this.inputNumber).mul(new Decimal(this.CurrentGameInfo.quantity) )
    },
    // 增加投注金额
    btnAdd(){
      this.inputNumber++
      this.UEnumber = new Decimal(this.inputNumber).mul(new Decimal(this.CurrentGameInfo.quantity) )   
    },
    // 随机投注
    randomBetting(){
      try {
        api.getRandomBetting({
          periods:this.CurrentGameInfo.periods,
          account_name:this.$store.state.wallet.account,
          bet_key:this.inputNumber,
          bet_amount:this.UEnumber}).then( async res => {
            console.log("随机投注结果:",res);
            if(res.code == 1){
              this.betSuccessDialog = true;
            }else if(res.code == 1011){
              this.showWalletPwdInput = true;
              var privateKey = await this.getKeyProvider();
              if(!this.walletPwd){
                return false;
              }
              // 调用eos投注
              const opts = { authorization:[this.$store.state.wallet.account] , keyProvider: [privateKey]};
              const adm = await this.eos.contract(this.$store.state.wallet.config.token_account);
              adm.transfer(this.$store.state.wallet.account, 'lottobanker', Number(this.UEnumber).toFixed(4)+' UE', `globallotto:${this.$store.state.wallet.account}:${this.inputNumber}:000000000:${this.UEnumber}:${this.CurrentGameInfo.periods}:random` , opts).then( async trx => {
                console.log('调用钱包随机投注成功:', trx);
                this.betSuccessDialog = true;
                this.walletPwd = '';
                this.showWalletPwdInput = false;
              })
            }else{
              this.$toast('随机投注失败，请检查再重试！')
              return false;
            }
        })
      } catch (error) {
        this.$toast('随机投注失败，请检查再重试！')
      }
    },
    // 手动投注
    postBetting(){
      if(this.betNumber.length < 9){
        this.$toast('请输入9位号码');
        return;
      }
      api.getBetting({
        periods:this.CurrentGameInfo.periods,
        account_name:this.$store.state.wallet.account,
        bet_num:this.betNumber,
        bet_key:this.inputNumber,
        bet_amount:Number(this.UEnumber)})
      .then( async res => {
          console.log("手动投注结果:",res);
          if(res.code == 1){
            this.betSuccessDialog = true;
          }else if(res.code == 1011){
            this.showWalletPwdInput = true;
            var privateKey = await this.getKeyProvider();
            if(!this.walletPwd){
              return false;
            }
            // 调用eos投注
            const opts = { authorization:[this.$store.state.wallet.account] , keyProvider: [privateKey]};
            const adm = await this.eos.contract(this.$store.state.wallet.config.token_account);
            adm.transfer(this.$store.state.wallet.account, 'lottobanker', Number(this.UEnumber).toFixed(4)+' UE', `globallotto:${this.$store.state.wallet.account}:${this.inputNumber}:${this.betNumber}:${this.UEnumber}:${this.CurrentGameInfo.periods}:optional` , opts).then( async trx => {
              console.log('调用钱包手动投注成功:', trx);
              this.betSuccessDialog = true;
              this.walletPwd = '';
              this.showWalletPwdInput = false;
            })
          }else{
            this.$toast('投注失败，请检查再重试！')
            return false;
          }
        }
      )
    },
    // 继续投注
    continueBet(){
      this.betSuccessDialog = false;
    },
    // 关闭投注成功弹窗
    closeSuccessDialog(){
      this.randBetDialog = false;
      this.selfBetDialog = false;
      this.betSuccessDialog = false;
    },
    // 获取基础配置
    getBaseConfig(){
      api.getConfig().then(res => {
        console.log("获取基础配置:",res);
        if(res.code == 1){
          this.$store.commit('wallet/setBaseConfig', res.data);
          console.log("$store.state.wallet:",this.$store.state.wallet);
          console.log("chainId:",this.$store.state.wallet.config);
          console.log("httpEndpoint:",this.$store.state.wallet.config.httpEndPoint);
          // 配置eos
          this.eos = Eos({
            chainId: this.$store.state.wallet.config.chainId, // 32 byte (64 char) hex string
            httpEndpoint: this.$store.state.wallet.config.httpEndPoint,
            expireInSeconds: 60
          });
        }else{
          this.$toast('获取基础配置失败,请退出重试!');
        }
      })
    },
    // 生成秘钥
    async getKeyProvider(){
      const seed = await PasswordService.encrypt(this.walletPwd);
      const privateKey = CryptoAES.decrypt(this.$store.state.wallet.privateKey,seed);
      console.log("生成秘钥:",privateKey);
      return privateKey;
    }

  },

  created(){
    //轮播滚动
    this.initSocket();
    //获取全球彩奖池，倒计时，期数
    this.getOpen();
    //获取基础配置
    this.getBaseConfig();
  }
}
</script>

<style scoped lang="less">
.wrap{
  background-color: rgba(40, 40, 40, 1);
}
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
  background:url("../assets/img/u102.png") no-repeat center center;
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
.display_ib{
  display: inline-block;
}
// 滚动区域
.scroll-enter-active, .scroll-leave-active {
  transition: all 1s;
}
.scroll-enter, .scroll-leave-to{
  transform: translateY(-30px);
}
.scroll-move{
  transition:transform 1s;
}

  
/* 滚动样式    */
.recording{
  overflow: hidden;
  position: relative;
  // width: 100%;
  width: 90%;
  height: 5.48rem;
  // margin: 0 0 1px 0;
  margin: 0.5rem auto auto auto;
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
.p_A{
  font-family: "Arial Normal", Arial;
}   
.font_five{
  font-size: .3rem;
}
.orange{
  color: rgba(255, 153, 51, 1);
}

// 顶部(标题栏)
.pub-header{
  height: 1.6rem;width: 100%;position: fixed;background-color: rgb(56, 56, 58);display: flex;z-index: 9999;
}
.pub-header .logo{
  height: 1rem;width: 1rem;display: flex;margin: auto;background-color: rgb(76, 76, 78);
}
.pub-header .logo img{
  height: 100%;width: auto;margin: auto;border-radius: 50%;
}
.pub-header .title{
  height: 100%;width: 40%;padding-left: 10px;line-height: 1.6rem;color:white;font-size: 0.5rem;
}
.pub-header .action{
  height: 60%;width: 25%;display: flex;border-radius: 1rem;margin: auto 0.5rem auto auto ;background-color: rgb(76, 76, 78);
}
.pub-header .action .more{
  height: 100%;width: 50%;display: flex;
  /* border-right: 0.02rem solid #6e6767; */
}
.pub-header .action .more img{
  height: 60%;width: auto;margin: auto;
}
.pub-header .action .exit{
  height: 100%;width: 50%;display: flex;
}
.pub-header .action .exit img{
  height: 70%;width: auto;margin: auto;
}

// (规则,我的投注,开奖记录)入口
.action-enter{
  height: 2rem;width: 100%;padding-top: 2.6rem;display: flex;background-color: rgb(56, 56, 58);
}
.action-enter .action-item{
  width: 33.33%;height: 100%;
}
.action-enter .action-item .logo{
  height: 1.2rem;width: 100%;display: flex;
} 
.action-enter .action-item .logo img{
  height: 1.2rem;margin: auto;margin-top: 0;box-shadow:0px 0.08rem 0.08rem rgba(0, 0, 0, 0.349019607843137);
}
.action-enter .action-item .text{
  line-height: 0.8rem;text-align: center;color: rgb(218, 178, 121);
}

// 最新一期开奖信息
.current-bet-info{
  width: 100%;display: flex;height: 5.5rem;background-color: rgb(56, 56, 58);
}
.current-bet-info .container{
  width: 90%;height: 90%;background:url('../assets/qqc/home_bg_1_img.png');
  margin: auto;background-repeat: no-repeat;background-size: contain;
}
.current-bet-info .container .current-periods{
  height: 2.6rem;line-height: 2.6rem;font-weight: bold;color: rgb(218, 178, 121);font-size: 0.5rem;padding-left: 0.8rem;
}
.current-bet-info .container .bet-pool-title{
  padding-left: 0.8rem;line-height: 0.8rem;color: white;
}
.current-bet-info .container .bet-pool-total{
  height: 1.5rem;line-height: 1.5rem;font-weight: bold;color: rgb(218, 178, 121);font-size: 0.5rem;padding-left: 0.8rem;
}

// 开奖倒计时(新版)
.bet-open-cut-time{
  height: 1.1rem;width: 100%;background-color: rgb(56, 56, 58);
}
.bet-open-cut-time .container{
  height: 100%;width: 90%;background:url('../assets/qqc/bg_2_time_img.png');
  margin: auto;background-repeat: no-repeat;background-size: 100%;
}
.bet-open-cut-time .container .title{
  line-height: 1.1rem;font-size: 0.3rem;float: left;color: white;padding-left: 0.5rem;
}
.bet-open-cut-time .container .time{
  line-height: 1.1rem;font-size: 0.5rem;float: right;color: white;padding-right: 0.5rem;
}

// 实时区块信息(新版)
.current-recording{
  height: 6.5rem;width: 100%;display: flex;
  background-color: rgb(56, 56, 58);
}
.current-recording .container{
  height: 100%;width: 95%;margin: auto;background:url('../assets/qqc/bg_3_exhibition.png');
  margin: auto;background-repeat: no-repeat;background-size: 100%;
}

// 投注按钮
.bet-button{
  height: 3rem;width: 100%;display: flex;background-color: rgb(56, 56, 58);
}
.bet-button .item{
  width: 38%;height: 1.5rem;margin: auto;background:url('../assets/qqc/home_button_2_img.png');
  margin: auto;background-repeat: no-repeat;background-size: 100%;
  text-align: center;line-height: 1.2rem;color: rgb(218, 178, 121);font-size: 0.4rem;font-weight: bold;
}

// 随机投注弹窗(新版)
.rand-bet-dialog{
  position:fixed;
  top:0;
  bottom:0;
  left:0;
  right:0;
  background-color:  rgba(0, 0, 0, 0.509803921568627);
  z-index:99;
  display:flex;
  align-items:center;
  justify-content: center;
}
.rand-bet-dialog .container{
  height: 10rem;width: 80%;
  background:url('../assets/qqc/card_bg_3_img.png');
  margin: auto;background-repeat: no-repeat;background-size: 100%;
}
.rand-bet-dialog .container .rand-num{
  width: 90%;height: 1.2rem;background-color: white;margin: auto;margin-top: 1rem;border-radius: 0.2rem;
}
.rand-bet-dialog .container .rand-num input{
  width: 90%;margin: auto;height: 0.8rem;border: none;text-align: center;font-size: 0.6rem;letter-spacing: 0.2rem;
}
.rand-bet-dialog .container .tips{
  line-height: 0.8rem;color: white;width: 90%;margin: auto;font-size: 0.3rem;
}
.rand-bet-dialog .container .bet-count{
  width: 90%;height: 1.2rem;background-color: rgb(218, 178, 121);margin: auto;border-radius: 0.2rem;display: flex;line-height: 1.2rem;font-size: 0.6rem;
}
.rand-bet-dialog .container .bet-count .action{
  width: 25%;height: 100%;text-align: center;color: white;
}
.rand-bet-dialog .container .bet-count .count{
  width: 50%;height: 100%;text-align: center;background-color: white;
}
.rand-bet-dialog .container .rand-bet{
  width: 90%;height: 1.2rem;margin: auto;margin-top: 0.6rem;background-color: rgb(218, 178, 121);border-radius: 0.2rem;text-align: center;
  line-height: 1.2rem;color: white;font-size: 0.4rem;
}

.bet-success-dialog{
  position:fixed;
  top:0;
  bottom:0;
  left:0;
  right:0;
  background-color:  rgba(0, 0, 0, 0.509803921568627);
  z-index:99;
  display:flex;
  align-items:center;
  justify-content: center;
}
.bet-success-dialog .container{
  height: 90%;width: 100%;
  background:url('../assets/qqc/success_bg_3_card.png');
  margin: 1rem auto auto auto;background-repeat: no-repeat;background-size: 112%;
}
.bet-success-dialog .container .tips{
  margin-top: 50%;
  text-align: center;
  font-size: 0.6rem;font-weight: bold;
}
.bet-success-dialog .container .continue{
  width: 55%;height: 1.2rem;line-height: 1.2rem;background-color: rgb(218, 178, 121);margin: auto; margin-top: 20%;
  text-align: center;border-radius: 1rem;color: white;
}
.bet-success-dialog .container .bet-detail{
  width: 55%;height: 1.2rem;line-height: 1.2rem;color: rgb(218, 178, 121);margin: auto; margin-top: 0.3rem;
  text-align: center;
}
.bet-success-dialog .container .delete{
  margin-top: 20%;display: flex;
}
.bet-success-dialog .container .delete img{
  margin: auto;
}

.current-block-record{
    height: 100%;width: 100%;
    // overflow-y: scroll;
  }
  .current-block-record .item{
    height: 0.8rem;width: 100%;display: flex;line-height: 0.8rem;text-align: center;color: #999999;
  }
  .current-block-record .item .num{
    width: 25%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .current-block-record .item .code{
    width: 50%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .current-block-record .item .time{
    width: 25%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }


</style> 

<style>
.page__background{
  background-color: rgb(56, 56, 58);
}
</style>