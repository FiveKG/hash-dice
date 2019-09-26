<template>
  <vpage>
    <slot>
      <div class="container">
        <Header :HeaderTitlle="HeaderTitlle"></Header>
        <div class="rule-title" style="padding-top:1.6rem;margin-top:0px;">全球彩规则: </div>
        <div class="rule-content">
        1、每个 Key = 0.1 UE 或 0.1全球彩彩码； <br>
        2、每个玩家可投注 1 个或多个 Key，即可随机或自选获得 1 个或多个 9 位数全球彩<br>
        3、每期游戏为 1 小时，投注时间为两个整点之间的时间，到期即时开奖，每 1 小时为一期 ; <br>
        4、每期开奖号码为 9 位 0 - 9 可重复数字，奖项及相关如下： <br>
        &ensp;&ensp;<span style="color:rgba(219, 179 , 121 ,1);">超级全球彩大奖：</span>按顺序中全部 9 个数字；<br>
        &ensp;&ensp;<span style="color:rgba(219, 179 , 121 ,1);">二等奖: </span>按顺序中其中 8 个数字；<br>
        &ensp;&ensp;<span style="color:rgba(219, 179 , 121 ,1);">三等奖: </span>按顺序中其中 7 个数字；<br>
        &ensp;&ensp;<span style="color:rgba(219, 179 , 121 ,1);">四等奖: </span>按顺序中其中 6 个数字；<br>
        &ensp;&ensp;<span style="color:rgba(219, 179 , 121 ,1);">五等奖: </span>按顺序中其中 5 个数字；<br>
        &ensp;&ensp;<span style="color:rgba(219, 179 , 121 ,1);">六等奖: </span>按顺序中其中 4 个数字；<br>
        &ensp;&ensp;<span style="color:rgba(219, 179 , 121 ,1);">七等奖: </span>按顺序中其中 3 个数字；<br>
        &ensp;&ensp;<span style="color:rgba(219, 179 , 121 ,1);">全球彩特别奖: </span>为超级全球彩大奖获得者的直接推荐者；<br>
        5、按最高奖项得奖，不向下兼容其他奖项，但全球彩特别奖可兼容其他奖项；<br>
        </div>
        <div class="rule-title">开奖方法：</div>
        <div class="rule-content">区块ID作为开奖依据，整点的区块ID开始，每个区块ID取 1 位尾数，跳过非数字的尾数，取9 位数字作为开奖号码；</div>
        <div class="rule-content" style="margin-top:10px;">
          如：15:00:00:0 开始的区块ID：<br>
          15:00:00:0     ......F079AC91D2AC45D8277<span style="color:rgba(219, 179 , 121 ,1);">4</span> <br>
          15:00:00:5     .....88B8825F15E82705AC87<span style="color:rgba(219, 179 , 121 ,1);">3</span> <br>
          15:00:01:0     .....B257EE4D1F5AE8495C5A <br>
          15:00:01:5     ......21EA55BC9D43172F275<span style="color:rgba(219, 179 , 121 ,1);">8</span> <br>
          15:00:02:0     ......BF58E289BE48315226BC <br>
          15:00:02:5     .....A9CED6C4630787FC3C2B <br>
          15:00:03:0     .....00D828EA9C1D260DD1B<span style="color:rgba(219, 179 , 121 ,1);">7</span> <br>
          15:00:03:5     ......3F7B195473D4F09BC8F<span style="color:rgba(219, 179 , 121 ,1);">7</span> <br>
          15:00:04:0     ......2589E1469E3E70F5D9E<span style="color:rgba(219, 179 , 121 ,1);">7</span> <br>
          15:00:04:5     ......2A6915A1EEF913BD61FF <br>
          15:00:05:0     ......10B56D7DBA840BF026C<span style="color:rgba(219, 179 , 121 ,1);">5</span> <br>
          15:00:05:5     .....34B5FD5CAB31B1270BEE <br>
          15:00:06:0     .....AD15BEFE93C6107DCB4<span style="color:rgba(219, 179 , 121 ,1);">5</span> <br>
          15:00:06:5     ......D16869814E489839F386<span style="color:rgba(219, 179 , 121 ,1);">5</span> <br>
        </div>
        <div class="rule-content" style="margin-top:10px;">
          尾数为非数字的跳过，取 9 组数字尾数是数字作为开奖号码 <br>
          本期中奖号码为：<span style="color:rgba(219, 179 , 121 ,1);">4,3,8,7,1,4,5,8,2</span>
        </div>
        <div class="rule-content" style="margin-top:10px;">
          区块 ID 为 UE 公链生成，无法预知、预设、修改，随时可在UE公链进行查询，作为开奖依据，完全公正公平透明可信。
        </div>
        <div class="rule-title">投注拨比：</div>
        <div class="rule-content" style="margin-top:10px;">
          1、80% 拨入全球彩奖池；<br>
          2、5% 拨入全球彩底池，当开出超级全球彩大奖的下一期，将全球彩底池的 50% 拨入下一轮全球彩奖池；<br>
          3、3% 拨入全球彩储备池，当五、六、七等奖奖金总额奖池不足以支付时，超出部分由全球彩储备池拨出；<br>
          4、2% 拨入 TBG 股东分红池；<br>
          5、2.5% 拨入 TBG 三倍收益保障池；<br>
          6、5% 拨入 TBG 共享推荐佣金分配；<br>
          7、2.5% 拨入团队，作资源购买及开发运维费用支配；<br>
        </div>
        <div class="rule-title">TBG 推荐关系适用 TBG 旗下所有游戏和应用</div>
        <div class="rule-title">奖金分配：</div>
        <div class="rule-content" style="margin-top:10px;">
          1、超级全球彩大奖 =（全球彩奖池 x 60% ) / 中奖数量 <br>
          2、二等奖 =（全球彩奖池 x 10% ) / 中奖数量 <br>         
          3、三等奖 =（全球彩奖池 x 8% ) / 中奖数量 <br> 
          4、四等奖 =（全球彩奖池 x 5% ) / 中奖数量 <br>
          5、五等奖 = 固定每注奖金 10 UE <br>
          6、六等奖 = 固定每注奖金 5 UE <br>
          7、七等奖 = 固定每注奖金 1 UE <br>
          8、全球彩特别奖 = 为被推荐者超级全球彩大奖奖金的10%
        </div>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import Header from '@/pages/game/qqc/components/Header'

export default {
  components: {
    vpage: MyPage,
    Header,
   },
  data() {
    return {
      HeaderTitlle: ''
    }
  },
  methods: {

  },
  created(){
    
  }
}
</script>

<style scoped>
  .container{
    height: auto;width: 100%;background-color:rgb(40,40,40);min-height: 100%;
  }
  .rule-title{
    line-height: 0.75rem;color: rgba(219, 179 , 121 ,1);font-size: 0.5rem;width: 90%;margin: 0.5rem 5%;
  }
  .rule-content{
    line-height: 0.7rem;font-size: 0.4rem;width: 90%;margin: 0 5%;color: #bcbcbc;
  }
</style>