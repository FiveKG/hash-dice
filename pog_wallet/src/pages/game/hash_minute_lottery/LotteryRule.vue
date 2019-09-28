<template>
  <vpage>
    <slot>
      <div class="container">
        <Header :HeaderTitlle="HeaderTitlle"></Header>
        <div class="rule-title" style="padding-top:1.6rem;">游戏时间：</div>
        <div class="rule-content">哈希分分彩游戏时间为一分钟一期，7X24 天全年无休，每天共1440期。</div>
        <div class="rule-title">哈希分分彩规则：</div>
        <div class="rule-content">
          1、玩家选择数字【0-9】时，当游戏结果等于选择的数字时时，玩家赢得游戏，返奖倍数为9.8 倍；
          2、玩家选择【大】时，当游戏结果为5-9时，玩家赢得游戏，返奖倍数为1.96 倍；
          3、玩家选择【小】时，当游戏结果为0-4时，玩家赢得游戏，返奖倍数为1.96 倍；
          4、玩家选择【单】时，当游戏结果为1.3.5.7.9时，玩家赢得游戏，返奖倍数为1.96 倍；
          5、玩家选择【双】时，当游戏结果为0.2.4.6.8时，玩家赢得游戏，返奖倍数为1.96 倍；
        </div>
        <div class="rule-title">投注时限：</div>
        <div class="rule-content">
          以玩家投注记录所在区块的时间来区分投注的期数，如：<br>
          1、玩家投注记录的区块时间为 21:22:59.5，则算在 21:22 的这一期，开奖号码则由21:23:00.0 的区块开始获取
          2、玩家投注记录的区块时间为 21:23:00.0，则算在 21:23 的这一期，开奖号码则由21:24:00.0 的区块开始获取
        </div>
        <div class="rule-title">开奖方法：</div>
        <div class="rule-content">
           <span style="color: rgba(255, 153, 0, 1);">我们以区块ID作为开奖依据，区块ID无法预知、预设、修改，随时可进行查询，作为开奖依据，完全公正、公平、透明及可信。</span><br>
          开奖数字为1位数，以每分钟开始的区块ID的最后一位数字做为开奖号码，如最后一位不是数字，则顺延至下一个区块，直至区块ID的最后一位为数字。
        </div>
        <div class="rule-title">投注限额：</div>
        <div class="rule-content">
          游戏以娱乐为主，不希望大额投注，我们设置了投注限额：<br>
          1、单笔限额，投注上限为 100 UE；
          2、单期限额，指每期的投注总限额，为所有参与者共用的限额，是为了保障单期投注额太大，导致奖金池被清空，单期限额为奖金池账户余额的5%
        </div>
        <div class="rule-title">TBG 分配：</div>
        <div class="rule-content">
          1、每次投注的0.1% 拨入 TBG 股东分红池；
          2、每次投注的0.1% 拨入 TBG 三倍收益保障池；
          3、每次投注的0.3% 拨入 TBG 共享推荐佣金分配。
        </div>
        <div class="rule-content" style="color: rgba(255, 153, 0, 1);font-size: 0.45rem;">TBG 推荐关系适用 TBG 旗下所有游戏和应用</div>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import Header from '@/pages/game/hash_minute_lottery/components/Header'

export default {
  components: {
    vpage: MyPage,
    Header,
   },
  data() {
    return {
      HeaderTitlle: '规则'
    }
  },
  methods: {

  },
  created(){
    
  }
}
</script>

<style scoped>
  .container{
    height: auto;width: 100%;background-color:rgb(56,56,58);min-height: 100%;
  }
  .rule-title{
    height: 1.5rem;line-height: 1.5rem;color: rgba(255, 153, 0, 1);font-size: 0.5rem;width: 90%;margin: 0 5%;
  }
  .rule-content{
    line-height: 0.7rem;font-size: 0.4rem;width: 90%;margin: 0 5%;color: #bcbcbc;
  }
</style>