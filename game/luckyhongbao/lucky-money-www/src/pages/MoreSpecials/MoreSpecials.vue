<template>
  <div style="padding-bottom: 5vh">
    <HeadPart v-if="!showEnterLoading"></HeadPart>
    <!-- 进入抢红包前一秒动画 -->
    <EnterLoading v-if="showEnterLoading"></EnterLoading>
    <div class="morespecials" v-if="!showEnterLoading">
      <div class="morespecials_a" v-for="(item,index) in roomList" :key="index" v-if="item.room_list.length">
        <p class="morespecials_a_p1"><span>{{item.type}}人抢</span></p>
        <div class="morespecials_a_bigbox">
          <div class="morespecials_a_box" v-for="(item2,index) in item.room_list" :key="index" @click="gotoGame(item.type , item2.room_id , item2.amount)">
            <div class="morespecials_a_box1">
              <div class="morespecials_a_box1_a">
                <img src="../../assets/02.png" height="70%" style="margin: 15% auto 0 auto">
              </div>
              <div class="morespecials_a_box1_b">
                <p>{{Number(item2.amount)}}POG</p>
                <p>{{item.type}}人抢</p>
              </div>
            </div>
            <div class="morespecials_a_box2">
              抢得金额最大者发下一轮红包
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="morespecials_b" v-if="!$store.state.sideBar && !showEnterLoading">
      tothemoon133&nbsp;<span style="color: #ffac2f;">抢得奖金</span>&nbsp;0.5617&nbsp;<span style="color: #ffac2f;">POG</span>
    </div> -->
  </div>

</template>


<script>
  import HeadPart from '@/components/HeadPart/HeadPart';
  import { Toast } from 'vant';
  import EnterLoading from '@/components/EnterLoading/EnterLoading';
  import { getClubInfo , storage , getOfficeRoomInfo , scatterOneStop } from '@/servers';
  export default {
    name: 'MoreSpecials',
    components: {
      HeadPart,
      EnterLoading
    },
    data() {
      return {
        showEnterLoading:false,
        roomList:[],//官方俱乐部房间列表
      }
    },
    mounted(){

    },
    created() {
      this.getClubInfo();
    },
    methods: {
      /**
       * 获取官方俱乐部房间列表
       */
      getClubInfo(){
        let data = { club_id : 1 }
        getClubInfo(data).then(res => {
          console.log("获取官方俱乐部房间列表:",res)
          if(res.code == 1){
            this.roomList = res.data.type_list;
          }
        }).catch(err =>{
          console.log("获取官方俱乐部房间列表失败:",err)
        });
      },
      // 进入抢红包
      async gotoGame(type , room_id , amount){
        console.log('=========',type , room_id , amount);
        if(!this.$store.state.eosAccount){
          // Scatter一站式调用
          var result = await scatterOneStop();
          console.log("Scatter一站式调用结果:",result);
          if(result.code != 1){
            Toast(result.desc);
          }else{
            if(this.$store.state.eosAccount){
              this.showEnterLoading = true;
              console.log("进入房间===room_id:",room_id);
              setTimeout(()=>{
                this.showEnterLoading = false;
                storage.set('clubId',1);
                storage.set('roomType',type);
                storage.set('roomAmount',amount);
                storage.set('roomId',room_id);
                this.$router.push({path: '/moneyclub'});
              },1000)
            }else{
              Toast("请退出重新登录");
            }
          }
        }else{
          this.showEnterLoading = true;
          console.log("room_id:",room_id);
          setTimeout(()=>{
            this.showEnterLoading = false;
            storage.set('clubId',1);
            storage.set('roomType',type);
            storage.set('roomAmount',amount);
            storage.set('roomId',room_id);
            this.$router.push({path: '/moneyclub'});
          },1000)
        }
      }

    }
  }
</script>

<style>
  /*主要样式*/
  .morespecials{
    padding-top: 10vh;
  }
  .morespecials .morespecials_a{
    padding: 0px 3vw 5vh 3vw;
    /*background: skyblue;*/
    border-bottom: 1px dashed  #ffac2f;
  }
  .morespecials_a  .morespecials_a_p1{
    /*background: skyblue;*/
    /* width: 30vw; */
    text-align: center;
    margin: 3vh auto;
    padding: 0.5vh 0px;
    color: white;
    font-size: 1.2rem;
    letter-spacing: 1px;
  }
  .morespecials_a  .morespecials_a_p1 span{
    border-bottom: 1px solid #ff9900;
    padding: 0.5vh 3vw;
  }
  /*红包样式*/
  .morespecials_a_bigbox{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: center;
    align-items: flex-start;
  }
  .morespecials_a_box{
    height: 16vh;
    width: 46vw;
    background: yellow;
    border-radius:5px;
    order: 0;
    flex: 0 1 auto;
    align-self: auto;
    margin: 0.7vh 0px
  }
  .morespecials_a_box .morespecials_a_box1{
    height: 11.5vh;
    width: 46vw;
    background: #ff9900;
    border-radius: 5px 5px 0px 0px;
  }
  .morespecials_a_box1 .morespecials_a_box1_a{
    width: 40%;
    height: 100%;
    float: left;
    text-align: center;
  }
  .morespecials_a_box1 .morespecials_a_box1_b{
    width: 58%;
    height: 100%;
    float: right;

  }
  .morespecials_a_box1 .morespecials_a_box1_b p{
    margin: 0px;
    font-size: 13px;
    color: white;
    word-break: break-word;
    letter-spacing: 1px;
  }
  .morespecials_a_box1 .morespecials_a_box1_b p:nth-child(1){
    margin-top: 10%;
  }
  .morespecials_a_box .morespecials_a_box2{
    height: 4.5vh;
    width: 46vw;
    background: white;
    color: #ff9900;
    font-size: 0.7rem;
    line-height: 4.5vh;
    text-align: center;
    border-radius: 0px 0px 5px 5px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }


  .morespecials_b{
    position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;
    height: 8vh;
    background: #c13939;
    line-height: 8vh;
    /*margin: 1.5vh 0px;*/
    text-align: center;
    color: white;
    font-size: 1rem;
  }
</style>













