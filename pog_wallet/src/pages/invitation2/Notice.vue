<template>
   <v-ons-page>
   <div class="wrap">
        <!-- 头部信息 -->
        <div class="top-info">
          <img @click="goback()" src="@/assets/img/u14.png" alt="">
          <span>系统公告</span>
        </div>

        <!-- 新游戏上线公告 -->
        <ul class="online">
          <li><span>新游戏上线公告</span> <span>2019-06-15</span></li>
          <li><span>新游戏上线公告</span> <span>2019-06-15</span></li>
          <li><span>新游戏上线公告</span> <span>2019-06-15</span></li>
        </ul>

  

    </div>
    </v-ons-page>
</template>

<script type="text/ecmascript-6">
export default {
   data() {
       return {
       }
   },
  methods:{
      goback(){
          this.$router.go(-1)
      }
  }
}
</script>

<style scoped lang="less">
.wrap{
  // background-color:#f6f6f6;
  font-family: '微軟正黑體 Regular', '微軟正黑體';
}
.top-info{
    height: 1.3rem;
    display: flex;
    align-items: center;
}
.top-info img{
    padding-left:0.3rem;
    height: 0.8rem;
    width:0.8rem;
}
.top-info span{
    font-family: 'Bahnschrift Regular', 'Bahnschrift';
    font-size:0.5rem;
    padding-left:0.1rem;
}

.online{
  background-color: #fff;
  padding:0;
}

.online li{
  padding: 0 .5rem;
  list-style: none;
  line-height: 1.5rem;
  font-size:.4rem;
  border-bottom:1px solid #f6f6f6;
}

.online li span:nth-child(2){
  float: right;
}





</style>
