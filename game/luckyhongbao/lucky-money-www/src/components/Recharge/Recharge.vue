<template>
  <van-popup v-model="$store.state.rechargeDialog" style="width:80%;height:50%;">
    <div class="recharge_dialog">
      <van-field class="input" type="number" v-model="rechargeNum" placeholder="请输入充值数量" />
      <div class="tips">1、预充值 POG 参与抢红包；</div>
      <div class="tips">2、预充值 POG 创建红包俱乐部及房间；</div>
      <div class="tips">3、POG 可随时提现 。</div>
      <div class="button" @click="rechargeEos">充值抢红包</div>
    </div>
  </van-popup>
</template>

<script>
import Eos from "eosjs";
import { Toast } from "vant";
import { storage, getAccountBalance } from "@/servers";
export default {
  name: "Recharge",
  data() {
    return {
      rechargeNum: "", //充值金额
      timer: null //获取账号余额定时器
    };
  },
  mounted() {},
  created() {},
  methods: {
    // 充值POG
    rechargeEos() {
      if (this.rechargeNum <= 0) {
        Toast("充值金额不能少于0");
        return;
      }
      const eos = this.$store.state.scatter.eos(this.$store.state.network, Eos);
      const account = this.$store.state.scatter.identity.accounts.find(
        x => x.blockchain === "eos"
      );
      const opts = { authorization: [`${account.name}`] };
      eos
        .transfer(
          account.name,
          this.$store.state.collectionAccount,
          Number(this.rechargeNum).toFixed(4) + " POG",
          account.name,
          opts
        )
        .then(async trx => {
          console.log("scatter充值成功:", trx);
          this.$store.commit("setRechargeDialog", false);
          Toast("充值成功 , 充值资金可能会延迟到账.");
          // 轮询获取用户账号余额
          this.timer = setInterval(() => {
            this.getAccountBalance();
          }, 5000);
        })
        .catch(err => {
          console.log(typeof err);
          if (typeof err == "object") {
            if (err.code == 402) {
              Toast("你拒绝了该请求");
            }
          } else if (typeof err == "string") {
            var error = JSON.parse(err);
            console.log("错误信息:", error);
            if (error.error.code == 3050003) {
              Toast("账户余额不足");
            } else if (error.error.code == 3080001) {
              Toast("内存不足");
            } else if (error.error.code == 3080002) {
              Toast("网络资源不足");
            } else if (error.error.code == 3080004) {
              Toast("CPU不足");
            } else if (error.error.code == 3090003) {
              Toast("请检查权限，签名等是否正确");
            } else {
              Toast("操作失败");
            }
          }
          console.error("Scatter充值失败:", err);
        });
    },
    // 获取用户账号余额
    getAccountBalance() {
      let data = {
        account_name: this.$store.state.eosAccount.name
      };
      getAccountBalance(data)
        .then(res => {
          console.log("充值后 , 获取用户账号余额:", res);
          if (
            res.code == 1 &&
            Number(res.data.balance) > Number(this.$store.state.eosBalance)
          ) {
            Toast("充值金额已到账");
            this.$store.commit("setEosBalance", res.data.balance);
            clearInterval(this.timer);
          }
        })
        .catch(err => {
          console.log("获取用户账号余额失败:", err);
        });
      // 获取链上余额
      const eos = this.$store.state.scatter.eos(this.$store.state.network, Eos);
      eos
        .getCurrencyBalance(
          this.$store.state.symbolAccountName,
          this.$store.state.eosAccount.name,
          "CLUB"
        )
        .then(tx => {
          // this.eosResources =tx[0];
          console.log("Scatter 查询 POG 余额:", tx);
          if (tx.length > 0) {
            this.$store.commit("setScatterEosBalance", tx[0]);
          }
        })
        .catch(error => {
          console.log("Scatter 查询 POG 余额失败", error);
        });
    }
  }
};
</script>

<style scoped>
.recharge_dialog {
  width: 100%;
  height: 100%;
  background-color: #363636;
  padding-top: 10px;
}
.recharge_dialog .input {
  margin: auto;
  width: 80%;
  border-radius: 10px;
  border: 1px solid #ffbf60;
  background-color: white;
  margin-bottom: 30px;
}
.recharge_dialog .tips {
  width: 80%;
  margin: auto;
  color: white;
  font-size: 12px;
  height: 20px;
  line-height: 20px;
}
.recharge_dialog .button {
  width: 80%;
  margin: 100px auto auto auto;
  background-color: #ff9900;
  color: white;
  font-size: 16px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 5px;
}
</style>













