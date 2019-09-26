<template>
  <div class="pub-header">
    <div class="logo"><img src="@/assets/img/back_fff.png" alt="" @click="$router.go(-1);"></div>
    <div class="title">{{HeaderTitlle}}</div>
    <div class="action">
      <div class="more" @click="actionSheetVisible = true"><img src="@/assets/img/assembly_ic_option@2x.png" alt=""></div>
      <div @click="$router.go(-3);" class="exit"><img src="@/assets/img/assembly_close_ic@2x.png" alt=""></div>
    </div>
    <!-- 更多下拉框 -->
    <v-ons-action-sheet :visible.sync="actionSheetVisible" cancelable>
        <div class="selectwrap">
          <div class="wdclose" @click="actionSheetVisible = false">
          </div>
          <v-ons-row class="selectrow" >
              <img class="people" src="@/assets/img/u9830.png" alt="">
              <span>eoscheshieos</span>
              <img class="pic" src="@/assets/img/u9827.png" alt="">
              <img class="pic" src="@/assets/img/u9825.png" alt="">
          </v-ons-row>
          <v-ons-row class="selectrow" @click="$router.push('GlovalLottoRule');">
              <img class="rule" src="@/assets/img/u9832.png" alt="">
              <span>规则</span>
          </v-ons-row>
        </div>
    </v-ons-action-sheet> 
  </div>
</template>

<script>
export default {
  components: {

  },
  props: [
    'HeaderTitlle',
  ],
  data() {
    return {
      actionSheetVisible: false, //拉下框
    }
  },
  methods: {
    
  },
  created(){
    
  }
}
</script>


<style scoped>
  .pub-header{
    height: 1.6rem;width: 100%;position: fixed;background-color: rgb(56, 56, 58);display: flex;z-index: 9999;
  }
  .pub-header .logo{
    height: 1rem;width: 1rem;display: flex;margin: auto;background-color: rgb(76, 76, 78);border-radius: 50%;
  }
  .pub-header .logo img{
    height: 35%;width: auto;margin: auto;
  }
  .pub-header .title{
    height: 100%;width: 40%;padding-left: 10px;line-height: 1.6rem;color:white;font-size: 0.5rem;
  }
  .pub-header .action{
    height: 60%;width: 25%;display: flex;border-radius: 1rem;margin: auto 0.5rem auto auto ;background-color: rgb(76, 76, 78);
  }
  .pub-header .action .more{
    height: 100%;width: 50%;display: flex;
    /* border-right: 0.02rem solid #6e6767; */
  }
  .pub-header .action .more img{
    height: 60%;width: auto;margin: auto;
  }
  .pub-header .action .exit{
    height: 100%;width: 50%;display: flex;
  }
  .pub-header .action .exit img{
    height: 70%;width: auto;margin: auto;
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
    background:url("../../../../assets/img/u102.png") no-repeat center center;
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