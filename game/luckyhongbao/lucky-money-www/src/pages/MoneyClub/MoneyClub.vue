<template>
  <div>
    <!--头部-->
    <HeadPart :amount="room_info.amount" @childshow="toogleShow" @roomShow="toogleRoomShow"></HeadPart>
    <!-- 红包列表 -->
    <div class="pack_list" ref="packList" :style="{height:clientHeight+'px'}">
      <!-- 已开奖红包 -->
      <div
        class="red_pack"
        v-for="(item, index) in packList"
        @click="handleHasGrabbedThePage(item.game_id)"
        :key="index"
      >
        <div class="headimg">
          <div class="round">
            <img src="../../assets/02.png" />
          </div>
        </div>
        <div class="pack">
          <div
            class="author_name"
          >{{item.account_name}} {{item.create_time}} #{{packTotal-(packList.length-index)}}轮</div>
          <div class="index_b_box">
            <div class="index_b_box1">
              <div class="index_b_box1_a">
                <img src="../../assets/01.png" height="70%" style="margin: 15% auto 0 auto" />
              </div>
              <div class="index_b_box1_b">
                <p>{{item.left_count?`已领取${item.left_count}个`:`已抢完`}}</p>
              </div>
            </div>
            <div class="index_b_box2">
              抢得金额最大者发下一轮红包
              <!-- {{item.game_id}} -->
            </div>
          </div>
          <div
            class="winner"
            v-for="(son_item, son_index) in item.results"
            :key="son_index"
            v-if="Number(son_item.amount) > 0"
          >
            <img src="../../assets/02.png" alt />
            <div class="text">
              <div>{{son_item.account_name === name ? '我':son_item.account_name}} 获得：{{Number(son_item.amount).toFixed(8)}} UE</div>
            </div>
          </div>
          <div class="next_info">
            <div style="padding-left:10px;">由 {{item.nextSender}} 发出下一轮红包</div>
          </div>
        </div>
      </div>
      <!-- 未开奖红包 -->
      <div class="red_pack" @click="checkPack" v-if="packNotOpen">
        <div class="headimg">
          <div class="round">
            <img src="../../assets/02.png" alt />
          </div>
        </div>
        <div class="pack">
          <div
            class="author_name"
          >{{packNotOpen.account_name}} ({{packNotOpen.create_time}}) #{{packTotal}}轮</div>
          <div class="index_b_box">
            <div class="index_b_box1" style="background: #ff9900;">
              <div class="index_b_box1_a">
                <img src="../../assets/02.png" height="70%" style="margin: 15% auto 0 auto" />
              </div>
              <div class="index_b_box1_b">
                <p>大吉大利 , 恭喜发财</p>
              </div>
            </div>
            <div class="index_b_box2">
              抢得金额最大者发下一轮红包
              <!-- {{packNotOpen.game_id}} -->
            </div>
          </div>
          <div class="finish" v-if="false">
            <div class="text">36秒抢完 23:02:36 Block # 29,321,055</div>
          </div>
          <div
            class="block_id"
            v-if="false"
          >Block ID:6400bce661000b18c376329b214ebd6400bce661000b18c376329b214ebd</div>
          <!-- <div class="block_id" v-if="false">加入算法计算出随机数，透明公正不可预测</div> -->
          <div class="winner" v-if="false">
            <img src="../../assets/02.png" alt />
            <div class="text">
              <div>thisis2ndeos 获得：</div>
              <div>0.1112 UE + 1.0000 RB</div>
            </div>
          </div>
          <div class="next_info" v-if="false">
            <div style="padding-left:10px;">由 sodakksodakk 发出下一轮红包</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 开奖蒙层 -->
    <van-popup
      class="dingo_close"
      v-model="showOpen"
      @click-overlay="closeOpen"
      style="width:80%;height:70%;border-radius: 10px;"
    >
      <!-- 未开 -->
      <div class="open_dialog" v-if="packState == 0">
        <div class="bg_img">
          <div></div>
          <img src="../../assets/u10043.svg" />
        </div>
        <div class="logo">
          <div class="round">
            <img src="../../assets/02.png" alt />
          </div>
        </div>
        <div class="wish">大吉大利&emsp;恭喜发财</div>

        <div class="open">
          <div class="round" v-if="!openLoad" @click="playGame">開</div>
          <div class="round round_load" v-else>開</div>
        </div>
        <!-- <div class="website">luckymoney</div> -->
        <div class="type">{{roomAmount}} UE 红包</div>
      </div>
      <!-- 抢到 -->
      <div class="winner_dialog" v-if="packState == 1">
        <div class="logo">
          <div class="round">
            <img src="../../assets/01.png" alt />
          </div>
        </div>
        <div class="wish">大吉大利&emsp;恭喜发财</div>
        <div class="type">{{ownEnvelope}} UE</div>
        <div class="tips">已存入账户余额，可再抢红包</div>
        <div class="name_list">
          <div class="name_item" v-for="(item,index) in packResult.grabbed_list" :key="index">
            <div v-if="!Grab">
              
              <div class='item_name'>{{index+1}} . {{item.account_name}}</div>
              <div v-if='name==item.account_name' class="item_amount">
                {{item.amount}}UE
              </div>
              <div v-else class='item_amount'> 
                <img src="../../assets/u10085.png" width="20px" height="20px" />&nbsp;
                <img src="../../assets/u10085.png" width="20px" height="20px" />&nbsp;
                <img src="../../assets/u10085.png" width="20px" height="20px" />
              </div>
            </div>
              <div  v-if="Grab">
              <div
              :class="big === item.amount?'item_name red':'item_name'"
            >{{index+1}} . {{item.account_name}}</div>
              <div
              :class="big === item.amount?'item_amount red':'item_amount'"
              >
                {{item.amount}}UE
              </div>
              </div>
          </div>
        </div>
      </div>
      <!-- 已抢完 -->
      <div class="open_dialog" v-if="packState == 2">
        <div class="bg_img">
          <div></div>
          <img src="../../assets/u10043.svg" />
        </div>
        <div class="logo">
          <div class="round">
            <img src="../../assets/02.png" alt />
          </div>
        </div>
        <div class="type">{{roomAmount}} UE 红包</div>
        <div class="wish">{{errorMsg}}</div>
      </div>
      <div class="close">
        <svg
          @click="()=>{showOpen = false}"
          class="icon"
          width="1.5rem"
          height="1.5rem"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#fff"
            d="M561.036 501.899l287.258-285.766c6.32-6.273 10.231-14.962 10.231-24.567 0-9.535-3.856-18.171-10.092-24.429-6.268-6.325-14.959-10.243-24.565-10.243-9.538 0-18.174 3.862-24.429 10.105l-287.329 285.801-284.828-285.702c-13.479-13.515-35.414-13.582-48.997-0.071-13.55 13.515-13.582 35.45-0.071 49.031l284.761 285.628-287.12 285.596c-6.32 6.273-10.23 14.962-10.23 24.567 0 9.535 3.856 18.171 10.092 24.429 6.267 6.314 14.951 10.223 24.549 10.223 0.007 0 0.013 0 0.021 0 8.835 0 17.67-3.362 24.429-10.081l287.191-285.663 287.431 288.297c6.248 6.293 14.901 10.189 24.465 10.189 0.023 0 0.048 0 0.072 0 0.002 0 0.007 0 0.015 0 9.545 0 18.187-3.866 24.444-10.118 13.55-13.515 13.582-35.414 0.071-48.996l-287.368-288.231z"
          />
        </svg>
      </div>
    </van-popup>
    <!-- 充值蒙层 -->
    <Recharge></Recharge>
    <!-- 红包来啦音频 -->
    <audio ref="audio" @pause="audio.playing = true" @play="audio.playing = false">
      <source src="../../assets/packComming.mp3" type="audio/mpeg" />
    </audio>
    <van-popup v-model="show" position="bottom">
      <div class="items">
        <div class="title">
          <div>选择红包专场</div>
          <div>
            <svg
              @click="()=>{show=false}"
              class="icon"
              width="1.5rem"
              height="1.5rem"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#999"
                d="M561.036 501.899l287.258-285.766c6.32-6.273 10.231-14.962 10.231-24.567 0-9.535-3.856-18.171-10.092-24.429-6.268-6.325-14.959-10.243-24.565-10.243-9.538 0-18.174 3.862-24.429 10.105l-287.329 285.801-284.828-285.702c-13.479-13.515-35.414-13.582-48.997-0.071-13.55 13.515-13.582 35.45-0.071 49.031l284.761 285.628-287.12 285.596c-6.32 6.273-10.23 14.962-10.23 24.567 0 9.535 3.856 18.171 10.092 24.429 6.267 6.314 14.951 10.223 24.549 10.223 0.007 0 0.013 0 0.021 0 8.835 0 17.67-3.362 24.429-10.081l287.191-285.663 287.431 288.297c6.248 6.293 14.901 10.189 24.465 10.189 0.023 0 0.048 0 0.072 0 0.002 0 0.007 0 0.015 0 9.545 0 18.187-3.866 24.444-10.118 13.55-13.515 13.582-35.414 0.071-48.996l-287.368-288.231z"
              />
            </svg>
          </div>
        </div>
        <div
          class="item"
          v-for="(item,index) in datalist.room_list"
          :key="index"
          @click="tooglePage(item)"
        >
          <div>{{item.amount}} UE - {{datalist.type}} 人抢专场</div>
          <div v-if="Number(item.amount) === roomAmount">
            <svg
              class="icon"
              width="1.5rem"
              height="1.5rem"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#ff9900"
                d="M886.4 240c-12.8-12.8-32-12.8-44.8 0L364.8 716.8l-182.4-182.4c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l204.8 204.8c6.4 6.4 12.8 9.6 22.4 9.6 9.6 0 16-3.2 22.4-9.6L886.4 284.8c12.8-12.8 12.8-32 0-44.8z"
              />
            </svg>
          </div>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="usershow" position="bottom">
      <div class="userinfo">
        <div>
          <svg
            class="icon"
            width="1.8rem"
            height="1.8rem"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#FF9900"
              d="M959.68 921.024c-15.232-181.696-139.648-331.968-307.84-386.624 70.464-45.632 117.248-124.48 117.248-214.464C769.152 178.624 654.208 64 512.512 64 370.752 64 255.808 178.624 255.808 319.936c0 89.984 46.784 168.832 117.248 214.528-168.192 54.592-292.544 204.864-307.84 386.56-0.192 3.456-0.64 5.44 0 10.176C66.496 947.2 80.64 960 96.704 960c17.92 0 32.064-14.656 32.064-32 16.704-197.76 182.272-351.936 383.744-351.936 201.408 0 366.976 154.176 383.68 351.936 0 17.344 14.144 32 32.064 32 16.064 0 30.208-12.8 31.424-28.8C960.32 926.464 959.936 924.416 959.68 921.024zM320 319.936C320 213.952 406.208 128 512.512 128s192.448 85.952 192.448 191.936c0 106.048-86.144 192-192.448 192S320 425.984 320 319.936z"
            />
          </svg>
          {{name}}
        </div>
        <div>
          <img src="../../assets/10.png" alt="#" />
          <img src="../../assets/09.png" alt="#" />
          <svg
            @click="()=>{usershow=false}"
            class="icon"
            width="1.5rem"
            height="1.5rem"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#999"
              d="M561.036 501.899l287.258-285.766c6.32-6.273 10.231-14.962 10.231-24.567 0-9.535-3.856-18.171-10.092-24.429-6.268-6.325-14.959-10.243-24.565-10.243-9.538 0-18.174 3.862-24.429 10.105l-287.329 285.801-284.828-285.702c-13.479-13.515-35.414-13.582-48.997-0.071-13.55 13.515-13.582 35.45-0.071 49.031l284.761 285.628-287.12 285.596c-6.32 6.273-10.23 14.962-10.23 24.567 0 9.535 3.856 18.171 10.092 24.429 6.267 6.314 14.951 10.223 24.549 10.223 0.007 0 0.013 0 0.021 0 8.835 0 17.67-3.362 24.429-10.081l287.191-285.663 287.431 288.297c6.248 6.293 14.901 10.189 24.465 10.189 0.023 0 0.048 0 0.072 0 0.002 0 0.007 0 0.015 0 9.545 0 18.187-3.866 24.444-10.118 13.55-13.515 13.582-35.414 0.071-48.996l-287.368-288.231z"
            />
          </svg>
        </div>
      </div>
      <div class="playingmethod">
        <div @click="goPlayIngmethodPage">
          <img src="../../assets/u9832.png" alt="玩法" height="30px" />玩法技巧
        </div>
      </div>
    </van-popup>
  </div>
</template>


<script>
import io from "socket.io-client";
import { Toast, Popup } from "vant";
import HeadPart from "@/components/HeadPart/HeadPart";
import Recharge from "@/components/Recharge/Recharge";
import { Notify } from "vant";

// import '@/lib/local/boot/index.js';
// import pomelo  from 'pomelo-jsclient-websocket';
import Eos from "eosjs";
import {
  baseURL,
  storage,
  getRoomRedPack,
  getAccountBalance,
  openPack,
  checkPack,
  debugTest,
  getClubInfo
} from "@/servers";
export default {
  name: "moneyroom",
  components: {
    HeadPart,
    Recharge
  },
  data() {
    return {
      maxAmount: null,
      usershow: false,
      show: false, //控制弹出层
      roomAmount: "", //红包金额
      roomType: storage.get("roomType"), //房间类型 , 几人抢
      roomId: storage.get("roomId"), //房间id
      onlineNum: 0, //在线人数
      showOpen: false, //开奖蒙层
      openLoad: false, //是否点击'開', true要转
      packState: 0, //红包状态 , 0未开 , 1抢到 , 2抢不到
      packList: [], //红包列表
      clientHeight: "height:500px",
      packNotOpen: [], //未开奖红包
      packResult: [], //抢红包结果
      timer: null, //
      UesrList: [], //其他抢到的人
      errorMsg: "红包抢完了，下次手快些",
      audio: {
        // 该字段是音频是否处于播放状态的属性
        playing: false
      },
      name: null,
      timer: null,
      packTotal: 0, //该房间红包总数
      datalist: {}, //5人抢所有红包信息
      room_list: [], //房间列表
      room_info: {},
      ownEnvelope:0,//自己抢到的红包
      big:0,    //最大的人的UE数
      Grab:false,//红包是否抢完
    };
  },
  mounted() {
    // 获取设备高度
    var clientHeight = document.documentElement.clientHeight;
    this.clientHeight = clientHeight - clientHeight * 0.19;
    console.log("获取设备高度:", this.clientHeight);
  },
  async created() {
    this.getClubInfo();
  },
  methods: {
    // 打开已抢红包
    handleHasGrabbedThePage(game_id) {
      console.log("触发了");
      this.packList.forEach(element => {
        if (game_id === element.game_id) {
          this.packState = 1;
          this.showOpen = true;
          let max = element.results[0].amount;
          for (let i = 0; i < element.results.length; i++) {
            element.results[i].amount = Number(element.results[i].amount);
            element.results[i].html =
              element.results[i].amount.toFixed(8) + "UE";
            if (element.results[i].amount > max) {
              max = element.results[i].amount;
            }
            if (element.results[i].account_name === name) {
              element.amount = element.results[i].amount;
            } else {
              this.packState = 1;
              this.showOpen = true;
            }
          }

          this.packResult = element;
          this.packResult.grabbed_list = element.results;
          for(var i=0;i<this.packResult.grabbed_list.length;i++){
                if(this.packResult.grabbed_list[i].amount>this.big){
                  this.big=this.packResult.grabbed_list[i].amount
                }
                if(this.packResult.grabbed_list[i].account_name==this.name){
                  this.ownEnvelope=this.packResult.grabbed_list[i].amount
                }    
              }
          if(this.packResult.grabbed_list.length>4){
            this.Grab=true
          }
          this.maxAmount = Number(max);
        }
      });
    },
    // 切换场次
    tooglePage(val) {
      console.log('val',val);
      localStorage.setItem("roomId", val.room_id);
      this.room_info = val;
      this.roomAmount = Number(val.amount);
      this.getRoomRedPack();
      this.show = false;
      // 创建websocket连接
    var that = this;
    var socket = io.connect(baseURL);
    this.$store.commit("setSocket", socket);
    setTimeout(() => {
      this.name = this.$store.state.eosAccount.name;
      console.log("lllllAA", this.$store.state.eosAccount.name);
    }, 650);
    this.timer = setInterval(() => {
      console.log('执行')
      console.log('that',that.$store.state.configIsOk )
      if (that.$store.state.configIsOk != 0) {
        console.log(
          "that.$store.state.configIsOk:",
          that.$store.state.configIsOk
        );
        clearInterval(that.timer);
        
        if (that.$store.state.configIsOk === 1) {
          let data = {
            club_id: "952795",
            room_id: storage.get("roomId"),
            account_name: this.$store.state.eosAccount.name
          };
          // 轮询ping
          this.timer = setInterval(() => {
            console.log("执行ping-test");
            that.$store.state.socket.emit("ping-test", data);
          }, 10000);
          // 加入房间 , 发送房间信息
          this.$store.state.socket.emit("join", data);
          // 获取在线人数
          this.$store.state.socket.on("join_result", function(data) {
            console.log("在线人数:", data);
            that.onlineNum = data;
          });
          // 监听socket断开
          this.$store.state.socket.on("disconnect", function(msg) {
            console.log("socket 已断开:", msg);
          });
          // 监听新红包
          this.$store.state.socket.on("new_red_envelope", function(data) {
            that.Play();
            that.showOpen = false;
            that.packTotal = that.packTotal + 1;
            console.log("最新红包:", data);
            Toast("新红包来啦!!!");
            data.create_time = new Date(data.create_time).toLocaleString();
            that.packNotOpen = data;
            console.log("this.packNotOpen:", that.packNotOpen);
          });
          // 监听最新已开奖红包
          this.$store.state.socket.on("get_envelope_result", function(data) {
            that.getAccountBalance();
            console.log("最新已开奖红包:", data);
            // data.endTime = new Date(data.endTime).toLocaleString();
            // data.startTime  = new Date(data.startTime).toLocaleString();
            data["create_time"] = new Date(data.endTime).toLocaleString();
            that.packList.push(data);
          });
          // 监听抢红包结果
          this.$store.state.socket.on("grab_red_envelope", function(data) {
            // that.debugTest();
            console.log("抢红包结果:", data);
            console.log(
              "当前用户的POG账号:",
              that.$store.state.eosAccount.name
            );
            Notify({
              message: data.account_name + " 已抢到红包",
              duration: 1000,
              background: "#1989fa"
            });



            that.packResult = data;
              for(var i=0;i<that.packResult.grabbed_list.length;i++){
                if(that.packResult.grabbed_list[i].amount>that.big){
                  that.big=that.packResult.grabbed_list[i].amount
                }
                if(that.packResult.grabbed_list[i].account_name==that.name){
                  that.ownEnvelope=that.packResult.grabbed_list[i].amount
                }    
              }
            // console.log("当前抢到红包的POG账号:", data.account_name);
            // if (data.account_name == that.$store.state.eosAccount.name) {
            //   console.log("属于当前用户的socket消息:", data);
            //   // that.getAccountBalance();
            //   that.openLoad = false;
            //   if (data.is_success == true) {
            //     that.packResult = data;
            //     that.packState = 1;
            //   } else {
            //     that.packResult = data;
            //     that.errorMsg = data.remark;
            //     that.packState = 2;
            //   }
            //   for (let i = 0; i < data.grabbed_list.length; i++) {
            //     if (
            //       data.grabbed_list[i].account_name ==
            //       that.$store.state.eosAccount.name
            //     ) {
            //       data.grabbed_list[i].amount = data.amount;
            //     } else {
            //       data.grabbed_list[i].amount = "*";
            //     }
            //   }
            // } else {
            //   // that.packState = 2;
            // }
          });
        }
      }
    }, 500);
    },
    // 获取房间信息
    getClubInfo() {
      getClubInfo({ club_id: 952795 })
        .then(result => {
          console.log("11111", result.data.type_list[0].room_list);
          result.data.type_list[0].room_list.forEach(element => {
            element.amount = Number(element.amount).toFixed(2);
          });
          localStorage.setItem(
            "roomId",
            result.data.type_list[0].room_list[0].room_id
          );
          this.room_info = result.data.type_list[0].room_list[0];
          this.datalist = result.data.type_list[0];
          this.roomAmount = Number(
            result.data.type_list[0].room_list[0].amount
          );
          this.getRoomRedPack();
          console.log('this.datalist.room_list[0]',this.datalist.room_list[0])
          this.tooglePage(this.datalist.room_list[0]) 
          console.log("11111", this.datalist);
        })
        .catch(err => {
          console.log("获取房间失败", err);
        });
    },
    // 跳转玩法技巧
    goPlayIngmethodPage() {
      this.$router.push({
        path: "/gameplay"
      });
    },
    // 接收子向父传值
    toogleShow(show) {
      console.log(111);
      this.usershow = true;
    },
    toogleRoomShow(show) {
      console.log(show);
      this.show = show;
    },
    // 获取开奖结果
    getPackResult() {
      this.openLoad = true;
      setTimeout(() => {
        this.openLoad = false;
        // Toast('余额不足 , 充值后体验更佳');
        this.packState = 2;
      }, 2000);
    },
    // 关闭蒙层
    closeOpen() {
      console.log(111);
      // this.packState = 0;
      this.openLoad = false;
    },
    /**
     *  获取房间中的红包
     */
    getRoomRedPack() {
      let data = {
        room_id: storage.get("roomId"),
        page: 1,
        limit: 10
      };
      getRoomRedPack(data)
        .then(res => {
          console.log("获取房间中的红包:", res);
          if (res.code == 1) {
            this.packTotal = res.page_info.total;
            // this.roomAmount = res.data[0].amount;
            // this.roomType = res.data.quantity;
            // this.packList = res.data;
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].left_count > 0) {
                res.data[i].startTime = new Date(
                  res.data[i].startTime
                ).toLocaleString();
                this.packNotOpen = res.data[i];
                this.packNotOpen["create_time"] = res.data[i].startTime;
                // this.packList.splice(i,1);
                // break;
              } else {
                res.data[i].startTime = new Date(
                  res.data[i].startTime
                ).toLocaleString();
                res.data[i]["create_time"] = res.data[i].startTime;
                this.packList.push(res.data[i]);
              }
            }
            setTimeout(() => {
              console.log("this.packList:", this.packList);
              console.log("this.packNotOpen:", this.packNotOpen);
            }, 2000);
          }
        })
        .catch(err => {
          console.log("获取房间中的红包失败:", err);
        });
    },

    /**
     * 检查余额 , 余额足调接口抢红包 , 不足则scatter直接转账
     */
    playGame() {
      this.openPack();
      // this.scatterTransfer();
    },
    scatterTransfer() {
      this.openLoad = false;
      console.log("余额不足 , 调用scatter转账抢红包");
      const eos = this.$store.state.scatter.eos(this.$store.state.network, Eos);
      const account = this.$store.state.scatter.identity.accounts.find(
        x => x.blockchain === "eos"
      );
      // let accountName = 'pcoinaccount';
      const opts = { authorization: [`${account.name}`] };
      // 执行转账动作
      eos.contract("uetokencoin").then(adm => {
        console.log("adm: ", adm);
        adm
          .transfer(
            account.name,
            this.$store.state.collectionAccount,
            Number(this.roomAmount).toFixed(4) + " UE",
            this.roomId,
            opts
          )
          .then(async trx => {
            Toast("scatter转账抢红包成功");
            console.log(
              "scatter转账抢红包成功 , 等待websocket返回抢红包结果:",
              trx
            );
          })
          .catch(err => {
            this.openLoad = false;
            if (typeof err == "object") {
              if (err.code == 402) {
                Toast("你拒绝了该请求");
              }
            } else if (typeof err == "string") {
              var error = JSON.parse(err);
              console.log("错误信息:", error);
              if (error.error.code == 3050003) {
                Toast("账户余额不足");
              } else if (error.error.code == 3080001) {
                Toast("内存不足");
              } else if (error.error.code == 3080002) {
                Toast("网络资源不足");
              } else if (error.error.code == 3080004) {
                Toast("CPU不足");
              } else if (error.error.code == 3090003) {
                Toast("请检查权限，签名等是否正确");
              } else {
                Toast("操作失败");
              }
            }
            console.error("scatter转账失败:", err);
          });
      });
    },
    /**
     * 调用接口抢红包
     */
    openPack() {
      this.openLoad = true;
      let data = {
        room_id: this.packNotOpen.room_id,
        symbol: "UE",
        amount: this.roomAmount,
        account_name: this.$store.state.eosAccount.name
      };
      openPack(data)
        .then(res => {
          console.log("调用接口抢红包:", res);
          if (res.code == 1) {
            console.log(
              "调用接口抢红包成功 , 等待websocket放回抢红包结果:",
              res
            );
            console.log(201701, this.packResult);
            setTimeout(() => {
              this.openLoad = false;
              this.packState = 1;
            }, 2000);
          } else if (res.code == 2017) {
            console.log(2017, this.packResult);
            setTimeout(() => {
              this.openLoad = false;
              this.packState = 1;
            }, 2000);
          } else if (res.code == 2015) {
            this.openLoad = false;
            this.packState = 2;
          } else if (res.code == 2014) {
            Toast(res.desc);
            this.showOpen = false;
          } else if (res.code == 2013) {
            Toast(res.desc);
            this.showOpen = false;
          } else if (res.code == 2012) {
            Toast("余额不足");
            setTimeout(() => {
              this.scatterTransfer();
            }, 1000);
            this.showOpen = false;
          } else {
            this.openLoad = false;
            Toast(res.desc);
          }
        })
        .catch(err => {
          console.log("调用接口抢红包失败:", err);
          this.openLoad = false;
          Toast("抢红包失败");
        });
    },
    /**
     * 检查用户是否已经抢过该红包
     */
    checkPack() {
      let data = {
        room_id: this.packNotOpen.room_id,
        account_name: this.$store.state.eosAccount.name
      };
      checkPack(data)
        .then(res => { 
          console.log("检查用户是否已经抢过该红包:", res);
          if (res.code === 1) {
            this.showOpen = true;
            this.packState = 0;
          } else if (res.code === 2017) {
            this.showOpen = true;
            if (res.data.grabbed_list.length > 0) {
              for (let i = 0; i < res.data.grabbed_list.length; i++) {
                if (res.data.grabbed_list[i].account_name === this.name) {
                  res.data.grabbed_list[
                    i
                  ].html = `<img src="../../assets/u10085.png" width="20px" height="20px"><img src="../../assets/u10085.png" width="20px" height="20px"><img src="../../assets/u10085.png" width="20px" height="20px">`;
                }
              }
              this.packResult = res.data;
              for(var i=0;i<this.packResult.grabbed_list.length;i++){
                if(this.packResult.grabbed_list[i].amount>this.big){
                  this.big=this.packResult.grabbed_list[i].amount
                }
                if(this.packResult.grabbed_list[i].account_name==this.name){
                  this.ownEnvelope=this.packResult.grabbed_list[i].amount
                }    
              }
              this.packState = 1;

            } else {
              this.packState = 2;
            }
          } else {
            this.packState = 2;
          }
        })
        .catch(err => {
          console.log("检查用户是否已经抢过该红包失败:", err);
          this.openLoad = false;
          Toast("抢红包失败");
        });
    },
    /**
     * 播放音频
     */
    Play() {
      console.log("播放音频");
      this.$refs.audio.play();
    },
    /**
     * 暂停音频
     */
    Pause() {
      this.$refs.audio.pause();
    },
    //监听到 WebSocket 返回的抢红包结果后 , 发送调试信息
    debugTest() {
      let data = {
        msg:
          "监听到 WebSocket 返回的抢红包结果后 , 发送调试信息" +
          new Date() +
          this.$store.state.eosAccount.name
      };
      debugTest(data)
        .then(res => {
          console.log("debugTest:", res);
        })
        .catch(err => {
          console.log("debugTest失败:", err);
          // Toast("抢红包失败");
        });
    },
    // 刷新当前页
    refresh() {
      this.$router.go(0);
    }
  },
  destroyed() {
    console.log("destroyed 时 断开 websocket");
    let data = {
      room_id: this.roomId,
      account_name: this.$store.state.eosAccount.name
    };

    this.$store.state.socket.disconnect();
    clearInterval(this.timer);
  },
  watch: {
    packList() {
      this.$nextTick(() => {
        let list = this.$refs.packList;
        list.scrollTop = list.scrollHeight;
      });
    }
  }
};
</script>

<style scoped>
/* 抢红包金额最多，高亮颜色 */
.red {
  color: #f00;
}
.userinfo {
  padding: 1rem;
  color: #ff9900;
  display: flex;
  justify-content: space-between;
}
.userinfo > div > img {
  vertical-align: middle;

  width: 30px;
  height: 20px;

  border: none;
}
.userinfo > div > img:nth-of-type(2) {
  background: inherit;
  margin-left: 15px;
  margin-right: 30px;
  background-color: rgba(13, 13, 13, 0.368627450980392);
}
.playingmethod {
  padding: 0.5rem 1rem;
  color: #f90;
  font-size: 20px;
}
.playingmethod > div > img {
  vertical-align: middle;
  margin-right: 4px;
}
.userinfo > div {
  font-size: 20px;
}
.club_type {
  width: 100%;
  height: 2.5vh;
  text-align: center;
  color: aliceblue;
  font-size: 12px;
  color: #ff9900;
  background: #c13939;
  margin-top: 55px;
  position: fixed;
  z-index: 2;
}
.close {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  border: 1px solid #fff;
  border-radius: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 2rem;
}
.icon {
  vertical-align: middle;
}
.info {
  width: 100%;
  height: 8vh;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  margin-top: 65px;
  position: fixed;
}
.pack {
  width: 85%;
}
.account_info {
  display: flex;
  align-self: center;
  color: rgb(241, 231, 215);
  border: 1px solid #ff9900;
  padding: 8px 10px;
  border-radius: 4px;
  margin-left: 20px;
}
.account_info .text {
  line-height: 2.5vh;
  font-size: 16px;
  font-weight: 500;
}
.account_info .text span {
  margin-left: 10px;
}
.recharge {
  margin: auto 20px auto auto;
  color: antiquewhite;
  background-color: #ff9900;
  height: 35px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 5px;
  line-height: 35px;
  font-size: 16px;
}
.pack_list {
  overflow-y: scroll;
  /* height: 800px; */
  padding-top: 10.5vh;
  /* padding-bottom: 5vh; */
}
.red_pack {
  width: 90%;
  display: flex;
  margin: auto;
  margin-top: 10px;
}
.red_pack .headimg {
  width: 40px;
  height: 40px;
  background-color: #ffac2f;
  border-radius: 5px;
  display: flex;
}
.red_pack .headimg .round {
  width: 30px;
  height: 30px;
  margin: auto;
  background-color: #d38107;
  border-radius: 50%;
  display: flex;
}
.red_pack .headimg .round img {
  height: 20px;
  margin: auto;
}
.author_name {
  color: aliceblue;
  font-size: 12px;
  padding-left: 10px;
}
.red_pack .finish {
  color: white;
  font-size: 12px;
  background-color: #7b3233;
  width: 76vw;
  height: 25px;
  line-height: 25px;
  margin-left: 10px;
  border-radius: 5px;
  margin-top: 5px;
}
.red_pack .finish .text {
  padding-left: 10px;
}
.red_pack .block_id {
  color: aliceblue;
  font-size: 12px;
  margin-left: 10px;
  /* margin-top: 10px; */
  text-overflow: ellipsis;
  white-space: nowrap;
  -webkit-line-clamp: 2;
  width: 100%;
  overflow: hidden;
}
.red_pack .winner {
  color: white;
  font-size: 14px;
  background-color: rgba(0, 0, 0, 0.4);
  width: 76vw;
  height: 50px;
  margin-left: 10px;
  border-radius: 5px;
  margin-top: 5px;
  display: flex;
}
.red_pack .winner img {
  height: 20px;
  margin: auto 10px auto 10px;
}
.red_pack .winner .text {
  margin: auto auto auto 0px;
}
.red_pack .next_info {
  height: 50px;
  width: 76vw;
  background-color: #e86466;
  color: white;
  margin-left: 10px;
  border-radius: 5px;
  font-size: 14px;
  line-height: 50px;
  margin-top: 5px;
}
/* 红包样式 */
.bg_img {
  width: 100%;
  position: relative;
  z-index: 1;
}
.bg_img > div {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 180px;
  z-index: 99;
  background-color: #ff6633;
}
.bg_img > img {
  position: absolute;
  top: 80px;
  left: -5%;
  width: 110%;
  height: 200px;
}
/*弹出层样式*/
.items {
  padding: 1rem;
}
.items > .title {
  display: flex;
  padding: 0.2rem 0.8rem;
  justify-content: space-between;
}
.items > .item {
  display: flex;
  margin-top: 10px;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
  padding: 0.8rem 1rem;
  justify-content: space-between;
}
/*红包样式*/
.index_b_bigbox {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: center;
  align-items: flex-start;
}
.index_b_box {
  height: 16vh;
  width: 76vw;
  background: yellow;
  border-radius: 5px;
  order: 0;
  flex: 0 1 auto;
  align-self: auto;
  margin: 0.7vh 0px;
  margin-left: 10px;
  box-shadow: 2px 2px 5px #333333;
}
.index_b_box .index_b_box1 {
  display: flex;
  justify-content: center;
  align-self: center;
  height: 11.5vh;
  width: 76vw;
  background: #ffbf60;
  border-radius: 5px 5px 0px 0px;
}
.index_b_box1 .index_b_box1_a {
  width: 30%;
  height: 100%;
  text-align: center;
}
.index_b_box1 .index_b_box1_b {
  flex: 1;
}
.index_b_box1 .index_b_box1_b p {
  padding-top: 10px;
  font-size: 1.2rem;
  color: white;
  letter-spacing: 1px;
}
.index_b_box1 .index_b_box1_b p:nth-child(1) {
  margin-top: 10%;
}
.index_b_box .index_b_box2 {
  height: 4.5vh;
  width: 76vw;
  background: white;
  color: #ff6600;
  font-size: 0.9rem;
  text-indent: 1.5em;
  line-height: 4.5vh;
  border-radius: 0px 0px 5px 5px;
}
.open_dialog {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* background: url(../../assets/06.png) no-repeat center center; */
  background-color: #ff4000;
  /* background-size: 100% 100%; */
}
.open_dialog .logo {
  position: absolute;
  z-index: 100;
  padding-top: 50px;
  width: 100%;
  height: 60px;
  display: flex;
}
.open_dialog .logo .round {
  width: 80px;
  height: 80px;
  display: flex;
  margin: auto;
  border-radius: 50%;
  background-color: #ff9900;
  box-shadow: 1px 1px 1px 2px rgba(0, 0, 0, 0.1);
}
.open_dialog .logo .round img {
  height: 45px;
  display: flex;
  margin: auto;
}
.open_dialog .wish {
  /* font-family: "微軟正黑體 Regular", "微軟正黑體"; */
  position: absolute;
  top: 140px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  width: 100%;
  font-size: 22px;
  text-align: center;
  color: #ffdaa2;
  margin-top: 20px;
}
.open_dialog .type {
  position: absolute;
  z-index: 100;
  bottom: 100px;
  left: 50%;
  width: 100%;
  transform: translateX(-50%);
  font-size: 22px;
  text-align: center;
  color: #ffdaa2;
  margin-top: 20px;
}
.open_dialog .open {
  position: absolute;
  z-index: 100;
  top: 194px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 80px;
  display: flex;
  margin-top: 30px;
}
.open_dialog .open .round {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background-color: #ffcc00;
  margin: auto;
  text-align: center;
  line-height: 90px;
  font-size: 45px;
  color: #ff4000;
  box-shadow: 1px 1px 1px 3px rgba(0, 0, 0, 0.1);
}
/* .open_dialog .open .round_load{
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: #FFBF60;
    margin: auto;
    text-align: center;
    line-height: 80px;
    font-size: 45px;
    color: #FF4000;
    animation: rotation 2s linear infinite;
    -moz-animation: rotation 2s linear infinite;
    -webkit-animation: rotation 2s linear infinite;
    -o-animation: rotation 2s linear infinite;
  } */
@-webkit-keyframes rotation {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}

.open_dialog .open .round_load {
  -webkit-transform: rotate(360deg);
  animation: rotation 2s linear infinite;
  -moz-animation: rotation 2s linear infinite;
  -webkit-animation: rotation 2s linear infinite;
  -o-animation: rotation 2s linear infinite;
}
.open_dialog .website {
  text-align: center;
  margin-top: 20px;
  color: #ffdaa2;
  font-size: 22px;
}
.winner_dialog {
  width: 100%;
  height: 100%;
  background: url(../../assets/07.png) no-repeat center center;
  background-size: 100% 100%;
}
.winner_dialog .logo {
  padding-top: 50px;
  width: 100%;
  height: 60px;
  display: flex;
}
.winner_dialog .logo .round {
  width: 60px;
  height: 60px;
  display: flex;
  margin: auto;
  border-radius: 50%;
  background-color: #ff9900;
  box-shadow: 2px 2px 5px #333333;
}
.winner_dialog .logo .round img {
  height: 30px;
  display: flex;
  margin: auto;
}
.winner_dialog .wish {
  text-align: center;
  color: #ffdaa2;
  margin-top: 20px;
}
.winner_dialog .type {
  text-align: center;
  color: #ffdaa2;
  margin-top: 10px;
}
.winner_dialog .tips {
  text-align: center;
  color: #ffdaa2;
  margin-top: 5px;
  font-size: 16px;
}
.winner_dialog .name_list {
  width: 90%;
  min-height: 200px;
  background-color: #e86466;
  overflow: scroll;
  margin: 20px auto auto auto;
}
.winner_dialog .name_list .name_item {
  width: 100%;
  height: 30px;
  line-height: 30px;
  display: flex;
}
.winner_dialog .name_list .name_item .item_name {
  height: 20px;
  margin: auto auto auto 10px;
  line-height: 20px;
  font-size: 16px;
  display: inline-block;
}
.winner_dialog .name_list .name_item .item_amount {
  height: 20px;
  margin: auto 10px auto auto;
  line-height: 20px;
  font-size: 16px;
  display: inline-block;
}
</style>













