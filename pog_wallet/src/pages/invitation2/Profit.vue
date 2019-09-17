<template>
  <vpage>
    <slot>
        <div>

        </div>
        <v-ons-carousel fullscreen swipeable auto-scroll overscrollable
      :index.sync="tag"
    >
      <v-ons-carousel-item>
          1
      </v-ons-carousel-item>
      2
      <v-ons-carousel-item>
      </v-ons-carousel-item>
    </v-ons-carousel>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import { format, parse } from 'date-fns'
import { incomeReferrer,incomeMode,incomeSort,incomeOther } from '@/servers/invitation';

export default {
  components: {
    vpage: MyPage
  },
  data() {
    return {
        tag:0
    }
  },
  created() {
    // this.incomeReferrer()
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

</style>
