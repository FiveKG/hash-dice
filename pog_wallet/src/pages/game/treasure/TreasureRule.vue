<template>
    <vpage >
     <slot>
       <div style="background-color: rgb(40,40,40);width:100%;">
        <div class="head" style="background: rgb(27,27,27);">
          <div class="float_left box"><img  class="ion_tbg" src="@/assets/img/u14.png" @click="back"></div>
          <p class="float_left font_four" style="margin: 0.45rem 0 .45rem 0;color: #FFFFFF;">玩法</p>
          <div class="float_right" style="width: 3rem;height: 1rem;border: 1px solid rgb(100,100,100);margin: .25rem .6rem .25rem 0;border-radius: 6px;">
            <div class="display_ib" style="width: 49.5%;height: 100%;vertical-align: top;"><img @click="actionSheetVisible = true" style="width: 50%;height: 27%;margin: 25% 0px 0px 25%;" src="@/assets/invitation2/u8.png"></div>
            <div class="display_ib" style="width: 1%;height: 70%;background: rgb(100,100,100);vertical-align: top;margin-top: 5%;"></div>
            <div class="display_ib" style="width: 49.5%;height: 100%;vertical-align: top;"><img @click="back" src="../../../assets/img/u102.png" style="width: 55%;height: 80%;margin: 6% 0 0 21%;"></div>
          </div>
        </div>

        <div class="font_four" style="width: 90%;margin:20px 5% 0 5%">
          <p class=" orange">游戏规则</p>
          <div style="width: 1.8rem;height: 1px;background: orange;margin: 3px 0 15px 0;"></div>
          <div style="width:100%;">
            <div class="display_ib vertical_top" style="width:8%;"><p>1 .</p></div>
            <div class="display_ib" style="width:88%;"><p>游戏筹码或钱包余额均可参与夺宝游戏；</p></div>
          </div>
          <div style="width: 100%;height: 20px;"></div>
          <div style="width:100%;">
            <div class="display_ib vertical_top" style="width:8%;"><p>2 .</p></div>
            <div class="display_ib" style="width:88%;"><p>玩家可投注 1 个或多个 Key，即随机获得 1个或多个夺宝幸运码；</p></div>
          </div>
          <div style="width: 100%;height: 10px;"></div>
          <div style="width:100%;">
            <div class="display_ib vertical_top" style="width:8%;"><p>3 .</p></div>
            <div class="display_ib" style="width:88%;"><p>当夺宝专场所有 Key 都被投注后，系统会根据最后一位投注者的交易 ID 跳开字母取末尾6位数字，按求余数的算法计算出幸运数字，当持有幸运数字夺宝码的玩家即为当期的幸运者并获得奖励；</p></div>
          </div>
          <div style="width: 100%;height: 10px;"></div>
          <div style="width:100%;">
            <div class="display_ib vertical_top" style="width:8%;"><p>4 .</p></div>
            <div class="display_ib" style="width:88%;"><p>玩家获得奖金后，平台即时将奖金转入玩家的钱包中，当玩家使用TBG游戏筹码参与时，获得的奖金中投注额部分按TBG游戏筹码转回，多出部分以 UE 转入玩家的钱包中。</p></div>
          </div>         
          <div style="width: 100%;height: 35px;"></div>
          <p class=" orange">游戏规则</p>
          <div style="width: 1.8rem;height: 1px;background: orange;margin: 3px 0 15px 0;"></div>
          <p>幸运数字</p>
          <p>= ((本期最后一位投注者的交易 ID去字母取末 6 位数字 + 当期期数) / 所需 Key 数量 ) 的余数 + 100001</p>
          <div style="width: 100%;height: 35px;"></div>
          <p>如：</p>
          <p>本期最后一位投注者的交易 ID 去字母取末 6 位数字：132244</p>
          <p>5eea2b24e5f3219cb9f408......9a40dcb33<br/><span class="orange">13224</span>cc<span class="orange">4</span></p>
          <p>假设当前期数为：660 期</p>
          <p>则幸运数字</p>
          <p>= (( 132244 + 660 ) / 20 ) 的余数 + 100001</p>
          <p>= 4 + 100001 = 100005</p>
          <p>持有夺宝码为 100005 的玩家即赢得这期的奖励</p>
          <div style="width: 100%;height: 35px;"></div>
          <p class="orange">交易 ID 为 UE 公链生成，无法预知、预设、修改数据也一样无法预知，作为开奖依据，完全公正公随时可在 UE 公链进行查询，而最后一位投注者的平透明可信</p>
          <div style="width: 100%;height: 35px;"></div>
          <p class=" orange">奖金分配</p>
          <div style="width: 1.8rem;height: 1px;background: orange;margin: 3px 0 15px 0;"></div>
          <div style="width:100%;">
            <div class="display_ib vertical_top" style="width:8%;"><p>1 .</p></div>
            <div class="display_ib" style="width:88%;"><p>幸运数字持有者获得游戏奖池的 90%；</p></div>
          </div>
          <div style="width:100%;">
            <div class="display_ib vertical_top" style="width:8%;"><p>2 .</p></div>
            <div class="display_ib" style="width:88%;"><p>游戏奖池的 2% 拨入 TBG 股东分红池；</p></div>
          </div>
          <div style="width:100%;">
            <div class="display_ib vertical_top" style="width:8%;"><p>3 .</p></div>
            <div class="display_ib" style="width:88%;"><p>游戏奖池的 2% 拨入 TBG 三倍收益保障池；</p></div>
          </div>
          <div style="width:100%;">
            <div class="display_ib vertical_top" style="width:8%;"><p>4 .</p></div>
            <div class="display_ib" style="width:88%;"><p>游戏奖池的 3% 拨入 TBG 共享推荐佣金分配；</p></div>
          </div>
          <div style="width:100%;">
            <div class="display_ib vertical_top" style="width:8%;"><p>5 .</p></div>
            <div class="display_ib" style="width:88%;"><p>游戏奖池的 3% 拨入团队，作资源购买及开发运维费用支配。</p></div>
          </div>
          <div style="width: 100%;height: 35px;"></div>
          <p class=" orange">TBG 推荐关系适用 TBG 旗下所有游戏和应用</p>
          <div style="width: 100%;height: 35px;"></div>

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

export default {
  components: {
    vpage: MyPage,
   },
  data() {
    return {
      actionSheetVisible: false,   //下拉框
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
  /* font-family: "Arial Normal", Arial; */
}   
span{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
}   



</style>