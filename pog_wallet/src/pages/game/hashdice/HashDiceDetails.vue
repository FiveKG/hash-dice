<template>
    <vpage >
     <slot>
       <div style="background-color: rgb(40,40,40);width:100%;height:100%;">
        <div class="head" style="background: rgb(27,27,27);">
          <div class="float_left box"><img  class="ion_tbg" src="@/assets/img/u14.png" @click="back"></div>
          <p class="float_left font_four" style="margin: 0.45rem 0 .45rem 0;color: #FFFFFF;">投注详情</p>
          <div class="float_right" style=" width: 2.5rem;height: .8rem;border: 1px solid rgb(100, 100, 100);margin: 0.36rem 0.6rem 0.25rem 0px;border-radius: 30px;">
            <div class="display_ib" style="width: 49.5%;height: 100%;vertical-align: top;"><img @click="actionSheetVisible = true" style="width: 50%;height: 65%;margin: 11% 0px 0px 25%;" src="@/assets/img/assembly_ic_option@2x.png"></div>
            <div class="display_ib" style="width: 1%;height: 70%;background: rgb(100,100,100);vertical-align: top;margin-top: 5%;"></div>
            <div class="display_ib" style="width: 49.5%;height: 100%;vertical-align: top;"><img @click="back" src="@/assets/img/assembly_close_ic@2x.png" style="width: 55%;height: 80%;margin: 6% 0 0 21%;"></div>
          </div>
        </div>
         <!-- 投注详情        -->
        <div v-if="twenty==1" class="font_four" style="width: 80%;margin:20px 10% 0 10%">
          <p class="p_A">时间：{{items.create_time}}</p>
          <p class="p_A">投注区块编号：{{items.bet_block_num}}</p>
          <p class="p_A">开奖区块编号：{{items.reward_block_num}}（投注区块编号+7）</p>
          <p class="p_A ">开奖区块ID：</p>
          <p class="p_A">{{items.reward_block_id}}<span class="orange">2</span>cc<span class="orange">3</span></p>
          <div style="width: 100%;height: 10px;"></div>
          <p class="p_A">开奖数字：<span class="orange">{{items.reward_num}}</span></p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">投注内容：小于 {{items.bet_num}}</p>
          <p class="p_A">投注金额：{{items.bet_amount}} UE</p>
          <p class="p_A">赔率: {{items.odds_rate}}</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">中奖金额：<span class="orange">{{items.bonus}} UE</span></p>
        </div>
        <!-- 投注详情代投 -->
        <div v-if="twenty==2" class="font_four" style="width: 80%;margin:20px 10% 0 10%">
          <p class="p_A">时间：{{items.create_time}}</p>
          <p class="p_A">投注区块编号：{{items.bet_block_num}}</p>
          <p class="p_A">开奖区块编号：{{items.reward_block_num}}（投注区块编号+7）</p>
          <p class="p_A ">开奖区块ID：</p>
          <p class="p_A">{{items.reward_block_id}}<span class="orange">2</span>cc<span class="orange">3</span></p>
          <div style="width: 100%;height: 10px;"></div>
          <p class="p_A">开奖数字：<span class="orange">{{items.reward_num}}</span></p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">投注内容：小于 {{items.bet_num}}</p>
          <p class="p_A">投注金额：{{items.bet_amount}} UE</p>
          <p class="p_A Centered">使用游戏筹码投注</p>
          <p class="p_A">代投账号：{{items.agent_account}}</p>
          <p class="p_A">赔率: {{items.odds_rate}}</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">中奖金额：<span class="orange">{{items.bonus}} UE</span></p>
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

       </div>  
     </slot>
    </vpage>
    
</template>

<script>
import MyPage from '@/components/MyPage'
import api from '@/pages/game/hashdice/game'

export default {
  components: {
    vpage: MyPage,
   },
  data() {
    return {
      actionSheetVisible: false,   //下拉框
      twenty:1,  //模式选择
      items:[]
    }
  },
  methods: {
       back() {
          this.$router.go(-1)
       },
       jumpHashDiceRule() {
         this.$router.push({
          name: 'HashDiceRule',
        })
       },
  },
  created(){
    // console.log('this',this);    
    api.getSomeUserBettingListBetting({id:this.$route.params.id}).then(res => {
        if (res.code === 1) {
            this.items=res.data
            if(this.items.agent_account==null){
              this.twenty=1  
            }else{
              this.twenty=2
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
.div_layout{

}
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
  font-family: "Arial Normal", Arial;
}   



</style>