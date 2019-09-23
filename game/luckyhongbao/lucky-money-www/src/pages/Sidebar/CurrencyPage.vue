<template>
  <div>
    <HeadPart></HeadPart>
    <div class="currency">
      <div class="currency_img" v-if="!$store.state.sideBar"><img src="../../assets/02.png" alt="hongbao..."/></div>
      <div class="currency_a">CLUB</div>
      <div class="currency_b">CLUB 总量为 {{clubamount}} 枚，永不增发</div>
      <div class="currency_b">游戏空投 {{clubamount /10}} 枚</div>
      <div class="currency_b">持有 CLUB 参与分红，您可从游戏中共同获益</div>
      <div class="currency_c"></div>
      <div class="currency_d">{{amount}}</div>
      <div class="currency_b">CLUB</div>
      <div class="currency_b">已空投 CLUB 数量</div>
      <div class="currency_e" v-if="!$store.state.sideBar">
        <van-progress
        style="height: 100%;background: #c13939"
        pivot-text=""
        color="#ff9900"
        :percentage="tage"
      />
      </div>
      <div class="currency_b">{{amount}} / {{clubamount}}</div>
      <div class="currency_b" style="margin-top: 7vh">抢到金额最大红包的玩家，将发下一轮红包</div>
      <div class="currency_b">按 1 POG 空投 10 CLUB，其他玩家则空投 1 CLUB</div>
      <div class="currency_f"></div>
      <div class="currency_b">邀请的好友参与游戏，每发出 1 个红包</div>
      <div class="currency_b">按 1 POG 空投 1 CLUB</div>
      <div class="currency_f"></div>
      <div class="currency_b">俱乐部每发出1个红包，创建者均可获得空投</div>
      <div class="currency_b" style="margin-bottom: 7vh">按 1 POG 空投 1 CLUB</div>

    </div>
  </div>

</template>


<script>
  import HeadPart from '@/components/HeadPart/HeadPart';
  import { getAirdropAmount } from '@/servers';
  import Eos from 'eosjs';
  export default {
    name: 'CurrencyPage',
    components: {
      HeadPart
    },
    data() {
      return {
        amount:0,
        clubamount:0,
        tage:0
      }
    },
    mounted(){
      setTimeout(() => {
        this.AirdropAmount()
      }, 1000);
      

    },
    created() {


    },
    methods: {
      AirdropAmount(){
        getAirdropAmount("").then(res => {
          if (res.code == 1) {
              this.amount = res.data.amount;
              const eos = this.$store.state.scatter.eos(this.$store.state.network, Eos);
              // console.log(9999999999,this.$store.state)
              eos.getCurrencyStats("myluckymoney", "CLUB").then( res => { 
                this.clubamount = Number(res.CLUB.max_supply.replace("CLUB",""));
                this.tage = this.amount/this.clubamount
                console.log(this.clubamount,this.tage)

              })
              console.log("获取CLUB:",res)
          } 
          
        }).catch(err =>{
          console.log("获取CLUB失败:",err);
        });
      }

    }
  }
</script>

<style>
  .currency{
    padding-top: 10vh;
  }
  .currency .currency_img{
    width: 90px;
    height: 90px;
    background: #ff9900;
    margin: 3vh auto;
    border-radius: 45px;
    -moz-box-shadow:1px 3px 8px 0px #333333;
    -webkit-box-shadow:1px 3px 8px 0px #333333;
    box-shadow:1px 3px 8px 0px #333333;
    position: relative;
  }
  .currency .currency_img img{
    width: 40px;
    height:50px;
    position: absolute;
    top: 20px;
    left: 25px;
  }
  .currency .currency_a{
    margin-top: -2.5vh;
    text-align: center;
    font-size: 2.8rem;
    color: #ff9900;
    margin-bottom: 1vh;
  }
  .currency .currency_b{
    color: white;
    text-align: center;
    padding: 1vh;
  }
  .currency .currency_c{
    width: 7vw;
    background: rgba(255,153,0,0.5);
    height: 1.3vh;
    margin: 1vh auto;
    border-radius: 10vw;
  }
  .currency .currency_d{
    font-size: 1.8rem;
    color: white;
    text-align: center;
    margin-top: 1.5vh;
    margin-bottom: -0.5vh;
  }
  .currency .currency_e{
    height: 1.2vh;
    margin: 1vh 8vw;
  }

  .currency .currency_f{
    width: 7vw;
    background: rgba(255,153,0,0.5);
    height: 0.5vh;
    margin: 1vh auto;
    border-radius: 5px;
  }


</style>













