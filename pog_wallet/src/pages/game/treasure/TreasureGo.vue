<template>
    <vpage >
     <slot>
       <div style=" background-color: rgba(40, 40, 40, 1);;height:100%;">
        <div style="width:100%;height:25%;"></div>
       <div style="" class="box"><img class="ion_tbg" src="@/assets/invitation2/u3.png"> </div>
       <p style=" font-weight: 400;font-size: .6rem;color:#FF9900 ;text-align: center;margin-top: 5px;">Snatch</p>
        <div style="position: absolute;text-align: center;bottom:8%;width:100%;">
          <p class="p_content" >提示</p>
          <p class="p_content" style="width:80%;margin:12px auto 12px auto;text-align: left;">您好，【夺宝】目前不支持来自下列国家或地区）的用户：中国内地、朝鲜、美国（包括所有美国领士）</p>
          <p class="p_content" style="width:80%;margin:0 auto;text-align: left;">未满18岁的用户禁止参与本游戏，本游戏包含一定程度的财务风险，玩家应该意识到这种风险并相应地进行自我管理。我们无意诱使任何人违反任何地方、州或国家法律。玩家的唯一责任是参考其管辖范围内的法律，以确定行为的合法性。</p>
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
      log:true,
   
    }
  },
  methods: {
       back() {
          this.$router.go(-1)
       },
       jump() {
          this.$router.push({
          name: 'TreasurePage',
        })
       },
  },
  created(){
    // console.log('this',this);
    // setTimeout(() => {
    //   this.jump();
    // }, 2000);
   
  }
}
</script>

<style scoped>
.box{
  background: rgba(255, 153, 51, 1);
  margin: 0 auto;
  width: 3rem;
  height:3rem;
  border-radius: 6px;
}
.p_content{
  font-weight: 400;
  font-style: normal;
  font-size: .4rem;
  color: #FF9900;
}
.p_white{
    font-family: 'Poiret One Bold', 'Poiret One Regular', 'Poiret One';
    font-weight: 700;
    font-style: normal;
    font-size: 1.2rem;
    color: #FFFFFF;
    text-align: center;
}
p{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
}  
.ion_tbg{
  width: 80%;
  height:80%;
  padding: 10% 10%;
}



</style>