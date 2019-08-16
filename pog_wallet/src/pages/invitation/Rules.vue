<template>
  <vpage>
    <slot>
      <div class="header">
        <div>
          <img src="@/assets/img/u14.png" @click="back">
          <span>游戏规则</span>
        </div>
        <span class="rules" @click="back">常见问题</span>
      </div>
      <div class="layout">
        <div class="container" @click="code = !code">
          <div class="card_title">
            <span>TBG 游戏玩法</span>
            <img src="@/assets/img/u12.png" alt="" v-if="code">
            <img src="@/assets/img/u28.png" alt="" v-else>
          </div>
          <collapse>
            <div class="card_content" v-show="code">
                邀请码是代表游戏用户的一串六位数字字符，如果您有上级推荐人，就必须填写上级推荐人的六位数字邀请码，以确定推荐关系，如果没有上级推荐人，请填写六位数字”000000“，由系统随机指定您的推荐人。
            </div>
          </collapse>
        </div>
        <div class="container" @click="shareholder = !shareholder">
          <div class="card_title">
            <span>股东会员分红</span>
            <img src="@/assets/img/u12.png" alt="" v-if="shareholder">
            <img src="@/assets/img/u28.png" alt="" v-else>
          </div>
          <collapse>
            <div class="card_content" v-show="shareholder">
                股东分红池收益来源 = TBG 游戏玩家投资额的 5% + 各种游戏及应用收益（参照各游戏及应用收益分配规则）仅达到钻石股东会员（直接推荐 50 个子账号以上）可参与股东池分红；<br>股东池每周分红一次，每周一 00:00 股东分红池余额的50% 为本周分红总额，再按钻石股东会员的直接推荐子账号数，计算出分红比例进行分红。
            </div>
          </collapse>
        </div>
        <div class="container" @click="five = !five">
          <div class="card_title">
            <span>五倍收益保障金</span>
            <img src="@/assets/img/u12.png" alt="" v-if="five">
            <img src="@/assets/img/u28.png" alt="" v-else>
          </div>
          <collapse>
            <div class="card_content" v-show="five">
                五倍收益保障池收益来源 = TBG 游戏玩家投资额的 20%+各种游戏及应用收益（参照各游戏及应用收益分配规则）主账户收益总额未达投资额五倍的账户可收取每日五倍收益保障金，收益超出五倍的账户不再获得；<br>五倍收益保障金每日发放一次，每日 00:00 五倍收益保障池的 30% 为本日五倍收益保障金发放总额，再按每个主账户收益与五倍收益额的差额计算出每个账户的发放比例，科学做到收益越少，五倍收益保障金领取越多。
            </div>
          </collapse>
        </div>
        <div class="container" @click="straightpk = !straightpk">
          <div class="card_title">
            <span>直接推荐 PK 奖金</span>
            <img src="@/assets/img/u12.png" alt="" v-if="straightpk">
            <img src="@/assets/img/u28.png" alt="" v-else>
          </div>
          <collapse>
            <div class="card_content" v-show="straightpk">
                直接推荐 PK 奖金池收益来源 = TBG 游戏玩家投资额的 5% <br> 
                每周直接推荐子账号数量前五名可获直接推荐PK奖金；<br>
                每周一 00:00 直接推荐 PK 池余额的 50% 为本周直接推荐 PK 奖金总额； <br>
                第一名可获本周奖金额的 40%； <br>
                第二名可获本周奖金额的 30%； <br>
                第三名可获本周奖金额的 15%； <br>
                第四名可获本周奖金额的 10%； <br>
                第五名可获本周奖金额的 5%。 <br>
            </div>
          </collapse>
        </div>
        <div class="container" @click="bingo = !bingo">
          <div class="card_title">
            <span>Bingo 倒计时游戏奖金</span>
            <img src="@/assets/img/u12.png" alt="" v-if="bingo">
            <img src="@/assets/img/u28.png" alt="" v-else>
          </div>
          <collapse>
            <div class="card_content" v-show="bingo">
                Bingo 倒计时游戏奖金池收益来源 = TBG 游戏玩家投资额的15%； <br> 
                无需担心兜底，人人都抢着兜底，兜底无风险还赚大钱；<br>
                最新一笔 TBG 投资倒计时 24 小时后无新投资，则本轮Bingo 倒计时游戏结束，当前 Bingo 倒计时游戏奖金池余额的 70% 为本轮游戏奖金； <br>
                倒数第一名投资者可独得本轮奖金总额的 50%； <br>
                倒数第二至第三十名投资者可均分本轮奖金的 50%。 <br>
            </div>
          </collapse>
        </div>
        <div class="container" @click="straight = !straight">
          <div class="card_title">
            <span>直接推荐奖金</span>
            <img src="@/assets/img/u12.png" alt="" v-if="straight">
            <img src="@/assets/img/u28.png" alt="" v-else>
          </div>
          <collapse>
            <div class="card_content" v-show="straight">
                TBG 游戏玩家投资额的 10% 作为直接推荐奖金进行向上九层分配； <br> 
                第一层可获推荐奖金的 50%；<br>
                第二层可获推荐奖金的 25%；<br>
                第三层可获推荐奖金的 10%；<br>
                第四层可获推荐奖金的 5%；<br>
                第五层可获推荐奖金的 3%；<br>
                第六层可获推荐奖金的 2.5%；<br>
                第七层可获推荐奖金的 2%；<br>
                第八层可获推荐奖金的 1.5%；<br>
                第九层可获推荐奖金的 1%；<br>
            </div>
          </collapse>
        </div>
        <div class="container" @click="gameInvitation = !gameInvitation">
          <div class="card_title">
            <span>游戏及应用推荐奖金</span>
            <img src="@/assets/img/u12.png" alt="" v-if="gameInvitation">
            <img src="@/assets/img/u28.png" alt="" v-else>
          </div>
          <collapse>
            <div class="card_content" v-show="gameInvitation">
                由官方开发的游戏及应用，按各游戏及应用的推荐佣金共享直接推荐关系进行向上九层分配； <br> 
                第一层可获推荐奖金的 50%；<br>
                第二层可获推荐奖金的 25%；<br>
                第三层可获推荐奖金的 10%；<br>
                第四层可获推荐奖金的 5%；<br>
                第五层可获推荐奖金的 3%；<br>
                第六层可获推荐奖金的 2.5%；<br>
                第七层可获推荐奖金的 2%；<br>
                第八层可获推荐奖金的 1.5%；<br>
                第九层可获推荐奖金的 1%；<br>
            </div>
          </collapse>
        </div>
        <div class="container" @click="oneStatic = !oneStatic">
          <div class="card_title">
            <span>一条公排静态奖金</span>
            <img src="@/assets/img/u12.png" alt="" v-if="oneStatic">
            <img src="@/assets/img/u28.png" alt="" v-else>
          </div>
          <collapse>
            <div class="card_content" v-show="oneStatic">
                TBG 游戏玩家投资额的 20% 作为一条公排静态奖金进行分配，优先分配顺序如下； <br> 
                末尾 5 个子账号均分一条公排静态奖金的 25%；<br>
                末尾 6-55 个子账号均分一条公排静态奖金的 25%；<br>
                去除公排收益 1.5 倍子账号后最前 50 个子账号均分一条公排静态奖金的 25%；<br>
                中间 n 个子账号均分一条公排静态奖金的 25%；<br>
                公排收益达 1.5 倍的子账号不再获得公排静态收益。<br>
            </div>
          </collapse>
        </div>
        <div class="container" @click="threeStatic = !threeStatic">
          <div class="card_title">
            <span>三三复制伞下公排静态奖金</span>
            <img src="@/assets/img/u12.png" alt="" v-if="threeStatic">
            <img src="@/assets/img/u28.png" alt="" v-else>
          </div>
          <collapse>
            <div class="card_content" v-show="threeStatic">
                TBG 游戏玩家投资额的 20% 作为三三复制伞下公排静态奖金进行分配； <br> 
                每个子账号下最多只能有三个子账号，满三个子账号后，当新推荐的往下进行伞下三三复制伞下公排； <br> 
                按三三复制伞下公排的位置，向上共 50 层静态奖金分配： <br> 
                第一层可获奖金的 30%； <br> 
                第二层可获奖金的 20%； <br> 
                第三层可获奖金的 15%； <br> 
                第四层可获奖金的 10%； <br> 
                第五层可获奖金的 5%； <br> 
                第六层可获奖金的 3.5%； <br> 
                第七层可获奖金的 2.5%； <br> 
                第八层可获奖金的 1.5%； <br> 
                第九层可获奖金的 1%； <br> 
                第十层可获奖金的 0.5%； <br> 
                第十一至三十层各可获奖金的 0.3%，共 6%； <br> 
                第三十一至五十层各可获奖金的 0.25%，共 5%； <br> 
                一个主账号下的所有子账号均可获得奖金，不封顶。 <br> 
            </div>
          </collapse>
        </div>
        <div class="container" @click="member = !member">
          <div class="card_title">
            <span>会员等级</span>
            <img src="@/assets/img/u12.png" alt="" v-if="member">
            <img src="@/assets/img/u28.png" alt="" v-else>
          </div>
          <collapse>
            <div class="card_content" v-show="member">
                会员等级或状态分为三种： <br> 
                一、未激活<br> 
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;未激活 TBG 游戏，但可开始推荐，可获得游戏推荐收益，当推荐的用户激活 TBG 游戏时，直接推荐分配收益在激活 TBG 游戏时可获得；<br> 
                二、黄金会员<br> 
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;激活 TBG 游戏，直接推荐的子账号数量 0-49 个，可获所有 TBG 游戏收益分配（未具备股东池分红资格）及游戏或应用推荐收益；<br> 
                三、钻石股东会员<br> 
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;激活 TBG 游戏，直接推荐的子账号数量在 50 个以上，可获所有 TBG 游戏收益分配（包括股东池分红）及游戏或应用推荐收益；<br> 
            </div>
          </collapse>
        </div>
        <div class="container" @click="mainAccount = !mainAccount">
          <div class="card_title">
            <span>主账户收益分配</span>
            <img src="@/assets/img/u12.png" alt="" v-if="mainAccount">
            <img src="@/assets/img/u28.png" alt="" v-else>
          </div>
          <collapse>
            <div class="card_content" v-show="mainAccount">
                主账户收益包含： <br> 
                直接推荐奖金 + 三三复制伞下公排静态奖金 + 一条公排静态奖金 + 五倍收益保障金 + 钻石股东分红 + 直接推荐 PK 奖金 + Bingo 倒计时游戏奖金 + 游戏及应用推荐奖金 <br> 
                所有以上收益汇集至 TBG 游戏的主账户中，然后再对总收益进行分配： <br> 
                一、总收益的 40% 为可提现，这部分随时秒提现，没有门槛，没有随加条件；<br> 
                二、总收益的 40% 为复投基金，不可提现，当复制基金达到 TBG游戏的投资额时，系统会自动进行复投，产生新的子账号，可按规则叠加收益，达到收益最大化；<br> 
                三、总收益的 10% 为彩码，不可提现，可用于全球彩游戏投注，1 彩码 = 1EOS；<br> 
                四、总收益的 10% 为游戏筹码，不可提现，可用于自主开发的各种游戏，1 游戏筹码 = 1 EOS。<br> 
            </div>
          </collapse>
        </div>
        <div class="container" @click="subAccount = !subAccount">
          <div class="card_title">
            <span>子账号</span>
            <img src="@/assets/img/u12.png" alt="" v-if="subAccount">
            <img src="@/assets/img/u28.png" alt="" v-else>
          </div>
          <collapse>
            <div class="card_content" v-show="subAccount">
                子账号为 TBG 游戏专有，游戏注册账号为 EOS 账号，为游戏的主账号，而投资和复投的产生的为子账号，一个主账户下可有多个子账号，子账号参与三三复制伞下公排静态奖金及一条公排静态奖金的分配，直接推荐账户每产生一个子账号，均可再一次获得直接推荐奖金。 <br> 
                每当复投余额满 30 EOS时，系统将自动复投产生一个子账号。
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
      shareholder: false,
      five: false,
      straightpk: false,
      straight: false,
      bingo: false,
      gameInvitation: false,
      oneStatic: false,
      threeStatic: false,
      member: false,
      mainAccount: false,
      subAccount: false,
    }
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
