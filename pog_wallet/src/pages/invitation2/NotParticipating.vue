<template>
  <div class="warp">
    <!-- 头部信息 -->
    <div class="top">
      <h2>eoscheshieos</h2>
      <span> 未激活 > </span>
    </div>
    

    <!-- 全球区块链去中心化游戏应用平台 -->
    <div class="log">
       <img src="../../../public/img/u482.svg" alt="">
       <p class="log_title"> 
          <span >Token ●</span>
          <span> Blockchain ●</span>
          <span> Game</span>
       </p>
       <p class="log_txt">全球区块链去中心化游戏应用平台</p>
    </div>

    <!-- 已销毁部分 -->
    <div class="destroyed">
        <spqn class="destroyed_txt1">   已销毁</spqn> 
        <span class="destroyed_txt2"> 1,201,519.</span>     
        <span class="destroyed_txt3">2630 26456</span>
        <span> TBG </span>
        <span class="destroyed_txt4">></span>
    </div> 

    <!-- 查看TBG旗下游戏 -->
    <div class="games">
       <p class="games_title">查看 TBG 旗下游戏</p>
        <p>...</p>
    </div>

    <!-- 在线客服 -->
    <div class="onlineService">
        <div class="item">
            <img src="../../../public/img/u5098.png" alt="">
            <span class="pd2">最新线性释放池调整... </span>
            <span>2019-06-23 ></span>
        </div>
        <div class="item">
           <img src="../../../public/img/u5100.svg" alt="">
           在线</br>客服
        </div>
    </div>

    <!-- 我的团队 -->
    <div class="myteam">
      <div class="title clear">
        <span class="left">
          我的团队
        </span>
        <span class="right">
          规则>
        </span>
      </div>
    </div>

    <!-- 投资与子账号 -->
    <div class="investment">
        <div class="title clear">
          <span class="left">
            投资与子账号
          </span>
          <span class="right">
            规则>
          </span>
        </div>
    </div>

    <!-- 全球区块链去中心化游戏平台 -->
    <div class="direction">
        <div class="content">
            <div class="left">
                <img src="@/assets/img/u5094.svg" alt="">
            </div>
            <div class="right">  
              全球区块链去中心化游戏平台，真正公平
            公正、透明可查、无法作假的区块链去中
            心化游戏是现在和未来的方向。
            </div>
        </div>
          
    </div>
    
    <!-- TBG-I 收益 -->
    <div class="profit">
        <div class="title clear">
          <span class="left">
            TBG-I 收益
          </span>
          <span class="right">
            规则>
          </span>
        </div>
        <div class="content clear">
          <div class="left">总计</div>
          <div class="right">492.5160 <span>0210</span> UE</div>
        </div>
    </div>

    <!-- 奖金及保障池 -->
    <div class="bonus">
        <div class="title clear">
          <span class="left">
            奖金及保障池
          </span>
          <span class="right">
            规则>
          </span>
        </div>
        <div class="content">
           <div class="item">
              <p>Bingo 奖金池</p>
              <p>00:26:09</p>
              <p>倒计时</p>
           </div>
           <div class="item">
              <p>最后1位投资者</p>
              <p>2303.2450</p>
              <p>UE</p>
           </div>
           <div class="item">
              <p>最后2-30位投资者</p>
              <p>2303.2450</p>
              <p>UE</p>
           </div>
           <div class="item">
              <p>TBG分红池</p>
              <p>5103.0580</p>
              <p>UE</p>
           </div>
           <div class="item">
              <p>三倍收益保障池</p>
              <p>1096.0000</p>
              <p>UE</p>
           </div>
           <div class="item">
              <p>直接推荐PK池</p>
              <p>154.2532</p>
              <p>UE</p>
           </div>
        </div>
    </div>

  </div>
 
</template>

<script>


export default {
    data(){
        return {
            
        }
    }
}
</script>

<style scoped>
  /* 公共样式 */
  .warp{
        font-family: '微軟正黑體 Regular', '微軟正黑體';
  }
  .clear{
    overflow: hidden;
    zoom:1;
  }
  .clear:after{
     content:"";
     clear:both;
     display:block;
     height:0;
     overflow:hidden;
     visibility:hidden;
  }
   .title{
    width:100%;
    height:1.3rem;
    line-height: 1.3rem;
    border-bottom:1px solid rgba(242, 242, 242, 1);;
  }
  .title .left{
    font-size:0.5rem;
    font-weight:bold;
    float:left;
    padding-left:0.3rem;
  }
  .title .right{
    font-size:0.35rem;
    float:right;
    padding-right:0.3rem;
  }

   /* 内容样式 */

  .top{
    text-align:center;
    padding:0.2rem 0;
  }
  .top h2{
    font-family: 'Bahnschrift Regular', 'Bahnschrift';
    font-weight: 400;
    margin:0;
    padding:0.1rem 0;
    font-style: normal;
    font-size: 0.6rem;
    color: #A1A1A1;
  }
  .top span{
    color:#9c9c9c;
    font-size:0.45rem;
  }


  .log{
    text-align:center;
    background-color:#fff;
    width:100%;
    padding:0.5rem 0;
    color:#333;
    margin-bottom:0.04rem;
  }
  .log_title{
    padding:0.2rem 0;
    font-size:0.5rem;
    font-family: 'Bahnschrift Regular', 'Bahnschrift';
  }
  .log_txt{
    font-size:0.45rem;
  }


  .games{
    padding:0.5rem 0;
    background-color:#fff;
    margin-bottom:0.04rem;
    text-align:center;
  }
  .games_title{
    font-size:0.43rem;
    
  }


  .destroyed{
     padding:0.5rem 0;
     margin-bottom:0.04rem;
     background-color:#fff;
     text-align:center;
     font-family: 'Bahnschrift Regular';
     font-size:0.5rem;
  }
  .destroyed_txt1{
    font-family: '微軟正黑體 Regular', '微軟正黑體';
    font-size:0.4rem;
    padding-left:0.3rem;
  }
  .destroyed_txt2{
    color: #FF9900;
  }
  .destroyed_txt3{
    color: #BCBCBC;
  }
  .destroyed_txt4{
    color:#b1b1b1;
  }


  .onlineService{
    background: #fff;
    display:flex;
    flex-wrap:nowrap;
    box-sizing:border-box;
    width:100%;
  }
  .onlineService .item:nth-child(1){
    flex:7.5 7.5;
    display:flex;
    align-items:center;
    font-size:0.37rem;
    border-right:1px solid #efeff4;
    /* justify-content:center; */
  }
  .onlineService .item:nth-child(2){
    flex:2.5 2.5;
    display:flex;
    align-items:center;
    font-size:0.37rem;
    justify-content:center;
    padding-right:0.1rem;
  }
  .pd2{
    padding-right:0.2rem;
  }


  .myteam{
     background:#fff;
     margin-top:0.35rem;
  }
 


  .investment{
    background:#fff;
     margin-top:0.35rem;
  }



  .direction{
    display:flex;
    margin-top:0.35rem;
    background-color:#fff;
    align-items:center;
    padding:0.4rem;
  }
  .direction .content{
    padding:0.35rem 0.2rem; 
    border:1px solid rgba(228, 228, 228, 1);
    border-radius: 5px;
    width:100%;
    display:flex;
    align-items:center;
  }
 
   .direction .content .left img{
    padding-right:0.2rem;
  }

  .direction .content .right{
    font-size:0.4rem;
  }



  .profit{
     background:#fff;
     margin-top:0.35rem;
  }
  .profit .content{
     padding:0.4rem;
  }
  .profit .content .left{
    float:left;
    font-size:0.45rem;
    
  }
  .profit .content .right{
    float:right;
    font-weight:bold;
    font-size:0.4rem;
  }
  .profit .content .right span{
    color:#868686;
  }



  .bonus{
     background:#fff;
     margin-top:0.35rem;
  }
  .bonus .content{
    display:flex;
    flex-wrap:wrap;
    text-align:center;
  }
  .bonus .content .item{
    flex:1;
    padding:0.4rem 0.2rem;
  }
  .bonus .content .item p:nth-child(1){
      font-family:'微軟正黑體 Regular', '微軟正黑體';
      font-size:0.4rem;
      white-space:nowrap;
  }
  .bonus .content .item p:nth-child(2){
      font-family: 'Bahnschrift Regular', 'Bahnschrift';
      font-size:0.45rem;
      white-space:nowrap;
      font-weight:400;
      
  }
  .bonus .content .item p:nth-child(2) + .bonus .content .item p:nth-child(-n+3){
      color:#FF9900;
  }
</style>
