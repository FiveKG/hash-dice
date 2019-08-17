<template>
  <div class="warp">
    <div class="top">
      <h2>eoscheshieos</h2>
      <span> 未激活 > </span>
    </div>
    <div class="log">
       <img src="../../../public/img/u482.svg" alt="">
       <p class="log_title"> 
          <span >Token ●</span>
          <span> Blockchain ●</span>
          <span> Game</span>
       </p>
       <p class="log_txt">全球区块链去中心化游戏应用平台</p>
    </div>
      <div class="destroyed">
          <spqn class="destroyed_txt1">   已销毁</spqn> 
          <span class="destroyed_txt2"> 1,201,519.</span>     
          <span class="destroyed_txt3">2630 26456</span>
          <span> TBG </span>
          <span class="destroyed_txt4">></span>
      </div> 
    <div class="games">
       <p class="games_title">查看 TBG 旗下游戏</p>
        <p>...</p>
    </div>
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
    <div class="myteam">
      <div class="title clear">
        <span class="left">
          我的团队
        </span>
        <span class="right">
          规则>
        </span>
      </div>

      <div class="btn2">
        
      </div>
    </div>
  </div>
</template>

<script>


export default {
   
}
</script>

<style scoped>
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
  .myteam .title{
    width:100%;
    height:1.3rem;
    line-height: 1.3rem;
    border-bottom:1px solid #efeff4;
  }
  .myteam .title .left{
    font-size:0.5rem;
    font-weight:bold;
    float:left;
    padding-left:0.3rem;
  }
  .myteam .title .right{
    font-size:0.35rem;
    float:right;
    padding-right:0.3rem;
  }


</style>
