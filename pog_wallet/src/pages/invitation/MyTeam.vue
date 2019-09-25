<template>
  <vpage>
    <slot>
      <div class="header">
        <img src="@/assets/img/u14.png" @click="back">
        <span>我的团队与排位</span>
      </div>
      <div class="layout">
        <div class="tab_layout">
          <div class="tab_item" :class="index === 0 ? 'tab_active':''" @click="clickTab(0)">直接推荐</div>
          <div class="tab_item" :class="index === 1 ? 'tab_active':''" @click="clickTab(1)">三三排位</div>
          <div class="tab_item" :class="index === 2 ? 'tab_active':''" @click="clickTab(2)">一条排位</div>
        </div>
        <div v-if="index === 0">
          <div class="invitation_layout">
            <div>我的邀请人</div>
            <div>{{invitation.myInvitation}}</div>
            <div class="invitation_code">{{invitation.myInvitationCode}}</div>
            <img class="divider" src="@/assets/img/u8.png" alt="">
          </div>
          <div class="team_layout">
            <div>我的团队</div>
            <div>共邀请 32 人</div>
            <img class="divider" src="@/assets/img/u8.png" alt="">
          </div>
          <div class="account_layout">
            <div v-if="invitation.teamActivated.length">
              <div>已激活账号{{invitation.teamActivated.length}}人</div>
              <div class="account_list">
                <div class="account_item" v-for="item in invitation.teamActivated">{{item}}</div>
              </div>
            </div>
            <img class="divider" src="@/assets/img/u8.png" alt="">
            <div v-if="invitation.teamInActivated.length">
              <div>未激活账号{{invitation.teamInActivated.length}}人</div>
              <div class="account_list">
                <div class="account_item" v-for="item in invitation.teamInActivated">{{item}}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="index === 1">
          <div class="three_layout">
            <div class="three_title">三三排位</div>
            <div class="three_detail">达 {{threeRank.length}} 层</div>
            <div class="three_detail">共 {{accountTotal}} 个账号</div>
            <div class="three_detail">直接推荐 {{accountInvite}} 个账号</div>
            <div class="three_detail">共复投 {{accountRepeat}} 个子账号</div>
            <img class="divider" src="@/assets/img/u8.png" alt="">
          </div>
          <table border="1" cellspacing="0">
            <tr>
              <th>层级</th>
              <th>已有账号</th>
              <th>直接推荐</th>
              <th>复投子账号</th>
              <th>尚余空账号</th>
            </tr>
            <tr v-for="item in threeRank">
              <td>{{item.level}}</td>
              <td>{{item.has_account}}</td>
              <td>{{item.invite_account}}</td>
              <td>{{item.repeat_account}}</td>
              <td>{{item.last_account}}</td>
            </tr>
          </table>
        </div>
        <div v-else="index === 2">
          <div class="one_layout">
            <div class="three_title">一条排位</div>
            <div class="three_detail">共 {{oneRank.length}} 个子账号</div>
            <img class="divider" src="@/assets/img/u8.png" alt="">
          </div>
          <table border="1" cellspacing="0">
            <tr>
              <th>子账号</th>
              <th>一条公排位置</th>
            </tr>
            <tr v-for="item in oneRank">
              <td>{{item.sort}}</td>
              <td>{{item.sub_account}}</td>
            </tr>
          </table>
        </div>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import api from '@/servers/invitation'

export default {
  components: {
    vpage: MyPage,
  },
  data() {
    return {
      index: 0,
      account: '',
      invitation: {
        myInvitation: '',
        myInvitationCode: '',
        teamActivated: [],
        teamInActivated: [],
      },
      oneRank: [],
      threeRank: [],
      accountTotal: 0,
      accountInvite: 0,
      accountRepeat: 0,
    }
  },
  created() {
    this.account=this.$store.state.wallet.assets.account;
    this.teamInvite();
  },
  methods: {
    teamSort() {
      api.teamSort({account_name: this.account}).then(res => {
        console.log(res)
        if (res.code === 1) {
          this.oneRank = res.data
        }
      })
    },
    teamMode() {
      this.threeRank = []
      this.accountTotal = 0
      this.accountInvite = 0
      this.accountRepeat = 0
      api.teamMode({account_name: this.account}).then(res => {
        console.log(res)
        if (res.code === 1) {
          this.threeRank = res.data
          for (const item of res.data) {
            this.accountTotal += Number(item.has_account)
            this.accountInvite += Number(item.invite_account)
            this.accountRepeat += Number(item.repeat_account)
          }
        }
      })
    },
    teamInvite() {
      api.teamInvite({account_name: this.account}).then(res => {
        console.log(res)
        if (res.code === 1) {
          this.invitation.myInvitation = res.data.referrer_account
          this.invitation.myInvitationCode = res.data.referrer_code
          this.invitation.teamActivated = res.data.activated
        }
      })
    },
    clickTab(index) {
      this.index = index
      switch (index) {
        case 0:
          this.teamInvite()
          break;
        case 1:
          this.teamMode()
          break;
        case 2:
          this.teamSort()
          break;
      
        default:
          break;
      }
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
  padding: 30px;
}
.tab_layout {
  display: flex;
  justify-content: space-around;
}
.tab_item {
  width: 100%;
  text-align: center;
  padding: 30px 0;
  margin: 0 10px;
  border-radius: 10px;
  box-shadow: 0 0 10px #cfcfcf;
  background-color: #fff;
  font-size: 30px;
  font-weight: bold;
}
.tab_active {
  color: #fff;
  background-color: #ff8e05;
}
.invitation_layout {
  margin-top: 50px;
  text-align: center;
  font-size: 32px;
  line-height: 1.5;
}
.three_layout {
  margin-top: 50px;
  text-align: center;
  font-size: 32px;
  line-height: 1.5;
}
.one_layout {
  margin-top: 50px;
  text-align: center;
  font-size: 32px;
  line-height: 1.5;
}
.team_layout {
  text-align: center;
  font-size: 32px;
  line-height: 1.5;
}
.invitation_code {
  letter-spacing: 15px;
}
.divider {
  margin: 50px 0;
  height: 20px;
}
.account_layout {
  text-align: center;
  font-size: 32px;
}
.account_list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}
.account_item {
  background-color: #fff;
  width: calc((100vw - 60px)/3);
  padding: 20px;
  box-sizing: border-box;
  border: 1PX solid #ececec;
}
.three_title {
  margin-bottom: 30px;
}
.three_detail {
  color: #ff6600;
}
table {
  border-collapse: collapse;
  width: calc(100vw - 60px);
}
table,table tr th,table tr td {
  border: 1PX solid rgb(223, 223, 223);
  background-color: #fff;
  text-align: center;
  font-size: 27px;
  font-weight: normal;
  line-height: 2;
}
table tr td {
  font-size: 34px;
}
</style>
