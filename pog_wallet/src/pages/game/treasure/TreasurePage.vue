<template>
    <vpage >
     <slot>
       <div style="background-color: rgb(40,40,40);height:100%;width:100%;">
        <div class="head" style="background: rgb(27,27,27);">
          <div class="float_left box"><img  class="ion_tbg" src="@/assets/invitation2/u3.png"></div>
          <p class="float_left orange" style="font-size: .5rem;margin: 0.45rem 0 .45rem 0;">夺宝</p>
          <div class="float_right" style="width: 3rem;height: 1rem;border: 1px solid rgb(100,100,100);margin: .25rem .6rem .25rem 0;border-radius: 6px;">
            <div class="display_ib" style="width: 49.5%;height: 100%;vertical-align: top;"><img @click="actionSheetVisible = true" style="width: 50%;height: 27%;margin: 25% 0px 0px 25%;" src="@/assets/invitation2/u8.png"></div>
            <div class="display_ib" style="width: 1%;height: 70%;background: rgb(100,100,100);vertical-align: top;margin-top: 5%;"></div>
            <div class="display_ib" style="width: 49.5%;height: 100%;vertical-align: top;"><img @click="back" src="../../../assets/img/u102.png" style="width: 55%;height: 80%;margin: 6% 0 0 21%;"></div>
          </div>
        </div>
        <!-- 区块滚动 -->
        <div class="recording"   >
            <transition-group name="scroll" >
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
            <div class="display_ib" style="width:33.3%;height:1.1rem;"><p @click="selectTwenty(1)" :class="{orange:twenty==1}" class=" font_five" style="line-height:1.1rem;text-align: center;">20x0.1</p></div>
            <div class="display_ib" style="width:33.3%;height:1.1rem;"><p @click="selectTwenty(2)" :class="{orange:twenty==2}" class=" font_five" style="line-height:1.1rem;text-align: center;">20x0.5</p></div>
            <div class="display_ib" style="width:33.3%;height:1.1rem;"><p @click="selectTwenty(3)" :class="{orange:twenty==3}" class=" font_five" style="line-height:1.1rem;text-align: center;">100x0.1</p></div>
          </div>
          <div style="width:100%;height:.15rem;background: rgb(27, 27, 27);"></div>
        </div>
        <div style="width: 100%;">
        <div style="width: 80%;height: 3.4rem;border: 1px solid rgb(100,100,100);margin: 1rem auto .5rem auto;border-radius: 7px;position: relative;box-shadow: 5px 5px 5px rgba(94, 94, 94, 0.349019607843137);">
          <div style=" position: absolute;width: 50%;height: 1rem;background-color: rgb(40,40,40);right: 25%;top: -15%;">
            <p class="" style=" line-height: 1rem;text-align: center;font-size: .6rem;font-weight: 700;">夺宝 20x0.1</p>
          </div>
            <p class="Centered font_four p_A" style="margin: 25px auto 8px auto;"># 166 期</p>
            <div class="schedule_white"><div class="schedule_orange" :style="{ width: 80 + '%' }"></div></div>
            <div style="width:100%;margin-top:.3rem;">
              <div class="display_ib" style="width:33.3%;height:1.1rem;"><p class=" font_four" style="text-align: center;">18 Key</p><p class=" font_four" style="text-align: center;">已投</p></div>
              <div class="display_ib" style="width:33.3%;height:1.1rem;"><p class=" font_four" style="text-align: center;">18 Key</p><p class=" font_four" style="text-align: center;">总需</p></div>
              <div class="display_ib" style="width:33.3%;height:1.1rem;"><p class=" font_four" style="text-align: center;">18 Key</p><p class=" font_four" style="text-align: center;">剩余</p></div>
            </div>
        </div>
        <div style="width: 80%;height: 1rem;margin: 0 auto;border-radius: 5px;background: rgb(54,54,54);">
          <div class="display_ib vertical_top" style="width:1rem;height:1rem;"><img style="width:50%;height:50%;margin: 25% 25%;" src="@/assets/invitation2/u7.png"></div>
          <div class="display_ib vertical_top" style="width:1rem;height:1rem;background:rgb(67,67,67);"><p class=" font_five" style="line-height:1rem;text-align: center;">-</p></div>
          <div class="display_ib vertical_top" style="width:1.8rem;height:1rem;"><p class=" font_five orange" style="line-height:1rem;text-align: center;">1</p></div>
          <div class="display_ib vertical_top" style="width:1rem;height:1rem;background:rgb(67,67,67);"><p class=" font_five orange" style="line-height:1rem;text-align: center;">+</p></div>
          <div class="display_ib vertical_top" style="width:3rem;height:1rem;"><p class=" font_five" style="line-height:1rem;text-align: center;color: #E4E4E4;">@ 1 UE</p></div>
        </div>
        <p class="Centered font_four p_A" style="margin:8px auto;">1 key = 0.1 UE</p>
        <div style="width: 80%;height: 1.4rem;border: 1px solid rgba(255, 153, 51, 1);margin:0 auto;border-radius: 7px;"><p class="Centered orange font_five" style="line-height: 1.4rem;">投注</p></div>
        <p class="Centered p_A" style="font-size: .35rem;margin:15px auto;color: #949494;">若投注超出本期可投数量，超出部分将自动投注下期</p>
        <p></p>
        </div>
        <div style="width: 100%;background: rgb(27, 27, 27);height: 8rem;">
          <div style="width:100%;height:1.4rem;">
            <div class="display_ib" :class="{gray:!allMy}" @click="selectAllMy(true)" style="width:50%;height:1.4rem;line-height: .7rem;"><p  style="text-align: center;font-size: .45rem;">全部</p><p  style="text-align: center;font-size: .45rem;">20x0.1</p></div>
            <div class="display_ib" :class="{gray:allMy}" @click="selectAllMy(false)" style="width:50%;height:1.4rem;line-height: .7rem;"><p  style="text-align: center;font-size: .45rem;">我的</p><p  style="text-align: center;font-size: .45rem;">20x0.1</p></div>
          </div>
          <div v-if="allMy">
            <div style="" v-for="(item,index) in items" :key='index'>
              <div style="width:100%;height:1.1rem;">
                <div class="display_ib vertical_top" style="width:33.3%;height:1.1rem;"><p  style="font-size: .45rem;line-height:1.1rem;text-align: center;">{{item.a}}</p></div>
                <div class="display_ib vertical_top" style="width:40%;height:1.1rem;"><p  style="font-size: .45rem;line-height:1.1rem;text-align: center;">{{item.b}}</p></div>
                <div class="display_ib vertical_top" style="width:22%;margin-left: 4%;height:1.1rem;">
                  <div class="display_ib vertical_top"><p style="font-size: .45rem;line-height:1.1rem;text-align: center;">{{item.key}} key</p></div>
                  <div class="display_ib"><img style="width: .5rem;height: 0.5rem;margin: .35rem .2rem;" src="@/assets/img/invitation_profitarrow.png"></div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="!allMy">
            <div style="" v-for="(item,index) in itemss" :key='index'>
              <div style="width:100%;height:1.1rem;">
                <div class="display_ib vertical_top" style="width:33.3%;height:1.1rem;"><p  style="font-size: .45rem;line-height:1.1rem;text-align: center;">{{item.a}}</p></div>
                <div class="display_ib vertical_top" style="width:40%;height:1.1rem;"><p  style="font-size: .45rem;line-height:1.1rem;text-align: center;">{{item.b}}</p></div>
                <div class="display_ib vertical_top" style="width:22%;margin-left: 4%;height:1.1rem;"><img style="width: .5rem;height: 0.5rem;margin: .35rem 0 .35rem 50%;" src="@/assets/img/invitation_profitarrow.png"></div>
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


       </div>
     </slot>
    </vpage>
    
</template>

<script>
import MyPage from '@/components/MyPage'
import { format, parse } from 'date-fns'
import {Decimal} from 'decimal.js'

//滚动区域
import ClientSocket from '@/socket/scrollClientSocket'


export default {
  components: {
    vpage: MyPage,
   },
  data() {
    return {
      treasureKey:1,  //滚动KEY
      twenty:1,      //模式选择  20*0.1为1  20*0.5为2  100*0.1为3
      allMy:true,   //区分我的 全部
      actionSheetVisible: false,   //下拉框
      betSuccess:false,        //成功显示
      betFailure:false,        //失败显示
      publicData:[   //公用界面数据

      ],
      publicAll:[    //公用全部

      ],
      publicMy:[    //公用我的

      ],   
      items:[    // 滚动
              // {timestamp:"15:23:02.0",block_num:33283278,
              //   id:'...'+"F7B195473D4F09BC8F1",treasureKey:1
              //   }
      ],   
        
    }
  },
  methods: {
       back() {
          this.$router.go(-2)
       },
       selectTwenty(index) {
         this.twenty=index;
       },
       selectAllMy(index) {
         this.allMy=index;
       },
       jumpTreasureRule() {
         this.$router.push({
          name: 'TreasureRule',
        })
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
                id:'...'+this.$store.state.wallet.block.id.slice(45),treasureKey:this.treasureKey});
                this.items.splice(10);

            }
        },
    },
  created(){
    // console.log('this',this);
    //滚动区域
    this.initSocket();
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



</style>