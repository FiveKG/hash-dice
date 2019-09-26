<template>
    <vpage >
     <slot>
       <div style="background-color: rgb(40,40,40);height:auto;width:100%;">
        <div class="head" style="background: rgb(27,27,27);">
          <div class="float_left box"><img  class="ion_tbg" src="@/assets/img/u14.png" @click="back"></div>
          <p class="float_left font_four" style="margin: 0.45rem 0 .45rem 0;color: #FFFFFF;">投注详情</p>
          <div class="float_right" style="width: 3rem;height: 1rem;border: 1px solid rgb(100,100,100);margin: .25rem .6rem .25rem 0;border-radius: 6px;">
            <div class="display_ib" style="width: 49.5%;height: 100%;vertical-align: top;"><img @click="actionSheetVisible = true" style="width: 50%;height: 27%;margin: 25% 0px 0px 25%;" src="@/assets/invitation2/u8.png"></div>
            <div class="display_ib" style="width: 1%;height: 70%;background: rgb(100,100,100);vertical-align: top;margin-top: 5%;"></div>
            <div class="display_ib" style="width: 49.5%;height: 100%;vertical-align: top;"><img @click="back" src="../../../assets/img/u102.png" style="width: 55%;height: 80%;margin: 6% 0 0 21%;"></div>
          </div>
        </div>
        <!-- 投注详情-待开奖   1   -->
        <div v-if="pageMode==1" class="font_four" style="width: 80%;margin:20px 10% 0 10%">
          <p class="p_A orange">{{items.game_name}}</p>
          <p class="p_A">本期：第 {{items.periods}} 期</p>
          <p class="p_A">共需 {{items.total_key}}Key，{{items.quantity}}，共 {{items.total_amount}}UE</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">已投注 18Key</p>
          <p class="p_A orange">待开奖</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">投注数量 ：{{items.bet_key}}Key</p>
          <p class="p_A">投注金额 ：{{items.bet_amount}}UE</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">夺宝投注幸运码：</p>
          <div style="width: 100%;height: 20px;"></div>
          <div style="word-break:break-word;"><p class="p_A"><span  style="margin-right: 15px;" v-for="item in items.bet_num" :key="item.key">{{item}}</span></p></div>
        </div>

        <!-- 投注详情-待开奖-代投   2   -->
        <div v-if="pageMode==2" class="font_four" style="width: 80%;margin:20px 10% 0 10%">
          <p class="p_A orange">{{items.game_name}}</p>
          <p class="p_A">本期：第 {{items.periods}} 期</p>
          <p class="p_A">共需 {{items.total_key}}Key，{{items.quantity}}，共 {{items.total_amount}}UE</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">已投注 18Key</p>
          <p class="p_A orange">待开奖</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">投注数量 ：{{items.bet_key}}Key</p>
          <p class="p_A">投注金额 ：{{items.bet_amount}}UE</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A Centered">使用游戏筹码投注</p>
          <p class="p_A">代投账号：{{items.agent_account}}</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">夺宝投注幸运码：</p>
          <div style="width: 100%;height: 20px;"></div>
          <div style="word-break:break-word;"><p class="p_A"><span style="margin-right: 15px;" v-for="item in items.bet_num" :key="item.key">{{item}}</span></p></div>
        </div>
        
        <!-- 投注详情-已开奖-代投--未中奖  3      -->
        <div v-if="pageMode==3" class="font_four" style="width: 80%;margin:20px 10% 0 10%">
          <p class="p_A orange">{{items.game_name}}</p>
          <p class="p_A">本期：第 {{items.periods}} 期</p>
          <p class="p_A">共需 {{items.total_key}}Key，{{items.quantity}}，共 {{items.total_amount}}UE</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">最后一位投注账号：{{items.last_bet_account}}</p>
          <div style="word-break:break-word;"><p class="p_A">交易ID :{{items.trx_id}}</p></div>
          <p class="p_A">本期：{{items.lucky_code}}</p>
          <p class="p_A">幸运数字</p>
          <p class="p_A">= (( 132244 + 165 ) / 20 ) 的余数 + 100001</p>
          <p class="p_A">= 9 + 100001 = <span class="orange p_A">{{items.constants_num}}</span></p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">投注数量 ：{{items.bet_key}}Key</p>
          <p class="p_A">投注金额 ：{{items.bet_amount}}UE</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A Centered">使用游戏筹码投注</p>
          <p class="p_A">代投账号：{{items.agent_account}}</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">夺宝投注幸运码：</p>
          <div style="width: 100%;height: 20px;"></div>
          <div style="word-break:break-word;"><p class="p_A"><span style="margin-right: 15px;" v-for="item in items.bet_num" :key="item.key">{{item}}</span></p></div>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">未中奖</p>
        </div>

        <!-- 投注详情-已开奖-代投--中奖   4      -->
        <div v-if="pageMode==4" class="font_four" style="width: 80%;margin:20px 10% 0 10%">
          <p class="p_A orange">{{items.game_name}}</p>
          <p class="p_A">本期：第 {{items.periods}} 期</p>
          <p class="p_A">共需 {{items.total_key}}Key，{{items.quantity}}，共 {{items.total_amount}}UE</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">最后一位投注账号：{{items.last_bet_account}}</p>
          <div style="word-break:break-word;"><p class="p_A">交易ID :{{items.trx_id}}</p></div>
          <p class="p_A">本期：{{items.lucky_code}}</p>
          <p class="p_A">幸运数字</p>
          <p class="p_A">= (( 132244 + 165 ) / 20 ) 的余数 + 100001</p>
          <p class="p_A">= 9 + 100001 = <span class="orange p_A">{{items.constants_num}}</span></p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">投注数量 ：{{items.bet_key}}Key</p>
          <p class="p_A">投注金额 ：{{items.bet_amount}}UE</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A Centered">使用游戏筹码投注</p>
          <p class="p_A">代投账号：{{items.agent_account}}</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">夺宝投注幸运码：</p>
          <div style="width: 100%;height: 20px;"></div>
          <div style="word-break:break-word;"><p class="p_A"><span style="margin-right: 15px;" v-for="item in items.bet_num" :key="item.key">{{item}}</span></p></div>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">中奖，共派奖：1.8000 UE</p>
          <p class="p_A">其中：1.6000 UE + 0.2000 游戏筹码</p>
        </div>

        <!-- 投注详情-已开奖-未中奖   5  -->
        <div v-if="pageMode==5" class="font_four" style="width: 80%;margin:20px 10% 0 10%">
          <p class="p_A orange">{{items.game_name}}</p>
          <p class="p_A">本期：第 {{items.periods}} 期</p>
          <p class="p_A">共需 {{items.total_key}}Key，{{items.quantity}}，共 {{items.total_amount}}UE</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">最后一位投注账号：{{items.last_bet_account}}</p>
          <div style="word-break:break-word;"><p class="p_A">交易ID :{{items.trx_id}}</p></div>
          <p class="p_A">本期：{{items.lucky_code}}</p>
          <p class="p_A">幸运数字</p>
          <p class="p_A">= (( 132244 + 165 ) / 20 ) 的余数 + 100001</p>
          <p class="p_A">= 9 + 100001 = <span class="orange p_A">{{items.constants_num}}</span></p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">投注数量 ：{{items.bet_key}}Key</p>
          <p class="p_A">投注金额 ：{{items.bet_amount}}UE</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">夺宝投注幸运码：</p>
          <div style="width: 100%;height: 20px;"></div>
          <div style="word-break:break-word;"><p class="p_A"><span style="margin-right: 15px;"  v-for="item in items.bet_num" :key="item.key">{{item}}</span></p></div>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">未中奖</p>
        </div>

        <!-- 投注详情-已开奖-已中奖  6    -->
        <div v-if="pageMode==6" class="font_four" style="width: 80%;margin:20px 10% 0 10%">
          <p class="p_A orange">{{items.game_name}}</p>
          <p class="p_A">本期：第 {{items.periods}} 期</p>
          <p class="p_A">共需 {{items.total_key}}Key，{{items.quantity}}，共 {{items.total_amount}}UE</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">最后一位投注账号：{{items.last_bet_account}}</p>
          <div style="word-break:break-word;"><p class="p_A">交易ID :{{items.trx_id}}</p></div>
          <p class="p_A">本期：{{items.lucky_code}}</p>
          <p class="p_A">幸运数字</p>
          <p class="p_A">= (( 132244 + 165 ) / 20 ) 的余数 + 100001</p>
          <p class="p_A">= 9 + 100001 = <span class="orange p_A">{{items.constants_num}}</span></p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">投注数量 ：{{items.bet_key}}Key</p>
          <p class="p_A">投注金额 ：{{items.bet_amount}}UE</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">夺宝投注幸运码：</p>
          <div style="width: 100%;height: 20px;"></div>
          <div style="word-break:break-word;"><p class="p_A"><span style="margin-right: 15px;" v-for="item in items.bet_num" :key="item.key">{{item}}</span></p></div>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">中奖，共派奖：1.8000 UE</p>
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

       </div>  
     </slot>
    </vpage>
    
</template>

<script>
import MyPage from '@/components/MyPage'
import api from '@/pages/game/treasure/game'

export default {
  components: {
    vpage: MyPage,
   },
  data() {
    return {
      account_name:'',
      pageMode:1,
      actionSheetVisible: false,   //下拉框
      items:{}   //数据
    }
  },
  methods: {
       back() {
          this.$router.go(-1)
       },
       jumpTreasureRule() {
         this.$router.push({
          name: 'TreasureRule',
        })
       }, 
  },
  created(){
    // console.log('this',this);
      this.account_name=this.$store.state.wallet.assets.account;
      api.getSomeUserBettingData({game_id:this.$route.params.game_id,periods:this.$route.params.periods,account_name:this.account_name}).then(res => {
        console.log(res)
      if (res.code === 1) {     
          if(res.data.last_bet_account==null){          //未开奖
            if(res.data.agent_account==null){          //未代投         
              this.pageMode=1;this.items=res.data;this.items.bet_num=this.items.bet_num.split(',')     
            }else{
              this.pageMode=2;this.items=res.data;this.items.bet_num=this.items.bet_num.split(',')      //代投
            }
          }else{              //已开奖
            if(res.data.agent_account==null){      //   未代投      
              if(res.data.bonus_amount==null){    //未中奖
                this.pageMode=5;this.items=res.data;this.items.bet_num=this.items.bet_num.split(',')     
              }else{                             //中奖
                this.pageMode=6;this.items=res.data;this.items.bet_num=this.items.bet_num.split(',')     
              }
            }else{                                  //代投
               if(res.data.bonus_amount==null){    //未中奖
                this.pageMode=3;this.items=res.data;this.items.bet_num=this.items.bet_num.split(',')     
              }else{                             //中奖
                this.pageMode=4;this.items=res.data;this.items.bet_num=this.items.bet_num.split(',')     
              }
            }
          }       
        }
    })
  
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
  width: 80%;
  height:80%;
  padding: 10% 10%;
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
  font-size: .45rem;
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



</style>