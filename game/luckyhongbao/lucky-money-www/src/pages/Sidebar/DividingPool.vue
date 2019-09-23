<template>
  <div>
    <HeadPart></HeadPart>
    <div class="dividingpool">
      <div class="dividingpool_a">{{pool.unallocate_bonus}}</div>
      <div class="dividingpool_b" style="margin-top: -1.5vh">POG</div>
      <div class="dividingpool_b">当前未分配分红累计</div>
      <div class="dividingpool_c"></div>
      <div class="dividingpool_d">{{pool.allocate_bonus}}</div>
      <div class="dividingpool_b" style="margin-top: -1.5vh">POG</div>
      <div class="dividingpool_b">累计已发放分红</div>
      <div class="dividingpool_c"></div>
      <div class="dividingpool_d">{{pool.release_symbol_amount}}</div>
      <div class="dividingpool_b" style="margin-top: -1.5vh">CLUB</div>
      <div class="dividingpool_b">已释放 CLUB 数量</div>
      <div class="dividingpool_e">
        <p><span>分红规则</span></p>
        <p>1、仅持有已释放 CLUB 的玩家及俱乐部创建者参与分红；</p>
        <p>2、每周分红一次，计算分红时间节点为每周一 00:00:00；</p>
        <p>3、玩家按每周一 00:00:00 持有的CLUB数量比例进行分红；</p>
        <p>4、俱乐部按每周最终排名前五名进行分红；</p>
        <p>5、当前未分配分红累计的50%为玩家每周分红额，当前未分配分红累计的20%为俱乐部每周分红额；</p>
        <p>6、所有分红均直接加入您的账户余额中，可随时提取。</p>
      </div>

    </div>
  </div>

</template>


<script>
  import HeadPart from '@/components/HeadPart/HeadPart';
  import { getBonusPool } from '@/servers';
  export default {
    name: 'DividingPool',
    components: {
      HeadPart
    },
    data() {
      return {
        pool:"",
      }
    },
    mounted(){
      this.BonusPool()
    },
    created() {

    },
    methods: {
      BonusPool(){
        getBonusPool("").then(res => {
          if (res.code == 1) {
            this.pool = res.data
            console.log("获取分红池:",res)
          }
          
          
          
        }).catch(err =>{
          console.log("获取分红池失败:",err);
        });
      }


    }
  }
</script>

<style scoped>
  .dividingpool{
    padding-top: 10vh;
  }
  .dividingpool .dividingpool_a{
    font-size: 2.2rem;
    color: #ff9900;
    text-align: center;
    margin: 4vh 0px 0vh 0px;
  }
  .dividingpool .dividingpool_b{
    color: white;
    text-align: center;
    padding: 1.2vh;
  }
  .dividingpool .dividingpool_c{
    width: 7vw;
    background: rgba(255,153,0,0.5);
    height: 1.3vh;
    margin: 2vh auto;
    border-radius: 10vw;
  }
  .dividingpool .dividingpool_d{
    color: white;
    text-align: center;
    padding: 1vh;
    font-size: 1.5rem;
  }
  .dividingpool .dividingpool_e{
    margin-top: 7vh;
    padding: 0px 4vw 5vh 4vw;
    color: white;
  }
  .dividingpool .dividingpool_e p{
    margin: 1.5vh 0px;
  }
  .dividingpool .dividingpool_e p:nth-child(1){
    margin-bottom: 3vh;
  }
  .dividingpool .dividingpool_e p span{
    padding-bottom: 0.2vh;
   border-bottom: 1px solid #ff9900;
    color: #ff9900;

  }

</style>













