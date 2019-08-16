<template>
  <vpage>
    <slot>
      <div class="header">
        <img src="@/assets/img/u14.png" @click="back">
        <span>直接推荐PK池</span>
      </div>
      <div class="layout">
        <div>当前直接推荐 PK 池余额</div>
        <div class="total_amount">{{totalAmount}}</div>
        <div>EOS</div>
        <div><img class="divider" src="@/assets/img/u8.png" alt=""></div>
        <div class="desc1">
          <div>每周直接推荐 PK 一次</div>
          <div>每周一 00:00 对所有账号本周直接推荐数量进行排名</div>
          <div>直接推荐前五名可获 PK 奖金</div>
          <div>当前直接推荐 PK 池余额的 50% 为每周发放总额</div>
        </div>
        <div><img class="divider" src="@/assets/img/u8.png" alt=""></div>
        <div>本周实时PK榜</div>
        <div>(变化中)</div>
        <table border="1" cellspacing="0">
          <tr>
            <th>排名</th>
            <th>主账户名称</th>
            <th>直推子 <br> 账号数</th>
            <th>奖金分 <br> 配比例</th>
            <th>实时奖金  EOS</th>
          </tr>
          <tr v-for="(item,index) in accountList">
            <td>
              <div class="table_icon" v-if="index+1 === 1"> <img src="@/assets/img/u95.png"> </div>
              <div class="table_icon" v-else-if="index+1 === 2"> <img src="@/assets/img/u97.png"> </div>
              <div class="table_icon" v-else-if="index+1 === 3"> <img src="@/assets/img/u99.png"> </div>
              <div v-else>{{index+1}}</div>
            </td>
            <td>{{item.account_name}}</td>
            <td>{{item.sub_account}}</td>
            <td>{{item.percentage}}</td>
            <td>{{item.bonus}}</td>
          </tr>
        </table>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import { poolPk } from '@/servers/invitation';

export default {
  components: {
    vpage: MyPage,
  },
  data() {
    return {
      totalAmount: '',
      accountList: []
    }
  },
  created() {
    poolPk({account_name: this.$route.query.account}).then(res => {
      console.log(res)
      if (res.code === 1) {
        this.totalAmount = res.data.current_amount
        this.accountList = res.data.detail
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
.divider {
  margin: 50px 0;
  height: 20px;
}
.total_amount {
  color: #ff9900;
  margin-top: 50px;
  font-size: 50px;
}
.desc1 {
  line-height: 1.9;
}
table {
  border-collapse: collapse;
  width: calc(100vw - 40px);
  margin: 0 auto;
  margin-top: 20px;
}
table,table tr th,table tr td {
  border: 1PX solid rgb(223, 223, 223);
  background-color: #fff;
  text-align: center;
  font-size: 27px;
  font-weight: normal;
}
table tr th {
  line-height: 1.5;
}
table tr td {
  font-size: 32px;
  line-height: 2;
}
.table_icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
.table_icon img {
  height: 40px;
}
</style>
