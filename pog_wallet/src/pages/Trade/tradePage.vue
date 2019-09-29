<template>
  <v-ons-page>
    <div class="background"></div>
    <div class="content">
      <div class="header">
        <div class="header_line"></div>
        <div class="header_content">
          <span>UE兑换</span>
          <img src="@/assets/img/u2568.svg" alt />
        </div>
      </div>
      <div class="exchange">
        <!-- 兑出金额 -->
        <div :class="{'open_mask':selectIsShow}"    @click="selectIsShow = !selectIsShow" ></div>
        <div class="exchange_row" :class="{'open':selectIsShow}">
          <p><input :disabled="selectIsShow"  placeholder="兑出金额"  class="input_exchange_amount" type="text"></p>
          <p @click="selectIsShow = !selectIsShow">

            <img v-if="amountExchangeSelect == 1" class="paxPic" src="@/assets/img/u2543.svg" />
            <span v-if="amountExchangeSelect == 1" >PAX</span>

             <img v-if="amountExchangeSelect == 2" class="paxPic" src="@/assets/img/u25481.svg"  />
            <span v-if="amountExchangeSelect == 2" >UE</span>

            <img class="uePic" src="@/assets/img/u1210.png" alt />
          </p>

          <ul class="change_list">
            <li @click="selectAmountExchange(1)">
             <span><img  v-show="amountExchangeSelect == 1" src="@/assets/img/u1499.png" alt="" ></span> 
              <div>
                <img src="@/assets/img/u2543.svg" alt="">
                <span>PAX</span>
              </div>
            </li>
            <li  @click="selectAmountExchange(2)">
              <span><img v-show="amountExchangeSelect == 2" src="@/assets/img/u1499.png" alt="" ></span>
              <div>
                <img src="@/assets/img/u25481.svg" alt="">
                <span>UE</span>
              </div>
            </li>
          </ul>

        </div>

        <div class="exchange_address">
          <span ref="exchangeAddres" @click="actionSheetVisible = true">选择兑出地址</span>
          <span>5 PAX 矿工费</span>
        </div>

        <!-- 实收金额 -->
        <div class="exchange_row">
          <p>实收金额</p>
          <p>
            <img class="paxPic" src="@/assets/img/u25481.svg"  />
            <span>UE</span>
            <img class="uePic" src="@/assets/img/u1210.png" />
          
          </p>
        </div>
        <div class="exchange_address">
          <span @click="actionSheetVisible1 = true">选择接收地址</span>
        </div>

        <!-- 兑换按钮 -->
        <div class="post_button">兑换</div>
        <p class="post_txt">1 UE = 1 PAX</p>
      </div>

      <div class="list_title">
        <p @click="titleToggle(0)" :class="{'active':switchNum === 0}">公众审计</p>
        <p @click="titleToggle(1)" :class="{'active':switchNum === 1}">最近兑换</p>
      </div>

      <v-ons-carousel fullscreen swipeable auto-scroll overscrollable :index.sync="switchNum">
        <v-ons-carousel-item>
          <!-- 公众审计 -->
          <div class="audit">
            <div class="audit_row">
              <img src="@/assets/img/u2485.svg"  />
              <div class="audit_txt">
                <p>1 UE = 1 PAX = 1 USD</p>
                <p>恒定价值，实时审计，随时兑换</p>
              </div>
            </div>

            <div class="audit_row">
              <img src="@/assets/img/u2507.svg" />
              <div class="audit_txt">
                <p>每兑换 1 PAX 则在银行存入 1 美元</p>
                <p>受纽约金融服务署 ( NYDFS ) 监管</p>
              </div>
            </div>
          </div>

          <!-- 实时公众审计 -->
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
              <img class="morePic" src="@/assets/img/u29.png"  />
            </p>
          </div>
        </v-ons-carousel-item>
      </v-ons-carousel>

      <!-- 更多下拉框1 (兑出地址))-->
      <v-ons-action-sheet :visible.sync="actionSheetVisible" cancelable>
        <div class="selectwrap">
          <div class="wdclose" @click="actionSheetVisible = false"></div>
          <div class="select_title">
            <span>选择{{amountExchangeSelect==1? 'PAX': 'UE'}}兑出地址</span>
          </div>
          <div class="select_list">
            <p class="list_col" v-for="(items,index) in exchangeAddressList" :key="index" @click="toggleItem($event)">
              <span>
                <img class="imgNone" src="@/assets/img/u1499.png" alt="ok" />
              </span>
              <span>{{items.name}}</span>
              <span>{{items.number}}</span>
            </p>
          </div>
        </div>
      </v-ons-action-sheet>




       <!-- 更多下拉框2 (接收钱包地址)-->
      <v-ons-action-sheet :visible.sync="actionSheetVisible1" cancelable>
        <div class="selectwrap">
          <div class="wdclose" @click="actionSheetVisible1 = false"></div>
          <div class="select_title">
            <span>选择 UE 接收钱包</span>
          </div>
          <div class="select_list">
            <p class="list_col">
              <span>
                <img src="@/assets/img/u1499.png" alt="ok" />
              </span>
              <span>fenglaoyang</span>
              <span>1,620.0253 0200</span>
            </p>
          </div>
        </div>
      </v-ons-action-sheet>
    </div>
  </v-ons-page>
</template>

<script type="text/ecmascript-6">
export default {
  name: "",
  data() {
    return {
      actionSheetVisible: false,
      actionSheetVisible1: false,
      selectIsShow:false,
      switchNum: 0,
      amountExchangeSelect:2, // 1等于pax  2等于ue
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
    titleToggle(num) {
      this.switchNum = num;
    },
    toggleItem(e){
        let colNode;
        for(let i=0 ; i<e.path.length;i++){
          if(e.path[i].className == 'list_col'){
              colNode = e.path[i]
          }
        }
        if(colNode.firstChild.childNodes[0].className == 'imgNone'){
            // 删除已有的选中项
            for(let i=0; i<e.path.length; i++){
              if(e.path[i].className == 'select_list'){
                  let listNodes = e.path[i].childNodes
                  for(let i=0; i<listNodes.length; i++){
                      if(listNodes[i].childNodes[1].className == 'fontBold'){
                            listNodes[i].firstChild.childNodes[0].className = 'imgNone'
                            listNodes[i].childNodes[1].className = ''
                      }
                  }
              }
            }
            colNode.firstChild.childNodes[0].className = 'imgBlock'
            colNode.children[1].className = 'fontBold'
            this.$refs.exchangeAddres.innerHTML = colNode.children[1].innerHTML
        }
    },
    selectAmountExchange(num){
        this.amountExchangeSelect = num
        this.selectIsShow = false
    },
  }
};
</script>

<style scoped lang="less">
.background {
  background: #f2f2f2;
}
.fr{
  float:right;
}
.fl{
  float:left;
}

.header_line {
  position: absolute;
  top: 0;
  height: 0.2rem;
  width: 100%;
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
  position:relative;
  background-color:#fff;
  padding-right:.2rem;
}
// 下拉菜单
.exchange_row ul{
  position:absolute;
  top:0rem;
  left: 0;
  margin-top:1.5rem;
  background-color:#fff;
  padding:0;
  width:100%;
  border-radius: 0.1rem;

  list-style-type: none;
  max-height: 0;
  transition: max-height .4s ease-out ;
  overflow-y:hidden;
  overflow-x: hidden;
  z-index:99;

}

.open{
  z-index: 99;
}

.change_list>li{
  display:flex;
  justify-content:space-between;
  align-items:center;
  line-height:1.2rem;
  height:1.2rem;
  padding:0 .6rem;
}
.change_list li>span{
  height:.5rem;
  width:.5rem;
  display:flex;
}
.change_list li>span>img{
  height:.5rem;
  width:.5rem;
  
}
.change_list>li>div>span{
  font-size:.45rem;
}
.change_list>li>div>img{
  height:1.1rem;
  width:1.1rem;
}

.change_list li div{
  display:flex;
  align-items:center;
  width:2rem;
}
.open ul{
  max-height:10rem;
  overflow-y:hidden;
  overflow-x:hidden;
}


 .open_mask{
  opacity: 1;
  transition: all 0.4s linear 0s;
  position:fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .1);
  z-index:98;
}


.exchange_row p:nth-child(1) {
  font-size: 0.5rem;
  color: #aeaeae;
  font-family: "微軟正黑體 Regular", "微軟正黑體";
  flex: 1;
  display: flex;
  align-items: center;
  padding-left:4%;
  height:100%;
}
.input_exchange_amount{
  height:100%;
  width:95%;
  border:0px;
  font-size:.45rem;
  letter-spacing:.02rem;
  background-color: #fff;
  
}
.input_exchange_amount::-webkit-input-placeholder {
  color: #aeaeae;
}
.input_exchange_amount:-moz-placeholder {
  color: #aeaeae;
}
.input_exchange_amount:-ms-input-placeholder {
  color: #aeaeae;
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
  padding:0 0.13rem
}
.paxPic {
  width: 1rem;
  height: 1rem;
}
.uePic {
  width: 0.5rem;
  height: 0.5rem;

  // transform: rotate(0deg);
  transition: .3s ease-out, top .2s ease-out;
}

.open .uePic{
  transform: rotate(-180deg);
  transition: .35s ease-in, top .2s ease-in;
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
  padding-top:5px;
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
.imgNone{
  display:none;
}
.imgBlock{
  display:block;
}
</style>
