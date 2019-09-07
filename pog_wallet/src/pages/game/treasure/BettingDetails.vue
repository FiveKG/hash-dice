<template>
    <vpage >
     <slot>
       <div style="background-color: rgb(40,40,40);height:100%;width:100%;">
        <div class="head" style="background: rgb(27,27,27);">
          <div class="float_left box"><img  class="ion_tbg" src="@/assets/img/u14.png"></div>
          <p class="float_left font_four" style="margin: 0.45rem 0 .45rem 0;color: #FFFFFF;">开奖详情</p>
          <div class="float_right" style="width: 3rem;height: 1rem;border: 1px solid rgb(100,100,100);margin: .25rem .6rem .25rem 0;border-radius: 6px;">
            <div class="display_ib" style="width: 49.5%;height: 100%;vertical-align: top;"><img style="width: 50%;height: 27%;margin: 25% 0px 0px 25%;" src="@/assets/invitation2/u8.png"></div>
            <div class="display_ib" style="width: 1%;height: 70%;background: rgb(100,100,100);vertical-align: top;margin-top: 5%;"></div>
            <div class="display_ib" style="width: 49.5%;height: 100%;vertical-align: top;"><img src="../../../assets/img/u102.png" style="width: 55%;height: 80%;margin: 6% 0 0 21%;"></div>
          </div>
        </div>
        <!-- 投注详情-待开奖   1   -->
        <div v-if="pageMode==1" class="font_four" style="width: 80%;margin:20px 10% 0 10%">
          <p class="p_A orange">夺宝 - 20x0.1</p>
          <p class="p_A">本期：第 166 期</p>
          <p class="p_A">共需 20Key，1Key = 0.1UE，共 2UE</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">已投注 18Key</p>
          <p class="p_A orange">待开奖</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">投注数量 ：18Key</p>
          <p class="p_A">投注数量 ：18Key</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">夺宝投注幸运码：</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A"><span>100007</span><span>100007</span></p>
        </div>

        <!-- 投注详情-待开奖-代投   2   -->
        <div v-if="pageMode==2" class="font_four" style="width: 80%;margin:20px 10% 0 10%">
          <p class="p_A orange">夺宝 - 20x0.1</p>
          <p class="p_A">本期：第 166 期</p>
          <p class="p_A">共需 20Key，1Key = 0.1UE，共 2UE</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">已投注 18Key</p>
          <p class="p_A orange">待开奖</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">投注数量 ：18Key</p>
          <p class="p_A">投注数量 ：18Key</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A Centered">使用游戏筹码投注</p>
          <p class="p_A">代投账号：snatchsnatch</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">夺宝投注幸运码：</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A"><span style="margin-right:20px">100007</span><span>100007</span></p>
        </div>
        
        <!-- 投注详情-已开奖-代投--未中奖  3      -->
        <div v-if="pageMode==3" class="font_four" style="width: 80%;margin:20px 10% 0 10%">
          <p class="p_A orange">夺宝 - 20x0.1</p>
          <p class="p_A">本期：第 166 期</p>
          <p class="p_A">共需 20Key，1Key = 0.1UE，共 2UE</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">最后一位投注账号：eoscheshieosy</p>
          <p class="p_A">交易ID：5eea2b24e5f3......40dcb33<span class="orange p_A">13224</span>cc4</p>
          <p class="p_A">本期：165</p>
          <p class="p_A">幸运数字</p>
          <p class="p_A">= (( 132244 + 165 ) / 20 ) 的余数 + 100001</p>
          <p class="p_A">= 9 + 100001 = <span class="orange p_A">10001</span></p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">投注数量 ：18Key</p>
          <p class="p_A">投注数量 ：18Key</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A Centered">使用游戏筹码投注</p>
          <p class="p_A">代投账号：snatchsnatch</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">夺宝投注幸运码：</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A"><span style="margin-right:20px">100007</span><span>100007</span></p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">未中奖</p>
        </div>

        <!-- 投注详情-已开奖-代投--中奖   4      -->
        <div v-if="pageMode==4" class="font_four" style="width: 80%;margin:20px 10% 0 10%">
          <p class="p_A orange">夺宝 - 20x0.1</p>
          <p class="p_A">本期：第 166 期</p>
          <p class="p_A">共需 20Key，1Key = 0.1UE，共 2UE</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">最后一位投注账号：eoscheshieosy</p>
          <p class="p_A">交易ID：5eea2b24e5f3......40dcb33<span class="orange p_A">13224</span>cc4</p>
          <p class="p_A">本期：165</p>
          <p class="p_A">幸运数字</p>
          <p class="p_A">= (( 132244 + 165 ) / 20 ) 的余数 + 100001</p>
          <p class="p_A">= 9 + 100001 = <span class="orange p_A">10001</span></p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">投注数量 ：18Key</p>
          <p class="p_A">投注数量 ：18Key</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A Centered">使用游戏筹码投注</p>
          <p class="p_A">代投账号：snatchsnatch</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">夺宝投注幸运码：</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A"><span style="margin-right:20px">100007</span><span class="orange">100007</span></p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">中奖，共派奖：1.8000 UE</p>
          <p class="p_A">其中：1.6000 UE + 0.2000 游戏筹码</p>
        </div>

        <!-- 投注详情-已开奖-未中奖   5  -->
        <div v-if="pageMode==5" class="font_four" style="width: 80%;margin:20px 10% 0 10%">
          <p class="p_A orange">夺宝 - 20x0.1</p>
          <p class="p_A">本期：第 166 期</p>
          <p class="p_A">共需 20Key，1Key = 0.1UE，共 2UE</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">最后一位投注账号：eoscheshieosy</p>
          <p class="p_A">交易ID：5eea2b24e5f3......40dcb33<span class="orange p_A">13224</span>cc4</p>
          <p class="p_A">本期：165</p>
          <p class="p_A">幸运数字</p>
          <p class="p_A">= (( 132244 + 165 ) / 20 ) 的余数 + 100001</p>
          <p class="p_A">= 9 + 100001 = <span class="orange p_A">10001</span></p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">投注数量 ：18Key</p>
          <p class="p_A">投注数量 ：18Key</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">夺宝投注幸运码：</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A"><span style="margin-right:20px">100007</span><span>100007</span></p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">未中奖</p>
        </div>

        <!-- 投注详情-已开奖-已中奖  6    -->
        <div v-if="pageMode==6" class="font_four" style="width: 80%;margin:20px 10% 0 10%">
          <p class="p_A orange">夺宝 - 20x0.1</p>
          <p class="p_A">本期：第 166 期</p>
          <p class="p_A">共需 20Key，1Key = 0.1UE，共 2UE</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">最后一位投注账号：eoscheshieosy</p>
          <p class="p_A">交易ID：5eea2b24e5f3......40dcb33<span class="orange p_A">13224</span>cc4</p>
          <p class="p_A">本期：165</p>
          <p class="p_A">幸运数字</p>
          <p class="p_A">= (( 132244 + 165 ) / 20 ) 的余数 + 100001</p>
          <p class="p_A">= 9 + 100001 = <span class="orange p_A">10001</span></p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">投注数量 ：18Key</p>
          <p class="p_A">投注数量 ：18Key</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">夺宝投注幸运码：</p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A"><span style="margin-right:20px">100007</span><span>100007</span></p>
          <div style="width: 100%;height: 20px;"></div>
          <p class="p_A">中奖，共派奖：1.8000 UE</p>
        </div>

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
      pageMode:6,

    }
  },
  methods: {
       back() {
          this.$router.go(-1)
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