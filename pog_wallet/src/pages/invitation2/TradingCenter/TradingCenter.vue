<template >
    <vpage>
     <slot>
     <div style=" background-color: RGB(242,242,242);height:100%;">
         <div v-if="selected_ipt"  style=" position: absolute;width: 100%;height: 100%;background-color: rgba(0, 0, 0, 0.227);" @click='logIpt'></div>
         <div v-if="sellConfirm" style=" position: absolute;width: 100%;height: 100%;background-color: rgba(0, 0, 0, 0.227);z-index: 5;" @click='logPSellConfirm'></div>
        <div class="header">
          <img class="ion_back display_ib" src="@/assets/img/u14.png" @click="back"> 
          <div class="display_ib float_left" style=" height: 100%;margin-left: 30%;"><p @click="logBuySell"  :class="{orange:buySell,font_silver:!buySell}" style="font-size: .5rem;margin-top: .4rem;">买入</p><div :class="{selected:buySell}" ></div></div>
          <div class="display_ib float_right" style=" height: 100%;margin-right: 30%;"><p @click="logBuySell" :class="{orange:!buySell,font_silver:buySell}" style="font-size: .5rem;margin-top: .4rem;">卖出</p><div :class="{selected:!buySell}" ></div></div>
        </div>
        <!-- 买入 -->
        <div v-if="buySell">
        <!-- 全球合伙人页面 -->
        <div v-if="buyPartner">
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
                <span class="font_B" style=" font-size:.5rem;color: #1E1E1E;">{{buyPartnerPrice.price}} UE</span>
                </div>
            </div>
            <div class="ipt_layout">
                <div class="float_left" style="margin: .3rem 0 0 .5rem;">
                <span style="font-size: .45rem;color: #1E1E1E;">全球合伙人价格</span>
                </div>
                <div class="float_right" style="margin: .28rem .4rem 0 0;">
                <span class="font_B" style=" font-size:.5rem;color: #1E1E1E;">{{buyPartnerPrice.raise_price}} UE</span>
                </div>
            </div>
                <!-- 多选框 -->
            <div style="position: relative;">
                <div class="ipt_layout" style="box-shadow: 0px 1px 10px rgba(201, 201, 201, 0.349019607843137);border: none;background: rgb(255, 255, 255);">
                    <div class="float_left" style="margin: .3rem 0 0 .5rem;">
                    <span style="font-size: .45rem;color: #1E1E1E;">资产包</span>
                    </div>
                    <div class="float_right" style="margin: .28rem 0 0 0;">
                    <span class="font_B" style=" font-size:.5rem;color: #1E1E1E;">{{buyPartnerData[globalSelect].amount}} TBG</span>
                    <img  src="@/assets/img/u28.png" style="width: 0.5rem;height: 0.5rem;" @click='logIpt'> 
                    </div>
                </div>
                <!-- 下拉部分 -->
                <div v-if="selected_ipt" style="position: absolute;background: rgb(255, 255, 255);border-radius: 0.08rem;width: 80%;left: 10%;box-shadow: 0px 1px 10px rgba(201, 201, 201, 0.349019607843137);">
                    <div style="margin: .28rem 0 0 0;"  v-for="(item,index) in buyPartnerData" @click="globalSelectAssets(index)"><p class="font_B" style=" font-size:.5rem;color: #1E1E1E;text-align: right;margin-right: .5rem;">{{item.amount}} TBG</p></div>
                    <div style="  width: 100%;height: .28rem;"></div>
                </div>
            </div>
                <p style="font-size: .4rem;color: #FF9900;text-align: center;margin-bottom: .15rem;">全球合伙人专享，仅可购买一次</p>
            <div class="ipt_layout">
                <div class="float_left" style="margin: .3rem 0 0 .5rem;">
                <span style="font-size: .45rem;color: #1E1E1E;">总价</span>
                </div>
                <div class="float_right" style="margin: .28rem .4rem 0 0;">
                <span class="font_B" style=" font-size:.5rem;color: #1E1E1E;">{{globalPrice}} UE</span>
                </div>
            </div>
            <div class="ipt_layout" style="background-color: #FF9900;">
                <p style="font-size: 0.55rem;color: #FFFFFF;text-align: center;margin-top: 0.25rem;" @click="sendGlobalPartnerPlacement">申请买入</p>
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
                    <p style="text-align: center;"><span style="font-size: .45rem;color: #1E1E1E;">可用</span><span class="font_B" style=" font-size:.5rem;color: #1E1E1E;">{{buyPartnerData[globalSelect].amount}} TBG</span><span style="font-size: .45rem;color: #1E1E1E;">资产包可获</span></p>
                </div>
                <div style="  width: 100%;height: 20px;"></div>
                <div style="margin-bottom: 5px;">
                    <div class="display_ib" style="width:50%;">
                        <p style="text-align: center;font-size: .45rem;color: #1E1E1E;">线性释放池</p>
                        <p class="font_B" style="text-align: center;font-size:.5rem;color: #1E1E1E;">{{buyPartnerData[globalSelect].release_pool}} TBG</p>
                    </div>
                    <div class="display_ib" style="width:50%;">
                        <p style="text-align: center;font-size: .45rem;color: #1E1E1E;">资产包矿池</p>
                        <p class="font_B" style="text-align: center;font-size:.5rem;color: #1E1E1E;">{{buyPartnerData[globalSelect].mining_pool}} TBG</p>
                    </div>
                </div>
                <p style="font-size: .4rem;color: #FF9900;text-align: center;">查看买入资产包规则 ></p>
                <div style="  width: 100%;height: 10px;"></div>
            </div>
            <!-- 第三部分 -->
            <div style="  width: 100%;height: 30px;"></div>
            <div>
                <span :class="{orange:buyPartnerList,font_silver:!buyPartnerList}" style="font-size: 0.45rem;margin:0 10%;" @click="logPartnerList">当前买入列表</span>
                <span :class="{orange:!buyPartnerList,font_silver:buyPartnerList}" style="font-size: 0.45rem;" @click="logPartnerList">历史买入记录</span>
            </div>
            <div style="  width: 100%;height: 15px;"></div>
            <!-- 当前买入列表 -->
            <div v-if="buyPartnerList" >
              <div class="asset_pool_header" > 
                <span style="width:25%;">时间</span>
                <span style="width:25%;">单价</span>
                <span style="width:25%;">成交 / 买入</span>
                <span style="width:25%;">动作</span>
              </div>
              <div class="asset_pool_data" v-for="item in buyPartnerListData" :key='item.key'>
                <div class="asset_pool_data_item" style="width:25%;"><p>{{item.create_time}}</p></div>
                <div class="asset_pool_data_item" style="width:25%;"><p class="font_fine">{{item.price}}</p></div>
                <div class="asset_pool_data_item" style="width:25%;"><p class="">{{item.transaction}}</p></div>
                <div class="asset_pool_data_item" style="width:20%;border: 0.02667rem solid orange;border-radius: 0.13333rem;margin-left: 2.5%;"><div style=" margin: .2rem auto;"><p style="font-size: .4rem;color: orange;">查看</p></div></div>
              </div>
            </div>
            <!-- 历史买入记录 -->
            <div v-if="!buyPartnerList" >
              <div class="asset_pool_header" > 
                <span style="width:25%;">时间</span>
                <span style="width:25%;">单价</span>
                <span style="width:25%;">买入</span>
                <span style="width:25%;">动作</span>
              </div>
              <div class="asset_pool_data" v-for="item in sellHistoryListData" :key='item.key'>
                <div class="asset_pool_data_item" style="width:25%;"><p>{{item.create_time}}</p></div>
                <div class="asset_pool_data_item" style="width:25%;"><p class="font_fine">{{item.price}}</p></div>
                <div class="asset_pool_data_item" style="width:25%;"><p class="font_silver">{{item.amount}}</p></div>
                <div class="asset_pool_data_item" style="width:20%;border: 0.02667rem solid orange;border-radius: 0.13333rem;margin-left: 2.5%;"><div style=" margin: .2rem auto;"><p style="font-size: .4rem;color: orange;">查看</p></div></div>
              </div>
            </div>
        </div>
          <!-- 正常买入页面 -->
          <div v-if="!buyPartner">
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
                <span class="font_B" style=" font-size:.5rem;color: #1E1E1E;">{{buynormalPrice.price}} UE</span>
                </div>
            </div>
                <!-- 多选框 -->
            <div style="position: relative;">
                <div class="ipt_layout" style="box-shadow: 0px 1px 10px rgba(201, 201, 201, 0.349019607843137);border: none;background: rgb(255, 255, 255);">
                    <div class="float_left" style="margin: .3rem 0 0 .5rem;">
                    <span style="font-size: .45rem;color: #1E1E1E;">请选择资产包</span>
                    </div>
                    <div class="float_right" style="margin: .28rem 0 0 0;">
                    <span class="font_B" style=" font-size:.5rem;color: #1E1E1E;">{{buynormalData[normalSelect].amount}} TBG</span>
                    <img  src="@/assets/img/u28.png" style="width: 0.5rem;height: 0.5rem;" @click='logIpt'> 
                    </div>
                </div>
                <!-- 下拉部分 -->
                <div v-if="selected_ipt" style="position: absolute;background: rgb(255, 255, 255);border-radius: 0.08rem;width: 80%;left: 10%;box-shadow: 0px 1px 10px rgba(201, 201, 201, 0.349019607843137);">
                    <div style="margin: .28rem 0 0 0;"  v-for="(item,index) in buynormalData" @click="normalSelectAssets(index)"><p class="font_B" style=" font-size:.5rem;color: #1E1E1E;text-align: right;margin-right: .5rem;">{{item.amount}} TBG</p></div>
                    <div style="  width: 100%;height: .28rem;"></div>
                </div>
            </div>
            <div class="ipt_layout">
              <div class="float_left" style="margin: .3rem 0 0 .5rem;">
                <span style="font-size: .45rem;color: #1E1E1E;">总价</span>
              </div>
              <div class="float_right" style="margin: .28rem .4rem 0 0;">
                <span class="font_B" style=" font-size:.5rem;color: #1E1E1E;">{{normalPrice}} UE</span>
              </div>
            </div>
            <div class="ipt_layout" style="background-color: #FF9900;">
                <p style="font-size: 0.55rem;color: #FFFFFF;text-align: center;margin-top: 0.25rem;" @click="sendBuyAsset">申请买入</p>
            </div>
            <div style="  width: 100%;height: .1rem;"></div>
            <div >
                <p style="text-align: center;"><span style="font-size: .45rem;color: #1E1E1E;">可用</span><span class="font_B" style=" font-size:.5rem;color: #1E1E1E;">10,293.3381 0000 UE</span></p>
            </div>
            <div style="  width: 100%;height: .5rem;"></div>
            </div>
            <!-- 第二部分 -->
            <div style="width: 90%;background: rgb(255, 255, 255);margin: 8px auto 0 auto;border-radius: 4px;">
            <div style="  width: 100%;height: .3rem;"></div>
            <div style="height: 1.2rem;width: 80%;margin: 0 auto;">
              <div class="display_ib" style="border-radius: 0.08rem;height: 1.2rem;width: 1.8rem;background-color: rgba(51, 204, 153, 1);">
                <div style="width: 100%;height: .05rem;"></div>
                <p style="font-size: 0.40rem;color: #FFFFFF;text-align: center;">交易开</p>
                <p style="font-size: 0.40rem;color: #FFFFFF;text-align: center;">放时间</p>
              </div>
              <div class="display_ib" style="margin-left: 8px;">
                <p>首次买入账号：{{buynormalPrice.first_buy}}:00-{{buynormalPrice.first_buys}}:00</p><p>其他账号：{{buynormalPrice.buy_time}}:00-{{buynormalPrice.buy_times}}:00</p>
              </div>
            </div>
            <div style="  width: 100%;height: .3rem;"></div>
            </div>
            <p style="font-size: .4rem;color: #FF9900;text-align: center;margin-top: .15rem;">交易开放时间内未成交订单</p>
            <p style="font-size: .4rem;color: #FF9900;text-align: center;margin-bottom: .15rem;">将在交易时间结束时自动撤单</p>
            <!-- 第三部分 -->
            <div style="width: 90%;background: rgb(255, 255, 255);margin: 8px auto 0 auto;border-radius: 4px;">
                <div style="  width: 100%;height: 25px;"></div>
                <div>
                    <p style="text-align: center;"><span style="font-size: .45rem;color: #1E1E1E;">买入</span><span class="font_B" style=" font-size:.5rem;color: #1E1E1E;"> {{buynormalData[normalSelect].amount}} TBG </span><span style="font-size: .45rem;color: #1E1E1E;">资产包可获</span></p>
                </div>
                <div style="  width: 100%;height: 20px;"></div>
                <div style="margin-bottom: 5px;">
                    <div class="display_ib" style="width:33.3%;">
                        <p style="text-align: center;font-size: .45rem;color: #1E1E1E;">线性释放池</p>
                        <p class="font_B" style="text-align: center;font-size:.5rem;color: #1E1E1E;">{{buynormalData[normalSelect].release_pool}} TBG</p>
                    </div>
                    <div class="display_ib" style="width:33.3%;">
                        <p style="text-align: center;font-size: .45rem;color: #1E1E1E;">资产包矿池</p>
                        <p class="font_B" style="text-align: center;font-size:.5rem;color: #1E1E1E;">{{buynormalData[normalSelect].mining_pool}} TBG</p>
                    </div>
                    <div class="display_ib" style="width:33.3%;">
                        <p style="text-align: center;font-size: .45rem;color: #1E1E1E;">可售额度</p>
                        <p class="font_B" style="text-align: center;font-size:.5rem;color: #1E1E1E;">{{buynormalData[normalSelect].saleable_amount}} TBG</p>
                    </div>
                </div>
                <p style="font-size: .4rem;color: #FF9900;text-align: center;">查看买入资产包规则 ></p>
                <div style="  width: 100%;height: 10px;"></div>
            </div>
            <!-- 第四部分 -->
            <div style="  width: 100%;height: 30px;"></div>
            <div>
                <span :class="{orange:buyList,font_silver:!buyList}" style="font-size: 0.45rem;margin:0 10%;" @click="logNormalList">当前买入列表</span>
                <span :class="{orange:!buyList,font_silver:buyList}" style="font-size: 0.45rem;" @click="logNormalList">历史买入记录</span>
            </div>
            <div style="  width: 100%;height: 15px;"></div>
            <!-- 当前买入列表 -->
            <div v-if="buyList" >
              <div class="asset_pool_header" > 
                <span style="width:33.3%;">时间</span>
                <span style="width:33.3%;">单价</span>
                <span style="width:33.3%;">成交 / 买入</span>
              </div>
              <div class="asset_pool_data" v-for="item in buynormalListData" :key='item.key'>
                <div class="asset_pool_data_item" style="width:33.3%;"><p>{{item.create_time}}</p></div>
                <div class="asset_pool_data_item" style="width:33.3%;"><p class="font_fine">{{item.price}}</p></div>
                <div class="asset_pool_data_item" style="width:33.3%;"><p class="">{{item.transaction}} / {{item.amount}}</p></div>
              </div>
            </div>
            <!-- 历史买入记录 -->
            <div v-if="!buyList" >
              <div class="asset_pool_header" > 
                <span style="width:25%;">时间</span>
                <span style="width:25%;">单价</span>
                <span style="width:25%;">买入</span>
                <span style="width:25%;">动作</span>
              </div>
              <div class="asset_pool_data" v-for="item in sellHistoryListData" :key='item.key'>
                <div class="asset_pool_data_item" style="width:25%;"><p>{{item.create_time}}</p></div>
                <div class="asset_pool_data_item" style="width:25%;"><p class="font_fine">{{item.price}}</p></div>
                <div class="asset_pool_data_item" style="width:25%;"><p class="font_silver">{{item.amount}}</p></div>
                <div class="asset_pool_data_item" style="width:20%;border: 0.02667rem solid orange;border-radius: 0.13333rem;margin-left: 2.5%;"><div style=" margin: .2rem auto;"><p style="font-size: .4rem;color: orange;">查看</p></div></div>
              </div>
            </div>
          </div>
        </div>
         <!-- 卖出 -->
        <div v-if="!buySell">
          <!-- 第一部分 -->
            <div style=" width: 90%;background: rgb(255, 255, 255);margin: 0 auto;border-radius: 4px;position: relative;">
            <!-- 卖出时的确认 -->
            <div style="position: absolute;width: 100%;background: rgb(255, 255, 255);top: 140px;border-radius: 4px;height:7rem;z-index: 10;" v-if="sellConfirm">
              <p style="text-align: left;margin: 20px 0 0 20px;"><span style="font-size: .45rem;color: #1E1E1E;">本次卖出 </span><span class="font_B" style=" font-size:.5rem;color: #1E1E1E;">{{sellingPrice}} TBG</span></p>
              <p style="text-align: left;margin-left: 20px;"><span style="font-size: .45rem;color: #1E1E1E;">卖出价格 </span><span class="font_B" style=" font-size:.5rem;color: #1E1E1E;">{{sellData.price}} UE</span></p>
              <p style="text-align: left;margin-left: 20px;"><span style="font-size: .45rem;color: #1E1E1E;">需扣除 </span><span class="font_B" style=" font-size:.5rem;color: #1E1E1E;">{{sellData.sell_fee_rate}}% UE</span><span style="font-size: .45rem;color: #1E1E1E;">手续费，共</span><span class="font_B" style=" font-size:.5rem;color: #1E1E1E;">{{handlingFee}} UE</span></p>
              <p style="text-align: left;margin-left: 20px;"><span style="font-size: .45rem;color: #1E1E1E;">在您的线性释放池中销毁 </span><span class="font_B" style=" font-size:.5rem;color: #1E1E1E;">{{sellData.destroy_rate}} %</span><span style="font-size: .45rem;color: #1E1E1E;">，共</span><span class="font_B" style=" font-size:.5rem;color: #1E1E1E;">{{destroy}} TBG</span></p>
              <p style="text-align: left;margin-left: 20px;"><span style="font-size: .45rem;color: #1E1E1E;">实收： </span><span class="font_B" style=" font-size:.5rem;color: #1E1E1E;">{{actualHarvest}} UE</span><span style="font-size: .45rem;color: #1E1E1E;">，确定卖出吗？</span></p>
              <p style="text-align: right;margin: 15px 25px 0 0px;"><span style="margin-right: 25px;color: #6B6B6B;" @click="logPSellConfirm">取消</span><span class="orange" @click="sendSellAsset">确认</span></p>
            </div>
            <!-- 正式的第一部分 -->
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
                <span class="font_B" style=" font-size:.5rem;color: #1E1E1E;">{{sellData.price}} UE</span>
                </div>
            </div>
            <div class="ipt_layout">
              <div class="float_left" style="margin: .3rem 0 0 .5rem;">
                <input type="text" class="text-input" :placeholder="`最多可卖`+maximumQuantity[0]" v-model="sellingPrice" style="height: .6rem;width: 3rem;font-size: .5rem;" >
              </div>
              <div class="float_right" style="margin: .28rem .4rem 0 0;">
                <span class="font_B" style=" font-size:.5rem;color: #1E1E1E;">TBG</span>
              </div>
            </div>
            <div class="ipt_layout">
              <div class="float_left" style="margin: .3rem 0 0 .5rem;">
                <span style="font-size: .45rem;color: #1E1E1E;">手续费 {{sellData.sell_fee_rate}}%</span>
              </div>
              <div class="float_right" style="margin: .28rem .4rem 0 0;">
                <span class="font_B" style=" font-size:.5rem;color: #1E1E1E;">{{handlingFee}} UE</span>
              </div>
            </div>
            <div class="ipt_layout">
              <div class="float_left" style="margin: .3rem 0 0 .5rem;">
                <span style="font-size: .45rem;color: #1E1E1E;">销毁 {{sellData.destroy_rate}}%</span>
              </div>
              <div class="float_right" style="margin: .28rem .4rem 0 0;">
                <span class="font_B" style=" font-size:.5rem;color: #1E1E1E;">{{destroy}} TBG</span>
              </div>
            </div>
            <div class="ipt_layout">
              <div class="float_left" style="margin: .3rem 0 0 .5rem;">
                <span style="font-size: .45rem;color: #1E1E1E;">实收</span>
              </div>
              <div class="float_right" style="margin: .28rem .4rem 0 0;">
                <span class="font_B" style=" font-size:.5rem;color: #1E1E1E;">{{actualHarvest}} UE</span>
              </div>
            </div>
            <div v-if="!sellingPrice" class="ipt_layout" style="background-color: rgba(188, 188, 188, 1);">
                <p style="font-size: 0.55rem;color: #FFFFFF;text-align: center;margin-top: 0.25rem;">卖出</p>
            </div>
            <div v-if="sellingPrice" class="ipt_layout" style="background-color: #FF9900;">
                <p style="font-size: 0.55rem;color: #FFFFFF;text-align: center;margin-top: 0.25rem;" @click="logPSellConfirm">卖出</p>
            </div>
            <div style="  width: 100%;height: .1rem;"></div>
            <div style="  width: 100%;height: .5rem;"></div>
            </div>
            <!-- 第二部分 -->
            <div style="width: 90%;background: rgb(255, 255, 255);margin: 8px auto 0 auto;border-radius: 4px;">
            <div style="  width: 100%;height: .3rem;"></div>
             <p style="text-align: center;"><span style="font-size: .45rem;color: #1E1E1E;">交易开放时间 : </span><span class="font_B" style=" font-size:.5rem;color: #1E1E1E;">{{sellPrice.first_buy}}:00-{{sellPrice.first_buys}}:00</span></p>
            <div style="  width: 100%;height: .3rem;"></div>
            </div>
            <p style="font-size: .4rem;color: #FF9900;text-align: center;margin-top: .15rem;">交易开放时间内未成交订单</p>
            <p style="font-size: .4rem;color: #FF9900;text-align: center;margin-bottom: .15rem;">将在交易时间结束时自动撤单</p>
            <!-- 第三部分 -->
            <div style="width: 90%;background: rgb(255, 255, 255);margin: 8px auto 0 auto;border-radius: 4px;">
                <div style="  width: 100%;height: 25px;"></div>
                <div>
                    <p style="text-align: center;"><span style="font-size: .45rem;color: #1E1E1E;">我的会员等级：{{sellData.level}} </span></p>
                </div>
                <div style="  width: 100%;height: 20px;"></div>
                <div style="margin-bottom: 5px;">
                    <div class="display_ib" style="width:33.3%;">
                        <p style="text-align: center;font-size: .45rem;color: #1E1E1E;">单次最高</p>
                        <p style="text-align: center;font-size: .45rem;color: #1E1E1E;">可卖数量</p>
                        <p class="font_B" style="text-align: center;font-size:.5rem;color: #1E1E1E;margin-top: 3px;">{{sellData.one_trx}} TBG</p>
                    </div>
                    <div class="display_ib" style="width:33.3%;">
                        <p style="text-align: center;font-size: .45rem;color: #1E1E1E;">每日最高</p>
                        <p style="text-align: center;font-size: .45rem;color: #1E1E1E;">可卖数量</p>
                        <p class="font_B" style="text-align: center;font-size:.5rem;color: #1E1E1E;margin-top: 3px;">{{sellData.day_trx}} TBG</p>
                    </div>
                    <div class="display_ib" style="width:33.3%;">
                        <p style="text-align: center;font-size: .45rem;color: #1E1E1E;">每日最多</p>
                        <p style="text-align: center;font-size: .45rem;color: #1E1E1E;">可卖次数</p>
                        <p class="font_B" style="text-align: center;font-size:.5rem;color: #1E1E1E;margin-top: 3px;">{{sellData.trx_day_count}}</p>
                    </div>
                </div>
                <p style="font-size: .4rem;color: #FF9900;text-align: center;">查看买入资产包规则 ></p>
                <div style="  width: 100%;height: 10px;"></div>
            </div>
            <!-- 第四部分 -->
            <div style="  width: 100%;height: 30px;"></div>
            <div>
                <span :class="{orange:sellList,font_silver:!sellList}" style="font-size: 0.45rem;margin:0 10%;" @click="logSelllList">当前卖出列表</span>
                <span :class="{orange:!sellList,font_silver:sellList}" style="font-size: 0.45rem;" @click="logSelllList">历史卖出记录</span>
            </div>
            <div style="  width: 100%;height: 15px;"></div>
            <!-- 当前买入列表 -->
            <div v-if="sellList" >
              <div class="asset_pool_header" > 
                <span style="width:33.3%;">时间</span>
                <span style="width:33.3%;">单价</span>
                <span style="width:33.3%;">成交 / 买入</span>
              </div>
              <div class="asset_pool_data" v-for="item in sellListData" :key='item.key'>
                <div class="asset_pool_data_item" style="width:33.3%;"><p>{{item.create_time}}</p></div>
                <div class="asset_pool_data_item" style="width:33.3%;"><p class="font_fine">{{item.price}}</p></div>
                <div class="asset_pool_data_item" style="width:33.3%;"><p class="font_silver">{{item.transaction}} / {{item.amount}}</p></div>
              </div>
            </div>
            <!-- 历史买入记录 -->
            <div v-if="!sellList" >
              <div class="asset_pool_header" > 
                <span style="width:25%;">时间</span>
                <span style="width:25%;">单价</span>
                <span style="width:25%;">买入</span>
                <span style="width:25%;">动作</span>
              </div>
              <div class="asset_pool_data" v-for="item in sellHistoryList" :key='item.key'>
                <div class="asset_pool_data_item" style="width:25%;"><p>{{item.create_time}}</p></div>
                <div class="asset_pool_data_item" style="width:25%;"><p class="font_fine">{{item.price}}</p></div>
                <div class="asset_pool_data_item" style="width:25%;"><p class="">{{item.amount}}</p></div>
                <div class="asset_pool_data_item" style="width:20%;border: 0.02667rem solid orange;border-radius: 0.13333rem;margin-left: 2.5%;"><div style=" margin: .2rem auto;"><p style="font-size: .4rem;color: orange;">查看</p></div></div>
              </div>
            </div>
        </div>

      <!-- 确定 -->
      <v-ons-action-sheet
        :visible.sync="actionSheetVisible"
        cancelable
        style="background: rgba(0,0,0,0.5);"
      >
        <div class="action_layout">
          <div class="btn_active" @click="showDialog = true">支付</div>
        </div>
      </v-ons-action-sheet>
      <v-ons-dialog
        modifier="width_pwd"
        cancelable
        style="background-color: rgba(0, 0, 0, .5);z-index: 10000;"
        :visible.sync="showDialog">
        <m-dialog v-model="password" v-on:confirm="handleConfirm" v-on:cancel="handleCancel"></m-dialog>
      </v-ons-dialog>
      <v-ons-modal :visible="loading" >
        <loading></loading>
      </v-ons-modal>

     </div>
     </slot>
    </vpage>
    
</template>
<script>
import MyPage from '@/components/MyPage'
import {getType,partnerPlacement,PlacementTransactionList,getSellHistoryList,getGeneralBuy,normalTransactionList,getGeneralSell,sellTransactionList,getSellList,
globalPartnerPlacement,buyAsset,sellAsset} from '@/servers/invitation'
import api from '@/servers/invitation'

import { format, parse } from 'date-fns'
import {Decimal} from 'decimal.js'

import MDialog from '@/components/MDialog'
import PasswordService from '@/services/PasswordService'
import CryptoAES from '@/util/CryptoAES'
import eos from '@/plugins/pog'
import serverApi from '@/servers/invitation'

export default {
  components: {
    vpage: MyPage,
    MDialog
   },
  data() {
    return {
      id:'',             //当前账户名字
      buySell:true,    //买入卖出
      selected_ipt:false, //选中资产
      buyPartner:false,   //判断全球合伙人
      buyPartnerList:true, //全球合伙人买入界面判断买入卖出列表
      buyList:true,      //买入界面判断买入卖出列表
      sellList:true,      //卖出界面判断买入卖出列表
      sellConfirm:false,   //卖出时的确认
      //全球合伙人
      globalSelect:0,     //合伙人用来选择资产包价格的数字
      globalPrice:0,      //合伙人资产包总价
      buyPartnerPrice:[    //合伙人界面价格
        {price:'',raise_price:'',},
      ],
      buyPartnerData:[    //合伙人界面数据
        
      ],
      buyPartnerListData:[    //合伙人当前买入列表数据
        
      ],
      sellHistoryListData:[    //正常和合伙人历史买入列表数据
        
      ],
      // 正常交易
      normalSelect:0,     //正常用来选择资产包价格的数字
      normalPrice:0,      //正常资产包总价
      buynormalPrice:[    //正常界面价格
        {price:'',first_buy:'',buy_time:'',first_buys:'',buy_times:''},
      ],
      buynormalData:[    //正常界面数据
        
      ],
      buynormalListData:[    //正常当前买入列表数据
        
      ],
      // 卖出交易
      sellingPrice:'',    //卖出的数量
      handlingFee:'',    //手续费
      destroy:'',        //销毁
      actualHarvest:'',   //实收
      sellPrice:[    //卖出界面时间
        {first_buy:'',first_buys:''},
      ],
      maximumQuantity:[0,[]],//最多可卖TBG数量
      sellData:{},  //卖出界面数据
      sellListData:[    //卖出当前买入列表数据
        
      ],
      sellHistoryList:[    //历史买出列表数据
        
      ],
      //区块链转站
      reqParams: {
        account: '',
        friendAccountName: ''
      },
      password: '',
      actionSheetVisible: false,
      showDialog: false,
      loading: false,
      blockchainTransferStation:0,    //判断调用哪个区块链转站    1--全球合伙人私募    2--买入资产    3--卖出资产
    }
  },
watch: {
      sellingPrice: {
          handler(newVal, oldVal) {
            //手续费
            this.handlingFee=new Decimal(this.sellData.price).mul(new Decimal(this.sellingPrice)).mul(new Decimal(this.sellData.sell_fee_rate)).mul(new Decimal(0.01)).toFixed(4);
            //销毁
            this.destroy=new Decimal(this.sellData.price).mul(new Decimal(this.sellingPrice)).mul(new Decimal(this.sellData.destroy_rate)).mul(new Decimal(0.01)).toFixed(4);
            //实收
            this.actualHarvest=new Decimal(this.sellData.price).mul(new Decimal(this.sellingPrice)).sub(new Decimal(this.handlingFee)).toFixed(4);
          }
      },
},
  methods: {
      //区块链转站
        // 验证密码
        async verifyPassword() {
          const seed = await PasswordService.encrypt(this.password);
          const wallets = this.$store.state.wallet.localFile.wallets;
          const current = wallets.find(ele => ele.accountNames[0] === this.reqParams.account);
          const privateKey = CryptoAES.decrypt(current.privateKey,seed);
          return privateKey
          // return '5KNoQXeFJp47dbtyifcCjJuhXjYmNvWPVcWYsHJJWZ8h7zAd78h';
        },
        async clickConfirm(i) {   //显示密码
              this.actionSheetVisible = true;
              this.blockchainTransferStation=i;
        },
        async goPay(privateKey,quantity,memo ) {
          if (privateKey) {
            this.showDialog = false
            try {
              const config = await this.getConfig()
              const opts = { authorization:[`${this.reqParams.account}@active`], keyProvider: privateKey }
              // await eos.transfer(this.reqParams.account, config.wallet_receiver, `100.0000 UE`, `tbg_invest:${this.reqParams.account}`, opts)
              const adm = await eos.contract('uetokencoin')
              // account_name,price,trx_type,assets_package_id ==> fb,0.5,raise,4
              const trx = await adm.transfer(this.reqParams.account, config.trade_receiver, quantity, memo, opts)
              console.log(11221111,trx);
              return true
            } catch (error) {
              console.log(error)
              error = JSON.parse(error)
              if (error.error.code == 3050003) {
                this.$toast(this.$t('common.overdrawn_balance'))
              }
              if (error.error.code == 3080004) {
                this.$toast('CPU资源受限')
              }
              return false
            }
          } else {
            this.$toast(this.$t('common.wrong_pwd'))
          }
        },
        async sellgoPay(privateKey,quantity,memo ) {
          if (privateKey) {
            this.showDialog = false
            try {
              const config = await this.getConfig()
              const opts = { authorization:[`${this.reqParams.account}@active`], keyProvider: privateKey }
              // await eos.transfer(this.reqParams.account, config.wallet_receiver, `100.0000 UE`, `tbg_invest:${this.reqParams.account}`, opts)
              const adm = await eos.contract('tbgtokencoin')
              // account_name,price,trx_type,assets_package_id ==> fb,0.5,raise,4
              const trx = await adm.transfer(this.reqParams.account, config.trade_receiver, quantity, memo, opts)
              console.log(11221111,trx);
              return true
            } catch (error) {
              console.log(error)
              error = JSON.parse(error)
              if (error.error.code == 3050003) {
                this.$toast(this.$t('common.overdrawn_balance'))
              }
              if (error.error.code == 3080004) {
                this.$toast('CPU资源受限')
              }
              return false
            }
          } else {
            this.$toast(this.$t('common.wrong_pwd'))
          }
        },
        async getConfig() {
          try {
            const res = await serverApi.getConfig()
            if (res.code === 1) {
              console.log('getConfig',res)
              return res.data
            }
          } catch (error) {
            console.log(error)
          }
        },
        async handleConfirm() {
          this.loading = true
          const privateKey = await this.verifyPassword()
          if (privateKey) {
            if(this.blockchainTransferStation==1){//全球合伙人
               let memo=this.id+','+this.buyPartnerPrice.raise_price+','+'raise'+','+this.buyPartnerData[this.globalSelect].id
               let globalPrice=new Decimal(this.globalPrice).toFixed(4)+' UE'   
               this.goPay(privateKey,globalPrice,memo);
               this.$toast('私募成功')
            }else if(this.blockchainTransferStation==2){//买入
               let memo=this.id+','+this.buynormalPrice.price+','+'buy'+','+this.buynormalData[this.normalSelect].id
               let normalPrice=new Decimal(this.normalPrice).toFixed(4)+' UE'
               this.goPay(privateKey,normalPrice,memo); 
               this.$toast('买入成功')
            }else if(this.blockchainTransferStation==3){//卖出
               let memo=this.id+','+this.sellData.price+','+'sell'+','+this.sellingPrice
               let sellingPrice=new Decimal(this.sellingPrice).toFixed(4)+' TBG'   
               this.sellgoPay(privateKey,sellingPrice,memo);
               this.$toast('卖出成功')
            }
            this.loading = false
            this.showDialog = false
            this.actionSheetVisible = false

          } else {
            this.$toast(this.$t('common.wrong_pwd'))
            this.loading = false
          }
        },
        handleCancel() {
          this.showDialog = false
        },


       back() {
          this.$router.go(-1)
       },
       logIpt() {       //切换选中资产
          this.selected_ipt=this.selected_ipt==true?this.selected_ipt=false:this.selected_ipt=true;
       },
       logBuySell() {  //切换买入卖出
          this.buySell=this.buySell==true?this.buySell=false:this.buySell=true;
       },
       logPartnerList() {  //切换全球合伙人买入卖出列表
          this.buyPartnerList=this.buyPartnerList==true?this.buyPartnerList=false:this.buyPartnerList=true;
       },
       logNormalList() {  //切换正常买入卖出列表
          this.buyList=this.buyList==true?this.buyList=false:this.buyList=true;
       },
       logSelllList() {  //切换卖出的买入卖出列表
          this.sellList=this.sellList==true?this.sellList=false:this.sellList=true;
       },
       logPSellConfirm() {  //切换卖出时的确认
          this.sellConfirm=this.sellConfirm==true?this.sellConfirm=false:this.sellConfirm=true;
       },
       globalSelectAssets(index) {  //全球合伙人资产包选择
          this.globalSelect=index;
          this.selected_ipt=this.selected_ipt==true?this.selected_ipt=false:this.selected_ipt=true;
          this.globalPrice=new Decimal(this.buyPartnerPrice.raise_price).mul(new Decimal(this.buyPartnerData[this.globalSelect].amount)).toFixed(4)
       },
       normalSelectAssets(index) {  //正常资产包选择
          this.normalSelect=index;
          this.selected_ipt=this.selected_ipt==true?this.selected_ipt=false:this.selected_ipt=true;
          this.normalPrice=new Decimal(this.buynormalPrice.price).mul(new Decimal(this.buynormalData[this.normalSelect].amount)).toFixed(4)
       },
       sendGlobalPartnerPlacement() {  //全球合伙人私募
          api.globalPartnerPlacement({account_name:this.id,price:this.buyPartnerPrice.raise_price,assets_package_id:this.buyPartnerData[this.globalSelect].id}).then(res => {   
            if (res.code === 1) {
               this.clickConfirm(1); 
              }else if(res.code===1016){
                this.$toast('已私募')
              }else{
                this.$toast('系统错误')
              }
          })
       },
       sendBuyAsset() {  //买入资产
          api.buyAsset({account_name:this.id,price:(this.buynormalPrice.price)+'',assets_package_id:this.buynormalData[this.normalSelect].id}).then(res => {   
            if (res.code === 1) {   
               this.clickConfirm(2);       
              }
          })
       },
       sendSellAsset() {  //卖出资产
          api.sellAsset({account_name:this.id,price:(this.sellData.price)+'',amount:this.sellingPrice,sell_fee:this.handlingFee,destroy:this.destroy,income:this.actualHarvest}).then(res => {   
            if (res.code === 1) {
                this.clickConfirm(3); 
              }
               this.logPSellConfirm();
          })
       },

},
  created(){
    // console.log(33333333333333333333,this.$store.state.wallet.localFile.wallets.slice()[0].accountNames[0]);
    //路由跳转判断

    if(this.$route.params.buySell==false){this.buySell=this.$route.params.buySell;}
    if(this.$route.params.buyPartner==2){this.buyPartner=true;}    
    if(this.$route.params.buyPartnerT==1){this.buyPartner=false;} 
       
    this.maximumQuantity=this.$route.params.Quantity;   //获取最多可卖出TBG数量
    this.id=this.$store.state.wallet.assets.account;   //初始化ID
     
    this.reqParams.account = this.id;   //转站
   
    setTimeout(() => {
      this.globalPrice=new Decimal(this.buyPartnerPrice.raise_price).mul(new Decimal(this.buyPartnerData[this.globalSelect].amount)).toFixed(4);//初始化合伙人资产包总价
    }, 1000);
    setTimeout(() => {
          this.normalPrice=new Decimal(this.buynormalPrice.price).mul(new Decimal(this.buynormalData[this.normalSelect].amount)).toFixed(4)//初始化正常资产包总价
    }, 1000);

    api.getType({account_name:this.id}).then(res => {    // 获取账号类型
        if (res.code === 1) {
            // res.data.account_type=="global"?this.buyPartner=true:this.buyPartner=false;
        }
      })
    //全球合伙人
    api.partnerPlacement({account_name:this.id}).then(res => {    // 获取全球合伙人私募信息
        if (res.code === 1) {
            this.buyPartnerPrice.price=res.data.price;
            this.buyPartnerPrice.raise_price=res.data.raise_price;
            this.buyPartnerData=res.data.assets_info;
        }
      })
    api.PlacementTransactionList().then(res => {    // 私募交易列表
        if (res.code === 1) {
            for(let i=0;i<res.data.length;i++){
              res.data[i].create_time=format(new Date(res.data[i].create_time), 'YYYY-MM-DD')
            }
            this.buyPartnerListData=res.data;
        }
      })
    api.getSellHistoryList({account_name:this.id}).then(res => {    // 正常和全球合伙人资产包买入记录
        if (res.code === 1) {
          for(let i=0;i<res.data.length;i++){
              res.data[i].create_time=format(new Date(res.data[i].create_time), 'YYYY-MM-DD')
            }
            this.sellHistoryListData=res.data;
        }
      })
    //正常交易  
    api.getGeneralBuy({account_name:this.id}).then(res => {    // 获取普通买入交易信息
        if (res.code === 1) {
            this.buynormalPrice.price=res.data.price;
            let[first_buy,first_buys] = res.data.first_buy.split(',');
            this.buynormalPrice.first_buy=first_buy;
            this.buynormalPrice.first_buys=first_buys;
            let[buy_time,buy_times] = res.data.buy_time.split(',');
            this.buynormalPrice.buy_time=buy_time;
            this.buynormalPrice.buy_times=buy_times;
            this.buynormalData=res.data.assets_info;
        }
      })
    api.normalTransactionList().then(res => {    // 买入交易列表
        if (res.code === 1) {
          for(let i=0;i<res.data.length;i++){
            res.data[i].create_time=format(new Date(res.data[i].create_time), 'YYYY-MM-DD')
            }
            this.buynormalListData=res.data;
        }
      })
    //卖出
    api.getGeneralSell({account_name:this.id}).then(res => {    // 获取卖出交易信息
        if (res.code === 1) {
          this.sellData=res.data;
          // sell_time
          let[first_buy,first_buys] = res.data.sell_time.split(',');
            this.sellPrice.first_buy=first_buy;
            this.sellPrice.first_buys=first_buys;
        }
      })
    api.sellTransactionList().then(res => {    // 卖出的买入交易列表
        if (res.code === 1) {
          for(let i=0;i<res.data.length;i++){
            res.data[i].create_time=format(new Date(res.data[i].create_time), 'YYYY-MM-DD')
            }
            this.sellListData=res.data;
        }
      })
    api.getSellList({account_name:this.id}).then(res => {    // 卖出的卖出交易列表
        if (res.code === 1) {
          for(let i=0;i<res.data.length;i++){
            res.data[i].create_time=format(new Date(res.data[i].create_time), 'YYYY-MM-DD')
            }
            this.sellHistoryList=res.data;
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
.asset_pool_header{
  border: 1px solid RGB(228,228,228);
  padding: 20px 0;
}
.asset_pool_header span{
  text-align: center;
  font-size: 30px;
  display:inline-block;
}
.asset_pool_data{
  border: 1px solid RGB(228,228,228);
  padding: 45px 0;
  position: relative;
  bottom: 1px;
}
.asset_pool_data_item{
  text-align: center;
  font-size: 30px;
  font-weight: 600;
  display:inline-block;
  vertical-align: middle;
}

/*确认密码*/
.action_layout {
  background-color: #fff;
  padding: 35px 50px;
}
.btn_active {
  background-color: #ff8e05;
  color: #fff;
  text-align: center;
  padding: 30px;
  border-radius: 10px;
  font-size: 36px;
  font-weight: bold;
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



