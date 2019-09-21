<template>
    <vpage >
     <slot>
       <div style="background-color: rgb(40,40,40);width:100%;">
        <div class="head" style="background: rgb(27,27,27);">
          <div class="float_left box"><img  class="ion_tbg" src="@/assets/invitation2/u4.svg"></div>
          <p class="float_left orange" style="font-size: .5rem;margin: 0.45rem 0 .45rem 0;">哈希骰子</p>
          <div class="float_right" style="width: 3rem;height: 1rem;border: 1px solid rgb(100,100,100);margin: .25rem .6rem .25rem 0;border-radius: 6px;">
            <div class="display_ib" style="width: 49.5%;height: 100%;vertical-align: top;"><img @click="actionSheetVisible = true" style="width: 50%;height: 27%;margin: 25% 0px 0px 25%;" src="@/assets/invitation2/u8.png"></div>
            <div class="display_ib" style="width: 1%;height: 70%;background: rgb(100,100,100);vertical-align: top;margin-top: 5%;"></div>
            <div class="display_ib" style="width: 49.5%;height: 100%;vertical-align: top;"><img @click="back" src="../../../assets/img/u102.png" style="width: 55%;height: 80%;margin: 6% 0 0 21%;"></div>
          </div>
        </div>
        <!-- 区块滚动 -->
        <div class="recording"   >
            <transition-group name="scroll" mode="out-in" >
              <div style="display:inline-block" class="row list-complete-item" v-for="item in items" :key='item.treasureKey'>
                  <div class="display_ib" style="width: 23%;height: 100%;"><p class="p_A" style="font-size: .35rem;line-height: .64rem;text-align: center; ">{{item.block_num}}</p> </div>
                  <div class="display_ib" style="width: 45%;height: 100%;"><p class="p_A" style="font-size: .35rem;line-height: .64rem;text-align: center; ">{{item.id}}</p></div>
                  <div class="display_ib" style="width: 9%; height: 100%;"><p class="p_A orange" style="font-size: .35rem;line-height: .64rem;text-align: center; ">{{item.ids}}</p></div>
                  <div class="display_ib" style="width: 23%;height: 100%;"><p class="p_A" style="font-size: .35rem;line-height: .64rem;text-align: center; ">{{item.timestamp}}</p></div>
              </div>
            </transition-group> 
        </div>
        <!--  -->
        <div style="box-shadow: rgba(0, 0, 0, 0.35) 0px 0px 5px;width: 100%;height: 7px;"></div>
        <div style="height: .9rem;margin:0 5% 12px 5%;">
          <div class="display_ib" style="width: .9rem;height: .9rem;background:rgb(0,204,153);border-radius: 50%;"><img  style="width: 80%;height: 80%;margin: 10%;" src="@/assets/invitation2/u11.png"></div>
          <div class="display_ib" style="height:100%;width:3.7rem;vertical-align: bottom;margin-left: .3rem;vertical-align: top;">
            <p class="white p_A" style="font-size:.5rem;margin-top:.15rem;">{{bankerQuota[0]}} UE</p>
          </div>
          <div class="display_ib" style="width: 4rem;height: .8rem;border: 1px solid rgb(107, 107, 107);border-radius: 6px;vertical-align: top;text-align: center;position: relative;">
            <div style="background: orange;width: 1%;height: 100%;position: absolute;border-radius: 6px;"></div>
            <p class="font_white" style="font-size:.35rem;position: absolute;margin: .13rem 0 0 .3rem;">最大可下注 100 UE</p>
          </div>
        </div>
        <!--  -->
        <div style="border: 1px solid rgb(107, 107, 107);width: 90%;height: 1.2rem;margin: 0 auto;border-radius: 5px;">
          <div class="display_ib vertical_top Centered p_A" style="width: 33%;height: 100%;"><p >可赢奖金</p><p class="orange font_five">{{winningBonus}}</p></div>
          <div class="display_ib vertical_top Centered p_A" style="width: 1px;height: 100%;background: rgb(107, 107, 107);"></div>
          <div class="display_ib vertical_top Centered p_A" style="width: 33%;height: 100%;"><p >赔率</p><p class="orange font_five">{{publicData[twenty].odds_rate}}</p></div>
          <div class="display_ib vertical_top Centered p_A" style="width: 1px;height: 100%;background: rgb(107, 107, 107);"></div>
          <div class="display_ib vertical_top Centered p_A" style="width: 33%;height: 100%;"><p >中奖概率</p><p class="orange font_five">{{publicData[twenty].winning_probability}}</p></div>
        </div>
        <!--  -->
        <div style="width: 100%;height: 9px;"></div>
        <div style="width: 90%;height: 1.2rem;margin: 0 auto;">
          <div @click="selectTwenty(0)" :class="{background_orange:twenty==0}" class="display_ib vertical_top Centered p_A" style="width: 22%;height: 100%;border-radius: 5px;border: 1px solid rgb(107, 107, 107);">
            <p class="font_five" :class="{font_white:twenty==0}" style="margin-top: .24rem;">小于</p>
          </div>
          <div class="display_ib" style="width: 3%;height: 100%;"></div>
          <div @click="selectTwenty(1)" :class="{background_orange:twenty==1}" class="display_ib vertical_top Centered p_A" style="width: 22%;height: 100%;border-radius: 5px;border: 1px solid rgb(107, 107, 107);">
            <p class="font_five" :class="{font_white:twenty==1}" style="margin-top: .24rem;">大</p>
          </div>
          <div class="display_ib" style="width: 3%;height: 100%;"></div>
          <div @click="selectTwenty(3)" :class="{background_orange:twenty==3}" class="display_ib vertical_top Centered p_A" style="width: 22%;height: 100%;border-radius: 5px;border: 1px solid rgb(107, 107, 107);">
            <p class="font_five" :class="{font_white:twenty==3}" style="margin-top: .24rem;">对子</p>
          </div>
          <div class="display_ib" style="width: 3%;height: 100%;"></div>
          <div @click="selectTwenty(2)" :class="{background_orange:twenty==2}" class="display_ib vertical_top Centered p_A" style="width: 22%;height: 100%;border-radius: 5px;border: 1px solid rgb(107, 107, 107);">
            <p class="font_five" :class="{font_white:twenty==2}" style="margin-top: .24rem;">小</p>
          </div>
        </div>
        <!--  -->
        <div style="width: 100%;height: 10px;"></div>
        <div style="width: 79%;margin: 0 auto;height: 1.35rem;"><div class="slider_number" :style="{ left:fadeInDuration*0.825+ '%' }"><p class="font_white font-weight font_five Centered">{{fadeInDuration}}</p></div></div>
        <div style="width: 90%;margin: 0 auto;">
          <div class="display_ib vertical_top" style="width: 6%;"><p class="white font_five font-weight">0 </p></div>
          <div class="schedule_white vertical_top display_ib" style="width: 84%;height: .66rem;">
            <div :style="{ width:fadeInDuration*0.068+ 'rem' }" class="shadow_orange"></div>
            <input type="range" v-model="fadeInDuration" min="0" max="99">
          </div>
          <div class="display_ib vertical_top" style="width: 10%;"><p class="white font_five font-weight">&nbsp;&nbsp;99</p></div>
        </div>
        <div style="width: 100%;height: 15px;"></div>
        <!--  --> 
        <div style="width: 100%;height: 1.2rem;">
          <div class="display_ib" style="width: 2%;height: 100%;"></div>
          <div @click="logKeyboard" class="display_ib vertical_top  p_A " style="width: 26%;height: 100%;border-radius: 5px;border: 1px solid rgb(107, 107, 107);">
            <div class="display_ib" style="width: 45%;height:100%;"><img  style="width: 100%;height: 100%;" src="@/assets/invitation2/u10.svg"></div>
            <div class="display_ib vertical_top" style="width: 55%;height:100%;">
              <p class=" Centered font_five orange" style="margin-top: .24rem;">{{betAmount}}</p>
            </div>
          </div>
          <div class="display_ib" style="width: 2%;height: 100%;"></div>
          <div class="display_ib vertical_top Centered p_A" style="width: 15%;height: 100%;border-radius: 5px;border: 1px solid rgb(107, 107, 107);">
            <p @click="selectBetAmount('1')" class="font_five" style="margin-top: .24rem;">1/2</p>
          </div>
          <div class="display_ib" style="width: 2%;height: 100%;"></div>
          <div class="display_ib vertical_top Centered p_A" style="width: 15%;height: 100%;border-radius: 5px;border: 1px solid rgb(107, 107, 107);">
            <p @click="selectBetAmount('2')" class="font_five" style="margin-top: .24rem;">2X</p>
          </div>
          <div class="display_ib" style="width: 2%;height: 100%;"></div>
          <div class="display_ib vertical_top Centered p_A" style="width: 15%;height: 100%;border-radius: 5px;border: 1px solid rgb(107, 107, 107);">                                                                       
            <p @click="selectBetAmount('0')" class="font_five" style="margin-top: .24rem;">MIN</p>
          </div>
          <div class="display_ib" style="width: 2%;height: 100%;"></div>
          <div class="display_ib vertical_top Centered p_A" style="width: 15%;height: 100%;border-radius: 5px;border: 1px solid rgb(107, 107, 107);">                                                                       
            <p @click="selectBetAmount('100')" class="font_five" style="margin-top: .24rem;">MAX</p>
          </div>
        </div>
        <!--  -->
        <div style="width: 100%;height: 20px;"></div>
        <div v-if="!Betting" class="background_orange" style="width: 80%;height: 1.4rem;border: 1px solid rgba(255, 153, 51, 1);margin:0 auto;border-radius: 7px;"><p @click="selectBetting();betting();" class="Centered font_white font_five" style="line-height: 1.4rem;">{{publicDataButton[twenty]}}</p></div>
        <div v-if="Betting" style="width: 80%;height: 1.4rem;border: 1px solid rgba(255, 153, 51, 1);margin:0 auto;border-radius: 7px;"><p class="Centered font_white font_five" style="line-height: 1.4rem;">开奖中...</p></div>
        <div style="width: 100%;height: 20px;"></div>
        <div style="width: 100%;">
          <div style="width:100%;height:1.4rem;background: rgb(27, 27, 27);">
            <div class="display_ib" :class="{gray:!allMy}" @click="selectAllMy(true)" style="width:50%;height:1.4rem;line-height: .7rem;"><p  style="text-align: center;font-size: .45rem; margin-top: .3rem;">所有投注</p></div>
            <div class="display_ib" :class="{gray:allMy}" @click="selectAllMy(false)" style="width:50%;height:1.4rem;line-height: .7rem;"><p  style="text-align: center;font-size: .45rem; margin-top: .3rem;">我的投注</p></div>
          </div>
          <div v-if="allMy">
            <div style="width:100%;height:1.1rem;background: rgb(27, 27, 27);">
              <div class="display_ib" style="width:33.3%;height:1.1rem;"><p class=" font_five" style="line-height:1.1rem;text-align: center;">时间</p></div>
              <div class="display_ib" style="width:33.3%;height:1.1rem;"><p class=" font_five" style="line-height:1.1rem;text-align: center;">玩家</p></div>
              <div class="display_ib" style="width:33.3%;height:1.1rem;"><p class=" font_five" style="line-height:1.1rem;text-align: center;">奖金</p></div>
            </div>
            <div style="" v-for="(item,index) in aLLBetting" :key='index'>
              <div style="width:100%;height:1.1rem;">
                <div class="display_ib vertical_top" style="width:33.3%;height:1.1rem;"><p  style="font-size: .45rem;line-height:1.1rem;text-align: center;">{{item.create_time}}</p></div>
                <div class="display_ib vertical_top" style="width:33.3%;height:1.1rem;"><p  style="font-size: .45rem;line-height:1.1rem;text-align: center;">{{item.account_name}}</p></div>
                <div class="display_ib vertical_top" style="width:33.3%;height:1.1rem;"><p  style="font-size: .45rem;line-height:1.1rem;text-align: center;">{{item.bonus}}</p></div>
              </div>
            </div>
          </div>
          <div v-if="!allMy">
            <div style="width:100%;height:1.1rem;background: rgb(27, 27, 27);">
              <div class="display_ib" style="width:25%;height:1.1rem;"><p class=" font_five" style="line-height:1.1rem;text-align: center;">时间</p></div>
              <div class="display_ib" style="width:25%;height:1.1rem;"><p class=" font_five" style="line-height:1.1rem;text-align: center;">投注内容</p></div>
              <div class="display_ib" style="width:25%;height:1.1rem;"><p class=" font_five" style="line-height:1.1rem;text-align: center;">投注金额</p></div>
              <div class="display_ib" style="width:25%;height:1.1rem;"><p class=" font_five" style="line-height:1.1rem;text-align: center;">奖金</p></div>
            </div>
            <div style="" v-for="(item,index) in myBetting" :key='index'>
              <div style="width:100%;height:1.1rem;">
                <div class="display_ib vertical_top" style="width:25%;height:1.1rem;"><p  style="font-size: .45rem;line-height:1.1rem;text-align: center;">{{item.create_time}}</p></div>
                <div class="display_ib vertical_top" style="width:25%;height:1.1rem;"><p  style="font-size: .45rem;line-height:1.1rem;text-align: center;">{{item.bet_num}}</p></div>
                <div class="display_ib vertical_top" style="width:25%;height:1.1rem;"><p  style="font-size: .45rem;line-height:1.1rem;text-align: center;">{{item.bet_amount}}</p></div>
                <div class="display_ib vertical_top" style="width:25%;margin-left: 0%;height:1.1rem;" @click="jumpHashDiceDetails(item.id)">
                  <div class="display_ib vertical_top Centered" style="width:70%;height: 1.1rem;"><p style="font-size: .45rem;line-height:1.1rem;">{{item.bonus}}</p></div>
                  <div class="display_ib vertical_top" style="width:30%;height: 1.1rem;"><img style="width: .5rem;height: .5rem;margin-top: .3rem;" src="@/assets/img/invitation_profitarrow.png"></div>
                </div>
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

              <v-ons-row class="selectrow" @click="jumpHashDiceRule">
                  <img class="rule" src="@/assets/img/u9832.png" alt="">
                  <span>玩法</span>
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
        <div v-if="CountDown" class="lottery">
            <p v-if="!LotteryResult" class="orange p_A" style=" font-size: 1.5rem;line-height: 4rem;">{{CountDownNum}}</p>
            <div v-if="LotteryResult" style="width: 48%;height: 48%;margin: 26% auto;">
              <p class="orange p_A" style="font-size: 1.2rem;line-height: 1rem;color:rgb(0, 204, 102);">35</p><p class="orange p_A" style="font-size: .8rem;color:rgb(0, 204, 102);">lose</p>
            </div>
        </div>
        <transition name="slide">
         <div class="keyboard" v-if="keyboard">
          <div class="list_row">
            <div class="key">{{betAmount}}</div>
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
import api from '@/pages/game/hashdice/game'


//滚动区域
import ClientSocket from '@/socket/HashSocket'


export default {
  components: {
    vpage: MyPage,
   },
  data() {
    return {
      account_name:'',//账户ID
      treasureKey:1,  //滚动KEY
      allMy:true,   //区分我的 全部
      actionSheetVisible: false,   //下拉框
      keyboard:false,  //下拉键盘betAmount
      betSuccess:false,        //成功显示
      betFailure:false,        //失败显示
      fadeInDuration:0,      //滑块骰子的值
      twenty:0,      //模式选择  
      Betting:false, //投注按钮显示开奖中
      CountDown:false, //开奖
      CountDownNum:7, //开奖倒计时
      LotteryResult:false,//开奖结果
      bankerQuota:'',  //庄家的额度
      betAmount:'0',//投注的总额度
      winningBonus:0,//可赢奖金
      publicData:[],  //公用界面数据       小于0   大于1   对子3   小2
      publicDataButton:[ //按钮
        '小于 50 赢 - 去投注','50 - 99 且不是对子赢 - 去投注','00 - 49 且不是对子赢 - 去投注','对子赢 - 去投注'
      ],  
      items:[    // 滚动
              // {timestamp:"15:23:02.0",block_num:33283278,id:'...'+"F7B195473D4F09BC8F1",treasureKey:1,ids:10},
              // {timestamp:"15:23:02.0",block_num:33283278,id:'...'+"F7B195473D4F09BC8F1",treasureKey:2,ids:10},
              // {timestamp:"15:23:02.0",block_num:33283278,id:'...'+"F7B195473D4F09BC8F1",treasureKey:3,ids:10},
              // {timestamp:"15:23:02.0",block_num:33283278,id:'...'+"F7B195473D4F09BC8F1",treasureKey:4,ids:10},
              // {timestamp:"15:23:02.0",block_num:33283278,id:'...'+"F7B195473D4F09BC8F1",treasureKey:5,ids:10},
              // {timestamp:"15:23:02.0",block_num:33283278,id:'...'+"F7B195473D4F09BC8F1",treasureKey:6,ids:10},
              // {timestamp:"15:23:02.0",block_num:33283278,id:'...'+"F7B195473D4F09BC8F1",treasureKey:7,ids:10},
              // {timestamp:"15:23:02.0",block_num:33283278,id:'...'+"F7B195473D4F09BC8F1",treasureKey:8,ids:10},
              // {timestamp:"15:23:02.0",block_num:33283278,id:'...'+"F7B195473D4F09BC8F1",treasureKey:9,ids:10},
              // {timestamp:"15:23:02.0",block_num:33283278,id:'...'+"F7B195473D4F09BC8F1",treasureKey:10,ids:10},
      ],   
      aLLBetting:[],//所有投注
      myBetting:[   //我的投注
        {create_time:1,bet_num:1,bet_amount:1,bonus:1}
      ],
      socket:'',

    }
  },
  methods: {
       back() {
          this.$router.go(-2)
       },
       selectTwenty(index) { //选择 小于 大 对子 小
         this.twenty=index;
       },
       selectAllMy(index) { //区分 我的 全部
         this.allMy=index;
       },
       selectBetting() {  //开奖
         this.Betting=true;
         this.CountDown=true;
         var star=setInterval(() => {this.CountDownNum-=1;}, 1000);
         setTimeout(() => {
            clearInterval(star);
            this.CountDownNum=7;
            this.LotteryResult=true;
            setTimeout(() => {
              this.Betting=false;
              this.CountDown=false;
              this.LotteryResult=false;
            }, 2000);
         }, 7000);
       },
       jumpHashDiceRule() {   //跳转规则
         this.$router.push({
          name: 'HashDiceRule',
        })
       },
       jumpHashDiceDetails(id) {    //跳转详情
         this.$router.push({
          name: 'HashDiceDetails',
          params: {
            id: id,
          }
        })
       },
       betting(){ //投注
        api.Betting({account_name:this.account_name,bet_num:this.publicData[this.twenty].bet_type,bet_amount:this.betAmount}).then(res => {
          if (res.code === 1) {
                console.log(res)
              }
          })
       },
       selectBetAmount(data){ //选择投注额度
          this.betAmount=data;
       },
       logKeyboard(){    //切换下拉键盘
          this.keyboard=!this.keyboard;
       },
       enterAmount(data){//  输入数字
        this.betAmount+=data;
        if(this.betAmount>100){this.betAmount='100';}
       },
       deleteAmout(){//   删除数字
        this.betAmount=this.betAmount.substr(0,this.betAmount.length-1);
       },
       addComma(data){
        var a=data;var b='';var c=a.length+1;
          for(var i=0;c/3>i;i++){
            if(a.length>3){
              b=','+a.slice(a.length-3,a.length)+b;
              a=a.slice(0,a.length-3);
            }else if(a.length==3){
              b=a;
            }else{
              b=a+b;
            }
          }
          return b;
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
       
        
        
  },
  watch: {
        '$store.state.wallet.block': {
            handler(newVal, oldVal) {
                console.log(12311111111111,this.$store.state.wallet.block);
                this.treasureKey+=1;
                this.items.unshift({timestamp:format(this.$store.state.wallet.block.timestamp, 'HH:mm:ss:S'),block_num:this.$store.state.wallet.block.block_num,
                id:'...'+this.$store.state.wallet.block.id.slice(45),treasureKey:this.treasureKey
                });
                this.items.splice(10);
            }
        },
         betAmount: {   //可赢奖金
          handler(newVal, oldVal) {
            this.winningBonus=new Decimal(this.betAmount).mul(new Decimal(this.publicData[this.twenty].odds_rate));
          }
        },
         twenty: {   //可赢奖金
          handler(newVal, oldVal) {
            this.winningBonus=new Decimal(this.betAmount).mul(new Decimal(this.publicData[this.twenty].odds_rate));
          }
        },
  },
  created(){
    this.account_name=this.$store.state.wallet.assets.account;
    //滚动区域
    this.initSocket();
    //获取配置信息
    api.getConfig().then(res => {
        if (res.code === 1) {
          }
      })
    //获取庄家的额度
    api.bankerQuota().then(res => {
        if (res.code === 1) {
            this.bankerQuota=res.data.balance[0].split('.');
            this.bankerQuota[0]=this.addComma(this.bankerQuota[0]);
          }
      })
    //获取当前用户的信息
    api.getCurrentUser({account_name:this.account_name}).then(res => {
        if (res.code === 1) {
            this.publicData=res.data;
          }
      })
    //获取所有的投注
    api.getAllBets().then(res => {
        if (res.code === 1) {
            this.aLLBetting=res.data;
          }
      })
    //获取我的投注
    api.getSomeUserBettingList({account_name:this.account_name}).then(res => {
        if (res.code === 1) {
            // this.myBetting=res.data;
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
  margin: 0 auto;
  width: .9rem;
  height:.9rem;
  margin:0.35rem 0.30rem .35rem 0.6rem;
  border-radius: 6px;
}
.ion_tbg{
  width: 115%;
  height:115%;
}
.schedule_white{
  width: 80%;
  border-radius: 20px;
  margin: 0 auto;
  /* background: rgb(54,54,54); */
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
.lottery{
  position: absolute;
  width: 4rem;
  height: 4rem;
  top: 14%;
  left: 30%;
  background:url("../../../assets/invitation2/u12.png");
  background-size:100% 100%;
  background-repeat:no-repeat;
  background-position:center center;
  text-align: center;
}
/*滑块样式*/
input[type="range"] {
    margin-top: 2px;
    background-color: rgb(188,188,188);
    border-radius: 15px;
    -webkit-appearance: none;
    width: 100%;
    height: 35%;
    margin: .214rem 0;
}
input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    cursor: default;
    width: 1.1rem;
    height: 1.1rem;
    background:url("../../../assets/invitation2/u13.svg");
    background-size:100% 100%;
    background-repeat:no-repeat;
    background-position:center center;
}
.slider_number{
  width: 1.1rem;
  height: 1rem;
  position: relative;
  background:url("../../../assets/invitation2/u14.png");
  background-size:100% 100%;
  background-repeat:no-repeat;
  background-position: center center;
}
.shadow_orange{
  margin-top: 0.02667rem;
  background-color: orange;
  border-radius: 0.2rem;
  -webkit-appearance: none;
  height: 0.23rem;
  margin: .214rem 0;
  position: absolute;
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
.background_orange{
  background: rgba(255, 153, 51, 1);
}
.background_green{
  background: rgb(72, 124, 98);
}
.background_red{
  background: rgb(124, 72, 72);
}
.font_white{
  color: #FFFFFF;
}
.font-weight{
  font-weight:600;
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
.font_six{
  font-size: .6rem;
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
   


/* 滚动样式    */
.recording{
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 6.48rem;
  margin: 0 0 1px 0;
}
.row{
  width: 100%;
  height: 0.64rem;
  position: relative;
}
.scroll-enter-active, .scroll-leave-active {
  transition: all 1s;
}
.scroll-enter, .scroll-leave-to{
  transform: translateY(-40px);
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