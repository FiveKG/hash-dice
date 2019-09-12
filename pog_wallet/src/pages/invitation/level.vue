<template >
    <vpage>
     <slot>
      <div style=" background-color: #fff;height:;">
        <div class="header">
          <img class="ion_back" src="@/assets/img/u14.png" @click="back"> 
          <span>会员等级</span>
        </div>
        <div class="content">
          <div style="width:100%;">
            <div class="display_ib" style="width:60%;line-height: .7rem;">
              <div style="width:100%;height:20px;"></div>
              <p class="font_five">我的会员等级</p>
              <div style="width:100%;height:20px;"></div>
              <p>我的账号：<span class="font_B font_weight_bold">{{account_name}}</span></p>
              <p>TBG-I：{{pool_data.tbg1}}</p>
              <p>TBG-II：{{pool_data.tbg2}}</p>
              <p>直接推荐会员数: <span class="font_B font_weight_bold">{{pool_data.invest_count}}</span></p>
              <p>当前会员等级：{{pool_data.level}}</p>
              <div style="width:100%;height:15px;"></div>
            </div>
            <div class="display_ib vertical_top" style="width:40%;margin-top: 1rem;">
              <img v-if="pool_data.level_img==1" style="width:90%;height:90%;" src="@/assets/invitation2/u15.svg">
              <img v-if="pool_data.level_img==2" style="width:90%;height:90%;" src="@/assets/invitation2/u16.svg">
              <img v-if="pool_data.level_img==3" style="width:90%;height:90%;" src="@/assets/invitation2/u18.svg">
              <img v-if="pool_data.level_img==4" style="width:90%;height:90%;" src="@/assets/invitation2/u17.svg">
              <img v-if="pool_data.level_img==5" style="width:90%;height:90%;" src="@/assets/invitation2/u19.svg">
            </div>
          </div>
          <div style="width:118%;height:15px;background: RGB(244,244,244);position: relative;left: -9%;"></div>
          <div class="display_ib div_white">            
              <div style="width:100%;height:15px;"></div>
              <p class="orange">未参与 TBG-I 或 TBG-II 用户，亦可使用分享页邀请好友，被邀请的好友参与 TBG 旗下游戏时，未激活用户亦可获得游戏佣金，可提现部份亦可提现，没有限制。</p>
              <div style="width:100%;height:15px;"></div>
          </div>
          <div style="width:118%;height:15px;background: RGB(244,244,244);position: relative;left: -9%;"></div>
          <div class="display_ib div_white">            
              <div style="width:100%;height:15px;"></div>
              <p class="font_five">会员达成条件</p>
              <div style="width:100%;height:20px;"></div>
              <p class="">会员达成首要条件为参与TBG-II</p>
              <table width="100%"  cellspacing="0" cellpadding="0" style="border-collapse: collapse;" class="Centered font_four">
                <tr>
                <td>会员等级</td>
                <td>直接推荐会员数</td>
                </tr>
                <tr>
                <td>海蓝会员</td>
                <td>0 - 5个会员</td>
                </tr>
                <tr>
                <td>紫晶会员</td>
                <td>6 - 15个会员</td>
                </tr>
                <tr>
                <td>黄金会员</td>
                <td>16 - 30个会员</td>
                </tr>
                <tr>
                <td>红钻会员</td>
                <td>31 - 50个会员</td>
                </tr>
                <tr>
                <td>皇冠会员</td>
                <td>51 个会员以上</td>
                </tr>
              </table>
              <div style="width:100%;height:20px;"></div>
           </div>
          <div style="width:118%;height:15px;background: RGB(244,244,244);position: relative;left: -9%;"></div>
          <div class="display_ib div_white">            
              <div style="width:100%;height:15px;"></div>
              <p class="font_five">会员 TBG-II 买入交易规则</p>
              <div style="width:100%;height:20px;"></div>
              <table width="100%"  cellspacing="0" cellpadding="0" style="border-collapse: collapse;" class="Centered font_four">
                <tr>
                <td>会员等级</td>
                <td>单日最多可买次数</td>
                <td>同时可挂买单单数</td>
                </tr>
                <tr>
                <td>未激活</td>
                <td>不限</td>
                <td>8</td>
                </tr>
                <tr>
                <td>会海蓝员</td>
                <td>不限</td>
                <td>8</td>
                </tr>
                <tr>
                <td>紫晶会员</td>
                <td>不限</td>
                <td>8</td>
                </tr>
                <tr>
                <td>黄金会员</td>
                <td>不限</td>
                <td>8</td>
                </tr>
                <tr>
                <td>红钻会员</td>
                <td>不限</td>
                <td>8</td>
                </tr>
                <tr>
                <td>皇冠会员</td>
                <td>不限</td>
                <td>8</td>
                </tr>
                
              </table>
              <div style="width:100%;height:20px;"></div>
           </div>
          <div style="width:118%;height:15px;background: RGB(244,244,244);position: relative;left: -9%;"></div>
          <div class="display_ib div_white">            
              <div style="width:100%;height:15px;"></div>
              <p class="font_five">会员 TBG-II 卖出交易规则</p>
              <div style="width:100%;height:20px;"></div>
              <table width="100%"  cellspacing="0" cellpadding="0" style="border-collapse: collapse;" class="Centered font_four">
                <tr>
                <td>会员等级</td>
                <td><P style="font-size:.3rem;">每次最低</P><p style="font-size:.3rem;">可卖数量</p></td>
                <td><P style="font-size:.3rem;">每次最高</P><p style="font-size:.3rem;">可卖数量</p></td>
                <td><P style="font-size:.3rem;">单日最高</P><p style="font-size:.3rem;">可卖数量</p></td>
                <td><P style="font-size:.3rem;">单日最多</P><p style="font-size:.3rem;">可卖次数</p></td>
                </tr>
                <tr>
                <td>未激活</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                </tr>
                <tr>
                <td>会海蓝员</td>
                <td>3</td>
                <td>100</td>
                <td>200</td>
                <td>2</td>
                </tr>
                <tr>
                <td>紫晶会员</td>
                <td>4</td>
                <td>125</td>
                <td>250</td>
                <td>2</td>
                </tr>
                <tr>
                <td>黄金会员</td>
                <td>5</td>
                <td>150</td>
                <td>300</td>
                <td>2</td>
                </tr>
                <tr>
                <td>红钻会员</td>
                <td>8</td>
                <td>175</td>
                <td>350</td>
                <td>2</td>
                </tr>
                <tr>
                <td>皇冠会员</td>
                <td>10</td>
                <td>200</td>
                <td>400</td>
                <td>2</td>
                </tr>
               
              </table>
              <div style="width:100%;height:20px;"></div>
           </div>
          <div style="width:118%;height:15px;background: RGB(244,244,244);position: relative;left: -9%;"></div>
          <div class="display_ib div_white">            
              <div style="width:100%;height:15px;"></div>
              <p class="font_five">会员 TBG 线性释放池释放规则</p>
              <div style="width:100%;height:20px;"></div>
              <table width="100%"  cellspacing="0" cellpadding="0" style="border-collapse: collapse;" class="Centered font_four">
                <tr>
                <td>会员等级</td>
                <td>每日线性释放比例</td>
                </tr>
                <tr>
                <td>未激活</td>
                <td>0.05%</td>
                </tr>
                <tr>
                <td>海蓝会员</td>
                <td>0.1%</td>
                </tr>
                <tr>
                <td>紫晶会员</td>
                <td>0.125%</td>
                </tr>
                <tr>
                <td>黄金会员</td>
                <td>0.15%</td>
                </tr>
                <tr>
                <td>红钻会员</td>
                <td>0.175%</td>
                </tr>
                <tr>
                <td>皇冠会员</td>
                <td>0.2%</td>
                </tr>
              </table>
              <div style="width:100%;height:20px;"></div>
           </div>




        </div>
      </div>
     </slot>
    </vpage>
    
</template>

<script>
import MyPage from '@/components/MyPage'
import api from '@/servers/invitation'


export default {
  components: {
    vpage: MyPage,
   },
  data() {
    return {
      account_name:'',
      pool_data:{},
    }
  },
  methods: {
       back() {
          this.$router.go(-1)
       },
  },
  created(){
    this.account_name=this.$store.state.wallet.assets.account;
    api.getLevel({account_name:this.account_name}).then(res => {    
      if (res.code === 1) {
           res.data.tbg1==false?res.data.tbg1='未参与':res.data.tbg1='已参与'
           res.data.tbg2==false?res.data.tbg2='未参与':res.data.tbg2='已参与'
           switch (res.data.level) {
             case '海蓝会员':res.data.level_img=1;break;
             case '紫晶会员':res.data.level_img=2;break;
             case '黄金会员':res.data.level_img=3;break;
             case '红钻会员':res.data.level_img=4;break;
             case '皇冠会员':res.data.level_img=5;break;
             default: break;
           }
           this.pool_data=res.data;
        }
      })

  }
}
</script>

<style scoped>
div{
  /* background: #fff; */
}
.header{
  position: fixed;
  width: 100%;
  z-index: 1000;
  font-size: 34px;
  background: RGB(228,228,228);
  height: 100px;
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
.header span{
  position: absolute;
  left: 120px;
  top: 48%;
  transform: translate(0, -50%);
}
.content{
  position: relative;
  top: 100px;
  padding: 0 7.5%;
  width: 85%;
  background-color: #fff;
}
table td{
 height: .9rem;
}
table,table tr th, table tr td {
  border: .5px solid black;
}


.div_white{
  width:100%;
  background-color: #fff;
  line-height: .7rem;
}

.display_ib{
  display: inline-block;
}
.Centered{
  text-align: center;
}
.vertical_top{
  vertical-align: top;
}
p{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
  color: #000000;
  font-size:0.40rem;
}    
span{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
}
.font_A{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
}
.font_B{
  font-family: 'Bahnschrift Regular', 'Bahnschrift';
}
.font_size_five{
  font-size: 0.40rem;
}
.font_five{
  font-size: .5rem;
}
.font_weight_bold{
  font-weight: 600;
}
.gray{
  color: #BCBCBC;
}
.orange{
  color: rgba(255, 153, 51, 1);
}
.bold{
  font-weight: bold;
}
</style>