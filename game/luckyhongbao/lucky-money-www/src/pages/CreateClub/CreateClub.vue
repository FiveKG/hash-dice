<template>
  <div>
    <HeadPart></HeadPart>
    <div class="createclub">

      <!--第一部分 水印-->
      <div class="createclub_a">

      </div>
      <!--第二部分-->
      <div class="createclub_b">
        <ul>
          <!-- <li v-for="(item, index) in clubId" :key="index">
            <input v-model="clubId[index]" type="number" oninput="if(value.length>1)value=value.slice(0,1)">
          </li> -->
          <li>
            <input v-model="clubId[0]" type="number" oninput="if(value.length>1)value=value.slice(0,1)" ref="club0" autofocus>
          </li>
          <li>
            <input v-model="clubId[1]" type="number" oninput="if(value.length>1)value=value.slice(0,1)" ref="club1" >
          </li>
          <li>
            <input v-model="clubId[2]" type="number" oninput="if(value.length>1)value=value.slice(0,1)" ref="club2">
          </li>
          <li>
            <input v-model="clubId[3]" type="number" oninput="if(value.length>1)value=value.slice(0,1)" ref="club3">
          </li>
          <li>
            <input v-model="clubId[4]" type="number" oninput="if(value.length>1)value=value.slice(0,1)" ref="club4">
          </li>
          <li>
            <input v-model="clubId[5]" type="number" oninput="if(value.length>1)value=value.slice(0,1)" ref="club5">
          </li>
          <li style="border-bottom:snow;">
            <img src="../../assets/delete.png" alt="" style="width:20px;height:20px;margin:auto;" @click="deleteClubId">
          </li>
        </ul>
        <p>请输入俱乐部 ID . 6 位数字<span style="color: #ffac2f;padding-left: 3vw">*</span></p>
      </div>

      <!--第三部分-->
      <div class="createclub_c">
        <p><input v-model="clubName" type="text" :minlength="2" :maxlength="15" ref="input"></p>
        <p>请输入俱乐部名称 . 2-15 位<span style="color: #ffac2f;padding-left: 3vw">*</span></p>
      </div>


      <!--第四部分-->
      <div class="createclub_b">
        <ul>
          <li>
            <input v-model="inviteClubId[0]" type="number" oninput="if(value.length>1)value=value.slice(0,1)" ref="invite0">
          </li>
          <li>
            <input v-model="inviteClubId[1]" type="number" oninput="if(value.length>1)value=value.slice(0,1)" ref="invite1">
          </li>
          <li>
            <input v-model="inviteClubId[2]" type="number" oninput="if(value.length>1)value=value.slice(0,1)" ref="invite2">
          </li>
          <li>
            <input v-model="inviteClubId[3]" type="number" oninput="if(value.length>1)value=value.slice(0,1)" ref="invite3">
          </li>
          <li>
            <input v-model="inviteClubId[4]" type="number" oninput="if(value.length>1)value=value.slice(0,1)" ref="invite4">
          </li>
          <li>
            <input v-model="inviteClubId[5]" type="number" oninput="if(value.length>1)value=value.slice(0,1)" ref="invite5">
          </li>
          <li style="border-bottom:snow;">
            <img src="../../assets/delete.png" alt="" style="width:20px;height:20px;margin:auto;" @click="deleteInviteClubId">
          </li>
        </ul>
        <p>请输入推荐俱乐部 ID . <span style="color: #ffac2f">选填</span> . 6 位数字</p>
      </div>

      <!--第五部分-->
      <div class="createclub_d">请确定俱乐部 ID、名称，创建后不可修改</div>

      <!--第六部分-->
      <div class="createclub_e">
        <p><span>俱乐部权益及规则</span></p>
        <p>1、俱乐部创建者可获每轮红包 2.5% 的俱乐部收益；<br><span style="color: #ffac2f">俱乐部创建时被推荐或创建后推荐其他俱乐部，推荐双方均为有效俱乐部时，则双方均可获 3.5% 的俱乐部收益。</span></p>
        <p>2、俱乐部创建后 72 小时内创建红包房间，俱乐部为有效俱部，在72小时内未创建红包房间，将注销您的俱乐部；</p>
        <p>3、每周（周一 00:00:00 至 周日 23:59:59）将对俱乐部发出红包金额进行排名，排名前五名可获当前分红池累计金额的 10%、5%、3%、1.5%、0.5%分红。</p>
      </div>

      <!--第七部分-->
      <div class="createclub_f" v-if="!$store.state.sideBar" style="position: fixed;width: 100%;bottom: 0px;"> 
        <span @click="createClub">确认创建</span>
      </div>

    </div>
  </div>

</template>


<script>
  import HeadPart from '@/components/HeadPart/HeadPart';
  import { createClub } from '@/servers';
import { Toast } from 'vant';
  export default {
    name: 'CreateClub',
    components: {
      HeadPart
    },
    data() {
      return {
        clubId:['','','','','',''],//俱乐部id
        clubName:'',//俱乐部名称
        inviteClubId:['','','','','',''],//推荐俱乐部id
        inputFocus:'club0',//光标自动聚焦
        inputIndex:0,//光标下标
      }
    },
    mounted(){
      console.log(document.body.clientHeight,document.getElementsByTagName("body")[0].clientHeight)
      
      // $('body').height(document.getElementsByTagName("body")[0].clientHeight);
      // this.$refs.input.focus();
      // this.$refs.club1.focus();


    },
    created() {


    },
    methods: {
      // 确认创建俱乐部
      createClub(){
        console.log("俱乐部id:",this.clubId);
        console.log("俱乐部名称:",this.clubName);
        console.log("推荐俱乐部id:",this.inviteClubId);
        if(!this.$store.state.eosAccount){
          Toast('Scatter已锁定');
          return;
        }
        let data = {
          club_id:'',
          club_name:this.clubName,
          refer_club_id:'',
          creator_name:this.$store.state.eosAccount.name,
          room_count:0
        }
        var clubId = this.clubId;
        var inviteClubId = this.inviteClubId;
        clubId.forEach(id => {
          console.log("Id:",id);
          data.club_id = data.club_id+id;
        });
        inviteClubId.forEach(id => {
          console.log("invite_id:",id);
          data.refer_club_id = data.refer_club_id+id;
        });
        if(data.club_id == '' || data.club_id.length < 6 ){
          Toast('请输入完整ID');
          return;
        }
        if(data.refer_club_id.length < 6 && data.refer_club_id.length > 0){
          Toast('请输入完整推荐俱乐部ID');
          return;
        }
        if(data.club_name == '' || 2 > data.club_name.length || data.club_name.length > 15){
          Toast('请输入俱乐部名称');
          return;
        }
        console.log("data:",data);
        // 创建俱乐部
        createClub(data).then(res => {
          console.log("创建俱乐部:",res)
          if(res.code == 1){
            Toast('俱乐部创建成功');
            this.$store.commit('setMyClubId',data.club_id);
            this.$router.push({path: '/myclub'});
          }else{
            Toast(res.desc);
          }
          
        }).catch(err =>{
          console.log("创建俱乐部失败:",err);
        });
      },
      // 删除俱乐部id
      deleteClubId(){
        for(var i=0 ; i<this.clubId.length ; i++){
          if(this.clubId[this.clubId.length-i-1] != ''){
            this.$set(this.clubId , this.clubId.length-i-1 , '');
            break;
          }
        }
      },
      // 删除推荐俱乐部id
      deleteInviteClubId(){
        for(var i=0 ; i<this.inviteClubId.length ; i++){
          if(this.inviteClubId[this.inviteClubId.length-i-1] != ''){
            this.$set(this.inviteClubId , this.inviteClubId.length-i-1 , '');
            break;
          }
        }
      }
    },
    watch: {
      clubId(value , oldvalue){
        for(var i=0 ; i<value.length ; i++){
          if(value[i] == ''){
            switch (i) {
              case 0:{
                console.log("执行case0?")
                this.$refs.club0.focus();
                break;
              }
              case 1:{
                console.log("执行case1?")
                this.$refs.club1.focus();
                break;
              }
              case 2:{
                console.log("执行case2?")
                this.$refs.club1.blur();
                this.$refs.club2.focus();
                break;
              }
              case 3:{
                console.log("执行case3?")
                this.$refs.club2.blur();
                this.$refs.club3.focus();
                break;
              }
              case 4:{
                console.log("执行case4?")
                this.$refs.club3.blur();
                this.$refs.club4.focus();
                break;
              }
              case 5:{
                console.log("执行case5?")
                this.$refs.club4.blur();
                this.$refs.club5.focus();
                break;
              }
            }
            break;
          }
        }
      },
      inviteClubId(value){
        for(var i=0 ; i<value.length ; i++){
          if(value[i] == ''){
            switch (i) {
               case 0:{
                console.log("执行case1?")
                this.$refs.invite0.focus();
                break;
              }
              case 1:{
                console.log("执行case1?")
                this.$refs.invite1.focus();
                break;
              }
              case 2:{
                console.log("执行case2?")
                this.$refs.invite1.blur();
                this.$refs.invite2.focus();
                break;
              }
              case 3:{
                console.log("执行case3?")
                this.$refs.invite2.blur();
                this.$refs.invite3.focus();
                break;
              }
              case 4:{
                console.log("执行case4?")
                this.$refs.invite3.blur();
                this.$refs.invite4.focus();
                break;
              }
              case 5:{
                console.log("执行case5?")
                this.$refs.invite4.blur();
                this.$refs.invite5.focus();
                break;
              }
            }
            break;
          }
        }
      },
    }
  }
</script>

<style scoped>
  /*第二部分*/
  .createclub{
    padding-top: 50px;
  }
  .createclub_b{
    height: auto;
    /*background: skyblue;*/
    margin: 15px 0px;
  }
  .createclub_b ul{
    width: 85vw;
    margin: 0 auto;
    /* padding:unset; */
  }
  .createclub_b ul li{
    vertical-align:top;
    display: inline-block;
    width: 10.5vw;
    height: 50px;
    font-size: 1.3rem;
    color: white;
    list-style: none;
    line-height: 50px;
    margin-top: 10px;
    /* margin-right:2px; */
    border-bottom: 1px solid #ffac2f;
  }
  .createclub_b ul li input{
    height: 100%;
    width: 100%;
    background: none;
    border: none;
    text-align: center;
  }
  .createclub_b p{
    margin: 10px 0px;
    text-align: center;
    color: white;
  }

  /*第三部分*/
  .createclub_c{
    height: auto;
    margin: 40px 0px 35px 0px;
  }
  .createclub_c p{
    margin: 0px;
  }
  .createclub_c p:nth-child(1){
    height: 45px;
    width: 85vw;
    margin: 0 auto;
    line-height: 45px;
    border-bottom: 1px solid #ffac2f;
    text-align: center;
  }
  .createclub_c p:nth-child(2){
    text-align: center;
    color: white;
    margin-top: 8px;
  }
  .createclub_c p:nth-child(1) input{
    height: 100%;
    width: 100%;
    background: none;
    border: none;
    text-align: center;
    color: white;
  }

  /*第五部分*/
  .createclub_d{
    margin: 50px 0px 16px 0px;
    text-align: center;
    font-size: 0.9rem;
    color: #ffac2f;
    padding: 5px 0px;
    border-bottom: 1px dashed  #ffac2f;
  }

  /*第六部分*/
  .createclub_e{
    padding: 0px 3vw 70px 3vw;
  }
  .createclub_e p{
    margin: 10px 0px;
    color: white;
  }
  .createclub_e p:nth-child(1){
    color: #ffac2f;
    margin: 20px 0px;
  }
  .createclub_e p:nth-child(1) span{
    border-bottom: 1px solid #ffac2f;
  }

  /*第七部分*/
  .createclub_f{
    margin-top: 40px;
    height: 70px;
    background: #c13939;
  }
  .createclub_f span{
    display: inline-block;
    height: 45px;
    background: #ff9900;
    line-height: 45px;
    padding: 0px 7vw;
    border-radius: 5px;
    float: right;
    margin: 10px 5vw;
    color: white;
    font-size: 1.1rem;
    font-weight: 500;
    -moz-box-shadow:1px 3px 8px 0px #333333;
    -webkit-box-shadow:1px 3px 8px 0px #333333;
    box-shadow:1px 3px 8px 0px #333333;
  }

</style>













