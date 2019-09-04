<template>
    <vpage style="background-color: rgb(242,242,242);">
     <slot>
       <div class="head">
         <div class="float_left box"><p class="p_white">Free</p><p class="p_white">OTC</p></div>
         <p class="float_left" style="font-size: .5rem;color: #5E5E5E;margin: 0.45rem 0 .45rem 0;">Free.OTC</p>
         <div class="float_right" style="width: 3rem;height: 1rem;border: 1px solid rgb(188,188,188);margin: .25rem .6rem .25rem 0;border-radius: 6px;">
           <div class="display_ib" style="width: 49.5%;height: 100%;"></div>
           <div class="display_ib" style="width: 1%;height: 70%;background: rgb(188, 188, 188);vertical-align: super;"></div>
           <div class="display_ib" style="width: 49.5%;height: 100%;"></div>
         </div>
       </div>
       <div style=" width: 94%;height: 1.2rem;margin: .2rem 3%;">
         <div class="display_ib" style="width: 49%;height: 100%;margin-right:2%;background: #fff;border-radius: 6px;text-align: center;">
           <p style="line-height: 1.2rem;font-size: .5rem;color: #868686;">我要买 UE</p>
           </div>
         <div class="display_ib" style="width: 49%;height: 100%;background: #fff;border-radius: 6px;text-align: center;">
           <p style="line-height: 1.2rem;font-size: .5rem;color: #868686;">我要卖 UE</p>
           </div>
       </div>
       <!-- <div class="" v-for="item in items" :key='item.key'> --> 
          <div class="otc_data">
            <div class="otc_data_left float_left" style="">
              <div><p class="font_b" style="font-size: .7rem;color: #000000;">amin2252255</p></div>
              <div><span style="font-size: .42rem;color: #6B6B6B;">限额：</span><span class="font_b" style="font-size: .42rem;color: #6B6B6B;">￥1,000-￥9,226</span></div>
              <div><span style="font-size: .42rem;color: #6B6B6B;">数量：</span><span class="font_b" style="font-size: .42rem;color: #6B6B6B;">1,290.3625 UE</span></div>
            </div>
            <div class="otc_data_right float_right" style="">
              <div><p class="font_b" style="font-size: .4rem;color: #6B6B6B;text-align: right;">2430&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;99%</p></div>
              <div><p class="font_b" style="font-size: .8rem;color: #24C6DC;text-align: right;">￥7.15</p></div>
              <div>
                <div class="display_ib" style="width:.7rem;height:.6rem;background-color: rgba(255, 153, 0, 1);margin-right:.2rem;"><p style="font-size: .4rem;color: #FFFFFF;text-align: center;">银</p></div>
                <div class="display_ib" style="width:.7rem;height:.6rem;background-color: rgba(0, 153, 204, 1);margin-right:.2rem;"><p style="font-size: .4rem;color: #FFFFFF;text-align: center;">支</p></div>
                <div class="display_ib" style="width:.7rem;height:.6rem;background-color: rgba(0, 204, 153, 1);margin-right:.2rem;"><p style="font-size: .4rem;color: #FFFFFF;text-align: center;">微</p></div>
              </div>
            </div>
          </div>
         <!-- </div> -->

       <div style="width: 100%;height: 60px;"></div>
     </slot>
    </vpage>
    
</template>

<script>
import MyPage from '@/components/MyPage'

export default {
  components: {
    vpage: MyPage,
   },
  data() {
    return {
      log:true,
      items:[
                  // {amount:1,per_hour_mining:1,mining_time:1,mining_income:1,mining_id:1},
            
      ],   
    }
  },
  methods: {
       back() {
          this.$router.go(-1)
       },
  },
  created(){
    // console.log('this',this);
   
  }
}
</script>

<style scoped>
.head{
  width: 100%;
  height:1.6rem;
  background: rgb(228,228,228);
  clear: both;
}
.box{
  background: rgb(43,198,220);
  margin: 0 auto;
  width: .9rem;
  height:.9rem;
  margin:0.35rem 0.30rem .35rem 0.6rem;
  border-radius: 6px;
}
.p_white{
    font-family: 'Poiret One Bold', 'Poiret One Regular', 'Poiret One';
    font-weight: 700;
    font-style: normal;
    font-size: 0.18rem;
    color: #FFFFFF;
    text-align: center;
}
.otc_data{
  width: 94%;
  height: 2.8rem;
  margin:0 3% .2rem 3%;
  background: #fff;
  border-radius: 6px;
  clear: both;
}
.otc_data_left{
  margin: .2rem 0 0 .4rem;
}
.otc_data_right{
  margin: .2rem .3rem 0 0;
}





/* div{
  background: #fff;
} */

.float_left{
  float: left;  
}
.float_right{
  float: right;
}
.font_b{
  font-family: 'Bahnschrift Regular', 'Bahnschrift';
}
.display_ib{
  display: inline-block;
}
p{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
}   
span{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
}   
   

</style>