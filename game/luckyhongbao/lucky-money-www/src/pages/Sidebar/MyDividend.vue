<template>
  <div>
    <HeadPart></HeadPart>
    <div class="mydividend">
      <div class="mydividend_a">{{mypool.bonus_amount}}</div>
      <div class="mydividend_b">POG</div>
      <div class="mydividend_b">我的分红总计</div>
      <div class="mydividend_c">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <thead>
            <tr>
              <th width="50%">时间</th>
              <th width="50%">分红额</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in mypool.bonus_log_list">
              <td>{{item.create_time}}</td>
              <td>{{Number(item.change_amount)}}&nbsp;{{item.symbol}}</td>
            </tr>
          </tbody>
        </table>
        <p v-if="mypool.bonus_log_list == ''" style="font-size: 16px;text-align: center;margin: 5px 0px;color: #f8f8f8">暂&nbsp;无&nbsp;记&nbsp;录</p>
        <van-pagination
          v-else
          class="pagin"
          v-model="currentPage"
          :total-items="listTotal"
           @change="changelist"
          mode="simple"
        />
      </div>

    </div>
  </div>

</template>


<script>
  import HeadPart from '@/components/HeadPart/HeadPart';
  import { parse, format } from 'date-fns';
  import { getMyBonus } from '@/servers';
  export default {
    name: 'MyDividend',
    components: {
      HeadPart
    },
    data() {
      return {
        mypool:"",
        currentPage:1,
        listTotal:0,//总条数
      }
    },
    mounted(){
  
      this.myPool()

    },
    created() {


    },
    methods: {
      myPool(val){
        let data = {
          page:val? val : 1
        }
        getMyBonus(data).then(res => {
          if (res.code ==1) {
            for (let i = 0;  i< res.data.bonus_log_list.length; i++) {
            let time = parse(res.data.bonus_log_list[i].create_time);
              time = format(time, "YYYY-MM-DD HH:mm:ss");
              res.data.bonus_log_list[i].create_time = time;
            }
            this.mypool = res.data;
            this.listTotal=res.page_info.total
            console.log("获取我的分红:",res)
          }

          

        }).catch(err =>{
          console.log("获取我的分红失败:",err);
        });
      },
      changelist(val){
        this.myPool(val)
      },

    }
  }
</script>

<style>
  .mydividend{
    padding-top: 10vh;
  }
  .mydividend .mydividend_a{
    text-align: center;
    font-size: 2.5rem;
    color: #ff9900;
    margin-top: 2vh;
  }
  .mydividend .mydividend_b{
    color: white;
    text-align: center;
    padding: 1vh;
  }
  .mydividend .mydividend_c{
    margin: 3vh 0px 12vh 0px;
  }
  .mydividend .mydividend_c table{
    color: #ffeaea;
    font-size: 1rem;
    text-align: center;
    background:#c13939 ;
  }
  .mydividend .mydividend_c table th{
    padding: 1.5vh 0px;
    /*border-bottom:1px solid skyblue ;*/
  }
  .mydividend .mydividend_c table td{
    border-top:2px solid #e84244 ;
    padding: 2vh 0px;
  }


  /* 修改页码 */
  .mydividend_c .pagin{
    margin-top: 10px;
    width:70vw;
    float: right

  }
  .van-pagination--simple .van-pagination__next::after, .van-pagination--simple .van-pagination__prev::after{
    border-width:0px !important
  }
  .mydividend_c .pagin .van-pagination__item{
    background: none !important;
  }
  .mydividend_c .pagin .van-pagination__page-desc{
    color: #323233 !important;
  }
  .van-pagination__item--disabled, .van-pagination__item--disabled:active{
    color: #c8c9cc !important;
  }


</style>













