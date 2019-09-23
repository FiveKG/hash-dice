<template>
  <div>
    <HeadPart></HeadPart>
    <div class="course" style="padding-top:10vh;">
      <p class="course_p">教程介绍</p>
      <p>1.浏览器打开『bitpie.com』，进入比特派官网，选择对应您手机系统的软件，下载安装软件</p>
      <p><img src="../../assets/24.png" width="400px" /></p>
      <p>2.首次打开比特派后，您将会看到如下界，认真阅读提示后，点击『创建新钱包』</p>
      <p><img src="../../assets/25.png" width="400px" /></p>
      <p>3.请按顺序抄下这些单词，如果条件允许，可以点左上方开启打印模式，打印（复印）一份您的种子。或者也可以认真抄写您的种子。 </p>
      <p>点击『我已抄好，去验证』，在新页面通过选择输入抄写的汉字（单词）为了验证您是否抄写正确</p>
      <p><img src="../../assets/26.png" width="400px" /></p>
      <p>4.设置您的开启密码</p>
      <p><img src="../../assets/27.png" width="400px" /></p>
      <p>5.进入主界面，点击左上方,切换钱包体系</p>
      <p><img src="../../assets/28.png" width="400px" /></p>
      <p>6.选择POG,切换成POG币种界面</p>
      <p><img src="../../assets/29.png" width="400px" /></p>
      <p>7.进入账户管理，选择『确认』，创建 POG 账户</p>
      <p><img src="../../assets/30.png" width="400px" /></p>
      <p>8.选择『使用支付/银行卡创建』</p>
      <p><img src="../../assets/31.png" width="400px" /></p>
      <p>9.进入 POG 账户页面，输入 POG 账户，选择『下一步』</p>
      <p><img src="../../assets/32.png" width="400px" /></p>
      <p>10.进入确认账户信息页面,选择支付方式后选择『立即创建』</p>
      <p><img src="../../assets/33.png" width="400px" /></p>
      <p>11. 输入 PIN 码，在详细页面，选择『去支付』，系统会自动跳入支付宝付款页面，在付款时请备注订单号。请您在规定的时间内完成支付，如果您已付款，请耐心等待交易员确认收款</p>
      <p><img src="../../assets/34.png" width="400px" /></p>
      <p>12. 待交易员确认之后，就会进入账户创建中页面，创建账户大约需要5分钟。您也可以切换到 POG 币种页面，点击查看最新记录（可以查看 创建 POG 账户、购买 RAM、质押）</p>
      <p><img src="../../assets/35.png" width="400px" /></p>
      <p>13.返回钱包界面，选择『一键买卖』</p>
      <p><img src="../../assets/36.png" width="400px" /></p>
      <p>14.填写您要购买POG的个数，选择付款方式付款，付款完成后，待交易员确认之后，POG就会打到您的POG账号</p>
      <p><img src="../../assets/37.png" width="400px" /></p>
      <p>15.点击软件下方的DAPP,然后在点击『输入DAPP名称或网址』</p>
      <p><img src="../../assets/38_1.png" width="400px" /></p>
      <p>16.输入我们的网址lucky.eoscrown.com,前往我们的导航页</p>
      <p><img src="../../assets/39_1.png" width="400px" /></p>
      <!-- <p>17.进入导航页，选择您要玩的游戏即可进行游戏</p>
      <p><img src="../../assets/40.png" width="400px" /></p> -->
    </div>
      <!-- <p class="ps_p">（注：如果图片无法看清，可用鼠标右击图片，选择【在新标签页中打开图片】查看大图）</p> -->
  </div>
</template>


<script>
  import HeadPart from '@/components/HeadPart/HeadPart';
  export default {
    name: 'course',
    components: {
      HeadPart
    },
    data() {
      return {
        tab:"",
      }
    },
    mounted(){
      this.tab=this.$route.query.Id;

    },
    created() {


    },
    methods: {



    }
  }
</script>

<style scoped>
  .course p{
    color: #fdfbfb;
    font-size: 16px;
    /*padding: 5px 0px ;*/
    text-align: justify;
    width: 90%;
    margin: auto;
  }
  .course p img{
    width: 100%;
  }
  .course .course_p{
    text-align: center;
    font-size: 26px;
    margin: 12px auto 5px auto;
  }
  .course a{
    color: skyblue;
  }
  .ps_p{
    color: #fdfbfb;
    font-size: 18px;
    text-align: center;
    margin-bottom: 50px;
  }

</style>