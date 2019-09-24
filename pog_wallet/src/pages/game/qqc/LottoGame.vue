<template>
    <ons-page>
        <div class="wrap">
            <div class="title">
              <div class="title_left">
                  <img src="@/assets/img/lotto_smlogo.png" alt="">
                  <span>全球彩</span>
              </div>
              <div class="title_right">
                  <div class="bottonwrap">
                    <div class="more" @click="actionSheetVisible = true">
                        <span class="radius"></span>
                        <span class="radiusBig"></span>
                        <span class="radius"></span>
                    </div>
                    <div @click="close()" class="close"></div>
                  </div>
              </div>
          </div>

      <!-- 区块滚动 -->
         <div class="recording"   >
            <transition-group name="scroll" >
              <div style="display:inline-block" class="row list-complete-item" v-for="item in items" :key='item.treasureKey'>
                  <div class="display_ib" style="width: 23%;height: 100%;color:#bcbcbc;font-size:0.4rem"><p class=" font_four p_A" style="line-height: .64rem;text-align: center; ">{{item.block_num}}</p> </div>
                  <div class="display_ib" style="width: 54%;height: 100%;color:#bcbcbc;font-size:0.4rem"><p class=" font_four p_A" style="line-height: .64rem;text-align: center; ">{{item.id}}</p></div>
                  <div class="display_ib" style="width: 23%;height: 100%; color:#bcbcbc;font-size:0.4rem"><p class=" font_four p_A" style="line-height: .64rem;text-align: center; ">{{item.timestamp}}</p></div>
              </div>
            </transition-group> 
        </div>
        
      <!-- 全球彩 -->
      <div class="globalColor">
         <div class="content">
            <p class="small_t">全球彩</p>
            <p class="big_t">全球彩</p>
            <div class="openTime">{{tiemer}}</div>
            <p class="openPhase"># {{openInfo.periods}} 期</p>
            <p class="openNum">{{openInfo.prize_pool}}</p>
            <p class="Company">UE</p>
         </div>
      </div>
      
      <!-- 按钮部分 -->
       <div style="width: 80%;height: 1rem;margin: 0 auto;border-radius: 5px;background: rgb(54,54,54);">
          <div class="display_ib vertical_top" style="width:1rem;height:1rem;"><img style="width:50%;height:50%;margin: 25% 25%;" src="@/assets/invitation2/u7.png"></div>
          <div @click="btnLess()" class="display_ib vertical_top" style="width:1rem;height:1rem;background:rgb(67,67,67);"><p class=" font_five" style="line-height:1rem;text-align: center;color: rgb(228, 228, 228);">-</p></div>
          <div class="display_ib vertical_top" style="width:1.8rem;height:1rem;"><p class=" font_five orange" style="line-height:1rem;text-align: center;">{{inputNumber}}</p></div>
          <div @click="btnAdd()" class="display_ib vertical_top" style="width:1rem;height:1rem;background:rgb(67,67,67);"><p class=" font_five orange" style="line-height:1rem;text-align: center;">+</p></div>
          <div class="display_ib vertical_top" style="width:3rem;height:1rem;"><p class=" font_five" style="line-height:1rem;text-align: center;color: #E4E4E4;">@ {{UEnumber}} UE</p></div>
        </div>

      <!-- key -->
      <p class="ukey">1 key = {{openInfo.quantity}} UE</p>

      <!-- 投注按钮 -->
      <div class="bettingBtn">
          <div class="btn1" @click="randomBetting()">随机投注</div>
          <div class="btn2" @click="logKeyboard()">选号投注</div>
      </div>

      <!-- 选项 -->
      <div class="options">
         <div class="btns">
           <p class="all" @click="btnToggle(0)" :class="{'active':btnId == 0}">全部</p>
           <p class="my" @click="btnToggle(1)" :class="{'active':btnId == 1}">我的</p>
         </div>
      </div>  

      <!-- 如果状态等于0 显示全部 -->
      <div class="allList" v-if="btnId == 0">
        <p v-for="(item,index) in openAllList" :key="index">
          <span># {{item.periods}} 期</span>  
          <span style="color:#FF9900" v-if="item.reward_num =='' ">待开奖 - 开奖倒计时 {{tiemer}}</span>
          <span v-if="item.reward_num">{{item.reward_num}}</span>
          <span>{{item.key}} <img src="@/assets/img/invitation_profitarrow.png" alt=""></span> 
          
        </p>
      </div>


      <!-- 如果状态等于1 显示我的 -->
      <div class="myList" v-if="btnId == 1">
        <p v-for="(item,index) in openMyList" :key="index">
          <span># {{item.periods}} 期 - <span style="color:#FF9900" v-if="item.win_type== 'waiting'">待开奖</span> </span>   
          <span>{{item.bet_time}}</span>
          <span>{{item.bet_key}} Key<img src="@/assets/img/invitation_profitarrow.png" alt=""></span> 
          
        </p>
      </div>
      
      



      <!-- 更多下拉框 -->
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

            <v-ons-row class="selectrow">
                <img class="rule" src="@/assets/img/u9832.png" alt="">
                <span>规则</span>
            </v-ons-row>
         </div>
      </v-ons-action-sheet> 


      <!-- 键盘 -->
      <!-- <transition name="slide">
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
        </transition> -->
        
         <transition name="slide">
           <div class="keyboardBox" v-if="keyboard" >
              <div class="keyboard">
                  <div class="top">
                      <div class="numbers">
                          <div class="rows">
                              <div class="col" @click="enterAmount('1')">1</div>
                              <div class="col" @click="enterAmount('2')">2</div>
                              <div class="col" @click="enterAmount('3')">3</div>
                              <div class="col" @click="enterAmount('4')">4</div>
                          </div>
                          <div class="rows">
                              <div class="col" @click="enterAmount('5')">5</div>
                              <div class="col" @click="enterAmount('6')">6</div>
                              <div class="col" @click="enterAmount('7')">7</div>
                              <div class="col" @click="enterAmount('8')">8</div>
                          </div>
                          <div class="rows">
                              <div class="col" @click="enterAmount('9')">9</div>
                              <div class="col" @click="enterAmount('0')">0</div>
                              <div class="col" @click="deleteAmout()"><p class="numberClose"><span></span>  X</p></div>
                          </div>
                      </div>
                      <div class="inputNumbers">
                          <p>{{inputNumberList}}</p>
                          <!-- <p>3</p>
                          <p>4</p>
                          <p>1</p>
                          <p>2</p>
                          <p>3</p>
                          <p>4</p>
                          <p>5</p>
                          <p>6</p> -->
                          <div @click="deleteAll()" ><img src="@/assets/img/u9556.png" alt=""></div>
                      </div>
                  </div>
                  
                   <div class="middle">
                      <div class="inputBetting">
                          <span @click="lessBtn()">-</span>
                          <span>{{bettingNumber}}</span>
                          <span @click="addBtn()">+</span>
                      </div>
                      <div class="UeBetting">{{bettingUe}} UE</div>
                  </div>
                  <div class="bottom">
                     <div class="cancel" @click="logKeyboard()">取消</div>
                     <div class="betting" @click="postBetting()">投注</div>
                  </div> 
                 
              </div>
           </div>
         </transition>

        </div>
    </ons-page>
</template>

<script>

//滚动区域
// import ClientSocket from '@/socket/socketWs'
import ClientSocket from '@/socket/scrollClientSocket'
import api from '@/servers/game'
import { format, parse } from 'date-fns'
import {Decimal} from 'decimal.js';

export default {
   name: '',
   data() {
       return {
          actionSheetVisible: false, //拉下框
          btnId:0,  //选项卡， 0为全部 1为我的
          treasureKey:1,  //滚动KEY
          tiemer:'', //倒计时
          inputNumber:1,  //加减框数字
          UEnumber:0,
          keyboard:false,  //下拉键盘
          betAmount:'0',//投注的总额度
          bettingNumber:0,
          bettingUe:0,
          items:[    // 滚动
            // {timestamp:"15:23:02.0",block_num:33283278,
            //   id:'...'+"F7B195473D4F09BC8F1",treasureKey:1
            //   }
          ], 
          inputNumberList:'',
          openAllList:[],
          openMyList:[],
          openInfo:{},
       }
   },
 
   methods:{
     //关闭按钮
     close(){
        this.$router.go(-2)
     },
     //切换选项卡
     btnToggle(id){
        this.btnId = id
     },
     //滚动区域
     initSocket() {
            ClientSocket.link().then(async connected => {
                // console.log('link',connected)
                if (connected) {
                    try {
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
                    } catch (error) {
                        console.log(error)
                    }
                }
            })
        },

     //获取全球彩奖池，倒计时，期数
      getOpen(){
            api.getOpen().then(res => {
                this.openInfo = res.data
                this.UEnumber = this.openInfo.quantity 
                //倒计时

                var allSecond =Math.abs(this.openInfo.count_down) 
   
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
                      }
                      
                      this.tiemer = hour + ':' + minute + ':' + second
                      
                      allSecond--
                },1000)
      
          })
      },
      btnLess(){
          this.inputNumber--
          if(this.inputNumber<1){
              this.inputNumber = 1
          }
          this.UEnumber = new Decimal(this.inputNumber).mul(new Decimal(this.openInfo.quantity) )
      },
      btnAdd(){
          this.inputNumber++
          this.UEnumber = new Decimal(this.inputNumber).mul(new Decimal(this.openInfo.quantity) )   
      },
      getAllGame(){
          api.getOpenlist().then(res => this.openAllList = res.data)
      },
      getMyGame(){
          api.getUserBet({account_name:this.$store.state.wallet.assets.account}).then(res => {
                this.openMyList = res.data.detail;
                for(var i=0; i<this.openMyList.length; i++){
                     this.openMyList[i].bet_time = format(parse(this.openMyList[i].bet_time), 'MM/DD HH:mm:ss')
                }
            })
      },
      randomBetting(){
          api.getRandomBetting({periods:this.openInfo.periods,account_name:this.$store.state.wallet.assets.account,bet_key:this.inputNumber,bet_amount:this.UEnumber}).then(res=> {
              if(res.code != 1){
                this.$toast('随机投注失败，请检查再重试！')
                return false;
              }
              if(res.code == 1){
                this.$toast('恭喜你，随机投注成功！')
              }
          })
      },
      logKeyboard(){    //切换下拉键盘
        this.keyboard=!this.keyboard;
      },
      enterAmount(data){//  输入数字
      if(this.inputNumberList.length < 9){
           this.inputNumberList+=data;
      }

      },
      deleteAmout(){//   删除数字
      this.inputNumberList=this.inputNumberList.substr(0,this.inputNumberList.length-1);
      },
      deleteAll(){//   删除数字
      this.inputNumberList='';
      },
      addBtn(){
          this.bettingNumber++
      },
      lessBtn(){
          this.bettingNumber--
           if(this.bettingNumber<0){
              this.bettingNumber = 0
          }
      },
      postBetting(){
          api.getBetting({periods:this.openInfo.periods,account_name:this.$store.state.wallet.assets.account,bet_num:this.inputNumberList,bet_key:this.bettingNumber,bet_amount:this.bettingUe}).then( res => console.log(res))
      }



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
         bettingNumber: {   //
          handler(newVal, oldVal){ 
            this.bettingUe=new Decimal(this.openInfo.quantity).mul(new Decimal(this.bettingNumber));
          }
         }
    },

  created(){


     //轮播滚动
     this.initSocket();

     //获取全球彩奖池，倒计时，期数
     this.getOpen()

     //获取全部开奖信息列表
     this.getAllGame()

     //获取我的开奖信息列表
     this.getMyGame()

     
     



    


   }
}
</script>

<style scoped lang="less">
 .wrap{
   background-color: rgba(40, 40, 40, 1);
 }
 .title{
   height:2rem;
   width:100%;
   display:flex;
   flex-wrap:nowrap;
   align-items:center;
   background-color: rgba(27, 27, 27, 1);
   box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.349019607843137);
   font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
   font-weight: 700;
 }
 .title_left{
   flex:1 1;
   display:flex;
   align-items:center;
 }
 .title_left img{
   height:1rem;
   width:1rem;
   padding-left:0.6rem;
 }
 .title_right{
   flex:1 1;
  //  justify-content:right;
   display: flex;
   flex-direction:row-reverse;
   padding-right:.6rem;
 }
 .title_left span{
   color:#FF9900; 
   font-family: 'Axure Handwriting Bold', 'Axure Handwriting Regular', 'Axure Handwriting';
   font-weight:bold;
   font-size:0.6rem;
   line-height:2rem;
   padding-left:0.2rem;
 }
 .bottonwrap{
   border:0.02rem solid rgba(255, 255, 255, 0.2);
   width:3.2rem;
   height:1.1rem;
   border-radius:.09rem; 
   display:flex;
   position:relative;
 }
  .more{
    flex:1 1;
    display:flex;
    align-items:center;
    justify-content: center;
  }
  .more:after{
        content: '';
        position: absolute;
        top: .15rem;
        left: 1.6rem;
        height: .8rem;
        width: 0.02rem;
        background-color: rgba(255, 255, 255, 0.2);
  }
  .radius{
      border-radius:50%;
      height:.16rem;
      width:.16rem;
      background: rgba(255, 255, 255, .85);
      display:inline-block;
      margin: .15rem;
  }
  .radiusBig{
      border-radius:50%;
      height:.28rem;
      width:.28rem;
      background: rgba(255, 255, 255, .85);
      display:inline-block;
  }
  .close{
    flex:1 1;
    background:url("../../../assets/img/u102.png") no-repeat center center;
    background-size:.8rem .8rem;
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



  .globalColor{
    padding:1rem .8rem .6rem .8rem;
  }

  .globalColor .content{
    border:0.02rem solid rgba(255,255,255,0.3);
    border-radius:.1rem;
    position:relative;
    text-align:center;
    padding-top:.8rem;

  }
  
  .big_t, .small_t{
    font-family: '微軟正黑體 Bold', '微軟正黑體 Regular', '微軟正黑體';
  }
  
  .big_t{
    background-color:rgba(40, 40, 40, 1);
    height:1rem;
    width:3.6rem;
    color:rgba(148, 148, 148, 0.109803921568627);
    position:absolute;
    left:50%;
     margin-left:-1.8rem;;
    top:-0.25rem;
    vertical-align: middle;
    font-size:.9rem;
    font-weight: 700;
  }
  .small_t{
    height:1rem;
    width:3rem;
    color: #FF9900;;
    position:absolute;
    left:50%;
    margin-left:-1.5rem;;
    top:-0.25rem;
    vertical-align: middle;
    font-size:.75rem;
    font-weight: 700;
    z-index: 11;
  }

  .openTime{
    font-size: .4rem;
    color: #BCBCBC;
    font-family: "Arial Normal", Arial;
    font-weight: 400;
    font-style: normal;
    padding:.22rem 0 .12rem;
  }

  .openPhase{
    font-weight: 400;
    font-style: normal;
    font-size: .4rem;
    color: #BCBCBC;
    font-family: '微軟正黑體 Regular', '微軟正黑體';
  }
  
  .openNum{
    font-family: 'Arial Rounded MT Bold', 'Arial Rounded MT';
    font-weight: 700;
    font-style: normal;
    font-size: .7rem;
    color: #FF9900;
  }

  .Company{
    font-family: "Arial Normal", Arial;
    font-weight: 400;
    font-style: normal;
    font-size: .4rem;
    color: #BCBCBC;
    padding:.05rem 0 .25rem ;
  }

  

  .display_ib{
  display: inline-block;
}
  .vertical_top{
  vertical-align: top;
}

  .ukey{
    text-align:center;
    color:#BCBCBC;
    font-size:.4rem;
    font-family: "Arial Normal", Arial;
    font-weight: 400;
    font-style: 700;
    line-height: 1.2rem;
  }
  

  .bettingBtn{
    display: flex;
    box-sizing:border-box;
    padding: 0 .8rem;
    padding-bottom:1rem;
    box-shadow: 0px 0.08rem 0.08rem rgba(0, 0, 0, 0.349019607843137);
  }
  .btn1, .btn2{
    flex:1 1;
    font-size:.45rem;
    border:.02rem solid  rgba(255,255,255,0.3);
    color:#FF9900;
    text-align:center;
    border-radius:.1rem;
    line-height:1.2rem;
  }
  .btn1{
    margin-right: .3rem;
  }
  
  .btns{
    display:flex;
    text-align:center;
    box-sizing:border-box;
    padding:0 .12rem;
    font-size:.45rem;
    font-family: '微軟正黑體 Regular', '微軟正黑體';
    font-weight: 400;
    font-style: normal;
    color: #5E5E5E;
    line-height:1.5rem;
    padding-top: .2rem;
  }
  .btns .active{
    background-color: rgba(27, 27, 27, 1);
    color: #FF9900;
   }
  .all, .my{
    flex:1 1;
    background-color: #343434;
    border-top-left-radius: .2rem;
    border-top-right-radius: .2rem;
  } 
  
  .allList, .myList{
      background-color:#1b1b1b;
      height:10.5rem;
      overflow-y:scroll;
 
  }
  // .allList p, .myList p{
  //     text-align:center;
  //     line-height: 1.5rem;
  //     font-size:.44rem;
  //     font-family: '微軟正黑體 Regular', '微軟正黑體';
  //     font-weight: 400;
  //     font-style: normal;
  // }
  .allList p, .myList p{
      display:flex;
      flex-wrap:nowrap;
      align-items:center;
      justify-content:space-between;
      padding:0 0.35rem 0 0.35rem;
      height:1.1rem;
      font-family: '微軟正黑體 Regular', '微軟正黑體';
      font-size:0.42rem;

  }
  .allList p span:nth-child(1), .myList p span:nth-child(1){
     color:#BCBCBC;
  
    
  }
  .allList p span:nth-child(2), .myList p span:nth-child(2){
     color:#BCBCBC;

  }
  .allList p span:nth-child(3), .myList p span:nth-child(3){
     color:#BCBCBC;
 
  }
  .allList{
  
  }
  .allList p img, .myList p img{
    vertical-align: middle;
    width:.5rem;
    height:.5rem;
  }

  .my_toast{
    top:50%;
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
.p_A{
  font-family: "Arial Normal", Arial;
}   
.font_five{
  font-size: .4rem;
}
.orange{
  color: rgba(255, 153, 51, 1);
}


/* 下拉键盘 */
// .slide-enter-active, .slide-leave-active {
//   transition: all .8s;
// }
// .slide-enter, .slide-leave-to{
//   transform: translateY(100%);
// }
// .keyboard {
//   height: 500px;
//   width: 100%;
//   position: fixed;
//   bottom: 0;
//   left: 0;
//   z-index: 10000;
//   font-size: 50px;
//   background-color: #fff;
// }
// .list_row {
//   display: flex;
//   height: 20%;
// }
// .key {
//   flex: 1;
//   border-right: 1PX solid #d6d6d6;
//   border-top: 1PX solid #d6d6d6;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// }
// .key img {
//   height: 60px;
// }
// .key:nth-child(3n) {
//   border-right: none;
// }
// .del {
//   font-size: 50px;
// }


//键盘样式
.keyboardBox{
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
.keyboard{
  flex:1;
  display: flex;
  align-items:center;
  justify-content: center;
  flex-direction: column;
  width:100%;
  margin:0 10%;
  // background-color:#fff;
  z-index: 101;
}

.keyboard .top{
  height:7.5rem;
  width:100%;
  border-radius: .15rem;
  padding:.7rem;
  background-color: rgba(40, 40, 40, 0.909803921568627);
  box-sizing:border-box;
}
.top .numbers{
  border:1px solid rgba(107, 107, 107, 1);
  color:#E4E4E4;
  font-family: 'Arial Normal', 'Arial';
  font-size:.5rem;
  font-weight:400;
  
}
.top .numbers .rows{
  display:flex;

}
.top .numbers .rows{
  display:flex;
  align-items:center;
  justify-content:center;
  text-align:center;
  line-height:1.65rem;
}
.top .numbers .rows:nth-child(1) .col{
  flex:1;
  border-right:1px solid  rgba(107, 107, 107, 1);
  border-bottom:1px solid  rgba(107, 107, 107, 1);
}
.top .numbers .rows:nth-child(1) .col:nth-child(4){
  border-right:0;
}
.top .numbers .rows:nth-child(2) .col{
  flex:1;
  border-right:1px solid  rgba(107, 107, 107, 1);
  border-bottom:1px solid  rgba(107, 107, 107, 1);
}
.top .numbers .rows:nth-child(2) .col:nth-child(4){
  border-right:0;
}
.top .numbers .rows:nth-child(3) .col:nth-child(1), .top .numbers .rows:nth-child(3) .col:nth-child(2){
   flex:1;
   border-right:1px solid rgba(107, 107, 107, 1);
}
.top .numbers .rows:nth-child(3) .col:nth-child(3){
  flex:2;
}
.numberClose{
  margin:0 auto;
  height:.7rem;
  line-height:.7rem;
  width: 1.2rem;
  font-size:.45rem;
  color:#fff;
  background-color:#FF9900;
  position:relative;
  left:6px;
}
.numberClose span{
  display:block;
  width:0;
  height:0;
  border-width: 0.36rem 0.4rem 0.36rem 0;
  border-style:solid;
  border-color:transparent #FF9900 transparent transparent;/*透明 黄 透明 透明 */
  position:absolute;
  top:0px;
  left:-0.36rem;
}
.inputNumbers{
  display:flex;
  padding-top:.4rem;
  font-size:.6rem;
  color:#fff;
  justify-content: center;
  align-items: center;
}
.inputNumbers p{
  flex:1;
  text-align: center;
  border-bottom:1px solid #fff;
  box-sizing: border-box;
  color:#FF9900;
  margin: 0 3px;
  padding-bottom:.1rem;
}
.inputNumbers div{
  flex:2;
  display:flex;
  justify-content: center;
  align-items: center;
  padding-left: 5px;
}
.middle{
  width:100%;
  margin-top:.8rem;
  display:flex;
  color:#fff;
  align-items: center;
  justify-content:center;
  text-align:center;
}
.inputBetting, .UeBetting{
  flex:1;
  background-color:rgba(54, 54, 54, 1);
  border-radius: 5px;
  height:1.1rem;
  font-family: 'Arial Normal', 'Arial';
  line-height:1.1rem;
  font-size:.5rem;
}
.inputBetting{
  margin-right:.5rem;
  display:flex;
  border-radius: 8px;
}
.inputBetting span:nth-child(1){
  flex:2;
  background-color: rgba(67, 67, 67, 1);
  border-bottom-left-radius: 8px;
  border-top-left-radius: 8px;
}
.inputBetting span:nth-child(2){
  flex:3;
  color: #FF9900;
}
.inputBetting span:nth-child(3){
  flex:2;
  background-color: rgba(67, 67, 67, 1);
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  color: #FF9900;
}
.UeBetting{
  border-radius:8px;
}


.keyboard .bottom{
    display:flex;
    margin-top:.5rem;
    width:100%;
    height:1.3rem;
    line-height:1.3rem;
    font-family: '微軟正黑體 Regular', '微軟正黑體';
    font-size:.5rem;
    color:#fff;
    align-items:center;
    justify-content:center;
    text-align: center;
}
.bottom .cancel{
    flex:3;
    margin-right:.3rem;
    background-color: rgba(148, 148, 148, 1);
    box-shadow: 0px 1px 10px rgba(201, 201, 201, 0.349019607843137);
    border-radius: 8px;
}
.bottom .betting{
    flex:7;
    background-color: rgba(107, 107, 107, 1);
    box-shadow: 0px 1px 10px rgba(201, 201, 201, 0.349019607843137);
    border-radius: 8px;
}

</style> 
