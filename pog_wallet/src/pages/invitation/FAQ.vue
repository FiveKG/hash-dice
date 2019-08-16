<template>
  <vpage>
    <slot>
      <div class="header">
        <div>
          <img src="@/assets/img/u14.png" @click="back">
          <span>常见问题</span>
        </div>
        <span class="rules" @click="clickRules">游戏规则</span>
      </div>
      <div class="layout">
        <div class="container" @click="code = !code">
          <div class="card_title">
            <span>什么是邀请码</span>
            <img src="@/assets/img/u12.png" alt="" v-if="code">
            <img src="@/assets/img/u28.png" alt="" v-else>
          </div>
          <collapse>
            <div class="card_content" v-show="code">
                邀请码是代表游戏用户的一串六位数字字符，如果您有上级推荐人，就必须填写上级推荐人的六位数字邀请码，以确定推荐关系，如果没有上级推荐人，请填写六位数字”000000“，由系统随机指定您的推荐人。
            </div>
          </collapse>
        </div>
        <div class="container" @click="how = !how">
          <div class="card_title">
            <span>如何邀请其他伙伴</span>
            <img src="@/assets/img/u12.png" alt="" v-if="how">
            <img src="@/assets/img/u28.png" alt="" v-else>
          </div>
          <collapse>
            <div class="card_content" v-show="how">
                当绑定邀请人后，就可以生成专属的邀请页，并生成六位邀请码，将专属的邀请页发给好友后，好友可以根据邀请页下载小鲸（poggy）钱包，并在 TBG 页面填写您的六位邀请码，绑定推荐关系。
            </div>
          </collapse>
        </div>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import collapse from "./collapse";

export default {
  components: {
    vpage: MyPage,
    collapse
  },
  data() {
    return {
      code: false,
      how: false,
    }
  },
  methods: {
    clickRules() {
      this.$router.push({name: 'TBGRules'})
    },
    back() {
      this.$router.go(-1)
    }
  },
}
</script>

<style scoped>
.header {
  padding: 30px 35px;
  display: flex;
  align-items: center;
  font-size: 36px;
  background-color: #ececec;
}
.header img {
  width: auto;
  height: 50px;
}
.header div {
  flex: 1;
  display: flex;
  align-items: center;
}
.rules {
  color: #006699;
}
.layout {
  padding: 30px 20px;
}
.container {
  background-color: #fcfcfc;
  padding: 30px 40px;
  box-shadow: 0 0 10px #dfdfdf;
  border-radius: 10px;
  margin-top: 20px;
}
.card_title {
  display: flex;
  align-items: center;
  color: #ff8e05;
  font-size: 34px;
}
.card_title span {
  flex: 1;
}
.card_title img {
  height: 50px;
}
.card_content {
  margin-top: 30px;
  font-size: 28px;
  line-height: 1.6;
}
</style>
