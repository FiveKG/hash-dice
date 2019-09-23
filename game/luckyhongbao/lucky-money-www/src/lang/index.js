import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zh from './zh'
import en from './en'
import zhCN from 'vant/lib/locale/lang/zh-CN';
import enUS from 'vant/lib/locale/lang/en-US';


Vue.use(VueI18n)
const i18n=new VueI18n({
  locale:localStorage.applang || "zh",
  messages:{
    en:{
      ...enUS,
      ...en
    },
    zh:{
      ...zhCN,
      ...zh
    }
  }

})
export default i18n
