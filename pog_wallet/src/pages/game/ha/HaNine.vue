<template>
    <vpage >
     <slot>
       <div style="background-color: rgb(123,30,30);height:100%;width:100%;">
        <div class="head">
          <div class="float_left box"><p class="p_white" style="text-align: left;">Ha</p><p class="p_white" style="text-align: right;line-height: .2rem;">999</p></div>
          <p class="float_left" style="font-size: .5rem;color: #FFFFFF;margin: 0.45rem 0 .45rem 0;font-weight: 700;">Ha999</p>
          <div class="float_right" style="width: 3rem;height: 1rem;border: 1px solid rgb(204,51,51);margin: .25rem .6rem .25rem 0;border-radius: 6px;">
            <div class="display_ib" style="width: 49.5%;height: 100%;"></div>
            <div class="display_ib" style="width: 1%;height: 70%;background: rgb(204,51,51);vertical-align: super;"></div>
            <div class="display_ib" style="width: 49.5%;height: 100%;"></div>
          </div>
        </div>
        <div style=" width: 100%;height: 6.4rem;background: rgb(204,51,51);margin:0 0 14px 0;">
          <div style="width:80%;margin:0 5%;" v-for="item in items" :key='item.key'>
            <p style="font-size: .42rem; line-height: .64rem;color: #363636;">{{item.num}}</p>
          </div>
        </div>
        <div style="height: .9rem;margin:0 5% 12px 5%;">
           <div class="display_ib" style="width: .9rem;height: .9rem;background:rgb(204,51,51);border-radius: 50%;"></div>
           <div class="display_ib" style="height:100%;width:3.7rem;vertical-align: bottom;margin-left: .3rem;vertical-align: top;">
             <p class="font_white" style="font-size:.5rem;margin-top:.05rem;">175,939 EOS</p>
             </div>
           <div class="display_ib" style="width: 4rem;height: .8rem;border: 1px solid rgb(204,51,51);border-radius: 6px;vertical-align: top;text-align: center;position: relative;">
             <div style="background: rgb(204,51,51);width: 30%;height: 100%;position: absolute;"></div>
             <p class="font_white" style="font-size:.35rem;position: absolute;margin: .13rem 0 0 .3rem;">最大可下注 100 EOS</p>
           </div>
        </div>
        <div style="width: 90%;height: 1.2rem;border: 1px solid rgb(204, 51, 51);border-radius: 6px;margin: 0 auto;">
          <div class="display_ib"><p>可赢奖金</p><p>1.2860</p></div>
          <div class="display_ib"></div>
          <div class="display_ib"><p>可赢奖金</p><p>1.2860</p></div>
          <div class="display_ib"></div>
          <div class="display_ib"><p>可赢奖金</p><p>1.2860</p></div>
        </div>
        
          
      <v-ons-list-item>
        <div class="center">

          <v-ons-select style="width: 40%"
            v-model="selectedItem"
          >
            <option v-for="item in items" :value="item.value" :key='item.key'>
              {{ item.num }}
            </option>
          </v-ons-select>

        </div>
      </v-ons-list-item>
      
       
       </div>
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
              {num:111111111111111111111,key:1},
              {num:111111111111111111111,key:2},
              {num:111111111111111111111,key:3},
              {num:111111111111111111111,key:4},
              {num:111111111111111111111,key:5},
              {num:111111111111111111111,key:6},
              {num:111111111111111111111,key:7},
              {num:111111111111111111111,key:8},
              {num:111111111111111111111,key:9},
              {num:111111111111111111111,key:10},  
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
  clear: both;
}
.box{
  background: rgb(204,51,51);
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
    font-size: 0.43rem;
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
.font_white{
  color: #FFFFFF;
}
p{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
}   
span{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
}   
   

</style>