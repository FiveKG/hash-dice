import Vue from 'vue'
import Router from 'vue-router'
import GlovalLotto from '@/pages/GlovalLotto'
import LottoGame from '@/pages/LottoGame'
import MyBetRecordList from '@/pages/MyBetRecordList'
import QqcBetDetail from '@/pages/BetDetail'
import OpenRecordList from '@/pages/OpenRecordList'
import QqcOpenDetail from '@/pages/OpenDetail'
import GlovalLottoRule from '@/pages/GameRule'

Vue.use(Router)

export default new Router({
  routes: [
    {//启动页
      path: '/',
      name: 'GlovalLotto',
      component: GlovalLotto
    },
    {//首页
      path: '/LottoGame',
      name: 'LottoGame',
      component: LottoGame,
    },
    {//我的投注记录
      path: '/MyBetRecordList',
      name: 'MyBetRecordList',
      component: MyBetRecordList,
    },
    {//投注详情
      path: '/QQC/BetDetail',
      name: 'QqcBetDetail',
      component: QqcBetDetail,
    },
    {//开奖记录
      path: '/OpenRecordList',
      name: 'OpenRecordList',
      component: OpenRecordList,
    },
    {//开奖详情
      path: '/QQC/OpenDetail',
      name: 'QqcOpenDetail',
      component: QqcOpenDetail,
    },
    {//规则介绍
      path: '/GlovalLottoRule',
      name: 'GlovalLottoRule',
      component: GlovalLottoRule,
    },

  ]
})