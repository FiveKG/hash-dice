<template>
  <div>
    <header>
      <div @click="backPage">
        <svg class="icon" width="1.5rem" height="1.5rem" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" d="M702.94996 958.89419c-8.375761 0-16.751522-3.196809-23.14514-9.590426L265.159102 534.658046c-12.787234-12.777001-12.787234-33.513278 0-46.289256L679.80482 73.722048c12.787234-12.787234 33.502022-12.787234 46.289256 0 12.787234 12.777001 12.787234 33.513278 0 46.289256L334.593498 511.512906l391.501602 391.501602c12.787234 12.777001 12.787234 33.513278 0 46.289256C719.701482 955.697381 711.325721 958.89419 702.94996 958.89419z" /></svg>
        返回
      </div>
    </header>
    <div class="gameplay">
      <div class="gameplay_p" style="padding-top:2vh;margin:0px;"><span>游戏规则</span></div>
      <p>1、TBG游戏筹码或钱包扣款，均可参与抢红包；</p>
      <p>2、玩家抢红包时，将抵押专场等额的UE或TBG游戏筹码；</p>
      <p>3、玩家可重复抢同一个红包，每次参与，都将抵押与专场等额的UE或TBG游戏筹码；</p>
      <p>4、红包份数抢完后，系统自动开奖，玩家抢到随机数量的UE将存入钱包余额中，当玩家使用TBG游戏筹码参与时，抢到的红包余额只有大于专场等额部分用UE存入钱包余额中，小于等于专场等额部分一样以TBG游戏筹码归还；</p>
      <p>5、开奖后，抢到最大金额红包玩家抵押的UE或TBG游戏筹码，将自动发出下一轮红包，其他玩家抵押的UE或TBG游戏筹码将分别退回玩家的钱包余额和TBG游戏筹码余额中；</p>
      <p class="gameplay_p"><span>开奖规则</span></p>
      <p>发出红包后，第一位玩家抢的时间点将作为随机数的种子，随机生成设定份数的红包，第一位玩家取得随机生成的第一个红包，第二位玩家抢时，其抢的时间点作为随机数的种子，余下金额随机生成设定份数-1的红包，第二位玩家取得随机生成的第一个红包，第三位玩家抢时，其抢的时间点作为随机数的种子，余下金额随机生成设定份数-2的红包，第三位玩家取得随机生成的第一个红包，以此类推，当最后一个红包时，玩家直接抢得这个红包，全部红包抢完后，所有玩家抢得红包最大者其抵押的金额发出下一个红包</p>
      <p></p>
      <p class="gameplay_p"><span>奖金分配</span></p>
      <p>1、每轮红包95%随机分配给参与玩家；</p>
      <p>2、每轮红包0.5%拨入TBG股东分红池；</p>
      <p>3、每轮红包0.5%拨入TBG三倍收益保障池。</p>
      <p>4、每轮红包2.5%拨入TBG共享推荐佣金分配。</p>
      <p>5、每轮红包1.5%拨入团队，作资源购买及开发运维费用支配。</p>
      <footer>TBG 推荐关系适用 TBG 旗下所有游戏和应用</footer>
    </div>
  </div>

</template>


<script>
  import HeadPart from '@/components/HeadPart/HeadPart';
  export default {
    name: 'Gameplay',
    components: {
      HeadPart
    },
    data() {
      return {

      }
    },
    mounted(){



    },
    created() {


    },
    methods: {
      backPage(){
        this.$router.go(-1)
      }

    }
  }
</script>

<style>
header{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 50px;
  padding:.2rem 1rem;
  color:#fff;
  line-height: 50px;
  background-color: #a22e2f; 
}
footer{
  color: #f90;
}
.icon{
  vertical-align: middle;
}
  .gameplay{
    padding: 7vh 4vw 6vh 4vw;
    color: white;
    line-height: 30px;
  }
  .gameplay p{
    margin:1vh 0px;
  }
  .gameplay .gameplay_p{

    color: #ff9900;
    margin: 0 0px 2vh 0px;
    padding-bottom: 0.2vh;
    width: 20vw;
  }
  .gameplay .gameplay_p span{
    border-bottom: 1px solid #ff9900;
  }

</style>













