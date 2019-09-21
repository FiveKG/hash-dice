<template>
  <vpage>
    <slot>
			<div class="header">
				<img @click="back" src="../../assets/profit-left-arrow.png" alt="">
				<span>收益</span>
			</div>
			<div class="total-income">
				<div @click="handleCollectIncome('all')" class="total-income_btn">
					<span>总收益</span>
					<span>{{total_income}} UE</span>
					<div :class="{'flow_breath':!isCollectiong}" class="flow flow_outer"></div>
					<div :class="{'flow_breath':!isCollectiong}" class="flow flow_inner"></div>
				</div>
				<div class="unsettle-income_left">
					<transition name="fade-to-right">
						<div @click="handleCollectIncome(unsettleIncome[0].income_type)" v-if="unsettleIncome[0]" class="unsettle-income">
							<span>{{unsettleIncome[0].income_name}}</span>
							<div class="income_detail">+ {{unsettleIncome[0].income_detail}}</div>
						</div>
					</transition>
					<transition name="fade-to-right">
						<div @click="handleCollectIncome(unsettleIncome[0].income_type)" v-if="unsettleIncome[1]" class="unsettle-income">
							<span>{{unsettleIncome[1].income_name}}</span>
							<div class="income_detail">+ {{unsettleIncome[1].income_detail}}</div>
						</div>
					</transition>
				</div>
				<div class="unsettle-income_right">
					<transition name="fade-to-left">
						<div @click="handleCollectIncome(unsettleIncome[0].income_type)" v-if="unsettleIncome[2]" class="unsettle-income">
							<span>{{unsettleIncome[2].income_name}}</span>
							<div class="income_detail">+ {{unsettleIncome[2].income_detail}}</div>
						</div>
					</transition>
					<transition name="fade-to-left">
						<div @click="handleCollectIncome(unsettleIncome[0].income_type)" v-if="unsettleIncome[3]" class="unsettle-income">
							<span>{{unsettleIncome[3].income_name}}</span>
							<div class="income_detail">+ {{unsettleIncome[3].income_detail}}</div>
						</div>
					</transition>
				</div>
			</div>
      <div class="tab-wrapper">
        <div
					:class="{'active':key === tabId}"
					class="tab-item"
          v-for="(item, key) in tabGroup"
          :key="key"
          @click="tabId = key"
        >
					<div>{{item.name}}</div>
					<div>{{item.income}}</div>
				</div>
      </div>
      <v-ons-carousel fullscreen swipeable auto-scroll overscrollable :index.sync="tabId">
        <v-ons-carousel-item>
					<div class="income-detail-title">收益详情</div>
					<div class="income-detail-wrapper" v-for="(item, index) in refferIncome.list" :key='index'>
						<div class="detail-left">
							<div class="detail-sub-account">{{item.sub_account?account_name + ' - ' + item.sub_account:account_name}}</div>
							<div class="detail-create-time">{{item.create_time}}</div>
						</div>
						<div class="detail-right detail-number">{{item.front+ ' ' + item.end}}</div>
					</div>
					<div v-if="refferIncome.list && refferIncome.list.length === 0" class="no-data">暂无收益记录</div>
				</v-ons-carousel-item>
        <v-ons-carousel-item>
					<div class="income-detail-title">收益详情</div>
					<div class="income-detail-wrapper" v-for="(item, index) in modeIncome.list" :key='index'>
						<div class="detail-left">
							<div class="detail-sub-account">{{item.sub_account?account_name + ' - ' + item.sub_account:account_name}}</div>
							<div class="detail-create-time">{{item.create_time}}</div>
						</div>
						<div class="detail-right detail-number">{{item.front+ ' ' + item.end}}</div>
					</div>
					<div v-if="modeIncome.list && modeIncome.list.length === 0" class="no-data">暂无收益记录</div>
				</v-ons-carousel-item>
        <v-ons-carousel-item>
					<div class="income-detail-title">收益详情</div>
					<div class="income-detail-wrapper" v-for="(item, index) in sortIncome.list" :key='index'>
						<div class="detail-left">
							<div class="detail-sub-account">{{item.sub_account?account_name + ' - ' + item.sub_account:account_name}}</div>
							<div class="detail-create-time">{{item.create_time}}</div>
						</div>
						<div class="detail-right detail-number">{{item.front+ ' ' + item.end}}</div>
					</div>
					<div v-if="sortIncome.list && sortIncome.list.length === 0" class="no-data">暂无收益记录</div>
				</v-ons-carousel-item>
        <v-ons-carousel-item>
					<div class="income-detail-title">收益详情</div>
					<div class="income-detail-wrapper" v-for="(item, index) in otherIncome.list" :key='index'>
						<div class="detail-left">
							<div class="detail-sub-account">{{item.sub_account?account_name + ' - ' + item.sub_account:account_name}}</div>
							<div class="detail-create-time">{{item.create_time}}</div>
						</div>
						<div class="detail-right detail-number">{{item.front+ ' ' + item.end}}</div>
					</div>
					<div v-if="otherIncome.list && otherIncome.list.length === 0" class="no-data">暂无收益记录</div>
				</v-ons-carousel-item>
      </v-ons-carousel>
    </slot>
  </vpage>
</template>

<script>
import Api from "../../servers/invitation"
import tab from "@/components/tab/tab";
import tabItem from "@/components/tab/tab-item";
import { format, parse } from "date-fns";
import MyPage from '@/components/MyPage'

export default {
  components: {
		vpage:MyPage,
    tab,
    tabItem
  },
  data() {
    return {
      tabId: 0,
			account_name: "",
			refferIncome:{},
			modeIncome:{},
			sortIncome:{},
			otherIncome:{},
			unsettleIncome:[],
			total_income:'',
			isCollectiong: false
    };
  },
  computed: {
    tabGroup() {
      return [
        { name: "直接推荐收益", income: this.refferIncome.refer_income },
        { name: "三三公排收益", income: this.modeIncome.mode_income },
        { name: "一行公排收益", income: this.sortIncome.sort_income },
        { name: "其他收益", income: this.otherIncome.other_income }
      ];
		}
  },
  created() {
    this.account_name = this.$store.state.wallet.assets.account;
		this.initRefer()
		this.initMode()
		this.initSort()
		this.initOther()
		this.initDetail()
  },
  methods: {
		initTotalIncome() {
			Api.incomeReferrer({account_name:this.account_name}).then(res => {
				this.refferIncome = res.data
				this.total_income = res.data.total_income
				this.refferIncome.list = this.refferList()
			});
		},
		initRefer() {
			Api.incomeReferrer({account_name:this.account_name}).then(res => {
				this.refferIncome = res.data
				this.total_income = res.data.total_income
				this.refferIncome.list = this.refferList()
			});
		},
		initMode() {
			Api.incomeMode({account_name:this.account_name}).then(res => {
				this.modeIncome = res.data
				this.total_income = res.data.total_income
				this.modeIncome.list = this.modeList()
			});
		},
		initSort() {
			Api.incomeSort({account_name:this.account_name}).then(res => {
				this.sortIncome = res.data
				this.total_income = res.data.total_income
				this.sortIncome.list = this.sortList()
			});
		},
		initOther() {
			Api.incomeOther({account_name:this.account_name}).then(res => {
				this.otherIncome = res.data
				this.total_income = res.data.total_income
				this.otherIncome.list = this.otherList()
			});
		},
		initDetail() {
			Api.incomeDetail({account_name:this.account_name}).then(res => {
				this.unsettleIncome = this.detailIncome(res.data)
			})
		},
		detailIncome (data) {//收集所有未收集的收益
			let details = []
			data.map(items => {
				items.map(item => {
					details.push({
						income_detail: item.income_detail,
						income_type: item.income_type,
						income_name: this.incomeDetailTransform(item.income_type)
					})
				})
			})
			return details
		},
		incomeDetailTransform (income_type) {//转换类型=>名字
			let type_name = ''
			switch(income_type){
				case "invite":
					type_name = '直接推荐';break;
				case "bingo":
					type_name = 'Bingo奖金';break;
				case "pk":
					type_name = '直接推荐PK奖金';break;
				case "safe":
					type_name = '五倍收益保障金';break;
				case "holder":
					type_name = '股东池分红';break;
				case "game":
					type_name = '游戏推荐奖金';break;
				case "sort":
					type_name = '一条静态';break;
				case "mode":
					type_name = '三三静态';
			}
			return type_name
		},
		refferList() {//初始化直接推荐详情列表
			let list = this.refferIncome.detail.map(item => {
        let income_arr = item.income.split(".");
        return {
					create_time: format(this.convertUTCDateToLocalDate(new Date(item.create_time)), 'YYYY-MM-DD HH:mm:ss'),
					front: income_arr[0] + '.' + income_arr[1].substr(0,4),
					end: income_arr[1].substr(4),
					invite_account: item.invite_account
				};
      });
      return list
    },
    modeList() {//初始化mode详情列表
      let list = this.modeIncome.detail.map(item => {
        let income_arr = item.income.split(".");
        return {
					create_time: format(this.convertUTCDateToLocalDate(new Date(item.create_time)), 'YYYY-MM-DD HH:mm:ss'),
					front: income_arr[0] + '.' + income_arr[1].substr(0,4),
					end: income_arr[1].substr(4),
					sub_account: item.sub_account,
					sub_level: item.sub_level
				};
      });
      return list
    },
    sortList() {//初始化sort详情列表
      let list = this.sortIncome.detail.map(item => {
        let income_arr = item.income.split(".");
        return {
					create_time: format(this.convertUTCDateToLocalDate(new Date(item.create_time)), 'YYYY-MM-DD HH:mm:ss'),
					front: income_arr[0] + '.' + income_arr[1].substr(0,4),
					end: income_arr[1].substr(4),
					sub_account: item.sub_account
				};
      });
      return list
    },
    otherList() {//初始化其他收益详情列表
      let list = this.otherIncome.detail.map(item => {
        let income_arr = item.income.split(".");
        return {
          create_time: format(
            this.convertUTCDateToLocalDate(new Date(item.create_time)),
            "YYYY-MM-DD HH:mm:ss"
          ),
          front: income_arr[0] + "." + income_arr[1].substr(0, 4),
          end: income_arr[1].substr(4),
          info: item.info
        };
      });
      return list;
    },
    convertUTCDateToLocalDate(date) {
      // let newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
      let newDate = date;

      let offset = date.getTimezoneOffset() / 60;
      let hours = date.getHours();

      newDate.setHours(hours - offset);

      return newDate;
		},
		handleCollectIncome (type) {
			if (this.unsettleIncome.length === 0) {
				this.$ons.notification.toast('没有更多收益收取啦',{timeout:1500})
				return
			}
			if (this.isCollectiong) {
				this.$ons.notification.toast('请勿频繁操作',{timeout:1500})
				return
			}
			this.isCollectiong = true
			Api.incomeGain({
				account_name: this.account_name,
				income_type: type
			})
			.then(async res => {
				const task = [this.initDetail()]
				switch (type) {
					case "invite":
						task.push(this.initRefer());break;
					case "mode":
						task.push(this.initMode());break;
					case "sort":
						task.push(this.initSort());break;
					case "all":
						task.push(this.initRefer(),this.initMode(),this.initSort(),this.initOther());break;
					default:
						task.push(this.initOther());
				}
				await Promise.all(task)
				this.isCollectiong = false
			})
		},
    back() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.header{
	padding: .6rem 0;
	position: relative;
	font-size: .6rem;
	color: aliceblue;
	text-align: center;
}
.header>img {
	position: absolute;
	height: .6rem;
	top: 50%;
	left: .5rem;
	transform: translateY(-50%);
}
.header::after{
	position: absolute;
	content: '';
	left: 0;
	top: 0;
	width: 100%;
	height: 10rem;
	background: rgb(83, 89, 237);
	border-radius: 0 0 1.2rem 1.2rem;
	z-index: -3;
}
.total-income{
	padding: 1rem .5rem 1.6rem .5rem;
	position: relative;
}
.total-income_btn{
	width: 25vw;
	height: 25vw;
	background-color: #fff;
	position: relative;
	margin: 0 auto;
	border-radius: 50%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.total-income_btn>span:nth-child(1){
	color: rgb(83, 89, 237);
	font-size: .35rem;

}
.total-income_btn>span:nth-child(2){
	width: 80%;
	color: #000;
	word-break: break-all;
	font-weight: bold;
	font-size: .35rem;
	text-align: center;
	margin: .25rem 0;
}
.flow{
	position: absolute;
	background: rgba(255,255,255,.15);
	border-radius: 50%;
}
.flow_inner{
	width: 120%;
	height: 120%;
}
.flow_outer{
	width: 140%;
	height: 140%;
}
.flow_shrink {
	transition: all .5s;
	transform: scale(.8);
}
.flow_breath{
	animation: breath 3s ease infinite;
}
@keyframes breath {
	0% {
		transform: scale(1);
		opacity: 1;
	}
	10% {
		transform: scale(1);
		opacity: 1;
	}
	60% {
		transform: scale(.95);
		opacity: .5;
	}
	100% {
		transform: scale(1);
		opacity: 1;
	}
}
.unsettle-income_left,.unsettle-income_right{
	position: absolute;
	top: 0;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 0 .5rem .4rem .5rem;
	box-sizing: border-box;
}
.unsettle-income_left{
	left: 0;
}
.unsettle-income_right{
	right: 0;
}
.unsettle-income{
	text-align: center;
}
.unsettle-income>span{
	font-size: .3rem;
	line-height: 1.8em;
	color: #fff;
}
.unsettle-income .income_detail{
	font-size: .3rem;
	background: #fff;
	color: #000;
	padding: .25rem .3rem;
}
.unsettle-income_left>.unsettle-income:nth-of-type(1)>.income_detail{
	border-radius: .3rem .3rem 0 .3rem;
}
.unsettle-income_left>.unsettle-income:nth-of-type(2)>.income_detail{
	border-radius: .3rem 0 .3rem .3rem;
}
.unsettle-income_right>.unsettle-income:nth-of-type(1)>.income_detail{
	border-radius: .3rem .3rem .3rem 0;
}
.unsettle-income_right>.unsettle-income:nth-of-type(2)>.income_detail{
	border-radius: 0 .3rem .3rem .3rem;
}
.tab-wrapper {
	width: 100%;
	margin-top: 1rem;
	white-space: nowrap;
	overflow-x: scroll;
}
.tab-item {
	display: inline-block;
	width: 30vw;
	height: 30vw;
	margin-left: .5rem;
	background: #fff;
	border-radius: .4rem;
	padding: .4rem;
	box-sizing: border-box;
	transition: all .5s;
	white-space: initial;
	word-break: break-all;
	position: relative;
	overflow: hidden;
}
.tab-item::before{
	position: absolute;
	content: '';
	width: 60%;
	height: 60%;
	bottom: 0;
	right: 0;
	transform: translate(50%, 50%);
	border-radius: 50%;
	transition: all .5s;
}
.tab-wrapper>.tab-item:nth-of-type(1)::before{
	background: rgb(236, 86, 90);
}
.tab-wrapper>.tab-item:nth-of-type(2)::before{
	background: rgb(43, 49, 185);
}
.tab-wrapper>.tab-item:nth-of-type(3)::before{
	background-color: rgb(254, 164, 29);
}
.tab-wrapper>.tab-item:nth-of-type(4)::before{
	background-color: #34bc83;
}
.tab-item.active {
	color: #fff;
	background:url('../../assets/profit-tab-active.png') no-repeat;
	background-size: 100% auto;
	background-position-y: bottom;
}
.tab-item.active::before {
	width: 140%;
	height: 140%;
	bottom: 50%;
	right: 50%;
	z-index: -2;
}
.tab-item>div:nth-child(1){
	width: 100%;
	font-size: .3rem;
	opacity: .8;
}
.tab-item>div:nth-child(2){
	width: 100%;
	height: auto;
	font-size: .5rem;
	margin-top: .2rem;
	overflow: hidden;
	font-weight: bold;
	z-index: 11;
}

.income-detail-title{
	font-size: .5rem;
	font-weight: bold;
	padding: .5rem;
}

.income-detail-wrapper{
	padding: .3rem .5rem;
	display: flex;
	width: 100%;
	justify-content: space-between;
	box-sizing: border-box;
	align-items: center;
}
.no-data::after,.no-data::before{
	display: inline-block;
	content: '';
	width: 1.5rem;
	height: .05rem;
	margin: .3rem;
	background: rgba(37, 37, 37, 0.205);
}
.no-data{
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: .4rem;
	color: rgb(37, 37, 37);
}
.detail-left{

}
.detail-sub-account{
	font-size: .4rem;
	margin-bottom: .25rem;
	font-weight: 600;
}
.detail-create-time{
	font-size: .3rem;
	color: rgba(0, 0, 0, 0.507);
}
.detail-number{
	color: rgb(83, 89, 237);
	font-weight: bold;
	font-size: .35rem;
}
.fade-to-right-enter-active,.fade-to-right-leave-active,
.fade-to-left-enter-active,.fade-to-left-leave-active{
	transition: all .5s;
	transform: translateX(0);

}
.fade-to-right-enter,.fade-to-right-leave-to{
	transform: translateX(2rem);
	opacity: 0;
}
.fade-to-left-enter,.fade-to-left-leave-to{
	transform: translateX(-2rem);
	opacity: 0;
}
</style>
