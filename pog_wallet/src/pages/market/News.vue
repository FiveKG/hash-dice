<template>
  <vpage>
    <slot>
      <div class="layout">
        <!-- <div class="item">
          <div class="flex_box">
            <div class="news_type">快讯</div>
            <span class="news_time">2019-04</span>
          </div>
          <div class="news_title">标题12345</div>
          <div class="news_content">据Vtoken Dapp数据显示，Vtoken交易所YEC/VRT24小时交易量3097.79万，ETH/YEC涨幅15.25%，VRT/VTOKEN单日涨幅13.52%，LINK/VRT单日涨幅10.24%，VPC平台币交易依旧活跃。</div>
          <div class="news_source">DappTotal</div>
        </div> -->
        <div class="news_none">
          --暂无快讯--
        </div>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage';

export default {
  components: {
    vpage: MyPage
  }
}
</script>

<style scoped>
.layout {
  height: 100%;
  background-color: #fff;
}
.flex_box {
  display: flex;
  align-items: center;
}
.item {
  margin: 0 47px;
  padding: 30px 0;
  border-bottom: 1PX solid rgb(228, 228, 228);
}
.news_type {
  padding: 10px 30px;
  background-color: #ec565a;
  color: #fff;
  border-radius: 15px;
  font-size: 24px;
}
.news_time {
  margin-left: 40px;
  font-size: 24px;
}
.news_title {
  margin-top: 28px;
  font-size: 34px;
}
.news_content {
  margin-top: 34px;
  font-size: 24px;
  color: #525252;
  letter-spacing: 3px;
  word-break: break-all;
}
.news_source {
  text-align: right;
  margin-top: 38px;
  font-size: 19px;
  color: #525252;
}
.news_none {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f6f6f6;
  font-size: 34px;
}
</style>
