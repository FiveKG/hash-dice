<template>
  <div class="header">
    <div class="header_a" @click="selecetGame" v-if="indextrue" style="display:flex;">
      <div style="text-align:center;margin-top:10px">
        <div class="account_info" @click="toogleRoomShow">
          <div class="text">
            {{amount}}UE 5 人抢专场
            <span>
              <svg
                class="icon"
                width="18px"
                height="18px"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#fff"
                  d="M845.73750784 310.06631558c11.09419837 11.20906823 20.13556271 20.35048032 31.14453548 31.47432293-121.43960347 124.00379403-242.4271389 247.54069789-364.70047497 372.39675162C390.0527457 589.68162356 268.72060139 466.23735673 147.11795668 342.52259023c10.96450709-9.79728131 20.93224036-18.70524869 26.40152463-23.59647866C215.4321334 358.44873076 260.2906406 398.96812377 303.11484019 441.54035152c65.17934399 64.79767943 129.21369503 130.75517321 193.07018343 196.86088611 11.65372557 12.06503364 18.47550896 13.01363611 30.76657736 0.32608175 101.29663005-104.55003835 203.3232385-208.39233111 305.05711445-312.51994567C836.68502706 321.42360292 840.7128809 316.00990072 845.73750784 310.06631558z"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
      <!-- <img src="../../assets/68.png" style="width:8vw;margin:auto;" />
      <van-icon name="arrow-up" style="margin-left:2vw;line-height: 4vh;margin:auto;" v-if="openGameList" />
      <van-icon name="arrow-down" style="margin-left:2vw;line-height: 4vh;margin:auto;" v-else />
      <div class="header_title1" v-show="openGameList && !$store.state.sideBar">
        <ul>
          <li><img src="../../assets/68.png" height="100%" /></li>
          <li><a href="https://pk10.eoscrown.com/"><img src="../../assets/69.png" height="100%" /></a></li>
          <li><a href="https://market.eoscrown.com/"><img src="../../assets/67.png" height="100%" /></a></li>
        </ul>
      </div>-->
    </div>
    <div class="header_a" @click="goPre" v-else>
      <img src="../../assets/02.png" alt />123123
      {{text}}
    </div>
    <div class="header_b">
      <div class="header_b_icon">
        <svg
          @click="toogleShow"
          class="icon"
          width="1.5rem"
          height="1.5rem"
          viewBox="0 0 1025 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#fff"
            d="M116.362876 512m-116.362876 0a69.545 69.545 0 1 0 232.725752 0 69.545 69.545 0 1 0-232.725752 0ZM512 512m-116.362876 0a69.545 69.545 0 1 0 232.725752 0 69.545 69.545 0 1 0-232.725752 0ZM907.637124 512m-116.362876 0a69.545 69.545 0 1 0 232.725752 0 69.545 69.545 0 1 0-232.725752 0Z"
          />
        </svg>
        <div></div>
        <svg
          class="icon"
          @click="goBack"
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
    </div>
    <!-- <div class="header_a">
      <img src="../../assets/link.png" v-if="$route.path == '/'" @click="showWx"/>
      <van-icon name="bars" style="font-size: 2rem;line-height: 60px;" @click="showright" />
    </div>-->
    <!--<div style="clear: both"></div>-->

    <!--右侧导航栏-->
    <van-popup v-model="$store.state.sideBar" position="right" class="popupbox">
      <div class="popupbox_a">
        <!-- <span><img src="../../assets/09.png" alt="英国国旗" height="25px" style="vertical-align: middle;"></span> -->
        <span>
          <van-icon name="bars" style="font-size: 2rem;line-height: 8vh;" @click="closeright" />
        </span>
      </div>
      <div style="clear: both"></div>
      <div class="popupbox_b">
        <p v-if="!$store.state.eosAccount" @click="getConfig">
          <img
            src="../../assets/11.png"
            alt="用户"
            height="20px"
            style="vertical-align: middle;margin-right: 2vw"
          />登录
        </p>
        <P v-else @click="scatterLogout">
          <img
            src="../../assets/11.png"
            alt="用户"
            height="20px"
            style="vertical-align: middle;margin-right: 2vw"
          />
          {{$store.state.eosAccount.name}}
          <img
            src="../../assets/exit.png"
            alt="用户"
            height="20px"
            style="vertical-align: middle;margin-right: 2vw"
          />
        </P>
        <!-- <p class="popupbox_b1"></p>
        <p :class="textnum ==10 ? 'nowcolor':''" @click="goGameplay">玩法</p>-->
        <p class="popupbox_b1"></p>
        <p
          :class="textnum ==1&&$store.state.eosAccount ? 'nowcolor':''"
          @click="$store.state.eosAccount ? gopage(1):''"
          :style="$store.state.eosAccount ? '' :'color: #a9a9a9 !important;'"
        >邀请好友</p>
        <!-- <p class="popupbox_b1"></p>
        <p :class="textnum ==9&&$store.state.eosAccount ? 'nowcolor':''" @click="$store.state.eosAccount ? gopage(9):''" :style="$store.state.eosAccount ? '' :'color: #a9a9a9 !important;'">账号明细</p>-->
        <p class="popupbox_b1"></p>
        <p
          :class="textnum ==2&&$store.state.eosAccount ? 'nowcolor':''"
          @click="$store.state.eosAccount ? gopage(2):''"
          :style="$store.state.eosAccount ? '' :'color: #a9a9a9 !important;'"
        >CLUB</p>
        <p
          :class="textnum ==3&&$store.state.eosAccount ? 'nowcolor':''"
          @click="$store.state.eosAccount ? gopage(3):''"
          :style="$store.state.eosAccount ? '' :'color: #a9a9a9 !important;'"
        >分红池</p>
        <p
          :class="textnum ==4&&$store.state.eosAccount ? 'nowcolor':''"
          @click="$store.state.eosAccount ? gopage(4):''"
          :style="$store.state.eosAccount ? '' :'color: #a9a9a9 !important;'"
        >我的分红</p>
        <p class="popupbox_b1" v-show="$store.state.eosAccount && $store.state.myClubId != ''"></p>
        <!-- <p :class="textnum ==5 ? 'nowcolor':''" @click="gopage(5)" v-show="$store.state.eosAccount && $store.state.myClubId != ''">我的俱乐部</p> -->
        <!-- <p :class="textnum ==6 ? 'nowcolor':''" @click="gopage(6)" v-show="$store.state.eosAccount && $store.state.myClubId != ''">俱乐部排行榜</p> -->
        <!-- <p :class="textnum ==7 ? 'nowcolor':''" @click="gopage(7)" v-show="$store.state.eosAccount && $store.state.myClubId != ''">俱乐部</p> -->
        <!-- <p :class="textnum ==8 ? 'nowcolor':''" @click="gopage(7)" v-show="$store.state.eosAccount && $store.state.myClubId != ''">抢红包</p> -->
      </div>
      <div class="popupbox_c" :style="$store.state.eosAccount ? '' :'opacity: 0.4;'">
        <div class="popupbox_c_left">
          <p>预存POG余额</p>
          <p>{{Number($store.state.eosBalance).toFixed(4)}} POG</p>
        </div>
        <div class="popupbox_c_left popupbox_c_right">
          <p>链上CLUB余额</p>
          <p>{{$store.state.scatterEosBalance}}</p>
        </div>
      </div>
      <div class="popupbox_d" :style="$store.state.eosAccount ? '' :'opacity: 0.4;'">
        <div class="popupbox_d_btn1" v-if="!$store.state.eosAccount">POG 提现</div>
        <div class="popupbox_d_btn1" @click="WithDraw" v-else>POG 提现</div>
        <div
          class="popupbox_d_btn1 popupbox_d_btn2"
          @click="$store.state.eosAccount ? $store.commit('setRechargeDialog',true) : ''"
        >充值抢红包</div>
      </div>
    </van-popup>

    <!-- 充值蒙层 -->
    <Recharge></Recharge>

    <!-- 微信客服蒙层 -->
    <van-popup v-model="showWechatCode" style="width:60%;">
      <img src="../../../static/wx.jpg" alt style="width:100%;height:auto;" />
      <!-- <div style="font-size:14px;line-height:16px;margin-top:5px;margin-bottom:5px;">请扫描二维码或搜索微信号添加客服微信:sdjksdjfkdsdfs</div> -->
    </van-popup>

    <!-- 提现验证码蒙层 -->
    <van-popup v-model="showWithdraw" style="width:80%;">
      <div>
        <div style="display:flex;">
          <img style="margin:auto;" :src="code_img" alt />
          <van-field class="input" v-model="auth_code" placeholder="请输入验证码" />
        </div>
        <!-- <van-field class="input" type="number" v-model="auth_code" placeholder="请输入答案"/> -->
        <div @click="WithDraw" style="text-align:center;background: navajowhite;">确定</div>
      </div>
    </van-popup>
  </div>
</template>


<script>
import { Toast, Dialog } from "vant";
import Eos from "eosjs";
import Recharge from "@/components/Recharge/Recharge";
import {
  storage,
  getAccountBalance,
  scatterOneStop,
  WithDraw,
  getVerifCode,
  getConfig
} from "@/servers";
export default {
  name: "HeadPart",
  components: {
    Recharge
  },
  props: {
      amount: String,
      required: true
    },
  data() {
    return {
      text: "",
      textnum: 0,
      indextrue: false,
      rightshow: false,
      openGameList: false, //
      timer: null, //获取账号余额定时器
      showWechatCode: false,
      showWithdraw: false,
      auth_code: "",
      rand: "",
      code_img: "",
      show: true,
      rlen: history.length
    };
  },
  mounted() {
    if (this.$route.path == "/" || this.$route.path == "/index") {
      this.text = "好运红包";
      this.indextrue = true;
      this.textnum = 0;
    } else if (this.$route.path == "/createclub") {
      this.text = "创建俱乐部";
      this.textnum = 0;
    } else if (this.$route.path == "/createroom") {
      this.text = "创建红包房间";
      this.textnum = 0;
    } else if (this.$route.path == "/gameplay") {
      this.text = "玩法";
      this.textnum = 0;
    } else if (this.$route.path == "/morespecials") {
      this.text = "官方俱乐部";
      this.textnum = 0;
    } else if (this.$route.path == "/quicklyjoin") {
      this.text = "快速加入俱乐部";
      this.textnum = 0;
    } else if (this.$route.path == "/moneyclub") {
      this.text = "好运红包";
      this.textnum = 0;
    } else if (this.$route.path == "/clubleaderboard") {
      this.text = "俱乐部排行榜";
      this.textnum = 6;
    } else if (this.$route.path == "/dividingpool") {
      this.text = "分红池";
      this.textnum = 3;
    } else if (this.$route.path == "/currencypage") {
      this.text = "CLUB";
      this.textnum = 2;
    } else if (this.$route.path == "/invitefriends") {
      this.text = "邀请好友";
      this.textnum = 1;
    } else if (this.$route.path == "/myclub") {
      this.text = "我的俱乐部";
      this.textnum = 5;
    } else if (this.$route.path == "/mydividend") {
      this.text = "我的分红";
      this.textnum = 4;
    } else if (this.$route.path == "/club") {
      this.text = "俱乐部";
      this.textnum = 7;
    } else if (this.$route.path == "/moneyclub") {
      this.text = "好运红包";
      this.textnum = 8;
    } else if (this.$route.path == "/accountreport") {
      this.text = "账号报表";
      this.textnum = 9;
    } else if (this.$route.path == "/course") {
      this.text = "POG教程";
      this.textnum = 11;
    }
    console.log("当前路由:", this.$route.path);
  },
  created() {
    this.getConfig();
  },
  methods: {
    goBack() {
      let len = this.rlen - history.length - 1; //-1是不进入iframe页面的下级页面直接退出的话，执行后退一步的操作
      console.log("len", len);
      this.$router.go(len);
    },
    toogleShow() {
      this.$emit("childshow", this.show);
    },
    toogleRoomShow(){
      this.$emit("roomShow", this.show);
    },
    getConfig: function() {
      return new Promise((resolve, reject) => {
        getConfig()
          .then(async res => {
            if (res.code == 1) {
              var blovk_arr = res.data.chain_info.http_end_point.split(":");
              let network = {
                blockchain: "eos",
                chainId: res.data.chain_info.chain_id,
                host: blovk_arr[1].substring(2),
                port: blovk_arr[2],
                protocol: blovk_arr[0]
              };
              console.log("获取配置信息中的network:", network);
              console.log("res: ", res);
              this.$store.commit("setNetwork", network);
              this.$store.commit(
                "setCollectionAccount",
                res.data.collection_account
              );
              this.$store.commit(
                "setBalanceChangeType",
                res.data.balanceChangeType
              );
              this.$store.commit(
                "setSymbolAccountName",
                res.data.symbolAccountName
              );
              // 连接Scatter => 登录Scatter => Scatter查询余额 => Api接口登录 => 获取我的俱乐部 => 获取我的余额
              var result = await scatterOneStop();
              console.log("Scatter一站式调用结果:", result);
              if (result.code !== 1) {
                Toast(result.desc);
                this.$store.commit("setConfigIsOk", -1);
                resolve(false);
              } else {
                this.$store.commit("setConfigIsOk", 1);
                resolve(true);
              }
            } else {
              Toast("登录失败 , 请关闭页面重新进入.");
              this.$store.commit("setConfigIsOk", -1);
              resolve(false);
            }
          })
          .catch(err => {
            Toast("获取基础配置失败");
            console.log("获取基础配置失败:", err);
            this.$store.commit("setConfigIsOk", -1);
            resolve(false);
          });
      });
    },
    goGameplay() {
      this.$router.push({ path: "/gameplay" });
    },
    //右侧导航栏跳到其他页面，邀请好友、CLUB、分红池、我的分红、我的俱乐部、俱乐部排行榜
    gopage(val) {
      if (val == 1) {
        //跳到邀请好友
        this.$router.push({ path: "/invitefriends" });
      } else if (val == 2) {
        //跳到CLUB
        this.$router.push({ path: "/currencypage" });
      } else if (val == 3) {
        //跳到分红池
        this.$router.push({ path: "/dividingpool" });
      } else if (val == 4) {
        //跳到我的分红
        this.$router.push({ path: "/mydividend" });
      } else if (val == 5) {
        //跳到我的俱乐部
        this.$router.push({ path: "/myclub" });
      } else if (val == 6) {
        //跳到俱乐部排行榜
        this.$router.push({ path: "/clubleaderboard" });
      } else if (val == 7) {
        //跳到俱乐部
        this.$router.push({ path: "/club" });
      } else if (val == 8) {
        //跳到俱乐部
        this.$router.push({ path: "/moneyclub" });
      } else if (val == 9) {
        //跳到账号报表
        this.$router.push({ path: "/accountreport" });
      }
    },
    //返回上一页
    goPre() {
      this.$router.go(-1);
      // this.$router.push({path: '/'});
    },
    //打开右侧导航栏
    showright() {
      this.$store.commit("setSideBar", true);
    },
    //关闭右侧导航栏
    closeright() {
      this.$store.commit("setSideBar", false);
    },
    // 获取用户账号余额
    // getAccountBalance() {
    //   let data = {
    //     account_name: this.$store.state.eosAccount.name
    //   };
    //   getAccountBalance(data)
    //     .then(res => {
    //       console.log("提现后 , 获取用户账号余额:", res);
    //       if (
    //         res.code == 1 &&
    //         Number(res.data.balance) !== Number(this.$store.state.eosBalance)
    //       ) {
    //         Toast("提现金额已到账");
    //         this.$store.commit("setEosBalance", res.data.balance);
    //         clearInterval(this.timer);
    //       }
    //     })
    //     .catch(err => {
    //       console.log("获取用户账号余额失败:", err);
    //     });
    //   // 获取链上余额
    //   const eos = this.$store.state.scatter.eos(this.$store.state.network, Eos);
    //   eos
    //     .getCurrencyBalance(
    //       this.$store.state.symbolAccountName,
    //       this.$store.state.eosAccount.name,
    //       "CLUB"
    //     )
    //     .then(tx => {
    //       // this.eosResources =tx[0];
    //       console.log("Scatter 查询 POG 余额:", tx);
    //       if (tx.length > 0) {
    //         this.$store.commit("setScatterEosBalance", tx[0]);
    //       }
    //     })
    //     .catch(error => {
    //       console.log("Scatter 查询 POG 余额失败", error);
    //     });
    // },
    // Scatter全局登录
    async scatterOneStop() {
      // Scatter一站式调用
      var result = await scatterOneStop();
      console.log("Scatter一站式调用结果:", result);
      if (result.code != 1) {
        Toast(result.desc);
      } else {
        if (this.$store.state.eosAccount) {
          this.$store.commit("setConfigIsOk", 1);
        } else {
          Toast("请退出重新登录");
        }
      }
    },
    // Scatter退出
    scatterLogout() {
      this.$store.state.scatter
        .forgetIdentity()
        .then(identity => {
          console.log("Scatter退出返回信息:", identity);
          this.$store.commit("setEosAccount", null);
          this.$router.go(0);
        })
        .catch(err => {
          Toast("Scatter退出失败");
          console.error("Scatter退出失败", err);
        });
    },
    // 选择游戏
    selecetGame() {
      this.openGameList = !this.openGameList;
    },
    // 余额提现
    WithDraw() {
      // if(this.rand =='' || this.auth_code == ''){
      //   Toast("请输入验证密码");
      // }
      let data = {
        rand_code: this.rand || "",
        verify_code: this.auth_code || ""
      };
      WithDraw(data)
        .then(res => {
          console.log("余额提现:", res);
          if (res.code == 1) {
            this.showWithdraw = false;
            Toast("提现成功 , 可能延迟到账.");
            // 轮询获取用户账号余额
            // this.timer = setInterval(() => {
            //   this.getAccountBalance();
            // }, 5000);
          } else {
            Toast(res.desc);
          }
        })
        .catch(err => {
          console.log("余额提现失败:", err);
          Toast("余额提现失败");
        });
    },
    // 显示微信账号
    showWx() {
      this.showWechatCode = true;
      // Dialog.alert({
      //   message: '请添加客服微信:dhffhjfjk'
      // }).then(() => {
      //   // on close
      // });
    },
    // 获取图片验证码
    getVerifCode() {
      // this.showWithdraw = true;
      // this.rand = Math.random().toString().slice(-6);
      // let data = {
      //   rand_code : this.rand
      // }
      // getVerifCode(data).then(res=>{
      //   console.log("获取图片验证码:",res);
      //   if(res.code == 1){
      //     this.code_img = 'data:image/png;base64,' + res.data
      //   }else{
      //     Toast(res,desc);
      //     this.showWithdraw = false;
      //   }
      // }).catch(err=>{
      //   console.log("获取图片验证码失败:",err);
      //   Toast('获取图片验证码失败');
      //   this.showWithdraw = false;
      // })
    }
  }
};
</script>

<style scoped>
.header {
  height: 60px;
  position: fixed;
  width: 100%;
  background: #c13939;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: center;
  align-items: flex-start;
  line-height: 60px;
  color: #ffac2f;
  z-index: 1;
  background-color: #a22e2f;
}
.header .header_a {
  order: 0;
  flex: 0 1 auto;
  align-self: auto;
  padding: 0px 4vw;
  width: auto;
  height: 60px;
  display: flex;
  font-size: 1rem;
  font-weight: 500;
}
.header .header_a img {
  height: 30px;
  margin: auto 10px auto 5px;
}
.header .header_b {
  /*font-weight: bold;*/
  order: 0;
  flex: 0 1 auto;
  align-self: center;
  padding: 0px 4vw;
  width: auto;
  display: flex;
  font-size: 1rem;
  font-weight: 500;
}
.header_b_icon {
  border: 1px solid #ff9900;
  border-radius: 4px;
  display: flex;
  font-size: 16px;
  padding: 4px 12px;
}
.header_b_icon > div {
  border-right: 1px solid #ff9900;
  margin: 2px 1rem 0 1rem;
  height: 20px;
}
/*右侧导航栏*/
.popupbox {
  width: 70vw;
  height: 100vh;
  background: #1b1b1b;
  padding: 0px 5vw;
}
.popupbox .popupbox_a {
  height: 8vh;
  /*background: yellow;*/
}
.popupbox .popupbox_a span {
  display: block;
}
.popupbox .popupbox_a span:nth-child(1) {
  float: left;
}
.popupbox .popupbox_a span:nth-child(2) {
  float: right;
}
.popupbox .popupbox_b p {
  clear: right;
  margin: 0px;
  text-align: right;
  color: white;
  height: 6vh;
  line-height: 6vh;
  overflow: hidden;
}
.popupbox .popupbox_b .popupbox_b1 {
  /*padding: 0.1vh 0px;*/
  background: #ffac2f;
  height: 0.4vh;
  margin: 2.5vh 0px;
  width: 8vw;
  float: right;
}
.popupbox .popupbox_b .popupbox_b1_off {
  /*padding: 0.1vh 0px;*/
  background: #ffac2f;
  height: 0.4vh;
  margin: 2.5vh 0px;
  width: 8vw;
  float: right;
  opacity: 0.4;
}
.popupbox .popupbox_c {
  margin-top: 5vh;
  height: 15vh;
  border: 1px solid #ffac2f;
  border-radius: 5px;
  display: flex;
}
.popupbox .popupbox_c .popupbox_c_left {
  height: 11vh;
  width: 49.5%;
  float: left;

  margin-top: 2vh;
  margin: auto;
}
.popupbox .popupbox_c .popupbox_c_left p {
  width: 100%;
  margin: 0px;
  height: 4vh;
  text-align: center;
  font-size: 1rem;
  word-wrap: break-word;
  line-height: 4vh;
  /*line-height: 6vh;*/
}
.popupbox .popupbox_c .popupbox_c_left p:nth-child(1) {
  padding-top: 1vh;
}
.popupbox .popupbox_c .popupbox_c_left p:nth-child(2) {
  color: white;
}
.popupbox .popupbox_c .popupbox_c_right {
  float: right;
  border-left: 1px solid #ffac2f;
}

.popupbox .popupbox_d {
  margin-top: 2vh;
  height: 8vh;
}
.popupbox_d .popupbox_d_btn1 {
  height: 7vh;
  width: 45%;
  float: left;
  border: 1px solid #ffac2f;
  border-radius: 5px;
  text-align: center;
  line-height: 7vh;
  color: white;
  font-size: 1.1rem;
}
.popupbox_d .popupbox_d_btn2 {
  width: 45%;
  height: 7vh;
  float: right;
  background: #ffac2f;
  border-radius: 5px;
  text-align: center;
  line-height: 7vh;
  color: white;
  font-size: 1.1rem;
}

.nowcolor {
  color: #ffac2f !important;
}
.nowcolor_off {
  color: #a9a9a9 !important;
}

/* 游戏切换 */
.header_title1 {
  /* width: 30vw; */
  float: left;
  /*background: skyblue;*/
  height: 6vh;
  margin-top: 0.5vh;
}
.header_title1 ul {
  margin-top: -22px;
  position: absolute;
  top: 11.1vh;
  padding: 0px;
  z-index: 9999;
  width: 30vw;
  background: #e33c3c;
  left: 0;
}

.header_title1 ul li {
  padding: 10px 0px;
  margin: 0px;
  width: 100%;
  height: 7vh;
  list-style: none;
  text-align: center;
}
.header_title1 ul li img {
  padding: 0px !important;
  /* margin: 0px 0px 5px 20% !important; */
}
.account_info {
  display: flex;
  align-self: center;
  margin-top: 2px;
  color: rgb(241, 231, 215);
  border: 1px solid #ff9900;
  padding: 7px 10px;
  border-radius: 4px;
}
.account_info .text {
  line-height: 2.5vh;
  font-size: 16px;
  font-weight: 500;
}
.account_info .text span {
  margin-left: 10px;
}
</style>













