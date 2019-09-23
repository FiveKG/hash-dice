<template>
  <div>
    <div class="enterpage">
      <div class="enter_a">
        <img src="../../assets/02.png" alt="hongbao..."/>
      </div>
      <div class="enter_b">
        luckmoney.club
      </div>
      <!-- <div class="enter_c">
        <p>提示</p>
        <p>您好，Luckymoney目前不支持来自下列国家或地区的用户：中国内地、朝鲜、美国（包括所有美国领士）</p>
        <p>
          未满18岁的用户禁止参与本游戏，本游戏包含一定程度的财务风险，
          玩家应该意识到这种风险并相应地进行自我管理。
          我们无意诱使任何人违反任何地方、州或国家法律。玩家的唯一责任是参考其管辖范围内的法律，以
          确定行为的合法性。
        </p>
      </div> -->
    </div>
  </div>

</template>


<script>
  
  export default {
    name: 'EnterLoading',
    data() {
      return {
      
      }
    },
    mounted(){


  
    },
    created() {


    },
    methods: {
    

    }
  }
</script>

<style scoped>
  .enterpage{
      width: 100vw;
      height: 100vh;
      background: #e33c3e;
      overflow: hidden;
    }
  .enterpage .enter_a{
    width: 110px;
    height: 110px;
    background: #ff9900;
    margin: 30vh auto 0px auto;
    border-radius: 55px;
    -moz-box-shadow:1px 3px 8px 0px #333333;
    -webkit-box-shadow:1px 3px 8px 0px #333333;
    box-shadow:1px 3px 8px 0px #333333;
    position: relative;
  }
  @-webkit-keyframes rotation{
    from {-webkit-transform: rotate(0deg);}
    to {-webkit-transform: rotate(360deg);}
  }
  .enterpage .enter_a img{
    width: auto;
    height:60px;
    position: absolute;
    top: 25px;
    left: 30px;
    -webkit-transform: rotate(360deg);
    animation: rotation 2s linear infinite;
    -moz-animation: rotation 2s linear infinite;
    -webkit-animation: rotation 2s linear infinite;
    -o-animation: rotation 2s linear infinite;
  }
  .enterpage .enter_b{
    text-align: center;
    padding: 2vh 3vw 0vh 3vw;
    font-size: 1.3rem;
    font-weight: bold;
    color: #ffdaa2;
  }
  .enterpage .enter_c{
    padding: 0px 3vw 0px 3vw;
    color: #ffdaa2;
  }
  .enterpage .enter_c p:nth-child(1){
    padding-top: 3vh;
    text-align: center;
  }
</style>