<template>
  <ons-page>
   <div class="wrap">
      <div class="logo">
          <img src="@/assets/img/lotto_logo1.png" alt="logo">
      </div>
      <p class="title">Global Lotto</p>
      <p class="content">提示</p>
      <p class="content1">您好，【全球彩】目前不支持来自下列国家或地区的用户：中国内地、朝鲜、美国（包括所有美国领士）</p>
      <p class="content1">未满18岁的用户禁止参与本游戏，本游戏包含一定程度的财务风险，玩家应该意识到这种风险并相应地进行自我管理。我们无意诱使任何人违反任何地方、州或国家法律。玩家的唯一责任是参考其管辖范围内的法律，以确定行为的合法性。</p>
   </div>
   </ons-page>
</template>

<script type="text/ecmascript-6">
export default {
   name: '',
   data() {
       return {}
   },
  components: {},
  methods:{
      goLottoGame(){
         setTimeout(()=>{
            this.$router.push('LottoGame');
         },3000)
          
      }
  },
  mounted(){
      this.goLottoGame()
  }
  
}
</script>

<style scoped lang="less">

.wrap{
  background-color: rgb(51, 51, 51);
  padding:1rem;
}

.logo img{
  width:4rem;
  height:4rem;
  display:block;
  margin:0 auto;
  margin-top:2rem;
}
.title{
  text-align:center;
  font-family: 'Axure Handwriting Regular', 'Axure Handwriting';
  font-size:0.6rem;
  color:#000;
  margin:0.2rem 0;
  color: #FF9900;
}
.martop{
  margin-top:3rem;
}
.content{
  text-align:center;
  font-size:0.6rem;
  color:#FF9900;
  margin-top:1.5rem;
  font-family: '微軟正黑體 Regular', '微軟正黑體';
}
.content1{
  text-align:justify;
  text-justify:distribute-all-lines;/*ie6-8*/
  -moz-text-align-last:justify;/*ff*/
  -webkit-text-align-last:justify;/*chrome 20+*/
  font-size:0.45rem;
  margin-top:0.5rem;
  line-height:0.8rem;
  color:#FF9900;
  letter-spacing:8px;
  font-family: '微軟正黑體 Regular', '微軟正黑體';
}
</style>
