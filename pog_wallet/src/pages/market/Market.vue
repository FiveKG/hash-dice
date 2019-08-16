<template>
  <vpage>
    <slot>
      <div>
        <div class="page_header">
          <!-- <v-ons-tabbar 
            swipeable
            position="top"
            modifier="market"
            @postchange="postchange"
          >
            <template slot="pages">
              <markets id="markets"></markets>
              <news id="news"></news>
            </template>
            <ons-tab page="markets">
              <input type="radio" style="display: none">
              <button class="tabbar__button">
                <div class="tabbar__label">行情</div>
              </button>
            </ons-tab>
            <ons-tab page="news">
              <input type="radio" style="display: none">
              <button class="tabbar__button">
                <div class="tabbar__label">快讯</div>
              </button>
            </ons-tab>
          </v-ons-tabbar> -->
          <div class="edit"></div>
          <tab class="type_tab" :animate="false" customClass>
            <tab-item class="item" customClass v-for="(item, key) in tabs" :key="key" @on-item-click="clickTab(item, key)">
              <span :style="{borderBottom: item === selectedTab ? '2px solid red':'none'}">{{item}}</span>
            </tab-item>
          </tab>
          <div class="add"></div>
        </div>
        <swiper class="page_content" v-model="index" :show-dots="false">
          <swiper-item>
            <markets></markets>
          </swiper-item>
          <swiper-item>
            <news></news>
          </swiper-item>
        </swiper>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage';
import Markets from './Markets';
import News from './News';
import tab from '@/components/tab/tab';
import tabItem from '@/components/tab/tab-item';
import swiper from '@/components/tab/swiper.vue';
import swiperItem from '@/components/tab/swiper-item';

export default {
  components: {
    vpage: MyPage,
    Markets,
    News,
    tab,
    tabItem,
    swiper,
    swiperItem
  },
  data() {
    return {
      tabs: ['行情', '快讯'],
      selectedTab: '行情',
      index: 0
    }
  },
  created () {
    console.log('market')
    
  },
  methods: {
    clickTab(item, index) {
      this.selectedTab = item
      this.index = index
    }
  },
  watch: {
    index(val) {
      this.selectedTab = this.tabs[val]
    }
  },
}
</script>

<style scoped>
.market_tab {
  height: 100%;
  padding: 0;
  background-color: #fff;
}
.page_header {
  background-color: #fff;
  display: flex;
  position: fixed;
  width: 100%;
  height: 100px;
  z-index: 1000;
  border-bottom: 1PX solid #f6f6f6;
}
.edit {
  flex: 1;
}
.add {
  flex: 1;
}
.type_tab {
  height: 100%;
  padding: 0;
  flex: 2;
  background-color: #fff;
}
.item {
  height: 100px;
  line-height: 100px;
}
.tabbar__label {
  font-size: 34px;
  font-weight: 450;
  color: #000;
  box-sizing: border-box;
}
:checked + .tabbar__button .tabbar__label {
  border-bottom: 5px solid #ec565a;
}
:checked + .tabbar__button {
  color: #000;
}
.page_content {
  height: calc(100vh - 120px);
  padding-top: 100px;
  box-sizing: border-box;
}
</style>
