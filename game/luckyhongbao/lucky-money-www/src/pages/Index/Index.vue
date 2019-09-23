<template>
  <div>
    <!--头部-->
    <HeadPart v-if="!showEnterLoading&&!enterpageshow"></HeadPart>
    <!-- 进入抢红包前一秒动画 -->
    <EnterLoading v-if="showEnterLoading"></EnterLoading>
    <!--进入首页时2秒的欢迎界面-->
    <div class="enterpage" v-if="enterpageshow">
      <div class="enter_a">
        <img src="../../assets/02.png" alt="hongbao..." />
      </div>
      <div class="enter_b">luckmoney</div>
      <div class="enter_c">
        <p>提示</p>
        <p>您好，【好运红包】目前不支持来自下列国家或地区的用户：中国内地、朝鲜、美国（包括所有美国领土）</p>
        <p>
          未满18岁的用户禁止参与本游戏，本游戏包含一定程度的财务风险，玩家应该意识到这种风险并相应地进行自我管理。我们无意诱使任何人违反
          任何地方、州或国家法律。玩家的唯一责任是参考其管辖范围内的法律，以确定行为的合法性。
        </p>
      </div>
    </div>

    <!--首页-->
    <!-- <div class="indexpage" v-else> -->
    <!--头部-->
    <!-- <HeadPart></HeadPart> -->
    <!--第一部分-->
    <!-- <div class="index_a">
        tothemoon133&nbsp;<span style="color: #ffac2f;">抢得奖金</span>&nbsp;0.5617&nbsp;<span style="color: #ffac2f;">POG</span>
    </div>-->
    <!--第二部分-->
    <!-- <div class="index_b"> -->
    <!-- <p class="index_b_p1_p">官方俱乐部</p> -->
    <!--红包-->
    <!-- <div class="index_b_bigbox">
          <div class="index_b_box" v-for="(item,index) in officialRoomList" :key="index" @click="gotoGame(item.quantity , item.room_id , item.amount)">
            <div class="index_b_box1">
              <div class="index_b_box1_a">
                <img src="../../assets/02.png" height="70%" style="margin: 15% auto 0 auto">
              </div>
              <div class="index_b_box1_b">
                <p>{{item.quantity}}人抢</p>
                <p>{{Number(item.amount)}}POG</p>
              </div>
            </div>
            <div class="index_b_box2">
                抢得金额最大者发下一轮红包
            </div>
          </div>
          <div class="index_b_box">
            <div class="index_b_box1">
              <div class="index_b_box1_a">
                <img src="../../assets/02.png" height="70%" style="margin: 15% auto 0 auto">
              </div>
              <div class="index_b_box1_b" style="line-height: 11.5vh;font-size: 16px;color: white" @click="gopage(3)">
                更多专场
              </div>
            </div>
            <div class="index_b_box2">
              抢得金额最大者发下一轮红包
            </div>
          </div>
        </div>
    </div>-->
    <!--第三部分-->
    <!-- <div class="index_b index_c">
        <p class="index_b_p1_p">好友俱乐部.我的俱乐部</p>
        <div class="index_b_bigbox">
          <div class="index_b_box">
            <div class="index_b_box1">
              <div class="index_b_box1_a">
                <img src="../../assets/02.png" height="70%" style="margin: 15% auto 0 auto">
              </div>
              <div class="index_b_box1_b" @click="gopage(1)">
    <p>快速加入</p>-->
    <!-- <p>CLUB</p> -->
    <!-- </div>
            </div>
          </div>
          <div class="index_b_box">
            <div class="index_b_box1">
              <div class="index_b_box1_a">
                <img src="../../assets/02.png" height="70%" style="margin: 15% auto 0 auto">
              </div>
              <div class="index_b_box1_b" @click="gopage(2)">
    <p>我也要创建</p>-->
    <!-- <p>CLUB</p> -->
    <!-- </div>
            </div>
          </div>
        </div>
    </div>-->

    <!--第四部分-->
    <!-- <div class="index_d" v-if="!$store.state.sideBar">
        <van-tabs>
          <van-tab title="奖金排行榜">
            <div class="d_table e_table">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                  <tr>
                    <th width="33.3%">排名</th>
                    <th width="33.3%">玩家</th>
                    <th width="33.3%">POG 总奖金</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,index) in tablelist1" :key="index">
                    <td>{{item.rank}}</td>
                    <td>{{item.account_name}}</td>
                    <td>{{item.reward_amount}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </van-tab>
          <van-tab title="我的">
            <div class="d_table">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                  <tr>
                    <th width="40%">时间</th>
                    <th width="35%">抢得 POG 奖金</th>
                    <th width="25%">获得 CLUB</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,index) in tablelist2" :key="index">
                    <td>{{item.create_time}}</td>
                    <td>{{item.reward_amount}}</td>
                    <td>{{item.airdrop_amount}}</td>
                  </tr>
                </tbody>
              </table>
              <p v-if="tablelist2 == ''" style="font-size: 16px;text-align: center;margin: 5px 0px;color: #f8f8f8">暂&nbsp;无&nbsp;记&nbsp;录</p>
              <van-pagination
                v-else
                class="pagin"
                v-model="currentPage"
                :total-items="tablelist2Total"
                mode="simple"
                @change="changetablelist2"
              />

            </div>
          </van-tab>
        </van-tabs>
      </div>


    </div>-->

    <!-- 进入俱乐部弹窗 -->
    <!-- <van-popup v-model="$store.state.joinDialog" v-if="!enterpageshow" @click-overlay="closeDialog" style="width:90%;max-height:80%;">
    <div class="club_dialog">-->
    <!-- <div class="title_tip">
          <img src="../../assets/02.png" alt="">
          <div class="text">
            人人都可以创建红包俱乐部
          </div>
    </div>-->
    <!-- <div class="title_text">请输入好友俱乐部ID</div>
        <div class="id_num">
          <div class="item" v-for="(item,index) in clubId" :key="index">{{item}}</div>
        </div>
        <div class="keyboard">
          <div class="item" v-for="(item,index) in keyboard" :key="index" @click="inputClubId(item)">
            <div v-if="item == -2">重输</div>
            <div v-if="item == -1" style="display:flex;height: 100%;"><img src="../../assets/delete.png" alt="" style="width:30px;height:30px;margin:auto;"></div>
            <div v-if="item != -1 && item != -2">{{item}}</div>
          </div>
    </div>-->
    <!-- <div class="confirm_id" @click="verifyClubId">确定ID</div> -->
    <!-- <div style="text-align:center;color:#ff9900;">历史加入</div> -->
    <!-- 加入历史 -->
    <!-- <div class="quicklyjoin_d">
          <div class="quicklyjoin_d_box" v-for="(item,index) in joinedClub" :key="index" @click="enterClub(item.club_id)">
            <div class="quicklyjoin_d_box1">
              <div class="quicklyjoin_d_box1_a">
                <img src="../../assets/02.png" height="80%" style="margin: 10% auto 0 auto">
              </div>
              <div class="quicklyjoin_d_box1_b">
                <p>{{item.club_name}}</p>
    <p>{{item.club_id}}</p>-->
    <!-- <p>CLUB</p> -->
    <!-- </div>
            </div>
          </div>
        </div>
        <div class="no_id" @click="$store.commit('setJoinDialog',false)">无ID进入</div>
        <div style="text-align:center;color:#ff9900;height:20px;line-height:16px;font-size:12px;">人人都可创建俱乐部</div>
      </div>
    </van-popup>-->
  </div>
</template>


<script>
import Eos from "eosjs";
import ScatterJS from "scatterjs-core";
import ScatterPOG from "scatterjs-plugin-eosjs";
import HeadPart from "@/components/HeadPart/HeadPart";
import EnterLoading from "@/components/EnterLoading/EnterLoading";
import { Toast } from "vant";
import { parse, format } from "date-fns";
import {
  joinClub,
  storage,
  getOfficeRoomInfo,
  inviteFriend,
  scatterOneStop,
  getConfig,
  getJoinedClub,
  getrewardLeaderboard,
  getMyRewardList
} from "@/servers";
export default {
  name: "Index",
  components: {
    HeadPart,
    EnterLoading
  },
  data() {
    return {
      showEnterLoading: false,
      enterpageshow: true,
      officialRoomList: [], //官方俱乐部房间列表
      tablelist1: [],
      tablelist2: [],
      rightshow: false,
      clubId: ["", "", "", "", "", ""],
      keyboard: [1, 2, 3, 4, 5, 6, 7, 8, 9, -2, 0, -1],
      joinedClub: [], //用户加入过的俱乐部列表
      currentPage: 1,
      tablelist2Total: 0, //总条数
      timer: null //
    };
  },
  mounted() {
    // this.enterpageshow = sessionStorage.enterpageshow ? false : true;
    // this.rewardLeaderboard();
  },
  created() {
    // var that = this;
    // setTimeout(()=>{
    //   this.enterpageshow=false;
    //   sessionStorage.setItem('enterpageshow',false)
    // },2000)
    // this.getOfficeRoomInfo();
    // this.timer = setInterval(function(){
    //   if(that.$store.state.configIsOk != 0){
    //    console.log("还在跑：",that.$store.state.configIsOk)
    //     if(that.$store.state.configIsOk === 1){
    //       that.getJoinedClub();
    //       that.MyRewardList();
    //       if(that.$store.state.eosAccount){
    //       console.log("邀请人账号666666:",that.$route.query.invite);
    //         if(that.$route.query.invite){
    //           console.log("检查邀请")
    //           that.inviteFriend();
    //         }
    //       }
    //       clearInterval(that.timer);
    //     }
    //   }
    // },1000)
    //两秒跳转页面
    setTimeout(()=>{
      this.handleGoPage()
    },2000)
  },
  methods: {
    handleGoPage() {
      this.$router.push({ path: "/moneyclub" });
    },
    // 页面跳转
    async gopage(val) {
      if (val == 1) {
        //跳到快速加入
        if (!this.$store.state.eosAccount) {
          // Scatter一站式调用
          var result = await scatterOneStop();
          console.log("Scatter一站式调用结果:", result);
          if (result.code != 1) {
            Toast(result.desc);
          } else {
            if (this.$store.state.eosAccount) {
              this.$router.push({ path: "/quicklyjoin" });
            } else {
              Toast("请退出重新登录");
            }
          }
        } else {
          this.$router.push({ path: "/quicklyjoin" });
        }
      } else if (val == 2) {
        //跳到创建俱乐部
        if (!this.$store.state.eosAccount) {
          // Scatter一站式调用
          var result = await scatterOneStop();
          console.log("Scatter一站式调用结果:", result);
          if (result.code != 1) {
            Toast(result.desc);
          } else {
            if (this.$store.state.eosAccount) {
              if (this.$store.state.myClubId !== "") {
                console.log("我的俱乐部id:", this.$store.state.myClubId);
                Toast("你已创建过俱乐部");
                return;
              }
              this.$router.push({ path: "/createclub" });
            } else {
              Toast("请退出重新登录");
            }
          }
        } else {
          if (this.$store.state.myClubId !== "") {
            console.log("我的俱乐部id:", this.$store.state.myClubId);
            Toast("你已创建过俱乐部");
            return;
          }
          this.$router.push({ path: "/createclub" });
        }
      } else if (val == 3) {
        //跳到更多专场---官方俱乐部
        this.$router.push({ path: "/morespecials" });
      }
    },
    // 关闭弹窗
    closeDialog() {
      this.$store.commit("setJoinDialog", false);
    },
    // 输入俱乐部id
    inputClubId(item) {
      if (item != -2 && item != -1) {
        for (var i = 0; i < this.clubId.length; i++) {
          if (this.clubId[i] === "") {
            this.$set(this.clubId, i, item);
            break;
          }
        }
      } else if (item == -1) {
        for (var i = 0; i < this.clubId.length; i++) {
          if (this.clubId[this.clubId.length - 1 - i] !== "") {
            this.$set(this.clubId, this.clubId.length - 1 - i, "");
            break;
          }
        }
      } else if (item == -2) {
        for (var i = 0; i < this.clubId.length; i++) {
          if (this.clubId[this.clubId.length - 1 - i] !== "") {
            this.$set(this.clubId, this.clubId.length - 1 - i, "");
          }
        }
      }
      if (this.clubId[5] !== "") {
        this.verifyClubId();
      }
      console.log("this.clubId:", this.clubId);
    },
    // 验证clubId,加入俱乐部
    async verifyClubId() {
      if (this.clubId[5] === "") {
        Toast("请输入完整ID");
        return;
      }
      if (!this.$store.state.eosAccount) {
        Toast("Scatter已锁定");
        return;
      } else {
        var club_id = "";
        for (var i = 0; i < this.clubId.length; i++) {
          club_id = club_id + this.clubId[i];
        }
        let data = {
          club_id: club_id
        };
        joinClub(data)
          .then(res => {
            console.log("加入俱乐部:", res);
            if (res.code == 1) {
              storage.set("clubId", club_id);
              this.$router.push({ path: "/club" });
            } else {
              Toast(res.desc);
              return;
            }
          })
          .catch(err => {
            console.log("加入俱乐部失败:", err);
          });
      }
    },
    /**
     * 获取官方俱乐部信息
     */
    getOfficeRoomInfo() {
      let data = {
        club_id: 1
      };
      getOfficeRoomInfo()
        .then(res => {
          console.log("获取官方俱乐部房间信息:", res);
          if (res.code == 1) {
            if (res.data.length == 0) {
              return;
            }
            this.officialRoomList.push(res.data[0]);
            this.officialRoomList.push(res.data[1]);
            this.officialRoomList.push(res.data[2]);
          }
        })
        .catch(err => {
          console.log("获取俱乐部信息失败:", err);
        });
    },
    // 进入抢红包
    async gotoGame(type, room_id, amount) {
      if (!this.$store.state.eosAccount) {
        // Scatter一站式调用
        var result = await scatterOneStop();
        console.log("Scatter一站式调用结果:", result);
        if (result.code != 1) {
          Toast(result.desc);
        } else {
          if (this.$store.state.eosAccount) {
            this.showEnterLoading = true;
            console.log("进入房间===room_id:", room_id);
            setTimeout(() => {
              this.showEnterLoading = false;
              storage.set("clubId", 1);
              storage.set("roomType", type);
              storage.set("roomAmount", amount);
              storage.set("roomId", room_id);
              this.$router.push({ path: "/moneyclub" });
            }, 1000);
          } else {
            Toast("请退出重新登录");
          }
        }
      } else {
        this.showEnterLoading = true;
        console.log("进入房间===room_id:", room_id);
        setTimeout(() => {
          this.showEnterLoading = false;
          storage.set("clubId", 1);
          storage.set("roomType", type);
          storage.set("roomAmount", amount);
          storage.set("roomId", room_id);
          this.$router.push({ path: "/moneyclub" });
        }, 1000);
      }
    },
    // 邀请好友
    inviteFriend() {
      let data = {
        account_name: this.$store.state.eosAccount.name,
        refer_name: this.$route.query.invite
      };
      inviteFriend(data)
        .then(res => {
          console.log("邀请好友:", res);
        })
        .catch(err => {
          console.log("邀请好友失败:", err);
        });
    },
    /**
     * 获取用户加入的俱乐部信息
     */
    getJoinedClub() {
      getJoinedClub()
        .then(res => {
          console.log("获取用户加入的俱乐部信息:", res);
          if (res.code == 1) {
            this.joinedClub = res.data;
          } else {
            Toast(res.desc);
          }
        })
        .catch(err => {
          console.log("获取用户加入的俱乐部信息失败:", err);
        });
    },
    // 进入已加入的俱乐部
    enterClub(club_id) {
      storage.set("clubId", club_id);
      this.$router.push({ path: "/club" });
    },

    // 奖金排行榜
    rewardLeaderboard() {
      getrewardLeaderboard("")
        .then(res => {
          if (res.code == 1) {
            for (let i = 0; i < res.data.length; i++) {
              if (i < 2) {
                res.data[i].rank = "";
              }
            }
            this.tablelist1 = res.data;
            console.log("获取奖金排行榜:", res);
          }
        })
        .catch(err => {
          console.log("获取奖金排行榜失败:", err);
        });
    },

    // 我的奖金排行榜
    MyRewardList(val) {
      let data = {
        page: val ? val : 1
      };
      getMyRewardList(data)
        .then(res => {
          console.log("获取我的奖金排行榜:", res);
          if (res.code == 1) {
            for (let i = 0; i < res.data.length; i++) {
              let time = parse(res.data[i].create_time);
              time = format(time, "YYYY-MM-DD HH:mm:ss");
              res.data[i].create_time = time;
            }
            this.tablelist2 = res.data;
            this.tablelist2Total = res.page_info.total;
          }
        })
        .catch(err => {
          console.log("获取我的奖金排行榜失败:", err);
        });
    },
    changetablelist2(val) {
      this.MyRewardList(val);
    }
  }
};
</script>

<style>
/*2秒欢迎部分*/
.enterpage {
  width: 100vw;
  height: 100vh;
  background: #e33c3e;
  overflow: hidden;
}
.enterpage .enter_a {
  width: 110px;
  height: 110px;
  background: #ff9900;
  margin: 25vh auto 0px auto;
  border-radius: 55px;
  -moz-box-shadow: 1px 3px 8px 0px #333333;
  -webkit-box-shadow: 1px 3px 8px 0px #333333;
  box-shadow: 1px 3px 8px 0px #333333;
  position: relative;
}
@-webkit-keyframes rotation {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
.enterpage .enter_a img {
  width: auto;
  /* height:60px; */
  position: absolute;
  top: 25px;
  left: 30px;
  -webkit-transform: rotate(360deg);
  animation: rotation 2s linear infinite;
  -moz-animation: rotation 2s linear infinite;
  -webkit-animation: rotation 2s linear infinite;
  -o-animation: rotation 2s linear infinite;
}
.enterpage .enter_b {
  text-align: center;
  padding: 2vh 3vw 0vh 3vw;
  font-size: 1.3rem;
  font-weight: bold;
  color: #FFDAA2;
}
.enterpage .enter_c {
  padding: 0px 9vw 0px 9vw;
  line-height: 32px;
  color: #FFDAA2;
}
.enterpage .enter_c p:nth-child(1) {
  padding-top: 3vh;
  text-align: center;
}

/*主页主要部分*/
/*第一部分*/
.indexpage {
  padding-top: 8vh;
}
.indexpage .index_a {
  height: 8vh;
  background: #c13939;
  line-height: 8vh;
  margin: 1.5vh 0px;
  text-align: center;
  color: white;
  font-size: 1rem;
}

/*第二部分*/
.indexpage .index_b {
  padding: 0px 3vw 2vh 3vw;
  /*height: 50vh;*/
  background: #c13939;
}
.indexpage .index_b .index_b_p1_p {
  color: #ff9900;
  margin: 0px;
  padding: 1vh 0px 0.3vh 0px;
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
  width: 46vw;
  background: yellow;
  border-radius: 5px;
  order: 0;
  flex: 0 1 auto;
  align-self: auto;
  margin: 0.7vh 0px;
}
.index_b_box .index_b_box1 {
  height: 11.5vh;
  width: 46vw;
  background: #ff9900;
  border-radius: 5px 5px 0px 0px;
}
.index_b_box1 .index_b_box1_a {
  width: 40%;
  height: 100%;
  float: left;
  text-align: center;
}
.index_b_box1 .index_b_box1_b {
  width: 58%;
  height: 100%;
  float: right;
}
.index_b_box1 .index_b_box1_b p {
  margin: 0px;
  font-size: 13px;
  color: white;
  letter-spacing: 1px;
  word-break: break-all;
  text-overflow: ellipsis;
  overflow: hidden;
  /* white-space: nowrap; */
}
.index_b_box1 .index_b_box1_b p:nth-child(1) {
  margin-top: 10%;
}
.index_b_box .index_b_box2 {
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

/*第三部分*/
.indexpage .index_c {
  margin-top: 1.5vh;
}
.index_c .index_b_box {
  height: 10.5vh;
}
.index_c .index_b_box1 {
  border-radius: 5px;
}
.index_c .index_b_box1_b {
  /* position: relative; */
}
.index_c .index_b_box1_b p:nth-child(1) {
  margin-top: 20%;
  letter-spacing: 0px;
  /*background: deepskyblue;*/
  /*position: relative;*/
  /*z-index: 100;*/
}
.index_c .index_b_box1_b p:nth-child(2) {
  font-size: 2.2rem;
  font-weight: bold;
  position: absolute;
  top: 15%;
  right: 0px;
  opacity: 0.15;
  /*z-index: 0;*/
}

/*第四部分 排行榜部分*/
.index_d {
  margin-top: 3vh;
  margin-bottom: 9vh;
}
/*处理选项卡*/
.index_d .van-tabs__wrap {
  width: 90vw;
  left: 5vw;
  border: none;
  border-radius: 5px 5px 0px 0px;
}
.index_d .van-tabs__nav--line {
  padding-bottom: 0px;
}
.index_d .van-tabs__line {
  background: none;
  width: 100px !important;
}
.index_d .van-tab {
  background: rgb(214, 59, 62);
  color: #e2e2e2;
  font-size: 1rem;
}
.index_d .van-tab--active {
  background: #c13939;
  color: #ff9900;
}
.index_d .van-tabs__content {
  background: #c13939;
  padding: 1vh 0vw;
}
.van-hairline--top-bottom::after {
  border: none;
}
/*处理表格*/
.index_d .d_table table {
  color: #ffeaea;
  font-size: 0.9rem;
  text-align: center;
}
.index_d .d_table table th {
  padding: 1.5vh 0px;
  /*border-bottom:1px solid skyblue ;*/
}
.index_d .d_table table td {
  border-top: 2px solid #e84244;
  padding: 2vh 0px;
  font-size: 0.7rem;
}
.index_d .e_table tr:nth-child(1) td:nth-child(1) {
  background: url(../../assets/03.png) no-repeat center center;
  /*background-size:100% 100%;*/
  /*-moz-background-size:100% 100%;*/
}
.index_d .e_table tr:nth-child(2) td:nth-child(1) {
  background: url(../../assets/04.png) no-repeat center center;
}
.index_d .e_table tr:nth-child(3) td:nth-child(1) {
  background: url(../../assets/05.png) no-repeat center center;
}

.club_dialog {
  width: 100%;
  height: 100%;
  padding-top: 5px;
  background: url(../../assets/u191.png) repeat center center;
}
.club_dialog .title_tip {
  width: 90%;
  height: 100px;
  margin: auto;
  border-radius: 5px;
  background-color: #ff9900;
  box-shadow: 2px 2px 5px #333333;
  display: flex;
  line-height: 100px;
  color: #e2e2e2;
}

.club_dialog .title_tip img {
  width: auto;
  height: 50px;
  margin: auto 20px auto 20px;
}
.club_dialog .title_tip .text {
  height: 100px;
  line-height: 100px;
}
.club_dialog .title_text {
  width: 100%;
  height: 30px;
  color: #e2e2e2;
  text-align: center;
  line-height: 30px;
}
.club_dialog .id_num {
  width: 90%;
  height: 50px;
  display: flex;
  margin: auto;
}
.club_dialog .id_num .item {
  width: 40px;
  height: 40px;
  margin: auto;
  line-height: 40px;
  text-align: center;
  font-size: 20px;
  color: #e33c3e;
  background-size: contain;
  border-radius: 10px;
  background: url(../../assets/u19.png) no-repeat center center;
}
.club_dialog .keyboard {
  display: inline-block;
  width: 90%;
  margin-left: 5%;
}
.club_dialog .keyboard .item {
  width: 30%;
  margin-left: 1.5%;
  margin-right: 1.5%;
  margin-top: 5px;
  border-radius: 5px;
  height: 40px;
  color: #e2e2e2;
  text-align: center;
  line-height: 40px;
  display: table-row-group;
  float: left;
  background-color: #ff9900;
}
.club_dialog .confirm_id {
  width: 90%;
  margin-left: 5%;
  height: 40px;
  text-align: center;
  line-height: 40px;
  color: #e2e2e2;
  background-color: #ff9900;
  margin-top: 20px;
  border-radius: 5px;
}
.club_dialog .no_id {
  width: 90%;
  margin-left: 5%;
  height: 40px;
  text-align: center;
  line-height: 40px;
  color: #e2e2e2;
  border: 1px solid#ff9900;
  margin-top: 10px;
  border-radius: 5px;
  margin-bottom: 5px;
}
.quicklyjoin_d {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: center;
  align-items: flex-start;
  padding: 1vh 5vw 1vh 5vw;
}
.quicklyjoin_d_box {
  border-radius: 5px;
  order: 0;
  flex: 0 1 auto;
  align-self: auto;
  margin: 0.7vh 0px;
  height: 11vh;
  width: 38vw;
  background: #ff9900;
  border-radius: 5px;
}
.quicklyjoin_d_box1 .quicklyjoin_d_box1_a {
  width: 40%;
  height: 11vh;
  float: left;
  text-align: center;
}
.quicklyjoin_d_box1 .quicklyjoin_d_box1_b {
  width: 58%;
  height: 100%;
  float: right;
  /* position: relative; */
}
.quicklyjoin_d_box1 .quicklyjoin_d_box1_b p {
  margin: 0px;
  /* font-size: 1.2rem; */
  font-size: 14px;
  color: white;
  letter-spacing: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.quicklyjoin_d_box1 .quicklyjoin_d_box1_b p:nth-child(1) {
  margin-top: 10%;
}
.quicklyjoin_d_box1 .quicklyjoin_d_box1_b p:nth-child(3) {
  font-size: 2.2rem;
  font-weight: bold;
  position: absolute;
  top: 20%;
  right: 0px;
  opacity: 0.2;
}

/* 修改页码 */
.pagin {
  margin-top: 10px;
  width: 70vw;
  float: right;
}
.van-pagination--simple .van-pagination__next::after,
.van-pagination--simple .van-pagination__prev::after {
  border-width: 0px !important;
}
.pagin .van-pagination__item {
  background: none !important;
}
.pagin .van-pagination__page-desc {
  color: #323233 !important;
}
.van-pagination__item--disabled,
.van-pagination__item--disabled:active {
  color: #c8c9cc !important;
}
</style>













