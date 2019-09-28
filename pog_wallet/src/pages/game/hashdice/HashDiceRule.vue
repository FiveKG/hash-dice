<template>
    <vpage >
     <slot>
       <div style="background-color: rgb(40,40,40);width:100%;">
        <div class="head" style="background: rgb(27,27,27);">
          <div class="float_left box"><img  class="ion_tbg" src="@/assets/img/u14.png" @click="back"></div>
          <p class="float_left font_four" style="margin: 0.45rem 0 .45rem 0;color: #FFFFFF;">规则</p>
          <div class="float_right" style=" width: 2.5rem;height: .8rem;border: 1px solid rgb(100, 100, 100);margin: 0.36rem 0.6rem 0.25rem 0px;border-radius: 30px;">
            <div class="display_ib" style="width: 49.5%;height: 100%;vertical-align: top;"><img @click="actionSheetVisible = true" style="width: 50%;height: 65%;margin: 11% 0px 0px 25%;" src="@/assets/img/assembly_ic_option@2x.png"></div>
            <div class="display_ib" style="width: 1%;height: 70%;background: rgb(100,100,100);vertical-align: top;margin-top: 5%;"></div>
            <div class="display_ib" style="width: 49.5%;height: 100%;vertical-align: top;"><img @click="back" src="@/assets/img/assembly_close_ic@2x.png" style="width: 55%;height: 80%;margin: 6% 0 0 21%;"></div>
          </div>
        </div>

        <div class="font_four" style="width: 90%;margin:20px 5% 0 5%">
          <p class=" orange">哈希骰子规则：</p>
          <div style="width: 100%;height: 20px;"></div>
          <div style="width:100%;">
            <div class="display_ib vertical_top" style="width:8%;"><p>1 .</p></div>
            <div class="display_ib" style="width:88%;"><p>当选择【小于】时，玩家选择一个数字，当游戏结果小于这个数字时，玩家赢得游戏；</p></div>
          </div>
          <div style="width: 100%;height: 10px;"></div>
          <div style="width:100%;">
            <div class="display_ib vertical_top" style="width:8%;"><p>2 .</p></div>
            <div class="display_ib" style="width:88%;"><p>当玩家选择【大】时，游戏结果为50-99且不是对子时，玩家赢得游戏；</p></div>
          </div>
          <div style="width: 100%;height: 10px;"></div>
          <div style="width:100%;">
            <div class="display_ib vertical_top" style="width:8%;"><p>3 .</p></div>
            <div class="display_ib" style="width:88%;"><p>当玩家选择【对子】时，游戏结果为对子时如：00.11.22.33.44.55.66.77.88.99，玩家赢得游戏；</p></div>
          </div>
          <div style="width: 100%;height: 10px;"></div>
          <div style="width:100%;">
            <div class="display_ib vertical_top" style="width:8%;"><p>4 .</p></div>
            <div class="display_ib" style="width:88%;"><p>当玩家选择【小】时，游戏结果为0-49且不是对子时，玩家赢得游戏；</p></div>
          </div>         
          <div style="width: 100%;height: 10px;"></div>
          <div style="width:100%;">
            <div class="display_ib vertical_top" style="width:8%;"><p>5 .</p></div>
            <div class="display_ib" style="width:88%;"><p>根据玩家选项的不同，中奖概率和赔率也会有相应的变化。</p></div>
          </div>         
          <div style="width: 100%;height: 35px;"></div>
          <p class=" orange">开奖方法</p>
          <div style="width: 100%;height: 15px;"></div>
          <p class="orange">我们以区块ID作为开奖依据，区块ID无法预知、预设、修改，随时可进行查询，作为开奖依据,完全公正、公平、透明及可信。</p>
          <div style="width: 100%;height: 20px;"></div>
          <div style="width:100%;">
            <div class="display_ib vertical_top" style="width:8%;"><p>1 .</p></div>
            <div class="display_ib" style="width:88%;"><p>玩家投注的交易记录所在的区块为【投注区块】，其区块编号为【投注编号】，在这个区块编号向后的第7个区块为【开奖区块】，其区块ID为【开奖ID】，末尾去除字母后的两个数字为游戏结果</p></div>
            <div class="display_ib" style="width:88%;margin-left:8%"><p class="orange">例：投注区块编号为：53283270，则开奖区块编号为：53283277=53283270+7</p></div>
          </div>
          <div style="width: 100%;height: 10px;"></div>
          <div style="width:100%;">
            <div class="display_ib vertical_top" style="width:8%;"><p>2 .</p></div>
            <div class="display_ib" style="width:88%;"><p>区块ID的末尾两个数字（非数字则跳过）为-开奖数字，如下则开奖数字为23 5eea2b24e5f3219c......40dcb331322<span class="orange">2</span>cc<span class="orange">3</span></p></div>
          </div>
          <div style="width: 100%;height: 35px;"></div>
          <p class=" orange">投注限额：</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class=" ">游戏以娱乐为主，不希望大额投注，我们设置了每次的双重投注限额：</p>
          <div style="width:100%;">
            <div class="display_ib vertical_top" style="width:8%;"><p>1 .</p></div>
            <div class="display_ib" style="width:88%;"><p>按1次游戏最高可获1000UE奖金为限，根据游戏选项的赔率不同，会得出不同的投注限额。</p></div>
          </div>
          <div style="width: 100%;height: 10px;"></div>
          <div style="width:100%;">
            <div class="display_ib vertical_top" style="width:8%;"><p>2 .</p></div>
            <div class="display_ib" style="width:88%;"><p>-按每次游戏最高投注不超过100UE为限；</p></div>
          </div>
          <div style="width: 100%;height: 35px;"></div>
          <p class=" orange">TBG 分配：</p>
          <div style="width: 100%;height: 20px;"></div>
          <div style="width:100%;">
            <div class="display_ib vertical_top" style="width:8%;"><p>1 .</p></div>
            <div class="display_ib" style="width:88%;"><p>每次投注的0.1% 拨入 TBG 股东分红池；</p></div>
          </div>
          <div style="width: 100%;height: 10px;"></div>
          <div style="width:100%;">
            <div class="display_ib vertical_top" style="width:8%;"><p>2 .</p></div>
            <div class="display_ib" style="width:88%;"><p>-每次投注的0.1% 拨入 TBG 三倍收益保障池；</p></div>
          </div>
          <div style="width: 100%;height: 10px;"></div>
          <div style="width:100%;">
            <div class="display_ib vertical_top" style="width:8%;"><p>3 .</p></div>
            <div class="display_ib" style="width:88%;"><p>3、每次投注的0.3% 拨入 TBG 共享推荐佣金分配。</p></div>
          </div>
          <div style="width: 100%;height: 25px;"></div>
          <p class="orange">TBG 推荐关系适用 TBG 旗下所有游戏和应用</p>
          <div style="width: 100%;height: 60px;"></div>

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
       jumpHashDiceRule() {
         this.$router.push({
          name: 'HashDiceRule',
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