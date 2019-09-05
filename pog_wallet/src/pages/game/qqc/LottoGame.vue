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

      <!-- 文字下拉 -->
        
      <!-- 全球彩 -->
      <div class="globalColor">
         <div class="content">
            <p class="small_t">全球彩</p>
            <p class="big_t">全球彩</p>
            <div class="openTime">00:35:23</div>
            <p class="openPhase"># 50 期</p>
            <p class="openNum">105,639.2700</p>
            <p class="Company">UE</p>
         </div>
      </div>
      
      <!-- 按钮部分 -->
      <div style="width: 80%;height: 1rem;margin: 0 auto;border-radius: 5px;background: rgb(54,54,54);">
          <div class="display_ib vertical_top" style="width:1rem;height:1rem;">
             <img style="width:50%;height:50%;margin: 25% 25%;" src="@/assets/invitation2/u7.png">
          </div>
          <div class="display_ib vertical_top" style="width:1rem;height:1rem;background:rgb(67,67,67);">
              <p class=" font_five" style="line-height:1rem;text-align: center;">-</p>
          </div>
          <div class="display_ib vertical_top" style="width:1.8rem;height:1rem;">
              <p class=" font_five orange" style="line-height:1rem;text-align: center;">1</p>
          </div>
          <div class="display_ib vertical_top" style="width:1rem;height:1rem;background:rgb(67,67,67);">
              <p class=" font_five orange" style="line-height:1rem;text-align: center;">+</p>
          </div>
          <div class="display_ib vertical_top" style="width:3rem;height:1rem;">
              <p class=" font_five" style="line-height:1rem;text-align: center;color: #E4E4E4;">@ 1 UE</p>
          </div>
      </div>

      <!-- key -->
      <p class="ukey">1 key = 0.1 UE</p>

      <!-- 投注按钮 -->
      <div class="bettingBtn">
          <div class="btn1">随机投注</div>
          <div class="btn2">选号投注</div>
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
         
       }
   },
   methods:{
     close(){
        this.$router.go(-2)
     },
  
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

  .test{
    height:1rem;
    background:#FF9900;
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
    line-height: 1rem;
  }
  
  .bettingBtn{
    display: flex;
    box-sizing:border-box;
    padding: 0 .8rem;
    padding-bottom:1rem;
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
  
</style>
