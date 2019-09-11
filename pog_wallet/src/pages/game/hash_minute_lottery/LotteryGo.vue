<template>
  <vpage>
    <slot>
      <div class="container">
        <div class="logo"><img src="@/assets/minute_lottery.png" alt=""></div>
        <div class="game-name">哈希分分彩</div>
        <div class="tips-title">提示</div>
        <div class="tips-content">
          您好，【 Snatch 】目前不支持来自下列国家或地区的用户：中国内地、朝鲜、美国（包括所有美国领士）
          <br><br>
          未满18岁的用户禁止参与本游戏，本游戏包含一定程度的财务风险，玩家应该意识到这种风险并相应地进行自我管理。我们无意诱使任何人违反任何地方、州或国家法律。玩家的唯一责任是参考其管辖范围内的法律，以确定行为的合法性。
        </div>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import { setTimeout } from 'timers';

export default {
  components: {
    vpage: MyPage,
   },
  data() {
    return {
   
    }
  },
  methods: {

  },
  created(){
    setTimeout(() => {
      this.$router.push({ path:'/Lottery' });
    }, 3000);
  }
}
</script>

<style scoped>
  .container{
    height: 100%;width: 100%;background-color:rgb(40,40,40);
  }
  .logo{
    width: 100%;
    height: 3rem;
    display: flex;
  }
  .logo img{
    height: 2.8rem;width: auto;margin: auto auto 0px auto;
  }
  .game-name{
    width: 100%;height: 80px;line-height: 80px;font-size: 40px;text-align: center;color:rgb(255, 153, 0, 1);
  }
  .tips-title{
    width: 100%;height: 50px;line-height: 50px;font-size: 30px;text-align: center;color:rgb(255, 153, 0, 1);margin-top: 50px;
  }
  .tips-content{
    width: 90%;line-height: 40px;font-size: 26px;text-align: justify;color:rgb(255, 153, 0, 1);margin: 30px 5%;
  }
</style>