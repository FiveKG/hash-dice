<template>
  <vpage>
    <slot>
      <div class="container">
        <Header :HeaderTitlle="HeaderTitlle"></Header>
        <!-- 投注时间 -->
        <div class="open-time">投注时间：2019/05/04  18:49:23.5</div>
        <!-- 投注交易ID -->
        <div class="open-periods">投注交易ID:</div>
        <div class="open-periods">5eea2b24e5f3f38d......ae4a0dcb331322cc3</div>
        <!-- 投注内容 -->
        <div class="open-periods">投注：共 3 注，1.5 UE</div>
        <div class="open-periods">大：0.5 UE</div>
        <div class="open-periods">3：0.5 UE</div>
        <div class="open-periods">7：0.5 UE</div>


        <!-- 时间 -->
        <div class="open-time">时间：2019/05/04  18:50:00.0</div>
        <!-- 期数 -->
        <div class="open-periods">期数：25949239</div>
        <!-- 开奖区块验证 -->
        <div class="block-verify-title">开奖区块验证:</div>
        <div class="block-verify-value">33283275 &nbsp; ...3323570611c7cd9f30 &nbsp; 18:50:00.5 </div>
        <div class="block-verify-value">33283275 &nbsp; ...3323570611c7cd9f30 &nbsp; 18:50:00.5 </div>
        <!-- 开奖号码 -->
        <div class="block-verify-title">开奖号码：0</div>
        <!-- 中奖范围 -->
        <div class="block-verify-title">中奖范围：0，小，双</div>
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
      HeaderTitlle: '投注详情'
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
    height: auto;width: 100%;background-color:rgb(40,40,40);min-height: 100%;
  }
  .open-time{
    padding-top: 2rem;color:#BCBCBC;;line-height: 1rem;width: 90;margin: 0px 5%;font-size: 0.5rem;
  }
  .open-periods{
    color:#BCBCBC;line-height: 0.8rem;width: 90;margin: 0px 5%;font-size: 0.5rem;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    text-align: left;
  }
  .block-verify-title{
    line-height: 0.8rem;width: 90;margin: 0px 5%;font-size: 0.5rem;color:#BCBCBC;margin-top: 0.5rem;
  }
  .block-verify-value{
    line-height: 0.8rem;width: 90;margin: 0px 5%;font-size: 0.4rem;color:#BCBCBC;
  }
</style>