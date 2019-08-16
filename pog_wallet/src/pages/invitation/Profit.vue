<template>
  <vpage>
    <slot>
      <div class="layout">
        <div class="fix_layout">
          <div class="header">
            <img src="@/assets/img/u14.png" @click="back">
            <span>收益</span>
          </div>
          <div class="total_profit">
            <div class="label">总收益</div>
            <div class="amount">{{profitTotal.front}} &nbsp; <span style="color:gray;">{{profitTotal.end}}</span> </div>
            <div class="label">EOS</div>
          </div>
        </div>
        <div class="scroll_layout">
          <div class="swiper_tab">
            <div class="tab_item" :class="index === 0 ? 'selected':''">
              <div>直接推荐收益</div>
              <div>{{profitStraight.front}}</div>
              <div class="last" :style="{color: index === 0 ? '#ff8e05':'gray'}">{{profitStraight.end}}</div>
            </div>
            <div class="tab_item" :class="index === 1 ? 'selected':''">
              <div>三三静态收益</div>
              <div>{{profitThree.front}}</div>
              <div class="last" :style="{color: index === 1 ? '#ff8e05':'gray'}">{{profitThree.end}}</div>
            </div>
            <div class="tab_item" :class="index === 2 ? 'selected':''">
              <div>一条静态收益</div>
              <div>{{profitOne.front}}</div>
              <div class="last" :style="{color: index === 2 ? '#ff8e05':'gray'}">{{profitOne.end}}</div>
            </div>
            <div class="tab_item" :class="index === 3 ? 'selected':''">
              <div>其他收益</div>
              <div>{{profitOther.front}}</div>
              <div class="last" :style="{color: index === 3 ? '#ff8e05':'gray'}">{{profitOther.end}}</div>
            </div>
          </div>

          <swiper class="swiper_layout" :show-dots="false" v-model="index">
            <swiper-item class="profit_item">
              <div class="space_around">
                <div>时间</div>
                <div>推荐账号</div>
                <div>收益</div>
              </div>
              <div v-if="listStraight.length">
                <div class="space_around item_detail" v-for="item in listStraight">
                  <div>
                    <div>{{item.create_time.split(' ')[0]}}</div>
                    <div>{{item.create_time.split(' ')[1]}}</div>
                  </div>
                  <div>{{item.invite_account}}</div>
                  <div>{{item.front}} <span style="color:gray;">{{item.end}}</span> </div>
                </div>
              </div>
              <div class="no_record" v-else>暂无收益记录</div>
            </swiper-item>
            <swiper-item class="profit_item">
              <div class="space_around">
                <div>时间</div>
                <div>收益子账号</div>
                <div>收益向下层数</div>
                <div>收益</div>
              </div>
              <div v-if="listThree.length">
                <div class="space_around item_detail" v-for="item in listThree">
                  <div>
                    <div>{{item.create_time.split(' ')[0]}}</div>
                    <div>{{item.create_time.split(' ')[1]}}</div>
                  </div>
                  <div>{{item.sub_account}}</div>
                  <div>{{item.sub_level}}</div>
                  <div>{{item.front}} <span style="color:gray;">{{item.end}}</span> </div>
                </div>
              </div>
              <div class="no_record" v-else>暂无收益记录</div>
            </swiper-item>
            <swiper-item class="profit_item">
              <div class="space_around">
                <div>时间</div>
                <div>收益子账号</div>
                <div>收益</div>
              </div>
              <div v-if="listOne.length">
                <div class="space_around item_detail" v-for="item in listOne">
                  <div>
                    <div>{{item.create_time.split(' ')[0]}}</div>
                    <div>{{item.create_time.split(' ')[1]}}</div>
                  </div>
                  <div>{{item.sub_account}}</div>
                  <div>{{item.front}} <span style="color:gray;">{{item.end}}</span> </div>
                </div>
              </div>
              <div class="no_record" v-else>暂无收益记录</div>
            </swiper-item>
            <swiper-item class="profit_item">
              <div class="space_around">
                <div>时间</div>
                <div>详情</div>
                <div>收益</div>
              </div>
              <div v-if="listOther.length">
                <div class="space_around item_detail" v-for="item in listOther">
                  <div>
                    <div>{{item.create_time.split(' ')[0]}}</div>
                    <div>{{item.create_time.split(' ')[1]}}</div>
                  </div>
                  <div>{{item.info}}</div>
                  <div>{{item.front}} <span style="color:gray;">{{item.end}}</span> </div>
                </div>
              </div>
              <div class="no_record" v-else>暂无收益记录</div>
            </swiper-item>
          </swiper>
        </div>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import swiper from './swiper.vue'
import swiperItem from './swiper-item'
import { format, parse } from 'date-fns'
import { incomeReferrer,incomeMode,incomeSort,incomeOther } from '@/servers/invitation';

export default {
  components: {
    vpage: MyPage,
    swiper,
    swiperItem
  },
  data() {
    return {
      index: 0,
      profitTotal: {
        front: '',
        end: ''
      },
      profitStraight: {
        front: '',
        end: ''
      },
      profitThree: {
        front: '',
        end: ''
      },
      profitOne: {
        front: '',
        end: ''
      },
      profitOther: {
        front: '',
        end: ''
      },
      listStraight: [],
      listThree: [],
      listOne: [],
      listOther: [],
    }
  },
  created() {
    this.incomeReferrer()
  },
  watch: {
    index(val) {
      console.log(val)
      switch (val) {
        case 0:
          this.incomeReferrer()
          break;
        case 1:
          this.incomeMode()
          break;
        case 2:
          this.incomeSort()
          break;
        case 3:
          this.incomeOther()
          break;
      
        default:
          break;
      }
    }
  },
  methods: {
    incomeOther() {
      incomeOther({account_name: this.$route.query.account}).then(res => {
        console.log(res)
        if (res.code === 1) {
          const detail = res.data.detail
          this.listOther = []
          for (const item of detail) {
            const income_arr = item.income.split('.')
            this.listOther.push({
              create_time: format(this.convertUTCDateToLocalDate(new Date(item.create_time)), 'YYYY-MM-DD HH:mm:ss'),
              front: income_arr[0] + '.' + income_arr[1].substr(0,4),
              end: income_arr[1].substr(4),
              info: item.info
            })
          }
        }
      })
    },
    incomeSort() {
      incomeSort({account_name: this.$route.query.account}).then(res => {
        console.log(res)
        if (res.code === 1) {
          const detail = res.data.detail
          this.listOne = []
          for (const item of detail) {
            const income_arr = item.income.split('.')
            this.listOne.push({
              create_time: format(this.convertUTCDateToLocalDate(new Date(item.create_time)), 'YYYY-MM-DD HH:mm:ss'),
              front: income_arr[0] + '.' + income_arr[1].substr(0,4),
              end: income_arr[1].substr(4),
              sub_account: item.sub_account
            })
          }
        }
      })
    },
    incomeMode() {
      incomeMode({account_name: this.$route.query.account}).then(res => {
        console.log(res)
        if (res.code === 1) {
          const detail = res.data.detail
          this.listThree = []
          for (const item of detail) {
            const income_arr = item.income.split('.')
            this.listThree.push({
              create_time: format(this.convertUTCDateToLocalDate(new Date(item.create_time)), 'YYYY-MM-DD HH:mm:ss'),
              front: income_arr[0] + '.' + income_arr[1].substr(0,4),
              end: income_arr[1].substr(4),
              sub_account: item.sub_account,
              sub_level: item.sub_level
            })
          }
        }
      })
    },
    incomeReferrer() {
      incomeReferrer({account_name: this.$route.query.account}).then(res => {
        console.log(res)
        if (res.code === 1) {
          const total_income = res.data.total_income
          const refer_income = res.data.refer_income
          const mode_income = res.data.mode_income
          const sort_income = res.data.sort_income
          const other_income = res.data.other_income
          const total_arr = total_income.split('.')
          const refer_arr = refer_income.split('.')
          const mode_arr = mode_income.split('.')
          const sort_arr = sort_income.split('.')
          const other_arr = other_income.split('.')
          this.profitTotal.front = total_arr[0] + '.' + total_arr[1].substr(0,4)
          this.profitTotal.end = total_arr[1].substr(4)
          this.profitStraight.front = refer_arr[0] + '.' + refer_arr[1].substr(0,4)
          this.profitStraight.end = refer_arr[1].substr(4)
          this.profitThree.front = mode_arr[0] + '.' + mode_arr[1].substr(0,4)
          this.profitThree.end = mode_arr[1].substr(4)
          this.profitOne.front = sort_arr[0] + '.' + sort_arr[1].substr(0,4)
          this.profitOne.end = sort_arr[1].substr(4)
          this.profitOther.front = other_arr[0] + '.' + other_arr[1].substr(0,4)
          this.profitOther.end = other_arr[1].substr(4)
          const detail = res.data.detail
          this.listStraight = []
          for (const item of detail) {
            const income_arr = item.income.split('.')
            this.listStraight.push({
              create_time: format(this.convertUTCDateToLocalDate(new Date(item.create_time)), 'YYYY-MM-DD HH:mm:ss'),
              front: income_arr[0] + '.' + income_arr[1].substr(0,4),
              end: income_arr[1].substr(4),
              invite_account: item.invite_account
            })
          }
        }
      })
    },
    convertUTCDateToLocalDate(date) {
      // let newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
      let newDate = date

      let offset = date.getTimezoneOffset() / 60;
      let hours = date.getHours();

      newDate.setHours(hours - offset);

      return newDate;   
    },
    back() {
      this.$router.go(-1)
    }
  },
}
</script>

<style scoped>
.layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}
.scroll_layout {
  flex: 1;
  display: flex;
  flex-direction: column;
}
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
.total_profit {
  padding: 30px 0;
  text-align: center;
  line-height: 1.5;
}
.total_profit .label {
  font-size: 35px;
}
.total_profit .amount {
  font-size: 50px;
}
.swiper_tab {
  display: flex;
  border-top: 1PX solid #ececec;
  border-bottom: 1PX solid #ececec;
  padding-top: 20px;
}
.tab_item {
  flex: 1;
  text-align: center;
  font-size: 27px;
  line-height: 1.5;
}
.tab_item .last {
  font-size: 24px;
  /* color: gray; */
  line-height: 1;
}
.selected {
  color: #ff8e05;
  border-bottom: 1PX solid #ff8e05;
}
.swiper_layout {
  flex: 1;
  text-align: center;
}
.space_around {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 20px 0;
  font-size: 28px;
}
.item_detail:nth-child(odd) {
  background-color: #f9f9f9;
}
.profit_item {
  overflow: scroll;
}
.no_record {
  margin-top: 10vh;
  font-size: 28px;
  color: gray;
}
</style>
