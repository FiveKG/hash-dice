<template>
   <div class="wrap">
     <div class="header">
        <div class="header_line"></div>
        <div class="header_content">
            <span>UE兑换</span> 
            <img src="@/assets/img/u2568.svg" alt="">
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
     </div>
   </div>
</template>

<script type="text/ecmascript-6">
export default {
   name: '',
   data() {
       return {
         
       }
   },
  components: {},
  methods:{
    

  },

}
</script>

<style scoped lang="less">
.wrap{
  background:rgba(242, 242, 242, 1);
  position:relative;
  height:1000px;
}
.header_line{
  position:absolute;
  top:0;
  height:.2rem;
  width:100%;
  background-color: rgba(228, 228, 228, 1);
}
.header_content{
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  padding-top:.2rem;
  height:1.6rem;
  color: #FF9900;
  font-family: 'Bahnschrift Regular', 'Bahnschrift';
  font-size:.55rem;
  font-weight: 400;
}
.header_content img{
  width:.6rem;
}
.exchange{
  margin:0 .5rem;
  background:#fff;
  padding: .5rem;
  border-radius:.2rem;
  box-shadow: 0 0 0.2rem rgba(236, 230, 230, 0.123)
}
.exchange_row{
  border:.018rem solid rgba(242, 242, 242, 1);
  display:flex;
  align-items:center;  
  flex-wrap:nowrap;
  padding:.1rem;
  border-radius: .1rem;
}
.exchange_row p:nth-child(1){
  padding-left:.1rem;
  font-size:.5rem;
  color: #AEAEAE;
  font-family: '微軟正黑體 Regular', '微軟正黑體';
  flex:1;
}
.exchange_row p:nth-child(2){
  display:flex;
  align-items: center;
}
.exchange_row p:nth-child(2) span{
  color: #000000;
  font-family: 'Bahnschrift Regular', 'Bahnschrift';
  font-size:.4rem;
  font-weight: 400;
}
.paxPic{
  width:1rem;
  height:1rem;
}
.uePic{
  width:.5rem;
  height:.5rem;
  padding-right:.2rem;
}
.exchange_address{
  display:flex;
  align-items:center;  
  flex-wrap:nowrap;
  justify-content:space-between;
  padding:.2rem .1rem;
  border-radius: .1rem;
}
.exchange_address span:nth-child(1){
  font-size:.4rem;
  color: #006699;
  padding-left:.1rem;
}
.exchange_address span:nth-child(2){
  font-size:.4rem;
  color: #6B6B6B;
  padding-right:.4rem;
  font-family: 'Bahnschrift Regular', 'Bahnschrift';
}
.post_button{
  color:#fff;
  background-color: rgba(255, 153, 0, 1);
  font-family: '微軟正黑體 Regular', '微軟正黑體';
  font-size: .5rem;
  line-height:1.2rem;
  text-align:center;
  border-radius: .1rem;
  margin-top:.4rem;
}
.post_txt{
  text-align: center;
  line-height:1.5rem;
  color: #6B6B6B;
  font-size:.5rem;
  font-family: 'Bahnschrift Regular', 'Bahnschrift';
}


</style>
