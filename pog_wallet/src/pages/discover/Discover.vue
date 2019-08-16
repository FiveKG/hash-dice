<template>
  <div class="layout">
    <div class="row_search">
      <img src="@/assets/img/u10.png" alt="">
      <input type="text" class="text-input" disabled>
      <span>搜索</span>
    </div>
    <div class="row_tab">
      <div v-for="item in tabs">{{item}}</div>
    </div>
    <div class="lotto">
      <div class="category">TBG彩码可用</div>
      <div class="dapp_layout" @click="clickDapp">
        <img class="dapp_icon" src="@/assets/EOS-256.png">
        <div class="dapp_text">
          <div class="dapp_name">全球彩</div>
          <div class="dapp_desc">真正全球的彩票</div>
        </div>
      </div>
      <div class="category">TBG 游戏筹码可用</div>
      <div class="dapp_layout">
        <img class="dapp_icon" src="@/assets/EOS-256.png">
        <div class="dapp_text">
          <div class="dapp_name">好运红包</div>
          <div class="dapp_desc">好运红包  好运相伴</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      tabs: ['全部','彩码','筹码','游戏','资源','理财']
    }
  },
  created() {
    const that = this
    window.handleOpenURL = function (url) {
      console.log('handleOpenURL',url)
      setTimeout(function() {
        // alert("received url: " + url.split('//')[1]);
        if (url.split('//')[1] === 'close') {
          that.$router.go(-1)
        }
      }, 0);
    }
  },
  methods: {
    clickDapp() {
      this.$router.push({
        name: 'Iframe',
        query: {
          url: 'http://192.168.1.155:8080',
          name: 'test'
        }
      })
    }
  },
}
</script>

<style scoped>

.layout {
  height: 100%;
  padding: 30px;
  box-sizing: border-box;
}
.row_search {
  padding: 20px 30px;
  box-shadow: 0 0 10px #cfcfcf;
  border-radius: 10px;
  display: flex;
  align-items: center;
}
.row_search img {
  width: 46px;
  height: 46px;
}
.row_search input {
  flex: 1;
}
.row_search span {
  color: #ff8e05;
  font-size: 34px;
}
.row_tab {
  display: flex;
  justify-content: space-around;
  box-shadow: 0 0 10px #cfcfcf;
  background-color: #fff;
  color: #aeaeae;
  padding: 20px 0;
  font-size: 30px;
  margin-top: 50px;
  border-radius: 10px;
}
.dapp_layout {
  margin-top: 20px;
  display: flex;
  align-items: center;
}
.dapp_icon {
  height: 100px;
  border-radius: 10px;
  margin-right: 20px;
}
.category {
  margin-top: 30px;
  font-size: 30px;
}
.dapp_name {
  font-size: 28px;
}
.dapp_desc {
  margin-top: 10px;
  color: gray;
}
</style>
