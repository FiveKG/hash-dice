<template>
  <div class="trade-page">
    <div class="wrap" >
     <div class="header">
        <div class="header_line"></div>
          <div class="header_content">
            <span style="">UE兑换</span> 
            <img src="@/assets/img/u2568.svg" alt="">
          </div>
      </div>
      <div class="exchange">
              <!-- 兑出金额 -->
              <div class="exchange_row amount_paid">
                  <p>兑出金额</p>
                  <p>
                    <img class="paxPic" src="@/assets/img/u2543.svg" alt="">
                    <span>PAX</span> 
                    <img class="uePic" src="@/assets/img/u1210.png" alt="">
                  </p>
              </div>
              <div class="exchange_address">
                  <span>选择兑出地址</span>
                  <span>5 PAX 矿工费</span>
              </div>

              <!-- 实收金额 -->
              <div class="exchange_row amount_received">
                  <p>实收金额</p>
                  <p>
                    <img class="paxPic" src="@/assets/img/u25481.svg" alt="">
                    <span style="padding:0 0.13rem">UE</span> 
                    <img class="uePic" src="@/assets/img/u1210.png" alt="">
                  </p>
              </div>
              <div class="exchange_address">
                  <span>选择接收地址</span>
              </div>
              
              <!-- 兑换按钮 -->
              <div class="post_button">
                  兑换
              </div>
              <p class="post_txt">1 UE = 1 PAX</p>
          </div>

            
            
            <div class="list_title">
              <p @click="titleTogle(0)" :class="{'active':switchNum === 0}">公众审计</p>
              <p @click="titleTogle(1)" :class="{'active':switchNum === 1}">最近兑换</p>
            </div>

            <v-ons-carousel fullscreen swipeable auto-scroll overscrollable
              :index.sync="switchNum"
            >
            <v-ons-carousel-item>
              <!-- 公众审计 -->
              <div class="audit">
                  <div class="audit_row">
                    <img src="@/assets/img/u2485.svg" alt="">
                    <div class="audit_txt">
                      <p>1 UE = 1 PAX = 1 USD</p>
                      <p>恒定价值，实时审计，随时兑换</p>
                    </div>
                  </div>

                  <div class="audit_row">
                    <img src="@/assets/img/u2507.svg" alt="">
                    <div class="audit_txt">
                      <p>每兑换 1 PAX 则在银行存入 1 美元</p>
                      <p>受纽约金融服务署 ( NYDFS ) 监管</p>
                    </div>
                  </div>

              </div>
              

            </v-ons-carousel-item>

        <v-ons-carousel-item>
          <div class="recentexchange_row" v-for="(item,index) in recentexchangeList " :key="index">
            <p>
              <span>{{item.date}}</span>
            </p>
            <p>
              <span>{{item.exchange}}</span>
            </p>
            <p>
              <span>{{item.number}}</span>
              <img class="morePic" src="@/assets/img/u29.png" alt />
            </p>
          </div>
        </v-ons-carousel-item>
      </v-ons-carousel>

            <v-ons-carousel-item>
              <div>222222222</div>
            </v-ons-carousel-item>

            </v-ons-carousel>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "",
  data() {
    return {
      actionSheetVisible: false,
      actionSheetVisible1: false,
      switchNum: 0,
      exchangeAddressList:[
        {name:'fenglaoyang',number:162002530200},
        {name:'qwe',number:112002530200},
        {name:'xxxyyyzzz',number:102002530200},
      ],
      recentexchangeList: [
        {
          date: "2019-06-10 17:15:23",
          exchange: "PAX 兑 UE",
          number: "1,200.0000"
        },
        {
          date: "2019-06-05 17:15:23",
          exchange: "UE 兑 PAX",
          number: "1,600.0000"
        },
        {
          date: "2019-06-01 17:15:23",
          exchange: "PAX 兑 UE",
          number: "1,000.0000"
        },
        {
          date: "2019-06-01 17:15:23",
          exchange: "PAX 兑 UE",
          number: "1,000.0000"
        },
        {
          date: "2019-06-01 17:15:23",
          exchange: "PAX 兑 UE",
          number: "1,000.0000"
        },
        {
          date: "2019-06-01 17:15:23",
          exchange: "PAX 兑 UE",
          number: "1,000.0000"
        }
      ]
    };
  },
  components: {},
  methods: {
    titleTogle(num) {
      this.switchNum = num;
    },
    checkItem(e){
      console.log(e.target)
    }
  }
};
</script>

<style scoped lang="less">
.trade-page{
  height: 100vh;
  overflow-y: scroll;
}
.wrap{
  background:rgba(242, 242, 242, 1);
  position:relative;
}
.header_line{
  position:absolute;
  top:0;
  height:.2rem;
  width:100%;
  background-color: rgba(228, 228, 228, 1);
}
.header_content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 0.4rem;
  height: 1.6rem;
  color: #ff9900;
  font-family: "Bahnschrift Regular", "Bahnschrift";
  font-size: 0.55rem;
  font-weight: 400;
}
.header_content img {
  width: 0.6rem;
}
.exchange {
  margin: 0 0.5rem;
  background: #fff;
  padding: 0.5rem;
  border-radius: 0.2rem;
  box-shadow: 0 0 0.2rem rgba(236, 230, 230, 0.123);
}
.exchange_row {
  border: 0.018rem solid rgba(242, 242, 242, 1);
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  padding: 0.1rem;
  border-radius: 0.1rem;
}
.exchange_row p:nth-child(1) {
  padding-left: 0.1rem;
  font-size: 0.5rem;
  color: #aeaeae;
  font-family: "微軟正黑體 Regular", "微軟正黑體";
  flex: 1;
}
.exchange_row p:nth-child(2) {
  display: flex;
  align-items: center;
}
.exchange_row p:nth-child(2) span {
  color: #000000;
  font-family: "Bahnschrift Regular", "Bahnschrift";
  font-size: 0.4rem;
  font-weight: 400;
}
.paxPic {
  width: 1rem;
  height: 1rem;
}
.uePic {
  width: 0.5rem;
  height: 0.5rem;
  padding-right: 0.2rem;
}
.exchange_address {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: space-between;
  padding: 0.2rem 0.1rem;
  border-radius: 0.1rem;
}
.exchange_address span:nth-child(1) {
  font-size: 0.4rem;
  color: #006699;
  padding-left: 0.1rem;
}
.exchange_address span:nth-child(2) {
  font-size: 0.4rem;
  color: #6b6b6b;
  padding-right: 0.4rem;
  font-family: "Bahnschrift Regular", "Bahnschrift";
}
.post_button {
  color: #fff;
  background-color: rgba(255, 153, 0, 1);
  font-family: "微軟正黑體 Regular", "微軟正黑體";
  font-size: 0.5rem;
  line-height: 1.2rem;
  text-align: center;
  border-radius: 0.1rem;
  margin-top: 0.4rem;
}
.post_txt {
  text-align: center;
  line-height: 1.5rem;
  color: #6b6b6b;
  font-size: 0.5rem;
  font-family: "Bahnschrift Regular", "Bahnschrift";
}
.list_title {
  margin: 0.8rem 0.5rem 0;
  line-height: 1rem;
  font-size: 0.45rem;
  color: #bcbcbc;
  font-family: "微軟正黑體 Regular", "微軟正黑體";
  display: flex;
}
.list_title p {
  margin-right: 0.4rem;
  padding: 0 0.1rem;
  box-sizing: border-box;
  transition: all 0.3s;
}
.list_title > .active {
  border-bottom: 0.05rem solid #ff9900;
  color: #ff9900;
  font-size: 0.5rem;
}
.audit_row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.5rem 0.5rem;
  padding-bottom: 0.5rem;
  flex-wrap: nowrap;
  border-bottom: 0.018rem solid rgba(204, 204, 204, 0.658);
  // box-sizing:border-box;
}
.audit_row img {
  width: 2.3rem;
  height: 2.3rem;
}
.audit_txt {
  flex: 1;
  font-size: 0.44rem;
  line-height: 0.7rem;
  padding-left: 0.1rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.audit_txt p {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.audit .audit_row:last-child {
  border-bottom: 0px;
  margin-bottom: 0px;
}
.recentexchange_row {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  font-family: "Bahnschrift Regular", "Bahnschrift";
  color: #000;
  font-weight: 400;
  padding: 0.2rem 0;
  font-size: 0.5rem;
}
.recentexchange_row p {
  flex: 1 1;
  text-align: center;
  font-size: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.morePic {
  width: 0.5rem;
  height: 0.5rem;
}

// 下拉菜单
.selectwrap {
  background-color: #fff;
  min-height: 200px;
  max-height: 100vh;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: scroll;
}
.wdclose {
  width: 0.6rem;
  height: 0.6rem;
  background: url("../../assets/img/u102.png") no-repeat center center;
  background-size: 1rem 1rem;
  position: absolute;
  right: 0.8rem;
  top: 0.65rem;
}
.select_title {
  margin: 0 0.7rem;
  padding: 0.6rem 0 0.4rem;
  align-items: center;
  font-size: 0.5rem;
  font-family: "微軟正黑體 Regular", "微軟正黑體";
  font-weight: 400;
  border-bottom: 0.018rem solid rgba(242, 242, 242, 1);
}
.selectrow span {
  padding-right: 1rem;
}
.pic {
  width: 0.7rem;
  height: 0.5rem;
  padding-right: 0.5rem;
}
.people {
  width: 0.8rem;
  height: 0.8rem;
  padding-right: 0.2rem;
}
.rule {
  width: 0.8rem;
  height: 0.8rem;
  padding-right: 0.2rem;
}
.list_col {
  display: flex;
  align-content: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  box-sizing: border-box;
  margin: 0.3rem 0.7rem;
  padding: 0.4rem 0.3rem;
  font-size: 0.5rem;
  box-shadow: 0px 1px 10px rgba(201, 201, 201, 0.6);
  color: #c9c9c9;
  transition: all 0.3s;
}
.list_col span:nth-child(1) {
  width: 0.5rem;
  height: 0.5rem;
  vertical-align: middle;
}
.list_col span:nth-child(2) {
  flex: 2 2;
  padding-left: 0.2rem;
}
.list_col span:nth-child(3) {
  flex: 3 3;
  text-align: right;
}
.list_col img {
  width: 0.5rem;
  height: 0.5rem;
  vertical-align: middle;
}
.fontBold{
  font-weight:bold;
  color:#000;
}
</style>
