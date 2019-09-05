<template>
    <vpage >
     <slot>
       <div style="background-color: rgb(40,40,40);height:100%;width:100%;">
        <div class="head" style="background: rgb(27,27,27);">
          <div class="float_left box"><img class="ion_tbg" src="@/assets/invitation2/u3.png"></div>
          <p class="float_left orange" style="font-size: .5rem;margin: 0.45rem 0 .45rem 0;">夺宝</p>
          <div class="float_right" style="width: 3rem;height: 1rem;border: 1px solid rgb(100,100,100);margin: .25rem .6rem .25rem 0;border-radius: 6px;">
            <div class="display_ib" style="width: 49.5%;height: 100%;"></div>
            <div class="display_ib" style="width: 1%;height: 70%;background: rgb(100,100,100);vertical-align: super;"></div>
            <div class="display_ib" style="width: 49.5%;height: 100%;"></div>
          </div>
        </div>
        <!-- <div style=" width: 100%;height: 4.48rem;background: ;margin:0 0 1px 0;">
          <div style="width:80%;margin:0 5%;" v-for="(item,index) in items" :key='index'>
            <p class=" font_four p_A" style="line-height: .64rem;">{{item.num}}</p>
          </div>
        </div> -->
        <!-- 区块滚动 -->
        <Row style="height: 180px;overflow: hidden;">
            <transition-group name="list-complete" style="height:180px;" tag="div" >
                <Row type="flex" style="padding:0 5px;font-size:14px;" class="list-complete-item" v-for="(item,index) in blockList" v-bind:key="item.timestamp">
                    <Col style="color:#5b5774;">
                        <div>{{item.block_num}}</div>
                    </Col>
                    <Col style="flex:1;padding: 0 20px;color:#5b5774;overflow: hidden;white-space: nowrap;text-overflow: ellipsis clip;font-family:Consolas, monaco, monospace;text-align:right;" >
                        <div >...{{item.id}}<span :style="item.isReward ? 'color:green':''">{{item.last_id}}</span>
                        </div>
                    </Col>
                    <Col style="color:#444150;">{{item.timestamp}}</Col>
                </Row>
            </transition-group>
        </Row>
        <div style="height: 1.4rem;">
          <div style="width:100%;height:.15rem;background: rgb(27, 27, 27);"></div>  
          <div style="width:100%;height:1.1rem;">
            <div class="display_ib" style="width:33.3%;height:1.1rem;"><p @click="selectTwenty(1)" :class="{orange:twenty==1}" class=" font_five" style="line-height:1.1rem;text-align: center;">20x0.1</p></div>
            <div class="display_ib" style="width:33.3%;height:1.1rem;"><p @click="selectTwenty(2)" :class="{orange:twenty==2}" class=" font_five" style="line-height:1.1rem;text-align: center;">20x0.5</p></div>
            <div class="display_ib" style="width:33.3%;height:1.1rem;"><p @click="selectTwenty(3)" :class="{orange:twenty==3}" class=" font_five" style="line-height:1.1rem;text-align: center;">100x0.1</p></div>
          </div>
          <div style="width:100%;height:.15rem;background: rgb(27, 27, 27);"></div>
        </div>
        <div style="width: 100%;">
        <div style="width: 80%;height: 3.4rem;border: 1px solid rgb(100,100,100);margin: 1rem auto .5rem auto;border-radius: 7px;position: relative;box-shadow: 5px 5px 5px rgba(94, 94, 94, 0.349019607843137);">
          <div style=" position: absolute;width: 50%;height: 1rem;background-color: rgb(40,40,40);right: 25%;top: -15%;">
            <p class="" style=" line-height: 1rem;text-align: center;font-size: .6rem;font-weight: 700;">夺宝 20x0.1</p>
          </div>
            <p class="Centered font_four p_A" style="margin: 25px auto 8px auto;"># 166 期</p>
            <div class="schedule_white"><div class="schedule_orange" :style="{ width: schedule + '%' }"></div></div>
            <div style="width:100%;margin-top:.3rem;">
              <div class="display_ib" style="width:33.3%;height:1.1rem;"><p class=" font_four" style="text-align: center;">18 Key</p><p class=" font_four" style="text-align: center;">已投</p></div>
              <div class="display_ib" style="width:33.3%;height:1.1rem;"><p class=" font_four" style="text-align: center;">18 Key</p><p class=" font_four" style="text-align: center;">总需</p></div>
              <div class="display_ib" style="width:33.3%;height:1.1rem;"><p class=" font_four" style="text-align: center;">18 Key</p><p class=" font_four" style="text-align: center;">剩余</p></div>
            </div>
        </div>
        <div style="width: 80%;height: 1rem;margin: 0 auto;border-radius: 5px;background: rgb(54,54,54);">
          <div class="display_ib vertical_top" style="width:1rem;height:1rem;"><img style="width:50%;height:50%;margin: 25% 25%;" src="@/assets/invitation2/u7.png"></div>
          <div class="display_ib vertical_top" style="width:1rem;height:1rem;background:rgb(67,67,67);"><p class=" font_five" style="line-height:1rem;text-align: center;">-</p></div>
          <div class="display_ib vertical_top" style="width:1.8rem;height:1rem;"><p class=" font_five orange" style="line-height:1rem;text-align: center;">1</p></div>
          <div class="display_ib vertical_top" style="width:1rem;height:1rem;background:rgb(67,67,67);"><p class=" font_five orange" style="line-height:1rem;text-align: center;">+</p></div>
          <div class="display_ib vertical_top" style="width:3rem;height:1rem;"><p class=" font_five" style="line-height:1rem;text-align: center;color: #E4E4E4;">@ 1 UE</p></div>
        </div>
        <p class="Centered font_four p_A" style="margin:8px auto;">1 key = 0.1 UE</p>
        <div style="width: 80%;height: 1.4rem;border: 1px solid rgba(255, 153, 51, 1);margin:0 auto;border-radius: 7px;"><p class="Centered orange font_five" style="line-height: 1.4rem;">投注</p></div>
        <p class="Centered p_A" style="font-size: .35rem;margin:15px auto;color: #949494;">若投注超出本期可投数量，超出部分将自动投注下期</p>
        <p></p>
        </div>
        <div style="width: 100%;background: rgb(27, 27, 27);height: 8rem;">
          <div style="width:100%;height:1.4rem;">
            <div class="display_ib" :class="{gray:!allMy}" @click="selectAllMy(true)" style="width:50%;height:1.4rem;line-height: .7rem;"><p  style="text-align: center;font-size: .45rem;">全部</p><p  style="text-align: center;font-size: .45rem;">20x0.1</p></div>
            <div class="display_ib" :class="{gray:allMy}" @click="selectAllMy(false)" style="width:50%;height:1.4rem;line-height: .7rem;"><p  style="text-align: center;font-size: .45rem;">我的</p><p  style="text-align: center;font-size: .45rem;">20x0.1</p></div>
          </div>
          <div v-if="allMy">
            <div style="" v-for="(item,index) in items" :key='index'>
              <div style="width:100%;height:1.1rem;">
                <div class="display_ib vertical_top" style="width:33.3%;height:1.1rem;"><p  style="font-size: .45rem;line-height:1.1rem;text-align: center;">{{item.a}}</p></div>
                <div class="display_ib vertical_top" style="width:40%;height:1.1rem;"><p  style="font-size: .45rem;line-height:1.1rem;text-align: center;">{{item.b}}</p></div>
                <div class="display_ib vertical_top" style="width:22%;margin-left: 4%;height:1.1rem;">
                  <div class="display_ib vertical_top"><p style="font-size: .45rem;line-height:1.1rem;text-align: center;">{{item.key}} key</p></div>
                  <div class="display_ib"><img style="width: .5rem;height: 0.5rem;margin: .35rem .2rem;" src="@/assets/img/invitation_profitarrow.png"></div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="!allMy">
            <div style="" v-for="(item,index) in items" :key='index'>
              <div style="width:100%;height:1.1rem;">
                <div class="display_ib vertical_top" style="width:33.3%;height:1.1rem;"><p  style="font-size: .45rem;line-height:1.1rem;text-align: center;">{{item.a}}</p></div>
                <div class="display_ib vertical_top" style="width:40%;height:1.1rem;"><p  style="font-size: .45rem;line-height:1.1rem;text-align: center;">{{item.b}}</p></div>
                <div class="display_ib vertical_top" style="width:22%;margin-left: 4%;height:1.1rem;"><img style="width: .5rem;height: 0.5rem;margin: .35rem 0 .35rem 50%;" src="@/assets/img/invitation_profitarrow.png"></div>
              </div>
            </div>
          </div>
        </div>
        
          

      
       
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
      twenty:1,      //模式选择  20*0.1为1  20*0.5为2  100*0.1为3
      allMy:true,   //区分我的 全部
      publicData:[   //公用界面数据

      ],
      publicAll:[    //公用全部

      ],
      publicMy:[    //公用我的

      ],
      items:[
              {num:111,a:'# 163期',b:'待开奖',key:1},
              {num:111,a:'# 163期',b:'幸运码：100006',key:2},
              {num:111,a:'# 163期 - 中奖',b:'幸运码：100006',key:3},
              {num:111,a:'# 163期',b:'幸运码：100006',key:4},
              {num:111,a:'# 163期',b:'幸运码：100006',key:5},
              {num:111,a:'# 163期',b:'幸运码：100006',key:6},
              {num:111,a:'# 163期',b:'幸运码：100006',key:7},
      ],   
    }
  },
  methods: {
       back() {
          this.$router.go(-1)
       },
       selectTwenty(index) {
         this.twenty=index;
       },
       selectAllMy(index) {
         this.allMy=index;
       }
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
  background: rgba(255, 153, 51, 1);
  margin: 0 auto;
  width: .9rem;
  height:.9rem;
  margin:0.35rem 0.30rem .35rem 0.6rem;
  border-radius: 6px;
}
.ion_tbg{
  width: 80%;
  height:80%;
  padding: 10% 10%;
}
.schedule_white{
  width: 80%;
  height: 15px;
  border-radius: 20px;
  margin: 0 auto;
  background: rgb(54,54,54);
}
.schedule_orange{
  width: 80%;
  height: 100%;
  background:orange;
  border-radius: 20px;
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
.white{
  color: rgb(188,188,188);
}
.orange{
  color: rgba(255, 153, 51, 1);
}
.gray{
  background:rgb(67,67,67);
}
.font_four{
  font-size: .4rem;
}
.font_five{
  font-size: .5rem;
}
.Centered{
  text-align: center;
}
.vertical_top{
  vertical-align: top;
}
p{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
  color: rgb(188,188,188);
}   
.p_A{
  font-family: "Arial Normal", Arial;
}   
span{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
}   
   


/* 滚动样式    */
.list-complete-item {
  transition: all .5s;
}

</style>