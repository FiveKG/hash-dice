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

      <!-- 内容 -->

      <div style="background-color: rgb(40,40,40);height:100%;width:100%;">
        <div  style=" width: 100%;height: 4.48rem;background: ;margin:0 0 1px 0;">
          <div style="width:80%;margin:0 5%;" v-for="(item,index) in items" :key='index'>
            <p class=" font_four p_A" style="line-height: .64rem;">{{item.num}}</p>
          </div>
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
            <div class="schedule_white"><div class="schedule_orange" :style="{ width: schedule + '%' }"></div></div>
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
            <div style="" v-for="(item,index) in items" :key='index'>
              <div style="width:100%;height:1.1rem;">
                <div class="display_ib vertical_top" style="width:33.3%;height:1.1rem;"><p  style="font-size: .45rem;line-height:1.1rem;text-align: center;">{{item.a}}</p></div>
                <div class="display_ib vertical_top" style="width:40%;height:1.1rem;"><p  style="font-size: .45rem;line-height:1.1rem;text-align: center;">{{item.b}}</p></div>
                <div class="display_ib vertical_top" style="width:22%;margin-left: 4%;height:1.1rem;"><img style="width: .5rem;height: 0.5rem;margin: .35rem 0 .35rem 50%;" src="@/assets/img/invitation_profitarrow.png"></div>
              </div>
            </div>
          </div>
        </div>
        
 
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




        </div>
    </ons-page>
</template>

<script type="text/ecmascript-6">
export default {
   name: '',
   data() {
       return {
          actionSheetVisible: false,
          twenty:1,      //模式选择  20*0.1为1  20*0.5为2  100*0.1为3
          allMy:true,   //区分我的 全部
          publicData:[   //公用界面数据

          ],
          publicAll:[    //公用全部

          ],
          publicMy:[    //公用我的

          ],
          items:[
                  {num:111,a:'# 163期',b:'待开奖',key:1},
                  {num:111,a:'# 163期',b:'幸运码：100006',key:2},
                  {num:111,a:'# 163期 - 中奖',b:'幸运码：100006',key:3},
                  {num:111,a:'# 163期',b:'幸运码：100006',key:4},
                  {num:111,a:'# 163期',b:'幸运码：100006',key:5},
                  {num:111,a:'# 163期',b:'幸运码：100006',key:6},
                  {num:111,a:'# 163期',b:'幸运码：100006',key:7},
          ], 
       }
   },
   methods:{
     close(){
        this.$router.go(-2)
     },
      selectTwenty(index) {
        this.twenty=index;
      },
      selectAllMy(index) {
        this.allMy=index;
      }
   },
   mounted(){
     
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


  
</style>
