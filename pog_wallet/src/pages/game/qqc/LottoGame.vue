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
          actionSheetVisible: false
       }
   },
   methods:{
     close(){
        this.$router.go(-2)
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
    background:url("../../assets/img/uv1.png") no-repeat center center;
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
    background:url("../../assets/img/u102.png") no-repeat center center;
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


  
</style>
