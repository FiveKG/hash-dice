<template>
  <div>
    <HeadPart v-if="!showEnterLoading"></HeadPart>
    <!-- 进入抢红包前一秒动画 -->
    <EnterLoading v-if="showEnterLoading"></EnterLoading>
    <!-- 俱乐部信息 -->
    <div class="club_text">
      <div class="text" style="border-right:1px solid wheat">{{myClubInfo.clubId}}</div>
      <div class="text">{{myClubInfo.clubName}}</div>
    </div>
    <div class="club_title">
      <div class="title">ID</div>
      <div class="title">名称</div>
    </div>
    <!-- 未创建房间提示 -->
    <div class="create_tips" v-if="myClubInfo.roomList.length == 0 && !$store.state.sideBar">
      <div class="tips">请务必于72小时内创建红包房间 , 未创建将会注销俱乐部！</div>
    </div>
    <!-- 红包房间列表 -->
    <div class="index_b" v-for="(fatheritem, fatherindex) in myClubInfo.roomList" :key="fatherindex" v-if="myClubInfo.roomList[fatherindex].room_list.length != 0 ">
      <p class="index_b_p1"> &nbsp; {{fatheritem.type}}人抢 &nbsp; </p>
      <!--红包-->
      <div class="index_b_bigbox">
        <div class="index_b_box" v-for="(item,index) in fatheritem.room_list" :key="index" @click="gotoGame(fatheritem.type , item.room_id , item.amount)">
          <div class="index_b_box1">
            <div class="index_b_box1_a">
              <img src="../../assets/02.png" height="70%" style="margin: 15% auto 0 auto">
            </div>
            <div class="index_b_box1_b">
              <p>{{Number(item.amount)}}POG</p>
              <p>{{fatheritem.type}}人抢</p>
            </div>
          </div>
          <div class="index_b_box2">
              抢得金额最大者发下一轮红包
          </div>
        </div>
      </div>
    </div>
    <div style="height:65px;"></div>
    <!-- 创建红包房间 -->
    <div class="create_room" v-if="!$store.state.sideBar && !showEnterLoading">
      <div class="icon" @click="gotoCreateHome">
        <img src="../../assets/add.png" alt="">
      </div>
    </div>
  </div>

</template>


<script>
  import HeadPart from '@/components/HeadPart/HeadPart';
  import EnterLoading from '@/components/EnterLoading/EnterLoading';
  import { getClubInfo , storage , getConfig  , scatterOneStop  } from '@/servers';
  export default {
    name: 'MyClub',
    components: {
      HeadPart,
      EnterLoading
    },
    data() {
      return {
        showEnterLoading:false,
        myClubInfo:{
          clubId:'',
          clubName:'',
          roomList:[]
        },
        timer:null
      }
    },
    mounted(){
      
    },
    created() {
      this.timer = setInterval(()=>{
        if(this.$store.state.configIsOk != 0){
          console.log("this.$store.state.configIsOk:",this.$store.state.configIsOk)
          clearInterval(this.timer);
          if(this.$store.state.configIsOk === 1){
            this.getClubInfo();
          }
        }
      },500)
    },
    methods: {
      // 前往创建红包房间
      gotoCreateHome(){
        this.$router.push({path: '/createroom'});
      },
      // 获取我的俱乐部信息
      getClubInfo(){
        let data = {
          club_id : this.$store.state.myClubId
        }
        console.log("我的俱乐部:",data)
        getClubInfo(data).then(res => {
          console.log("获取我的俱乐部信息:",res)
          if(res.code == 1){
            this.myClubInfo.clubId = res.data.club_id;
            this.myClubInfo.clubName = res.data.club_name;
            this.myClubInfo.roomList = res.data.type_list;
          }
        }).catch(err =>{
          console.log("获取俱乐部信息失败:",err)
        });
      },
      // 进入抢红包
      gotoGame(type , room_id , amount){
        this.showEnterLoading = true;
        console.log("room_id:",room_id);
        setTimeout(()=>{
          this.showEnterLoading = false;
          storage.set('clubId',this.$store.state.myClubId);
          storage.set('roomType',type);
          storage.set('roomAmount',amount);
          storage.set('roomId',room_id);
          this.$router.push({path: '/moneyclub'});
        },1000)
      },
    }
  }
</script>

<style scoped>
  .club_text{
    width: 90%;
    display: flex;
    padding-top:10vh;
    border-bottom: 1px solid wheat;
    margin: auto;
  }
  .club_text .text{
    width: 50%;
    height: 20px;
    color: aliceblue;
    margin-top: 20px;
    margin-bottom: 5px;
    text-align: center;
  }
  .club_title{
    width: 90%;
    display: flex;
    margin: auto;
  }
  .club_title .title{
    width: 50%;
    height: 20px;
    color: aliceblue;
    text-align: center;
  }
  .create_tips{
    width: 100%;
    /* height: 250px; */
    display: flex;
    margin-top: 40%;
  }
  .create_tips .tips{
    width: 60%;
    height: 100%;
    margin: auto;
    color: aliceblue;
    text-align: justify;
    line-height: 30px;
    padding: 10px;
    background-color: black;
    opacity: 0.4;
    border-radius: 10px;
  }
  /*红包样式*/
  .index_b{
    padding: 0px 3vw 2vh 3vw;
    /*height: 50vh;*/
    /* background: #c13939; */
  }
  .index_b .index_b_p1{
    color:aliceblue;
    margin: 0px;
    padding: 1vh 0px 0.3vh 0px;
    text-align: center;
    text-decoration: underline;
  }
  .index_b_bigbox{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: center;
    align-items: flex-start;
  }
  .index_b_box{
    height: 16vh;
    width: 46vw;
    background: yellow;
    border-radius:5px;
    order: 0;
    flex: 0 1 auto;
    align-self: auto;
    margin: 0.7vh 0px
  }
  .index_b_box .index_b_box1{
    height: 11.5vh;
    width: 46vw;
    background: #ff9900;
    border-radius: 5px 5px 0px 0px;
  }
  .index_b_box1 .index_b_box1_a{
    width: 40%;
    height: 100%;
    float: left;
    text-align: center;
  }
  .index_b_box1 .index_b_box1_b{
    width: 58%;
    height: 100%;
    float: right;

  }
  .index_b_box1 .index_b_box1_b p{
    margin: 0px;
    /* font-size: 1.2rem; */
    font-size: 13px;
    color: white;
    letter-spacing: 1px;
    text-overflow: ellipsis;
  }
  .index_b_box1 .index_b_box1_b p:nth-child(1){
    margin-top: 10%;
  }
  .index_b_box .index_b_box2{
    height: 4.5vh;
    width: 46vw;
    background: white;
    color: #ff9900;
    font-size: 0.7rem;
    line-height: 4.5vh;
    text-align: center;
    border-radius: 0px 0px 5px 5px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .create_room{
    width: 100%;
    /* height: 60px; */
    display: flex;
    position: fixed;
    bottom: 0px;
    padding-bottom: 10px;
    background-color: #e84244;
  }
  .create_room .icon{
    width: 60px;
    height: 60px;
    margin: auto;
    background-color: #ff9900;
    border-radius: 50%;
    display: flex;
    box-shadow: 2px 2px 5px #333333;
  }
  .create_room .icon img{
    width: 30px;
    margin: auto;
  }
</style>













