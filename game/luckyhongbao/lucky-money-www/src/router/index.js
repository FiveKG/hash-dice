import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index/Index'
import CreateClub from '@/pages/CreateClub/CreateClub'
import CreateRoom from '@/pages/CreateRoom/CreateRoom'
import Gameplay from '@/pages/Gameplay/Gameplay'
import Course from '@/components/Course/Course'
import MoreSpecials from '@/pages/MoreSpecials/MoreSpecials'
import QuicklyJoin from '@/pages/QuicklyJoin/QuicklyJoin'
import MoneyClub from '@/pages/MoneyClub/MoneyClub'
import Club from '@/pages/Club/Club'
import ClubLeaderboard from '@/pages/Sidebar/ClubLeaderboard'
import DividingPool from '@/pages/Sidebar/DividingPool'
import CurrencyPage from '@/pages/Sidebar/CurrencyPage'
import InviteFriends from '@/pages/Sidebar/InviteFriends'
import MyClub from '@/pages/Sidebar/MyClub'
import MyDividend from '@/pages/Sidebar/MyDividend'
import AccountReport from '@/pages/Sidebar/AccountReport'

import Iframe from '@/pages/iframe/Iframe'

Vue.use(Router)

export default new Router({

  routes: [
    // {
    //     path: '/',
    //     name: '首页_1',
    //     component: Index,
    // },
    // {
    //   path: '/index',
    //   name: '首页',
    //   component: Index,
    // },
    // {
    //   path: '/club',
    //   name: '俱乐部',
    //   component: Club,
    // },
    // {
    //   path: '/createclub',
    //   name: '创建俱乐部',
    //   component: CreateClub,
    // },
    // {
    //   path: '/createroom',
    //   name: '创建红包房间',
    //   component: CreateRoom,
    // },
    {
      path: '/gameplay',
      name: '游戏玩法',
      component: Gameplay,
    },
    {
      path: '/course',
      name: 'POG教程',
      component: Course,
    },
    // {
    //   path: '/morespecials',
    //   name: '更多专场-官方俱乐部',
    //   component: MoreSpecials,
    // },
    // {
    //   path: '/quicklyjoin',
    //   name: '快速加入俱乐部',
    //   component: QuicklyJoin,
    // },
    {
      path: '/',
      name: '抢红包页面',
      component: MoneyClub,
    },

    // 以下为侧边栏页面
    // {
    //   path: '/clubleaderboard',
    //   name: '俱乐部排行榜',
    //   component: ClubLeaderboard,
    // },
    {
      path: '/dividingpool',
      name: '分红池',
      component: DividingPool,
    },
    {
      path: '/currencypage',
      name: '币种-RB',
      component: CurrencyPage,
    },
    {
      path: '/invitefriends',
      name: '邀请好友',
      component: InviteFriends,
    },
    // {
    //   path: '/myclub',
    //   name: '我的俱乐部',
    //   component: MyClub,
    // },
    {
      path: '/mydividend',
      name: '我的分红',
      component: MyDividend,
    },
    {
      path: '/accountreport',
      name: '账号报表',
      component: AccountReport
    },
    {
      path: '/iframe',
      name: 'PC 端模拟 mobile',
      component: Iframe
    }

    ]
})
