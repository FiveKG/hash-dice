<template>
  <vpage>
    <slot>
      <div class="header">
        <img src="@/assets/img/u14.png" @click="back">
        <span>股东分红池</span>
      </div>
      <div class="layout">
        <div>当前股东分红池余额</div>
        <div class="total_amount">{{currentBalance}}</div>
        <div>EOS</div>
        <div><img class="divider" src="@/assets/img/u8.png" alt=""></div>
        <div>累计已发放股东分红</div>
        <div class="sent_amount">{{sent}}</div>
        <div>EOS</div>
        <div><img class="divider" src="@/assets/img/u8.png" alt=""></div>
        <div>股东分红池累计收入</div>
        <div class="income_amount">{{total}}</div>
        <div>EOS</div>
        <div><img class="divider" src="@/assets/img/u8.png" alt=""></div>
        <div>仅钻石股东会员参与分红</div>
        <div class="member_level">
          <div>我的会员等级：{{level === 1 ? '未激活':level === 2 ? '黄金会员':'钻石股东会员'}}</div>
        </div>
        <div v-if="level !== 3">尚未具备分红资格</div>
        <div><img class="divider" src="@/assets/img/u8.png" alt=""></div>
        <div class="layout_bottom">
          <div>每周分红一次</div>
          <div>周一 00:00 按钻石股东会员的直接推荐数比例进行分红</div>
          <div>当前股东分红池余额的 50% 为每周分红总额</div>
        </div>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import { poolShareholder } from '@/servers/invitation';

export default {
  components: {
    vpage: MyPage,
  },
  data() {
    return {
      currentBalance: '',
      sent: '',
      total: '',
      level: 1
    }
  },
  created() {
    poolShareholder({account_name: this.$route.query.account}).then(res => {
      console.log(res)
      if (res.code === 1) {
        this.currentBalance = res.data.current_amount
        this.sent = res.data.issue
        this.total = res.data.total
        this.level = res.data.account_level
      }
    })
  },
  methods: {
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
  font-size: 38px;
  background-color: #ececec;
}
.header img {
  width: auto;
  height: 50px;
}
.header span {
  flex: 1;
  margin-left: 20px;
}
.layout {
  padding: 50px 0;
  text-align: center;
  font-size: 32px;
}
.total_amount {
  color: #ff9900;
  margin-top: 50px;
  font-size: 50px;
}
.divider {
  margin: 50px 0;
  height: 20px;
}
.sent_amount {
  font-size: 38px;
  margin-top: 30px;
}
.income_amount {
  font-size: 40px;
  margin-top: 30px;
}
.member_level {
  margin-top: 50px;
}
.member_level div {
  display: inline-block;
  padding: 10px 50px;
  border-bottom: 1PX solid #dddddd;
}
.layout_bottom {
  line-height: 2;
}
</style>
