<template>
  <div class="scrollView" @scroll.native="scrollEvent" ref="page">
    <div ref="page2" class="wrap">
    <!-- 头部信息 -->
    <div class="head-info jc_sb-al_c">
      <div class="head-user flx_default">
        <img class="head-user_avatar" src="../../assets/invitation2/avatar.jpg" alt="">
        <span>{{account_name}}</span>
        <span @click="jumplevel">{{atv_text}}</span>
        <img class="head-user_arrow" src="@/assets/img/u28.png">
      </div>
      <img class="head-serve" src="../../assets/invitation2/head-serve.png" alt="">
    </div>

    <!-- 全球区块链去中心化游戏应用平台 -->
    <div class="banner-wrap jc_c-al_c">
      <div class="banner fd_cln jc_sa-al_c">
        <div class="top jc_c-al_c">
          <div class="top_logo jc_c-al_c">
            <img src="../../../public/img/u482.svg" alt="">
          </div>
          <div class="top_right fd_cln">
            <span>Token · Blockchain · Game</span>
            <span>全球区块链去中心化游戏应用平台</span>
          </div>
        </div>
        <div class="destroyed jc_c-al_c">
          <span>已销毁</span> 
          <div class="destroyed_txt" v-if="destroy_amount.length>0">
            <span class="destroyed_txt1"> {{destroy_amount[0]}}.</span>     
            <!-- <span class="destroyed_txt2">{{destroy_amount[1]}}</span> -->
            <span class="destroyed_txt3"> {{destroy_amount[1]}}</span>
          </div>
          <span>TBG</span>
        </div>
        <div @click="jumpDestruction()" class="banner-detail_btn">
          查看详情
        </div>
      </div>
    </div>    

    <!-- 查看TBG旗下游戏 -->
    <div v-if="false" class="games fd_cln">
      <div class="section-head jc_sb-al_c">
        <span>TBG旗下游戏</span>
        <span @click="navigateTo('DappList')">查看全部</span>
      </div>
      <div class="games-bar">
        <div class="games_group" @click="navigateTo('DappList')">
          <div class="games_group_inner">
            <div class="games_item_wrap"><img src="../../assets/invitation2/u1.png" alt=""><span>全球彩</span></div>
            <div class="games_item_wrap"><img src="../../assets/invitation2/u2.svg" alt=""><span>好运红包</span></div>
            <div class="games_item_wrap"><img src="../../assets/invitation2/u3.png" alt=""><span>夺宝</span></div>
            <div class="games_item_wrap"><img src="../../assets/invitation2/u4.svg" alt=""><span>哈希骰子</span></div>
            <div class="games_item_wrap"><img src="../../assets/invitation2/u5.png" alt=""><span>哈希分分彩</span></div>
            <div class="games_item_wrap"><img src="../../assets/invitation2/u6.png" alt=""><span>ha666</span></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 在线客服 -->
    <div class="broadcast-wrap">
      <div class="broadcast jc_sb-al_c">
        <img class="broadcast_img" src="../../assets/invitation2/broadcast.png" alt="">
        <div class="broadcast_info">
          <span v-if="system_ntf.length > 0">{{system_ntf[0].title}}</span>
        </div>
        <span @click="jumpNotice()">查看更多</span>
      </div>
    </div>

    <!-- 我的团队 -->
    <div class="team">
      <div class="section-head jc_sb-al_c">
        <span>我的团队</span>
        <span>规则</span>
      </div>
      <div class="team-select flx_default">
        <div @click="jumpMyInvitationPage" class="left al_c">
          <img src="../../assets/invitation2/invite.png" alt="">
          <span>我的邀请专页</span>
        </div>
        <div @click="jumpMyTeam(0)" class="right al_c">
          <img src="../../assets/invitation2/team.png" alt="">
          <span>我的团队</span>
        </div>
      </div>
    </div>
    <!-- 为tbgbar吸附提供参照 -->
    <div ref="barFixedRefer" style="visibility:none;"></div>
    <!-- TBG 1 - 2 -->
    <div ref="tbgbar" class="tbg-bar-wrap" :class="{'fixedActive':tbgbarFixed}">
      <div class="tbg-bar">
        <div @click="tbgToggle(0)" class="tbg-bar_item" :class="{'active': tbg === 0}">
          TBG-I
        </div>
        <div @click="tbgToggle(1)" class="tbg-bar_item" :class="{'active': tbg === 1}">
          TBG-II
        </div>
      </div>
    </div>
    <v-ons-carousel fullscreen swipeable auto-scroll overscrollable
      :index.sync="tbg"
    >
      <v-ons-carousel-item>
        <div>
          <!-- 交易中心 -->
          <div>
            <div class="section2-head jc_sb-al_c">
              <span>交易中心</span>
              <span>规则</span>
            </div>
            <div class="exchange-content">
              <div class="exchange-left">
                <span>当前TBG价格</span>
                <span>{{trade_price}}</span>
                <span>UE</span>
              </div>
              <div class="exchange-right">
                <div class="select-wrap">
                  <div @click='switchData(2)' class="ipt_layout">
                      <div>
                      <span style="font-size: .45rem;color: rgb(236,90,91);">买入TBG</span>
                      </div>
                      <img  src="@/assets/img/u28.png" style="width: 0.5rem;height: 0.5rem;"> 
                  </div>
                  <!-- 下拉部分 -->
                  <div class="select-toggle" ref="slt-2" style="position: absolute;background: rgb(255, 255, 255);border-radius: 0.08rem;width: 80%;left: 10%;box-shadow: 0px 1px 10px rgba(201, 201, 201, 0.349019607843137);z-index:99">
                      <div class="select-item" @click="jumpnormal()">普通用户</div>
                      <div v-if="isGlobal" class="select-item" @click="jumpglobal()">全球合作伙伴</div>
                  </div>
                </div>
                <div class="select-wrap">
                  <div @click='jumpTwoSell' class="ipt_layout">
                      <div>
                      <span style="font-size: .45rem;color: #0099CC;">卖出TBG</span>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 全球区块链去中心化游戏平台 -->
          <div class="common-wrap">
            <div class="intro common-box al_c">
              <div class="left jc_sb-al_c">
                <img src="@/assets/img/u5094.svg" alt="">
              </div>
              <div class="right">  
                全球区块链去中心化游戏平台，真正公平公正、透明可查、无法作假的区块链去中心化游戏是现在和未来的方向。
              </div>
            </div>
          </div>

          <!-- qiandao -->
          <check-in></check-in>

          <!-- TBG资产包矿池 -->
          <div>
            <div class="section2-head jc_sb-al_c">
              <span>TBG资产包矿池</span>
              <span>规则</span>
            </div>
            <div class="common-wrap" @click="jumpAssetPool">
              <div class="common-box resource jc_sb-al_c">
                <img src="@/assets/img/u6712.gif" alt="">
                <div class="resource-info">
                  <p class="">当前有效资产包</p>
                    <span style="font-size:0.6rem;color: rgb(236,90,91);">{{mined_amount[0]}}.{{mined_amount[1][0]}} </span>
                    <span style="font-size:0.6rem;color: #FF9900;">{{mined_amount[1][1]}} </span>
                    <span style="font-size:0.6rem;color: rgb(236,90,91);"> TBG</span>
                </div>
              </div>
            </div>
          </div>


            <!--  TBG线性释放池 -->
          <div>
            <div class="section2-head jc_sb-al_c">
              <span>TBG线性释放池</span>
              <span>规则</span>
            </div>
            <div class="common-wrap" @click="jumpAssetLinearPool">
              <div class="common-box jc_sb-al_c">
                <span>释放池余额</span>
                <div class="common-number">
                  <span style="line-height: 1.1rem;" class="font_B ">{{balance_info}} </span>
                </div>
              </div>
            </div>
          </div>

          <!-- TBG 可售池 -->
          <div>
            <div class="section2-head jc_sb-al_c">
              <span>TBG 可售池</span>
              <span>规则</span>
            </div>
            <div class="common-wrap distribution_content">
              <div class="distribution_content_inner" @click="jumpSaleableBalance">
                <p class="top ">可售余额</p>
                <p class="mid" style="text-align: center;">
                  <span style="font-size:0.5rem;color: rgb(236,90,91);">{{Balance[0]}}.{{Balance[1][0]}} </span>
                  <span style="font-size:0.5rem;color: #FF9900;">{{Balance[1][1]}} </span>
                </p>
                <p class="bot ">TBG</p>
              </div>
              <div class="distribution_content_inner" @click="jumpSaleableLimit">
                <p class="top">可售额度</p>
                <p class="mid" style="text-align: center;">
                  <span style="font-size:0.5rem;color: rgb(236,90,91);">{{Amount[0]}}.{{Amount[1][0]}} </span>
                  <span style="font-size:0.5rem;color: #FF9900;">{{Amount[1][1]}} </span>
                </p>
                <p class="bot">TBG</p>
              </div>
              <div class="distribution_content_inner">
                <p class="top">可售数量</p>
                <p class="mid" style="text-align: center;">
                  <span style="font-size:0.5rem;color: rgb(236,90,91);">{{Quantity[0]}}.{{Quantity[1][0]}} </span>
                  <span style="font-size:0.5rem;color: #FF9900;">{{Quantity[1][1]}} </span>
                </p>
                <p class="bot">TBG</p>
              </div>
            </div>
          </div>
        </div>
      </v-ons-carousel-item>
      <v-ons-carousel-item>
        <div class="tag-page">
          <!-- 子账号 -->
          <div class="child-account">
            <div class="section2-head jc_sb-al_c">
              <span>投资与子账号</span>
              <span>规则</span>
            </div>
            <div class="child-account_items jc_sa-al_c">
              <div v-if="account_activation" @click="jumpSubAccount" class="account_item_left">
                <div class="acc-img_wrap">
                  <img src="../../assets/invitation2/child-acc.png" alt="">
                  <span class="child-acc_amount">{{sub_account.total_sub_account || 0}}</span>
                </div>
                <p >子账号</p>
              </div>
              <div v-if="!account_activation" @click="jumpQuantityTbg" class="account_item_left">
                <div class="acc-img_wrap">
                  <img src="../../assets/invitation2/child-acc.png" alt="">
                  <span class="child-acc_amount">{{sub_account.total_sub_account || 0}}</span>
                </div>
                <p >参与TBG</p>
              </div>
              <div @click="navigateTo('HelpFriend')" class="account_item_right">
                <div class="acc-img_wrap">
                  <img src="../../assets/invitation2/assist-fri.png" alt="">
                </div>
                <p>帮助伙伴</p>
              </div>
            </div>
          </div>

          <!-- 全球区块链去中心化游戏平台 -->
          <div class="common-wrap">
            <div class="intro common-box al_c">
              <div class="left jc_sb-al_c">
                <img src="@/assets/img/u6628.svg" alt="">
              </div>
              <div class="right">  
                共同建设全球区块链去中心化游戏社区，
                购买 TBG 资产包即挖矿，参与游戏获空
                投，持有 TBG 享股东分红。
              </div>
            </div>
          </div>

          <!-- TBG-I 收益 -->
          <div>
            <div class="section2-head jc_sb-al_c">
              <span>TBG-II收益</span>
              <span>规则</span>
            </div>
            <div class="common-wrap">
              <div class="common-box jc_sb-al_c">
                <span>总计</span>
                <div class="common-number">
                  <span>{{total_income[0]}} </span>
                  <span style="color: #FF9900;">{{total_income[1]}}</span>
                  <span> UE</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 奖金和保障 -->
          <div>
            <div class="section2-head jc_sb-al_c">
              <span>奖金以及保障池</span>
              <span>规则</span>
            </div>
            <div class="common-wrap">
              <div class="common-box ensure_content">
                <div @click='navigateTo(item.url)' v-for="(item, index) in ensure" :key="index" class="ensure_content_inner" >
                  <span class="top">{{item.top}}</span>
                  <span class="mid">{{item.mid}}</span>
                  <span class="bot">{{item.bot}}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 收入分配 -->
          <div>
            <div class="section2-head jc_sb-al_c">
              <span>收益分配</span>
              <span>规则</span>
            </div>
            <div class="common-wrap distribution_content">
              <div @click='navigateTo(item.url)' v-for="(item, index) in distribution" :key="index" class="distribution_content_inner">
                <span class="top">{{item.top}}</span>
                <span class="mid">
                  <span>{{item.mid[0]}}</span>
                  <span style="color: #868686;"> {{item.mid[1]}}</span>
                </span>
                <span class="bot">{{item.bot}}</span>
              </div>
            </div>
          </div>
        </div>
      </v-ons-carousel-item>
    </v-ons-carousel>

    <!-- TBG-I标签页 -->
    


    <!-- TBG-II标签页 -->
    

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
import eos from '@/plugins/pog'
import serverApi from '@/servers/invitation'; //getConfig

export default {
    data(){
          return {
                tbgbarFixed: false,
                atv_text: '',
                account_name: '',
                destroy_amount: '',
                sub_account:{},
                total_income: '',
                selected_ipt:false,
                tbg:0,
                balance_info:0,   //释放池余额
                mined_amount:0,   //获取当前有效资产包

                isGlobal:'',     //账号类型
                account_activation:'true',     //账号是否激活
                Balance:0,      //余额
                Amount:1,       //额度
                Quantity:[0,[]],     //可售数量
                subAccountQuantity:false,  //子账号数量切换

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
        this.account_name = this.$store.state.wallet.assets.account;
        //判断是否激活
        // api.isBind({account_name: this.account_name}).then(res => {
        //   if (res.code==1){
        //     console.log(22222222222222,res);
        //     if(res.data.is_bind==true){
        //     return 
        //     }else{
        //       this.$router.push({
        //           name: 'IndexT',
        //         })
        //     }
        //   }
        // })
        //

        this.is_active()
        api.getTradePrice().then(res => {
          this.trade_price = res.data.price
        })
        api.getDestory().then(res => {  //获取已销毁
          this.destroy_amount = res.data.destroy_amount.split('.')
          this.destroy_amount[1] = this.addSpace(this.destroy_amount[1])
          this.destroy_amount[0]=this.addComma(this.destroy_amount[0]);
        })
        api.LinearReleasePool({account_name:this.account_name}).then(res => { //获取释放池数据
          if (res.code === 1) {
            this.balance_info = res.data.balance_info;
          }
        })
        api.effectiveAssets({account_name:this.account_name}).then(res => {    //获取当前有效资产包
          if (res.code === 1) {
          this.mined_amount = res.data.mined_amount.split('.');
          this.mined_amount[1] = this.addSpace(this.mined_amount[1]);
          this.mined_amount[1] = this.mined_amount[1].split(' ');
          }
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
            res.data.account_type=="global"?this.isGlobal=true:this.isGlobal=false;
          }
        })
        this.availableQuantity();     //可售数量

        this.$nextTick(() => {
          // this.tbgbarlistener = setInterval(() => {
          //   console.log(this.$refs.tbgbar.offsetTop, this.$refs.page.scrollTop)
          // }, 1000)
          window.addEventListener('scroll', this.setTbgBarFixed, true)
        })
    },
    beforeDestroy() {
      clearInterval(this._binggotimer);
      window.removeEventListener('scroll',this.setTbgBarFixed, true)
    },
    methods: {
      setTbgBarFixed () {
        let barClientTop = this.$refs.barFixedRefer.getBoundingClientRect().top
        if (barClientTop < 0 && !this.tbgbarFixed) {
          this.tbgbarFixed = true
        }
        if (barClientTop >=  0 && this.tbgbarFixed) {
          this.tbgbarFixed = false
        }
      },
      switchData (id) {
        this.$refs[`slt-${id}`].classList.toggle('select-toggle')
      },
      addSpace (str) { //修改已销毁数据
        return str.slice(0,str.length-4) + " " +str.slice(-4)
      },
      addComma(data){  //修改已销毁数据
        var a=data;var b='';var c=a.length+1;
          for(var i=0;c/3>i;i++){
            if(a.length>3){
              b=','+a.slice(a.length-3,a.length)+b;
              a=a.slice(0,a.length-3);
            }else{
              b=a+b;
            }
          }
          return b;
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
            this.Balance = res.data.saleable_amount.split('.');
            this.Balance[1] = this.addSpace(this.Balance[1]);
            this.Balance[1] = this.Balance[1].split(' ');
          }})
        api.SaleableAmount({account_name:this.account_name}).then(res => {
          if (res.code === 1) {
            this.Amount = res.data.saleable_balance.split('.');
            this.Amount[1] = this.addSpace(this.Amount[1]);
            this.Amount[1] = this.Amount[1].split(' ');
          }}).then(() =>{
          (this.Balance[0]+'.'+this.Balance[1][0]+this.Balance[1][1])>(this.Amount[0]+'.'+this.Amount[1][0]+this.Amount[1][1])?this.Quantity=this.Amount:this.Quantity=this.Balance;
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
            buySell: false,
            Quantity:this.Quantity,
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
          const current = wallets.find(ele => ele.accountNames[0] === this.account_name );
          const privateKey = CryptoAES.decrypt(current.privateKey,seed);
          return privateKey
          // return '5KNoQXeFJp47dbtyifcCjJuhXjYmNvWPVcWYsHJJWZ8h7zAd78h';
        },
        async clickConfirm() {   //显示密码
              this.actionSheetVisible = true;
        },
        async goPay(privateKey) {
          if (privateKey) {
            this.showDialog = false
            try {
              const config = await this.getConfig();
              console.log(3333333333333,config);
              console.log(44444444444444,privateKey);
              const opts = { authorization:[`${this.account_name }@active`], keyProvider: privateKey }
              // await eos.transfer(this.reqParams.account, config.wallet_receiver, `100.0000 UE`, `tbg_invest:${this.reqParams.account}`, opts)
              const adm = await eos.contract('uetokencoin')
              // account_name,price,trx_type,assets_package_id ==> fb,0.5,raise,4
              const trx = await adm.transfer(this.account_name , config.wallet_receiver, `100.0000 UE`, `tbg_invest:${this.account_name }`, opts)
              this.is_active()
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
        is_active () {
          api.isActive({
            account_name: this.account_name
          }).then(res => {
            switch(res.data.is_activated){
              case 0:
                this.atv_text = '未激活';this.subAccountQuantity=false;this.account_activation=false;break;
              case 10:
                this.atv_text = '已激活';this.subAccountQuantity=true;this.account_activation=true;break;
              case 20:
                this.atv_text = '已激活';this.subAccountQuantity=false;this.account_activation=true;break;
              case 30:
                this.subAccountQuantity=true;this.account_activation=true;break;
            }
          })
        },
        async getConfig() {
          try {
            const res = await serverApi.getConfig()
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
       jumplevel(){
         this.$router.push({
           name:'level'
         })
       }
    },
}
</script>

<style scoped>
.scrollView {
  width: 100%;
  height: 100%;
}
  .wrap{
    /* background: rgb(228, 147, 147); */
    padding-bottom: 2.6rem;
}
.head-info{
    padding-top: constant(safe-area-inset-top);
    padding-right: constant(safe-area-inset-right);
    padding-left: constant(safe-area-inset-left);
    padding-top: env(safe-area-inset-top);
    padding-right: env(safe-area-inset-right);
    padding-left: env(safe-area-inset-left);
}
.head-user {
    padding: .5rem;
}
.head-user>.head-user_avatar{
    width: .9rem;
    border-radius: 50%;
    margin-right: .3rem;
}
.head-user>span:nth-of-type(1){
    font-size: .4rem;
    font-weight: bold;
    margin-right: .2rem;
}
.head-user>span:nth-of-type(2){
    font-size: .3rem;

}
.head-user>.head-user_arrow {
    width: .4rem;
    transform: rotate(-90deg);
}
.head-serve {
    margin-right: .5rem;
    width: .7rem;
}

.font_B{
  font-weight: bold;
  font-family: "Bahnschrift Regular", Bahnschrift;
}
/* banner */
.banner-wrap {
    width: 100vw;
}
.banner {
    background: url('../../assets//invitation2/banner-bg.png') no-repeat;
    width: 90vw;
    height: 54vw;
    background-size: 100% 100%;
    font-family: 'Bahnschrift Regular', 'Bahnschrift';
    box-shadow: 0 .1rem .4rem rgba(30, 76, 155, 0.877);
    border-radius: .6rem;
    padding: .3rem 0;
    box-sizing: border-box;
}
.banner>.top {
    color: aliceblue;
}
.top_logo {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: .2rem;
    background-color: #fff;
    margin-right: .4rem;
}
.top_logo>img {
    width: 100%;
}
.top_right>span:nth-of-type(1) {
    color: rgba(255, 255, 255, 0.692);
}
.top_right>span:nth-of-type(2) {
    font-size: .4rem;
    margin-top: .15rem;
}

.destroyed{
    font-family: 'Bahnschrift Regular';
    font-size:0.45rem;
    color: #fff;
}
.destroyed>*{
    margin-right: .2rem;
}
.destroyed_txt{
    font-weight: bold;
    font-size: .52rem;
}
.destroyed_txt1{
    color: #FF9900;
}
.destroyed_txt2{
    color: #fff;
}
.destroyed_txt3{
    color:#BCBCBC;
}

.banner-detail_btn{
    line-height: 2.2em;
    font-size: .35rem;
    padding: 0 .5rem;
    border-radius: 1em;
    color: rgb(30, 76, 155);
    background: #fff;
    font-weight: bold;
}

/* games */
.games {
}
.section-head {
    padding: .5rem;
}
.section-head>span:nth-of-type(1) {
    font-size: .6rem;
}
.section-head>span:nth-of-type(2) {
    color: #1D4997;
}
.games-bar{
    position: relative;
    width: 100%;
    height: 3rem;
    box-sizing: border-box;
    /* padding-left: .5rem; */
    overflow: hidden;
}

.games_group{
    position: absolute;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    box-sizing: content-box;
    /* padding: 0 .5rem; */
}
.games_group_inner{
    display: flex;
    justify-content: space-between;
    height: 100%;
    width: auto;
    padding: 0 2rem 0 .5rem;
    box-sizing: content-box;
}
.games_item_wrap {
    flex-shrink: 0;
    flex-basis: 1.8rem;
    margin-right: .4rem;
    position: relative;
}
.games_item_wrap img{
    width: 1.8rem;
    height: 1.8rem;
    box-shadow: 0 .2rem .2rem rgba(156, 156, 156, 0.267);
    border-radius: .15rem;
}
.games_item_wrap>span{
    display: inline-block;
    text-align: center;
    font-size: .3rem;
    color: rgba(0, 0, 0, 0.795);
    bottom: -.3rem;
    white-space: nowrap;
    width: 100%;
    margin-top: .25rem;
}


/* broadcast */
.broadcast-wrap {
    padding: .5rem;
}
.broadcast {
    padding: .4rem;
    border-radius: .3rem;
    background-color: #fff;
}
.broadcast>span {
    color: #1D4997;
    font-size: .3rem;
}
.broadcast_img {
    width: .8rem;
    margin-right: .4rem;
}
.broadcast_info {
    font-size: .5rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-right: .4rem;
    color: rgba(0, 0, 0, 0.514);
    /* max-width: 45%; */
    flex: 1;
}

/* myteam */
.team-select{
    padding: .5rem;
}
.team-select>.left{
    margin-right: .4rem;
    box-shadow: 0 0 .2rem rgba(236,90,91,.8);
    background: linear-gradient(to right,rgba(236,90,91,.8),rgb(236,90,91));
}
.team-select>.right{
    box-shadow: 0 0 .2rem rgb(37, 85, 162);
    background: linear-gradient(to right,rgb(62, 114, 198) ,rgb(37, 85, 162));
}
.team-select>.left, .team-select>.right{
    border-radius: .2rem;
    flex: 1;
    padding: .7rem 0 .7rem .6rem;
    font-size: .35rem;
    color: rgba(255, 255, 255, 0.925);
}
.team-select>.left>img, .team-select>.right>img{
    width: .8rem;
    margin-right: .3rem;
}

/* TBG-select-bar */
.tag-page {
    border-top-left-radius: .5rem;
    border-top-right-radius: .5rem;
    background-color: #fff;
}
.tbg-bar-wrap {
    padding: .3rem .5rem;
}
.tbg-bar-wrap.fixedActive {
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    background: #fff;
    z-index: 9999;
}
.tbg-bar{
    display: flex;
}
.tbg-bar_item {
    margin-right: 1.2rem;
    text-align: center;
    line-height: 1.3rem;
    position: relative;
    font-size: .45rem;
    color: #BCBCBC;
    transition: all .3s;
}
.tbg-bar_item::after {
    position: absolute;
    content: '';
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: .4rem;
    height: .15rem;
    border-radius: .08rem;
}
.tbg-bar>.active{
    font-size: .6rem;
    color: rgb(29, 29, 29);
}
.tbg-bar>.active::after{
    background: #1D4997;
}

/* TBG */
.section2-head {
    padding: .5rem;
}
.section2-head>span:nth-of-type(1) {
    font-size: .45rem;
    font-weight: bold;
}
.section2-head>span:nth-of-type(2) {
    color: #1D4997;
}
.common-box {
    padding: .4rem .3rem;
    background: rgb(248, 249, 255);
    border-radius: .3rem;
    box-sizing: border-box；
}
.common-wrap {
    padding: .5rem;
}

/* child-account */
.account_item_left,.account_item_right {
    width: 1.8rem;
}
.account_item_left > p,.account_item_right > p {
    text-align: center;
    padding: .2rem 0;
}
.account_item_left>.acc-img_wrap::after{
    box-shadow: 0 .2rem .4rem rgba(236,90,91,.8);
}
.account_item_right>.acc-img_wrap::after {
    box-shadow: 0 .2rem .4rem #1D4997;
}
.acc-img_wrap,.acc-img_wrap {
    width: 100%;
    position: relative;
    z-index: 1;
}
.acc-img_wrap::after,.acc-img_wrap::after {
    position: absolute;
    content: '';
    z-index: -1;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    transform: translate(-50%,-50%);
    left: 50%;
    top: 50%;
}
.acc-img_wrap>img,.acc-img_wrap>img {
    width: 100%;
}
.child-acc_amount {
    position: absolute;
    background: #FF9900;
    border-radius: 50%;
    width: .6rem;
    height: .6rem;
    top: 0;
    right: -.2rem;
    border: .05rem solid #fff;
    color: #fff;
    font-weight: bold;
    box-shadow: 0 0 .2rem #BCBCBC;
    text-align: center;
    line-height: .6rem;
}

/* intro */
.intro>.left{
    width: 1.8rem;
    background: #fff;
    padding: .2rem 0;
    border-radius: .3rem;
    margin-right: .4rem;
}
.intro>.left>img{
    width: 100%;
}
.intro>.right{
    flex: 1;
    font-size: .4rem;
    color: rgb(100, 100, 100);
}

/* income */
.common-number{
    font-size: .5rem;
    color: rgb(236,90,91);
}

 /* 奖金和保障 */
.ensure_content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 0;
}
.ensure_content_inner {
    width: 32%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: .3rem 0;
    margin: .3rem 0;
    position: relative;
}
.ensure_content>div:nth-child(2)::after,
.ensure_content>div:nth-child(2)::before,
.ensure_content>div:nth-child(5)::before,
.ensure_content>div:nth-child(5)::after{
    position: absolute;
    content: '';
    width: .03rem;
    height: 50%;
    top: 50%;
    transform: translateY(-50%);
    background-color: #BCBCBC;
}
.ensure_content>div:nth-child(2)::before,
.ensure_content>div:nth-child(5)::before{
    left: -.02rem;
}
.ensure_content>div:nth-child(2)::after,
.ensure_content>div:nth-child(5)::after{
    right: -.02rem;
}
.ensure_content>div:nth-child(n+4) .mid {
    color: rgb(41, 41, 41);
}
.ensure_content_inner>.top{
    font-size: .3rem;
    color: rgb(109, 109, 109);
    font-weight: 400;
    line-height: 1.4em;
    height: 2.8em;
    padding: 0 .3rem;
    text-align: center;
}
.ensure_content_inner>.bot {
    font-size: .35rem;
    font-weight: bold;
    line-height: .5rem;
}
.ensure_content_inner>.mid {
    font-size: .45rem;
    color: rgb(236,90,91);
    font-weight: bold;
    padding-bottom: .15rem;
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

/* 分配 */
.distribution_content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}
.distribution_content_inner {
    flex: 1 45%;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0px 1px 10px rgba(201, 201, 201, 0.349019607843137);
    margin: .2rem .2rem;
    background: rgb(248, 249, 255);
    border-radius: .3rem;
    padding: .4rem 0;
}
.distribution_content_inner>.top{
    color: rgb(73, 73, 73);
}
.distribution_content_inner>.bot {
    font-size: .37rem;
    color: #0D0D0D;
    font-weight: bold;
}
.distribution_content_inner>.mid {
    font-size: .5rem;
    padding: .2rem 0;
    font-weight: bold;
    /* color: #FF9900; */
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
    background-color: rgb(248, 249, 255);
    border-radius: .3rem;
    margin: .2rem;
  }
  .exchange-left>span:nth-of-type(2){
    color: rgb(236,90,91);
  }
  .exchange-right{
    flex-grow: 1;
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
      border-radius: .2rem;
      height: 1.2rem;
      width: auto;
      display: flex;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-items: center;
      padding-left: 1rem;
      margin: .15rem .15rem;
      box-sizing: border-box;
      background-color: rgb(248, 249, 255);
  }

/* 矿产资源包 */
.resource>img{
    width: 3rem;
}
.resource-info{
    flex: 1;
}
.resource-info>p:nth-of-type(1){
    font-size: .6rem;
    font-weight: bold;
}
.resource-info>p:nth-of-type(2){
    color: rgb(236,90,91);
    font-weight: bold;
    font-size: .5rem;
}
.resource-info>p:nth-of-type(2)>span{
    color: #FF9900;
}

/* 可售池 */
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

/* common style */
.jc_sb-al_c {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.jc_sa-al_c {
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.jc_c-al_c {
    display: flex;
    justify-content: center;
    align-items: center;
}
.al_c{
    display: flex;
    align-items: center;
}
.fd_cln {
    display: flex;
    flex-direction: column;
}
.flx_default {
    display: flex;
    align-items: center;
}

</style>
