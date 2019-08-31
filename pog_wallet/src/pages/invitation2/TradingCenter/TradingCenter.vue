<template >
    <vpage>
     <slot>
     <div style=" background-color: RGB(242,242,242);height:100%;">
         <div v-if="selected_ipt" style=" position: absolute;width: 100%;height: 100%;background-color: rgba(0, 0, 0, 0.227);" @click='switchData'></div>
        <div class="header">
          <img class="ion_back display_ib" src="@/assets/img/u14.png" @click="back"> 
          <div class="display_ib float_left" style=" height: 100%;margin-left: 30%;"><p @click="switchPage"  :class="{orange:logPage,font_silver:!logPage}" style="font-size: .5rem;margin-top: .4rem;">买入</p><div :class="{selected:logPage}" ></div></div>
          <div class="display_ib float_right" style=" height: 100%;margin-right: 30%;"><p @click="switchPage" :class="{orange:!logPage,font_silver:logPage}" style="font-size: .5rem;margin-top: .4rem;">卖出</p><div :class="{selected:!logPage}" ></div></div>
        </div>
        <!-- 买入 -->
        <div v-if="logPage">
        <!-- 全球合伙人 -->
          <div v-if="logPage">
            <!-- 第一部分 -->
            <div style=" width: 90%;background: rgb(255, 255, 255);margin: 0 auto;border-radius: 4px;">
            <div style="  width: 100%;height: 36px;"></div>
            <div class="ipt_layout">
                <div class="float_left">
                <img  src="@/assets/img/u7203.png" style=" margin: 0.15rem 0.25rem 0 .3rem;width: 0.9rem;height: 0.9rem;"  @click="back"> 
                </div>
                <div class="float_left" style="margin-top: .28rem;">
                <span class="font_B" style=" font-size: .5rem;color: #1E1E1E;">TBG</span>
                <span style="font-size: .5rem;color: #1E1E1E;">价格</span>
                </div>
                <div class="float_right" style="margin: .28rem .4rem 0 0;">
                <span class="font_B" style=" font-size:.5rem;color: #1E1E1E;">1.00000 UE</span>
                </div>
            </div>
            <div class="ipt_layout">
                <div class="float_left" style="margin: .3rem 0 0 .5rem;">
                <span style="font-size: .45rem;color: #1E1E1E;">全球合伙人价格</span>
                </div>
                <div class="float_right" style="margin: .28rem .4rem 0 0;">
                <span class="font_B" style=" font-size:.5rem;color: #1E1E1E;">0.50000 UE</span>
                </div>
            </div>
                <!-- 多选框 -->
            <div style="position: relative;">
                <div class="ipt_layout" style="box-shadow: 0px 1px 10px rgba(201, 201, 201, 0.349019607843137);border: none;background: rgb(255, 255, 255);">
                    <div class="float_left" style="margin: .3rem 0 0 .5rem;">
                    <span style="font-size: .45rem;color: #1E1E1E;">资产包</span>
                    </div>
                    <div class="float_right" style="margin: .28rem 0 0 0;">
                    <span class="font_B" style=" font-size:.5rem;color: #1E1E1E;">20000 TBG</span>
                    <img  src="@/assets/img/u28.png" style="width: 0.5rem;height: 0.5rem;" @click='switchData'> 
                    </div>
                </div>
                <!-- 下拉部分 -->
                <div v-if="selected_ipt" style="position: absolute;background: rgb(255, 255, 255);border-radius: 0.08rem;width: 80%;left: 10%;box-shadow: 0px 1px 10px rgba(201, 201, 201, 0.349019607843137);">
                    <div style="margin: .28rem 0 0 0;"><p class="font_B" style=" font-size:.5rem;color: #1E1E1E;text-align: right;margin-right: .5rem;">20000 TBG</p></div>
                    <div style="margin: .28rem 0 0 0;"><p class="font_B" style=" font-size:.5rem;color: #1E1E1E;text-align: right;margin-right: .5rem;">20000 TBG</p></div>
                    <div style="margin: .28rem 0 0 0;"><p class="font_B" style=" font-size:.5rem;color: #1E1E1E;text-align: right;margin-right: .5rem;">20000 TBG</p></div>
                    <div style="  width: 100%;height: .28rem;"></div>
                </div>
            </div>
                <p style="font-size: .4rem;color: #FF9900;text-align: center;margin-bottom: .15rem;">全球合伙人专享，仅可购买一次</p>
            <div class="ipt_layout">
                <div class="float_left" style="margin: .3rem 0 0 .5rem;">
                <span style="font-size: .45rem;color: #1E1E1E;">总价</span>
                </div>
                <div class="float_right" style="margin: .28rem .4rem 0 0;">
                <span class="font_B" style=" font-size:.5rem;color: #1E1E1E;">10,000.0000 UE</span>
                </div>
            </div>
            <div class="ipt_layout" style="background-color: #FF9900;">
                <p style="font-size: 0.55rem;color: #FFFFFF;text-align: center;margin-top: 0.25rem;">申请买入</p>
            </div>
            <div style="  width: 100%;height: .1rem;"></div>
            <div >
                <p style="text-align: center;"><span style="font-size: .45rem;color: #1E1E1E;">可用</span><span class="font_B" style=" font-size:.5rem;color: #1E1E1E;">10,293.3381 0000 UE</span></p>
            </div>
            <div style="  width: 100%;height: .5rem;"></div>
            </div>
            <!-- 第二部分 -->
            <div style="width: 90%;background: rgb(255, 255, 255);margin: 8px auto 0 auto;border-radius: 4px;">
                <div style="  width: 100%;height: 25px;"></div>
                <div>
                    <p style="text-align: center;"><span style="font-size: .45rem;color: #1E1E1E;">可用</span><span class="font_B" style=" font-size:.5rem;color: #1E1E1E;">20,000 TBG</span><span style="font-size: .45rem;color: #1E1E1E;">资产包可获</span></p>
                </div>
                <div style="  width: 100%;height: 20px;"></div>
                <div style="margin-bottom: 5px;">
                    <div class="display_ib" style="width:50%;">
                        <p style="text-align: center;font-size: .45rem;color: #1E1E1E;">线性释放池</p>
                        <p class="font_B" style="text-align: center;font-size:.5rem;color: #1E1E1E;">100,000 TBG</p>
                    </div>
                    <div class="display_ib" style="width:50%;">
                        <p style="text-align: center;font-size: .45rem;color: #1E1E1E;">资产包矿池</p>
                        <p class="font_B" style="text-align: center;font-size:.5rem;color: #1E1E1E;">20,000 TBG</p>
                    </div>
                </div>
                <p style="font-size: .4rem;color: #FF9900;text-align: center;">查看买入资产包规则 ></p>
                <div style="  width: 100%;height: 10px;"></div>
            </div>
            <!-- 第三部分 -->
            <div style="  width: 100%;height: 30px;"></div>
            <div>
                <span style="font-size: 0.45rem;color: #FF9900;margin:0 10%;">当前买入列表</span>
                <span style="font-size: 0.45rem;color: #AEAEAE;">历史买入记录</span>
            </div>
            <!-- 当前买入列表 -->
            <div>

            </div>
            <!-- 历史买入记录 -->
            <div>

            </div>
          </div>
        </div>
     </div>
     </slot>
    </vpage>
    
</template>

<script>
import MyPage from '@/components/MyPage'
import {SaleableBalance,getType} from '@/servers/invitation';


export default {
  components: {
    vpage: MyPage,
   },
  data() {
    return {
      logPage:true,
      selected_ipt:false,
     
    }
  },
  methods: {
       back() {
          this.$router.go(-1)
       },
       switchData() {
          this.selected_ipt=this.selected_ipt==true?this.selected_ipt=false:this.selected_ipt=true;
       },
       switchPage() {
          this.logPage=this.logPage==true?this.logPage=false:this.logPage=true;
       }
  },
  created(){
    // console.log('this',this);
    getType({account_name:"yujinsheng11"}).then(res => {
        if (res.code === 1) {
            console.log('111111111111111111111111',res.data)
        }
      })
  }
}
</script>

<style scoped>
.header{
  position: relative;
  width: 100%;
  height: 120px;
  z-index: 1000;
  font-size: 34px;
  /* background: RGB(228,228,228); */
  text-align: center;
}
.ion_back {
  width: 70px;
  height: 70px;
  position: absolute;
  left: 45px;
  top: 50%;
  transform: translate(0, -50%);
}
.ipt_layout {
    border-radius: 0.08rem;
    height: 1.2rem;
    width: 80%;
    border: 2px solid RGB(228,228,228);
    margin: 0 auto 15px auto;
    clear: both;
}












.selected{
  width: 40%;
  height: 3px;
  background-color: #FF9900;
  margin: 0 auto;
}



/* div{
  background: #fff;
} */
p{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
  color: #000000;
  font-size:0.4rem;
} 
span{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
}
.font_B{
  font-family: 'Bahnschrift Regular', 'Bahnschrift';
}
.font_weight_bold{
  font-weight: 600;
}
.float_left{
  float: left;  
}
.float_right{
  float: right;
}
.display_ib{
  display: inline-block;
}
.font_silver{
  color: #BCBCBC;
}
.font_red{
  color: #FF0000;
}
.orange{
  color: #FF9900;
}
/* 
    position: absolute;
    overflow: hidden;
    top: 0px;
    width: 100%;
    z-index: 10000;
    background: white; */
</style>



