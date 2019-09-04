<template>
  <div class="wrap">
    <!-- 头部信息 -->
    <div class="top-info">
      <h2>{{account_name}}</h2>
      <span> {{atv_text}} > </span>
    </div>
    

    <!-- 全球区块链去中心化游戏应用平台 -->
    <div class="log">
       <img src="../../../public/img/u482.svg" alt="">
       <p class="log_title"> 
          <span >Token ●</span>
          <span> Blockchain ●</span>
          <span> Game</span>
       </p>
       <p class="log_txt">全球区块链去中心化游戏应用平台</p>
    </div>

    <!-- 已销毁部分 -->
    <div class="destroyed">
        <span class="destroyed_txt1">   已销毁</span> 
        <span class="destroyed_txt2"> {{destroy_amount[0]}}.</span>     
        <span class="destroyed_txt3">{{destroy_amount[1]}}</span>
        <span @click="jumpDestruction()"> TBG </span>
        <span @click="jumpDestruction()" class="destroyed_txt4">></span>
    </div> 

    <!-- 查看TBG旗下游戏 -->
    <div class="games">
       <p class="games_title">查看 TBG 旗下游戏</p>
       <div class="games_group" @click="navigateTo('DappList')">
         <img src="../../assets/invitation2/u1.png" alt="">
         <img src="../../assets/invitation2/u2.svg" alt="">
         <img src="../../assets/invitation2/u3.png" alt="">
         <img src="../../assets/invitation2/u4.svg" alt="">
         <img src="../../assets/invitation2/u5.png" alt="">
         <img src="../../assets/invitation2/u6.png" alt="">
         <span>></span>
       </div>
        <p>...</p>
    </div>
    
    <!-- 在线客服 -->
    <div class="onlineService">
        <div class="item">
            <img src="../../../public/img/u5098.png" alt="">
            <div class="system_ntf">
              <div v-if="system_ntf.length > 0" class="system_ntf_item">
                <span>{{system_ntf[0].title}}</span>
                <span>{{system_ntf[0].create_time}}</span>
                <span @click="jumpNotice()" >></span>
              </div>
            </div>
        </div>
        <div class="item">
           <img src="../../../public/img/u5100.svg" alt="">
           在线<br/>客服
        </div>
    </div>

    <!-- 我的团队 -->
    <div class="myteam">
      <div class="title clear">
        <span class="left">
          我的团队
        </span>
        <span class="right">
          规则>
        </span>
      </div>
      <div class="select-content">
        <div class="select-wrap">
            <div class="ipt_layout" style="box-shadow: 0px 1px 10px rgba(201, 201, 201, 0.349019607843137);border: none;background: rgb(255, 255, 255);">
                <div>
                <span style="font-size: .45rem;color: #1E1E1E;" @click="jumpMyInvitationPage">我的邀请专页</span>
                </div>
            </div>
        </div>
        <div class="select-wrap">
          <div @click='switchData(1)' class="ipt_layout" style="box-shadow: 0px 1px 10px rgba(201, 201, 201, 0.349019607843137);border: none;background: rgb(255, 255, 255);">
              <div>
              <span style="font-size: .45rem;color: #1E1E1E;">我的团队</span>
              </div>
              <img  src="@/assets/img/u28.png" style="width: 0.5rem;height: 0.5rem;"> 
          </div>
          <!-- 下拉部分 -->
          <div class="select-toggle" ref="slt-1" style="position: absolute;background: rgb(255, 255, 255);border-radius: 0.08rem;width: 80%;left: 10%;box-shadow: 0px 1px 10px rgba(201, 201, 201, 0.349019607843137);z-index:99">
              <div class="select-item" v-for="(item, index) in MyTeamItem" :key="index" @click="jumpMyTeam(index)">{{item.text}}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- TBG 1 - 2 -->
    <div class="tbg-bar-warp">
      <div class="tbg-bar">
        <div @click="tbgToggle(0)" class="tbg-bar_item" :class="{'active': tbg === 0}">
          TBG-I
        </div>
        <div @click="tbgToggle(1)" class="tbg-bar_item" :class="{'active': tbg === 1}">
          TBG-II
        </div>
      </div>
    </div>

    <!-- TBG-I标签页 -->
    <div v-if='tbg === 0'>
      <!-- 子账号 -->
      <div class="orePool child-account">
          <div class="title clear">
            <span class="left">
              投资与子账号
            </span>
            <span class="right">
              规则>
            </span>
          </div>
          <div class="child-account_content">
              <div class="child-account_left" @click="jumpSubAccount" v-if="subAccountQuantity">
                子账号数量：
                <span>{{sub_account.total_sub_account}}</span>
              </div>
              <div class="child-account_left" style="background: orange;" @click="jumpQuantityTbg" v-if="!subAccountQuantity">
                参与TBG
              </div>
              <!-- <div class="child-account_left" @click="">
                <span>参与TBG-I</span>
              </div> -->
              <div @click="navigateTo('HelpFriend')" class="child-account_right">
                帮助投资伙伴
              </div>
          </div>
      </div>
      <!-- 全球区块链去中心化游戏平台 -->
      <div class="direction">
          <div class="content">
              <div class="left">
                  <!-- <img src="@/assets/img/u6628.svg" alt=""> -->
              </div>
              <div class="right">  
                全球区块链去中心化游戏平台，真正公平公正、透明可查、无法作假的区块链去中心化游戏是现在和未来的方向。
              </div>
          </div>
      </div>

      <!-- TBG-I 收益 -->
      <div class="orePool income">
          <div class="title clear">
            <span class="left">
              TBG-I 收益
            </span>
            <span class="right">
              规则>
            </span>
          </div>
          <div class="income_content" @click="jumpProfit">
            <div class="income_content_inner">
              <span>总计</span>
              <span>{{total_income}} UE</span>
            </div>
          </div>
      </div>

      <!-- 奖金和保障 -->
      <div class="orePool ensure">
          <div class="title clear">
            <span class="left">
              奖金及保障池
            </span>
            <span class="right">
              规则>
            </span>
          </div>
          <div class="ensure_content">
            <div @click='navigateTo(item.url)' v-for="(item, index) in ensure" :key="index" class="ensure_content_inner" >
              <span class="top">{{item.top}}</span>
              <span class="mid">{{item.mid}}</span>
              <span class="bot">{{item.bot}}</span>
            </div>
          </div>
      </div>

      <!-- 收入分配 -->
      <div class="orePool distribution">
          <div class="title clear">
            <span class="left">
              收益分配
            </span>
            <span class="right">
              规则>
            </span>
          </div>
          <div class="distribution_content">
            <div @click='navigateTo(item.url)' v-for="(item, index) in distribution" :key="index" class="distribution_content_inner">
              <span class="top">{{item.top}}</span>
              <span class="mid">{{item.mid}}</span>
              <span class="bot">{{item.bot}}</span>
            </div>
          </div>
      </div>
    </div>


    <!-- TBG-II标签页 -->
    <div v-if="tbg === 1">
      <!-- 交易中心 -->
      <div class="orePool">
          <div class="title clear">
            <span class="left">
              交易中心
            </span>
            <span class="right">
              规则>
            </span>
          </div>
          <div class="exchange-content">
              <div class="exchange-left">
                <span>当前TBG价格</span>
                <span>{{trade_price}}</span>
                <span>UE</span>
              </div>
              <div class="exchange-right">
                <div class="select-wrap">
                  <div @click='switchData(2)' class="ipt_layout" style="box-shadow: 0px 1px 10px rgba(201, 201, 201, 0.349019607843137);border: none;background: rgb(255, 255, 255);">
                      <div>
                      <span style="font-size: .45rem;color: #1E1E1E;">买入TBG</span>
                      </div>
                      <img  src="@/assets/img/u28.png" style="width: 0.5rem;height: 0.5rem;"> 
                  </div>
                  <!-- 下拉部分 -->
                  <div class="select-toggle" ref="slt-2" style="position: absolute;background: rgb(255, 255, 255);border-radius: 0.08rem;width: 80%;left: 10%;box-shadow: 0px 1px 10px rgba(201, 201, 201, 0.349019607843137);z-index:99">
                      <div class="select-item" @click="jumpnormal()">普通用户</div>
                      <div class="select-item" @click="jumpglobal()">全球合作伙伴</div>
                  </div>
                </div>
                <div class="select-wrap">
                  <div @click='jumpTwoSell' class="ipt_layout" style="box-shadow: 0px 1px 10px rgba(201, 201, 201, 0.349019607843137);border: none;background: rgb(255, 255, 255);">
                      <div>
                      <span style="font-size: .45rem;color: #1E1E1E;">卖出TBG</span>
                      </div>
                  </div>
                </div>
              </div>
          </div>
      </div>

      <!-- 全球区块链去中心化游戏平台 -->
      <div class="direction">
          <div class="content">
              <div class="left">
                  <img src="@/assets/img/u6628.svg" alt="">
              </div>
              <div class="right">  
                共同建设全球区块链去中心化游戏社区，
                购买 TBG 资产包即挖矿，参与游戏获空
                投，持有 TBG 享股东分红。
              </div>
          </div>
            
      </div>

      <!-- qiandao -->
      <check-in></check-in>
      <!-- TBG资产包矿池 -->
      <div class="orePool">
          <div class="title clear">
            <span class="left">
              TBG资产包矿池
            </span>
            <span class="right">
              规则>
            </span>
          </div>
          <div class="content" @click="jumpAssetPool">
              
              <div class="left">
                <img class="people"  src="@/assets/img/u6712.gif" alt="">
                </div>
              <div class="right">
                  <p>当前有效资产包</p>
                  <p>1,954.2532 <span>0000</span> TBG</p>
              </div>
          </div>
      </div>


     <!--  TBG线性释放池 -->
      <div class="releasePool">
          <div class="title clear">
            <span class="left">
              TBG线性释放池
            </span>
            <span class="right">
              规则>
            </span>
          </div>
          <div class="content clear" @click="jumpAssetLinearPool">
            <div class="left">释放池余额</div>
            <div class="right">2,492.5160 <span> 0210 </span> TBG</div>
          </div>
      </div>

      <!-- TBG 可售池 -->
      <div class="bonus">
          <div class="title clear">
            <span class="left">
              TBG 可售池
            </span>
            <span class="right">
              规则>
            </span>
          </div>


          <div class="content">

            <div class="item" @click="jumpSaleableBalance">
                <p>可售余额</p>
                <p>{{Balance}} </p>
                <p>TBG</p>
            </div>

            <div class="item" @click="jumpSaleableLimit">
                <p>可售额度</p>
                <p>{{Amount}} </p>
                <p>TBG</p>
            </div>

          </div>
      </div>

      <div class="container-common can-sell">
          <div class="item">
              <p>可售数量</p>
          </div>

          <div class="item">
              <p>{{Quantity}}TBG</p>
          </div>
      </div>
    </div>

<v-ons-action-sheet
        :visible.sync="actionSheetVisible"
        cancelable
        style="background: rgba(0,0,0,0.5);"
      >
        <div class="action_layout">
          <div class="btn_active" @click="showDialog = true">支付</div>
        </div>
      </v-ons-action-sheet>
      <v-ons-dialog
        modifier="width_pwd"
        cancelable
        style="background-color: rgba(0, 0, 0, .5);z-index: 10000;"
        :visible.sync="showDialog">
        <m-dialog v-model="password" v-on:confirm="handleConfirm" v-on:cancel="handleCancel"></m-dialog>
      </v-ons-dialog>
      <v-ons-modal :visible="loading" >
        <loading></loading>
      </v-ons-modal>
   

  </div>
 
</template>

<script>
import CheckIn from './CheckIn'
import api from '@/servers/invitation'
import {Decimal} from 'decimal.js'

import MyPage from '@/components/MyPage'
import MDialog from '@/components/MDialog'
import PasswordService from '@/services/PasswordService'
import CryptoAES from '@/util/CryptoAES'
import eos from '@/plugins/eos'
import { friendInvest,getConfig } from '@/servers/invitation';

export default {
    data(){
          return {
                atv_text: '',
                account_name: '',
                destroy_amount: '',
                sub_account:{},
                total_income: '',
                selected_ipt:false,
                tbg:0,

                account_type:'',     //账号类型
                Balance:0,      //余额
                Amount:1,       //额度
                Quantity:0,     //可售数量
                subAccountQuantity:true,  //子账号数量切换

                //区块链转站
                reqParams: {
                  account: '',
                  friendAccountName: ''
                },
                password: '',
                actionSheetVisible: false,
                showDialog: false,
                loading: false,

                system_ntf:[],
                MyInvitationItem: [
                  { text: '普通用户', value: 'OrdinaryUsers' },
                  { text: '全球合作伙伴', value: 'GlobalPartners' },
                ],
                selectedInvitation: 'OrdinaryUsers',
                MyTeamItem:[
                  { text: '普通用户', value: 'OrdinaryUsers' },
                  { text: '全球合作伙伴', value: 'GlobalPartners' },
                ],
                selectedMyTeam:'OrdinaryUsers',
                ensure: [
                  {
                    top: 'binggo奖金池',
                    mid: '',
                    bot: '倒计时',
                    url: 'BingoPool'
                  },{
                    top: '最后1位投资者',
                    mid: '',
                    bot: 'UE',
                    url: 'BingoPool'
                  },{
                    top: '最后2-30位投资者',
                    mid: '',
                    bot: 'UE',
                    url: 'BingoPool'
                  },{
                    top: 'TBG分红池',
                    mid: '',
                    bot: 'UE',
                    url: 'shareholderPool'
                  },{
                    top: '三倍收益保障池',
                    mid: '',
                    bot: 'UE',
                    url: 'FivePool'
                  },{
                    top: '直接推荐PK池',
                    mid: '',
                    bot: 'UE',
                    url: 'PkPool'
                  },
                ],
                distribution: [
                  {
                    top: '',
                    mid: '',
                    bot: 'UE',
                    url: 'Withdraw'
                  },{
                    top: '可提现余额.40%',
                    mid: '492.5160  0210',
                    bot: 'UE',
                    url: ''
                  },{
                    top: '可提现余额.40%',
                    mid: '492.5160  0210',
                    bot: 'UE',
                    url: ''
                  },{
                    top: '可提现余额.40%',
                    mid: '492.5160  0210',
                    bot: 'UE',
                    url: 'DappList'
                  }
                ],
                trade_price: 0,
                _binggotimer: null
        }
    },
    components: {
      CheckIn,
      MDialog
    },
    created(){
        this.account_name = this.$store.state.wallet.localFile.wallets.slice()[0].accountNames[0];
        //判断是否激活
        api.isBind({
          account_name: this.account_name
        }).then(res => {
          if (res.code==1){
            console.log(22222222222222,res.data)
            if(res.data.is_bind==true){
            return 
            }else{
              this.$router.push({
                  name: 'IndexT',
                })
            }
          }
        })
        //



        api.isActive({
          account_name: this.account_name
        }).then(res => {
          switch(res.data.is_activated){
            case 0:
              this.atv_text = '未激活';this.subAccountQuantity=false;break;
            case 10:
              this.atv_text = '已激活';this.subAccountQuantity=true;break;
            case 20:
              this.atv_text = '已激活';this.subAccountQuantity=false;break;
            case 30:
              this.subAccountQuantity=true;;break;
          }
        })
        api.getTradePrice().then(res => {
          this.trade_price = res.data.price
        })
        api.getDestory().then(res => {
          this.destroy_amount = res.data.destroy_amount.split('.')
          this.destroy_amount[1] = this.addSpace(this.destroy_amount[1])
        })
        api.subAccount({
          account_name: this.account_name
        }).then(res => {
          this.sub_account = res.data
        })
        api.investmentIndex({
          account_name: this.account_name
        }).then(res => {
          this.getEndTime(res.data.bingo_countdown)
          this.ensure[1].mid = res.data.last_invest
          this.ensure[2].mid = res.data.other_invest
          this.ensure[3].mid = res.data.shareholders_bonus
          this.ensure[4].mid = res.data.safe_bonus
          this.ensure[5].mid = res.data.pk_bonus
          this.total_income = this.addSpace(res.data.total_income)
        })
        api.getBalanceAlloc({
          account_name: this.account_name
        }).then(res => {
          this.distribution[0].mid = res.data.withdraw_enable
          this.distribution[1].mid = res.data.repeat_currency
          this.distribution[2].mid = res.data.lotto_currency
          this.distribution[3].mid = res.data.game_currency
          this.distribution.forEach(item => {
            item.mid = this.addSpace(item.mid)
          })
          this.distribution[0].top = `可提现余额.${res.data.withdraw_enable_rate}%`
          this.distribution[1].top = `复投余额.${res.data.repeat_currency_rate}%`
          this.distribution[2].top = `全球彩彩码.${res.data.lotto_currency_rate}%`
          this.distribution[3].top = `游戏筹码.${res.data.game_currency_rate}%`
        })
        api.getSystemNtf().then(res => {
          this.system_ntf = res.data.system_notification
          // console.log(this.system_ntf)
        })
        api.getType({account_name:this.account_name}).then(res => {    //获取当前用户的信息
          if(res.code){
            this.account_type=res.data.account_type;
            }
        })
        this.availableQuantity();     //可售数量






    },
    beforeDestroy() {
      clearInterval(this._binggotimer);
    },
    methods: {
      switchData (id) {
        this.$refs[`slt-${id}`].classList.toggle('select-toggle')
      },
      addSpace (str) {
        return str.slice(0,str.length-4) + " " +str.slice(-4)
      },
      navigateTo (url) {
        console.log('router has active')
        if (!url) return
        this.$router.push({
          path: `${url}`
        })
      },
      tbgToggle (id) {
        this.tbg = id
      },
      getRemainTime (endTime) {
          let t = endTime - Date.parse(new Date())
          let seconds = Math.floor((t / 1000) % 60)
          let minutes = Math.floor((t / 1000 / 60) % 60)
          let hours = Math.floor((t / (1000 * 60 * 60)) % 24)
          // let days = Math.floor(t / (1000 * 60 * 60 * 24))
          return {
              'total': t,
              // 'days': days,
              'h': hours,
              'm': minutes,
              's': seconds
          }
      },
      getEndTime (endTime) {
          //设置定时器
          this._binggotimer = setInterval(() => {
              // 得到剩余时间
              let remainTime = this.getRemainTime(endTime)
              // 倒计时到两个小时内
              this.ensure[0].mid = `${remainTime.h}:${remainTime.m}:${remainTime.s}`
              if (remainTime.total <= 0) {
                  clearInterval(this._binggotimer);
                  // do something
              }
          }, 1000)
      },

      availableQuantity(){    //可售数量
        api.SaleableBalance({account_name:this.account_name}).then(res => {
          if (res.code === 1) {
            this.Balance=res.data.saleable_amount;
          }})
        api.SaleableAmount({account_name:this.account_name}).then(res => {
          if (res.code === 1) {
            this.Amount=res.data.saleable_balance;
          }}).then(() =>{
          this.Balance>this.Amount?this.Quantity=this.Amount:this.Quantity=this.Balance;
          })        
        },
      //跳转路由
      jumpSaleableBalance() {        //跳转可售余额
          this.$router.push({ 
          name: 'SaleableBalance',
        })
       },
      jumpSaleableLimit() {        //跳转可售额度
          this.$router.push({
          name: 'SaleableLimit',
        })
       },
      jumpAssetLinearPool() {     //跳转TBG线性释放池
          this.$router.push({
          name: 'AssetLinearPool',
        })
       },
      jumpAssetPool() {         //跳转TBG资产包矿池
          this.$router.push({
          name: 'AssetPool',
        })
       },
      jumpMyTeam(index) {
        if(index==0){       //跳转我的团队---普通用户
          this.$router.push({
            name: 'MyTeam',
        })
        }else{               //跳转我的团队---全球合伙人

        }
       },
      jumpMyInvitationPage() {
        let Judge=0;        //判断普通用户--全球合伙人
        if(Judge==0){       //跳转我的邀请专页---普通用户
          this.$router.push({
            name: 'MyInvitationPage',
        })
        }else{               //跳转我的邀请专页---全球合伙人

        }
       },
      jumpSubAccount() {         //跳转 子账号
          this.$router.push({
          name: 'SubAccount',
        })
       },
      jumpProfit() {         //跳转 TBG-1收益
          this.$router.push({
          name: 'Profit',
        })
       },
       jumpTwoSell() {    //TBG-2 卖出TBG
          this.$router.push({
          name: 'TradingCenter',
          params: {
            buySell: false
          }
        })
       },
       jumpglobal() {    //跳转全球合伙人私募
          this.$router.push({     
          name: 'TradingCenter',
          params: {
            buyPartner: 2
          }
        })
       },
       jumpnormal(){      //跳转普通买入
         this.$router.push({
          name: 'TradingCenter',
          params: {
            buyPartnerT: 1
          }
        })
       },
       jumpQuantityTbg(){   //子账号参与TBG
         this.clickConfirm(); 
       },
    



        //区块链转站
        // 验证密码
        async verifyPassword() {
          const seed = await PasswordService.encrypt(this.password);
          const wallets = this.$store.state.wallet.localFile.wallets;
          const current = wallets.find(ele => ele.accountNames[0] === this.reqParams.account);
          const privateKey = CryptoAES.decrypt(current.privateKey,seed);
          return privateKey
          // return '5KNoQXeFJp47dbtyifcCjJuhXjYmNvWPVcWYsHJJWZ8h7zAd78h';
        },
        async clickConfirm() {   //显示密码
              this.actionSheetVisible = true;
        },
        async goPay(privateKey,quantity,memo ) {
          if (privateKey) {
            this.showDialog = false
            try {
              const config = await this.getConfig()
              const opts = { authorization:[`${this.reqParams.account}@active`], keyProvider: privateKey }
              // await eos.transfer(this.reqParams.account, config.wallet_receiver, `100.0000 UE`, `tbg_invest:${this.reqParams.account}`, opts)
              const adm = await eos.contract('tbgjoin')
              // account_name,price,trx_type,assets_package_id ==> fb,0.5,raise,4
              const trx = await adm.transfer(this.reqParams.account, config.trade_receiver, quantity, memo, opts)
              console.log(11221111,trx);
              return true
            } catch (error) {
              console.log(error)
              error = JSON.parse(error)
              if (error.error.code == 3050003) {
                this.$toast(this.$t('common.overdrawn_balance'))
              }
              if (error.error.code == 3080004) {
                this.$toast('CPU资源受限')
              }
              return false
            }
          } else {
            this.$toast(this.$t('common.wrong_pwd'))
          }
        },
        async sellgoPay(privateKey,quantity,memo ) {
          if (privateKey) {
            this.showDialog = false
            try {
              const config = await this.getConfig()
              const opts = { authorization:[`${this.reqParams.account}@active`], keyProvider: privateKey }
              // await eos.transfer(this.reqParams.account, config.wallet_receiver, `100.0000 UE`, `tbg_invest:${this.reqParams.account}`, opts)
              const adm = await eos.contract('tbgjoin')
              // account_name,price,trx_type,assets_package_id ==> fb,0.5,raise,4
              const trx = await adm.transfer(this.reqParams.account, config.trade_receiver, quantity, memo, opts)
              console.log(11221111,trx);
              return true
            } catch (error) {
              console.log(error)
              error = JSON.parse(error)
              if (error.error.code == 3050003) {
                this.$toast(this.$t('common.overdrawn_balance'))
              }
              if (error.error.code == 3080004) {
                this.$toast('CPU资源受限')
              }
              return false
            }
          } else {
            this.$toast(this.$t('common.wrong_pwd'))
          }
        },
        async friendInvest() {
          try {
            const res = await friendInvest()
            return res.code
          } catch (error) {
            console.log(error)
          }
        },
        async getConfig() {
          try {
            const res = await getConfig()
            if (res.code === 1) {
              console.log('getConfig',res)
              return res.data
            }
          } catch (error) {
            console.log(error)
          }
        },
        async handleConfirm() {
          this.loading = true
          const privateKey = await this.verifyPassword()
          if (privateKey) {
            const res = await this.goPay(privateKey)
            if (res) this.$toast('投资成功')
            this.loading = false
            this.showDialog = false
            this.actionSheetVisible = false
          } else {
            this.$toast(this.$t('common.wrong_pwd'))
            this.loading = false
          }
        },
        handleCancel() {
          this.showDialog = false
        },
        jumpDestruction(){
         this.$router.push({
           name:'DestructionDetails'
         })
       },
       jumpNotice(){
         this.$router.push({
           name:'Notice'
         })
       },
    },
}
</script>

<style scoped>
  /* 系统公告 */
  .system_ntf{
    flex-grow: 1;
  }
  .system_ntf_item{
    display: flex;
    justify-content: space-between;
    padding-right: .3rem;
  }
  .system_ntf_item>span:nth-of-type(3){
    color:#bcbcbc;
  }
  /* 交易中心 */
  .exchange-content{
    display: flex;
    justify-content: space-between;
  }
  .exchange-left{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;;
    flex-grow: 1;
    font-size: .4rem;
    padding: .3rem 0;
    border: 2px solid rgb(233, 233, 233);
    border-radius: 4px;
    margin: .2rem;
  }
  .exchange-left>span:nth-of-type(2){
    color: #FF9900;
  }
  .exchange-right{
    flex-grow: 1;
  }
  /* 奖金和保障 */
  .ensure_content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .ensure_content_inner {
    width: 30%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: .3rem 0;
    box-shadow: 0px 1px 10px rgba(201, 201, 201, 0.349019607843137);
    margin: .2rem 0;
  }
  .ensure_content_inner>.top,.ensure_content_inner>.bot {
    font-size: .3rem
  }
  .ensure_content_inner>.mid {
    font-size: .4rem;
    color: #FF9900;
  }

  /* 分配 */
  .distribution_content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .distribution_content_inner {
    width: 45%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: .3rem 0;
    box-shadow: 0px 1px 10px rgba(201, 201, 201, 0.349019607843137);
    margin: .2rem 0;
  }
  .distribution_content_inner>.top,.distribution_content_inner>.bot {
    font-size: .3rem
  }
  .distribution_content_inner>.mid {
    font-size: .4rem;
    /* color: #FF9900; */
  }


  .can-sell {
    display: flex;
    justify-content: space-between;
    padding: .3rem .4rem;
    font-size: .4rem;
  }
  /* 公共样式 */
  .wrap{
        font-family: '微軟正黑體 Regular', '微軟正黑體';
        margin-bottom:2rem;
  }
  .clear{
    overflow: hidden;
    zoom:1;
  }
  .clear:after{
     content:"";
     clear:both;
     display:block;
     height:0;
     overflow:hidden;
     visibility:hidden;
  }
   .title{
    width:100%;
    height:1.3rem;
    line-height: 1.3rem;
    border-bottom:1px solid rgba(242, 242, 242, 1);;
  }
  .title .left{
    font-size:0.5rem;
    font-weight:bold;
    float:left;
    padding-left:0.3rem;
  }
  .title .right{
    font-size:0.35rem;
    float:right;
    padding-right:0.3rem;
  }

   /* 内容样式 */

  .top-info{
    text-align:center;
    padding:0.2rem 0;
  }
  .top-info h2{
    font-family: 'Bahnschrift Regular', 'Bahnschrift';
    font-weight: 400;
    margin:0;
    padding:0.1rem 0;
    font-style: normal;
    font-size: 0.5rem;
    color: #A1A1A1;
  }
  .top-info span{
    color:#9c9c9c;
    font-size:0.4rem;
    padding-bottom: .2rem;
  }


  .log{
    text-align:center;
    background-color:#fff;
    width:100%;
    padding:0.5rem 0;
    color:#333;
    margin-bottom:0.04rem;
  }
  .log_title{
    padding:0.2rem 0;
    font-size:0.43rem;
    font-family: 'Bahnschrift Regular', 'Bahnschrift';
  }
  .log_txt{
    font-size:0.45rem;
  }


  .games{
    padding:0.5rem 0;
    background-color:#fff;
    margin-bottom:0.04rem;
    text-align:center;
  }
  .games_title{
    font-size:0.43rem;
  }
  .games_group{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .2rem 1rem;
  }
  .games_group img{
    width: 11vw;
    height: 11vw;
  }

  .destroyed{
     padding:0.5rem 0;
     margin-bottom:0.04rem;
     background-color:#fff;
     text-align:center;
     font-family: 'Bahnschrift Regular';
     font-size:0.5rem;
  }
  .destroyed_txt1{
    font-family: '微軟正黑體 Regular', '微軟正黑體';
    font-size:0.4rem;
    padding-left:0.3rem;
  }
  .destroyed_txt2{
    color: #FF9900;
  }
  .destroyed_txt3{
    color: #BCBCBC;
  }
  .destroyed_txt4{
    color:#b1b1b1;
  }


  .onlineService{
    background: #fff;
    display:flex;
    flex-wrap:nowrap;
    box-sizing:border-box;
    width:100%;
  }
  .onlineService .item:nth-child(1){
    flex:7.5 7.5;
    display:flex;
    align-items:center;
    font-size:0.37rem;
    border-right:1px solid #efeff4;
    /* justify-content:center; */
  }
  .onlineService .item:nth-child(2){
    flex:2.5 2.5;
    display:flex;
    align-items:center;
    font-size:0.37rem;
    justify-content:center;
    padding-right:0.1rem;
  }
  .pd2{
    padding-right:0.2rem;
  }
  .myteam{
     background:#fff;
     margin-top:0.35rem;
  }
  .select-content {
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
  }
  .select-toggle {
    display: none;
  }
  .select-wrap {
    flex: 0 50%;
    position: relative;
  }
  .select-item {
    padding: .2rem 0;
    text-align: center;
    font-size: .4rem;
  }
  .ipt_layout {
      border-radius: 0.08rem;
      height: 1.2rem;
      width: 100%;
      border: 2px solid RGB(228,228,228);
      display: flex;
      flex-wrap: nowrap;
      justify-content: center;
      align-items: center;
      padding: 0 15px;
      box-sizing: border-box;
  }
  .tbg-bar-wrap {
    padding: .3rem;
  }
  .tbg-bar{
    display: flex;
    justify-content: space-between;
    background: #fff;
    height: 1rem;
  }
  .tbg-bar_item {
    flex: 0 50%;
    text-align: center;
    line-height: 1rem;
    position: relative;
  }
  .tbg-bar_item::after {
    position: absolute;
    content: '';
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: .8rem;
    height: 5px;
  }
  .tbg-bar>.active{
    color: #FF9900;
  }
  .tbg-bar>.active::after{
    background: #FF9900;
  }
 

.child-account_content{
  display: flex;
  padding: .4rem;
}
.child-account_left,.child-account_right{
  flex-grow: 1;
  text-align: center;
  box-shadow: 0px 1px 10px rgba(201, 201, 201, 0.349019607843137);
  padding: .5rem;
  font-size: .4rem;
}
.child-account_right{
  margin-left: .4rem;
}
.income_content{
  padding: .2rem .2rem .6rem .2rem;
}
.income_content_inner{
  display: flex;
  justify-content: space-between;
  padding: .4rem .2rem;
  font-size: .4rem;
  box-shadow: 0px 1px 10px rgba(201, 201, 201, 0.349019607843137);
}






.container-common {
  background:#fff;
  margin-top:0.35rem;
}

.orePool{
  background:#fff;
  margin-top:0.35rem;
}
.orePool .content{
  display:flex;
  
}
.orePool .content .left{
  flex:2 2;
  text-align: center;
  background:url("../../assets/img/u6711.svg") no-repeat ;
  background-position:center;
  background-size: 3rem;
}
.orePool .content .right{
  flex:3 3;
  text-align:center;
  font-size:0.4rem;
}
.orePool .content .right p:nth-child(1){
  padding-top:0.7rem;
}
.orePool .content .right p:nth-child(2){
  padding-top:0.1rem;
  font-weight:bold;
}
.orePool .content .right p:nth-child(2) span{
  color:#bcbcbc;
}
.people{
  width:2.5rem;
  height:2.5rem;
  z-index: 99;
}







  .direction{
    display:flex;
    margin-top:0.35rem;
    background-color:#fff;
    align-items:center;
    padding:0.4rem;
  }
  .direction .content{
    padding:0.35rem 0.2rem; 
    border:1px solid rgba(228, 228, 228, 1);
    border-radius: 5px;
    width:100%;
    display:flex;
    align-items:center;
  }
   .direction .content .left img{
    padding-right:0.2rem;
  }
  .direction .content .right{
    font-size:0.4rem;
  }



  .releasePool{
     background:#fff;
     margin-top:0.35rem;
  }
  .releasePool .content{
     padding:0.4rem  0.8rem;
  }
  .releasePool .content .left{
    float:left;
    font-size:0.45rem;
    
  }
  .releasePool .content .right{
    float:right;
    font-weight:bold;
    font-size:0.4rem;
  }
  .releasePool .content .right span{
    color:#BCBCBC;
  }

  .bonus{
     background:#fff;
     margin-top:0.35rem;
  }
  .bonus .content{
    display:flex;
    flex-wrap:wrap;
    text-align:center;
  }
  .bonus .content .item{
    flex:1;
    padding:0.4rem 0.2rem;
  }
  
  .bonus .content .item p:nth-child(1){
    font-family:'微軟正黑體 Regular', '微軟正黑體';
    font-size:0.4rem;
    white-space:nowrap;
  }
  .bonus .content .item p:nth-child(2){
      font-family: 'Bahnschrift Regular', 'Bahnschrift';
      font-size:0.45rem;
      white-space:nowrap;
      font-weight:400;
  }
   .bonus .content .item p:nth-child(2) span{
      color:#bcbcbc;
  }
  .bonus .content .item p:nth-child(3){
      font-family: 'Bahnschrift Regular', 'Bahnschrift';
      font-weight:400;
      font-size:0.4rem;
  }
 

/*确认密码*/
.action_layout {
  background-color: #fff;
  padding: 35px 50px;
}
.btn_active {
  background-color: #ff8e05;
  color: #fff;
  text-align: center;
  padding: 30px;
  border-radius: 10px;
  font-size: 36px;
  font-weight: bold;
}

</style>
