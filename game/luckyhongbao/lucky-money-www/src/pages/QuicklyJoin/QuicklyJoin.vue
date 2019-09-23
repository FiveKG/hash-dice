<template>
  <div>
    <HeadPart></HeadPart>
    <div class="quicklyjoin">
      <!--第一部分-->
      <div class="quicklyjoin_a">
        <ul>
          <li>俱乐部 ID</li>
          <li v-for="(item, index) in clubId" :key="index">{{item}}</li>
        </ul>
      </div>

      <!--第二部分-->
      <div class="quicklyjoin_b">
        <div class="quicklyjoin_b_a" v-for="(item,index) in keyboard" :key="index" @click="inputClubId(item)">
          <div v-if="item != -2 && item != -1" >{{item}}</div>
          <div v-if="item == -2">重输</div>
          <div v-if="item == -1">
            <img src="../../assets/08.png" alt="huitui..."/>
          </div>
        </div>
      </div>

      <!--第三部分-->
      <div class="quicklyjoin_c">
        <div class="quicklyjoin_c_a">俱乐部加入历史</div>
        <div class="quicklyjoin_c_b" @click="gotoCreate">我也要创建</div>
      </div>

      <!--第四部分-->
      <div class="quicklyjoin_d">
        <div class="quicklyjoin_d_box" v-for="(item,index) in joinedClub" :key="index" @click="enterClub(item.club_id)">
          <div class="quicklyjoin_d_box1">
            <div class="quicklyjoin_d_box1_a">
              <img src="../../assets/02.png" height="80%" style="margin: 10% auto 0 auto">
            </div>
            <div class="quicklyjoin_d_box1_b">
              <p>{{item.club_name}}</p>
              <p>{{item.club_id}}</p>
              <!-- <p>CLUB</p> -->
            </div>
          </div>
        </div>
      </div>

     </div>
  </div>

</template>


<script>
  import HeadPart from '@/components/HeadPart/HeadPart';
  import { Toast } from 'vant';
  import { joinClub , getJoinedClub , storage } from '@/servers';
  export default {
    name: 'QuicklyJoin',
    components: {
      HeadPart
    },
    data() {
      return {
        keyboard:[1,2,3,4,5,6,7,8,9,-2,0,-1],
        clubId:['','','','','',''],
        joinedClub:[],//用户加入过的俱乐部列表
      }
    },
    mounted(){


    },
    created() {
      this.getJoinedClub();

    },
    methods: {
      // 输入俱乐部id , 输入完整后进入俱乐部
      inputClubId(item){
        if(item != -2 && item != -1){
          for(var i= 0 ; i< this.clubId.length ; i++){
            if(this.clubId[i] === ''){
              console.log("????")
              this.$set(this.clubId,i,item);
              break;
            }
          }
        }else if(item == -1){
          for(var i= 0 ; i< this.clubId.length ; i++){
            if(this.clubId[this.clubId.length-1-i] !== ''){
              this.$set(this.clubId,this.clubId.length-1-i , '');
              break;
            }
          }
        }else if(item == -2){
          for(var i= 0 ; i< this.clubId.length ; i++){
            if(this.clubId[this.clubId.length-1-i] !== ''){
              this.$set(this.clubId,this.clubId.length-1-i , '');
            }
          }
        }
        console.log("this.clubId:",this.clubId)
        if(this.clubId[5] !== ''){
          var club_id = '';
          for(var i=0 ; i<this.clubId.length ; i++){
            club_id = club_id + this.clubId[i];
          }
          let data ={
            club_id : club_id
          }
          joinClub(data).then(res => {
            console.log("加入俱乐部:",res)
            if(res.code == 1){
              storage.set('clubId',club_id);
              this.$router.push({path: '/club'});
            }else{
              Toast(res.desc);
              return;
            }
          }).catch(err =>{
            Toast("加入俱乐部失败");
            console.log("加入俱乐部失败:",err)
          });
        }
      },
      // 获取用户加入的俱乐部信息
      getJoinedClub(){
        getJoinedClub().then(res => {
          console.log("获取用户加入的俱乐部信息:",res)
          if(res.code == 1){
            this.joinedClub = res.data;
          }else{
            Toast(res.desc);
          }
        }).catch(err =>{
          console.log("获取用户加入的俱乐部信息失败:",err)
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
      // 进入已加入的俱乐部
      enterClub(club_id){
        storage.set('clubId',club_id);
        this.$router.push({path: '/club'});
      }
    }
  }
</script>

<style>
  .quicklyjoin{
    overflow: hidden;
    padding-top: 10vh;
  }
  /*第一部分*/
  .quicklyjoin .quicklyjoin_a{
    height: 8vh;
    background: #c13939;
    line-height: 8vh;
    margin: 1.5vh 0px;
    text-align: center;
    overflow: hidden;
    font-size: 1rem;
  }
  .quicklyjoin_a ul li{
    vertical-align:top;
    display: inline-block;
    background: #a93a3c;
    width: 11vw;
    height: 6vh;
    border-radius: 5px;
    font-size: 1.3rem;
    color: white;
    list-style: none;
    line-height: 6vh;
    margin-top: 1vh;
    margin-right: 2px;
  }
  .quicklyjoin_a ul li:nth-child(1){
    width: 22vw;
    background: none;
    font-size: 1rem;
    color: #ff9900;
    font-size: 1.1rem;
  }

  /*第二部分*/
  .quicklyjoin_b{
    padding: 2vh 3vw;
    background: #c13939;
    /*margin: 1.5vh 0px;*/
    margin: 1.5vh auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: center;
    align-items: flex-start;
  }
  .quicklyjoin_b .quicklyjoin_b_a{
    background: #ff9900;
    width: 28vw;
    height: 9vh;
    order: 0;
    flex: 0 1 auto;
    align-self: auto;
    margin: 1vh 0px;
    border-radius: 5px;
    text-align: center;
    color: white;
    line-height: 9vh;
    font-size: 1.5rem;
  }
  .quicklyjoin_b .quicklyjoin_b_a img{
    vertical-align: middle;
    width: 10vw;
  }

  /*第三部分*/
  .quicklyjoin_c{
    height: 8vh;
    background: #c13939;
    line-height: 8vh;
    margin: 1.5vh 0px;
    text-align: center;
    overflow: hidden;
    font-size: 1rem;
  }
  .quicklyjoin_c .quicklyjoin_c_a{
    float: left;
    padding-left: 3vw;
    color: #ff9900;
    font-size: 1.1rem;
  }
  .quicklyjoin_c .quicklyjoin_c_b{
    float: right;
    background: #ff9900;
    font-size: 1.1rem;
    height: 5vh;
    margin-top: 1vh;
    padding: 0.5vh 5vw;
    margin-right: 3vw;
    line-height: 5vh;
    border-radius: 5px;
    color: white;
    font-size:1rem;
    -moz-box-shadow:1px 3px 8px 0px #333333;
    -webkit-box-shadow:1px 3px 8px 0px #333333;
    box-shadow:1px 3px 8px 0px #333333;
  }

  /*第四部分*/
  .quicklyjoin_d{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: center;
    align-items: flex-start;
    padding: 1vh 3vw 5vh 3vw;

  }
  .quicklyjoin_d_box{
    border-radius:5px;
    order: 0;
    flex: 0 1 auto;
    align-self: auto;
    margin: 0.7vh 0px;
    height: 11vh;
    width: 46vw;
    background: #ff9900;
    border-radius: 5px;
  }
  .quicklyjoin_d_box1 .quicklyjoin_d_box1_a{
    width: 40%;
    height: 11vh;
    float: left;
    text-align: center;
  }
  .quicklyjoin_d_box1 .quicklyjoin_d_box1_b{
    width: 58%;
    height: 100%;
    float: right;
    /* position: relative; */
  }
  .quicklyjoin_d_box1 .quicklyjoin_d_box1_b p{
    margin: 0px;
    font-size: 1.2rem;
    color: white;
    letter-spacing: 1px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .quicklyjoin_d_box1 .quicklyjoin_d_box1_b p:nth-child(1){
    margin-top: 10%;
  }
  .quicklyjoin_d_box1 .quicklyjoin_d_box1_b p:nth-child(3){
    font-size: 2.2rem;
    font-weight: bold;
    position: absolute;
    top: 20%;
    right: 0px;
    opacity: 0.2;
  }



</style>













