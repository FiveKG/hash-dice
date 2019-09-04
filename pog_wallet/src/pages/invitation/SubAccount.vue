<template>
  <vpage>
    <slot>
      <div class="layout">
        <div class="header">
          <img src="@/assets/img/u14.png" @click="back">
          <span>子账号</span>
        </div>
        <div class="head_card">
          <div class="head_item">
            <div>
              <div>子</div>
              <div>账</div>
              <div>号</div>
            </div>
            <div class="head_value">{{subAccountTotal}}</div>
          </div>
          <div class="head_item">
            <div>
              <div>初始</div>
              <div>投资</div>
            </div>
            <div class="head_value">1</div>
          </div>
          <div class="head_item">
            <div>
              <div>复投</div>
              <div>产生</div>
            </div>
            <div class="head_value">{{repeatAccountTotal}}</div>
          </div>
        </div>
        <div class="page_content">
          <div class="total_input">
            <div>当前复投余额</div>
            <div class="balance_amount">{{repeatBalance}}</div>
            <div class="symbol">EOS</div>
            <div class="desc">
              <div>每当复投余额满 30 EOS 时</div>
              <div>系统将自动复投产生一个子账号</div>
            </div>
          </div>
          <div class="flex_center">
            <div>子账号编号</div>
            <div>生成</div>
          </div>
          <div class="flex_center item_detail" v-for="item in subList">
            <div>{{item.sub_account_num}}</div>
            <div>{{item.detail}}</div>
          </div>
        </div>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import { subAccount } from '@/servers/invitation';
import api from '@/servers/invitation';


export default {
  components: {
    vpage: MyPage
  },
  data() {
    return {
      subAccountTotal: 0,
      repeatAccountTotal: 0,
      repeatBalance: '0.0000',
      subList: []
    }
  },
  created() {
    console.log(this.$route.query)
    api.subAccount({account_name: this.$route.query.account}).then(res => {
      console.log(res)
      if (res.code === 1) {
        this.subAccountTotal = res.data.total_sub_account
        this.repeatAccountTotal = res.data.repeat_quantity
        this.subList = res.data.detail
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
.head_card {
  display: flex;
  /* justify-content: space-around; */
  margin: 20px;
  padding: 30px 0;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px #dddddd;
  font-size: 30px;
}
.head_item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1PX solid #ececec;
}
.head_value {
  margin-left: 35px;
  font-size: 50px;
}
.page_content {
  flex: 1;
  background-color: #fff;
  text-align: center;
  font-size: 30px;
}
.total_input {
  border-top: 1PX solid #ebebeb;
  border-bottom: 1PX solid #ebebeb;
  padding: 30px 0;
}
.balance_amount {
  margin-top: 15px;
  font-size: 50px;
}
.symbol {
  line-height: 1;
}
.desc {
  margin-top: 70px;
}
.layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.space_around {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
}
.flex_center {
  display: flex;
  align-items: center;
  padding: 20px 0;
}
.flex_center div {
  flex: 1;
}
.item_detail:nth-child(odd) {
  background-color: #f9f9f9;
}
</style>
