<template>
  <div>
    <!--头部-->
    <HeadPart v-if="!showEnterLoading"></HeadPart>
    <!--某个俱乐部-->
    <div class="indexpage" >
      <!-- 进入抢红包前一秒动画 -->
      <EnterLoading v-if="showEnterLoading"></EnterLoading>
      <div class="create_club" v-if="!showEnterLoading">
        <div class="name">{{clubInfo.clubId}} | {{clubInfo.clubName}}</div>
        <div class="create" @click="gotoCreate">我也要创建</div>
      </div>
      <!--所有红包列表-->
      <div class="index_b" v-if="!showEnterLoading && fatheritem.room_list.length > 0" v-for="(fatheritem, fatherindex) in clubInfo.roomList" :key="fatherindex">
        <!--单个规则红包列表-->
        <p class="index_b_p1"> &nbsp {{fatheritem.type}}人抢 &nbsp </p>
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
      <!--红包列表为空时 , 提示 -->
      <div class="create_tips" v-if="clubInfo.roomList.length == 0 && !$store.state.sideBar">
        <div class="tips">该俱乐部尚未创建红包 , 未创建房间的俱乐部将在72小时后清除.</div>
      </div>
    </div>
  </div>
</template>


<script>
  import HeadPart from '@/components/HeadPart/HeadPart';
  import EnterLoading from '@/components/EnterLoading/EnterLoading';
  import { getClubInfo , storage , scatterOneStop } from '@/servers';
  import { Toast } from 'vant';
  export default {
    name: 'Club',
    components: {
      HeadPart,
      EnterLoading
    },
    data() {
      return {
        tablist:[],
        clubInfo:{
          clubId:'',
          clubName:'',
          roomList:[]
        },
        showEnterLoading:false
      }
    },
    mounted(){
      for (let i =0;i<5;i++){
          this.tablist.push({tab1:"0.5 POG", tab2:i+5+"人抢"})
      }
    },
    created() {
      this.getClubInfo();
    },
    methods: {
      // 获取俱乐部信息
      getClubInfo(){
        let data = {
          club_id : storage.get('clubId')
        }
        getClubInfo(data).then(res => {
          console.log("获取俱乐部信息:",res)
          if(res.code == 1){
            this.clubInfo.clubId = res.data.club_id;
            this.clubInfo.clubName = res.data.club_name;
            this.clubInfo.roomList = res.data.type_list;
          }
        }).catch(err =>{
          console.log("获取俱乐部信息失败:",err)
        });
      },
      // 跳转创建俱乐部
      gotoCreate(){
        if(this.$store.state.myClubId !== ''){
          console.log("我的俱乐部id:",this.$store.state.myClubId)
          Toast('你已创建过俱乐部');
          return;
        }
        this.$router.push({path: '/createclub'});
      },
      // 进入抢红包
      async gotoGame(type , room_id , amount){
        console.log("roomType:",type);
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
                storage.set('clubId',this.clubInfo.clubId);
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
            storage.set('clubId',this.clubInfo.clubId);
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



  /*主页主要部分*/
  .indexpage{
     padding-top: 8vh;
  }
  
  /*第二部分*/
  .indexpage .index_b{
    padding: 0px 3vw 2vh 3vw;
    /*height: 50vh;*/
    /* background: #c13939; */
    min-height: 100px;
  }
  .indexpage .index_b .index_b_p1{
    color:aliceblue;
    margin: 0px;
    padding: 1vh 0px 0.3vh 0px;
    text-align: center;
    text-decoration: underline;
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
    font-size: 14px;
    word-break: break-word;
    color: white;
    letter-spacing: 1px;
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
    overflow: hidden;
  }


  .create_club{
    width: 100%;
    height:50px;
    background-color: #7B3233;
    display: flex;
  }
  .create_club .name{
    line-height: 50px;
    color: aliceblue;
    margin-left: 20px;
  }
  .create_club .create{
    height: 30px;
    padding-left: 20px;
    padding-right: 20px;
    background-color: #ff9900;
    line-height: 30px;
    box-shadow: 2px 2px 5px #333333;
    color: aliceblue;
    border-radius: 5px;
    margin: auto 20px auto auto;
  }





</style>