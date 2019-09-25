<template>
  <div id="app">
    <router-view v-if="showIndex"/>
  </div>
</template>

<script>
  import { Toast } from 'vant';
  import Eos from 'eosjs';
  import ScatterJS from 'scatterjs-core';
  import ScatterPOG from 'scatterjs-plugin-eosjs';
  import { storage , getConfig , scatterOneStop} from '@/servers';
  
  ScatterJS.plugins( new ScatterPOG() );

  export default {
    name: 'App',
    components: {
      
    },
    data() {
      return {
        showIndex:true
      }
    },
    created: function () {
      
    },
    methods: {
      // 获取基础配置
      // getConfig: function(){
      //   getConfig().then( async res => {
      //     console.log("获取基础配置:",res)
      //     if(res.code == 1){
      //       var blovk_arr = res.data.chain_info.http_end_point.split(':');
      //       let network = {
      //         blockchain:'eos',
      //         chainId:res.data.chain_info.chain_id,
      //         host:blovk_arr[1].substring(2),
      //         port:blovk_arr[2],
      //         protocol:blovk_arr[0]
      //       }
      //       console.log("获取配置信息中的network:",network);
      //       this.$store.commit('setNetwork',network);
      //       this.$store.commit('setCollectionAccount',res.data.collection_account);
      //       this.$store.commit('setBalanceChangeType',res.data.balanceChangeType);
      //       // 连接Scatter => 登录Scatter => Scatter查询余额 => Api接口登录 => 获取我的俱乐部 => 获取我的余额
      //       var result = await scatterOneStop();
      //       console.log("Scatter一站式调用结果:",result);
      //       if(result.code !== 1){
      //         Toast(result.desc);
      //       }
      //       this.showIndex = true;
            
      //     }
      //   }).catch(err =>{
      //     this.showIndex = true;
      //     Toast("获取基础配置失败");
      //     console.log("获取基础配置失败:",err)
      //   });
      // },
    },
  }

</script>

<style>
  html,body{
    width: 100vw;
    height: 100vh;
    overflow: scroll;
    margin: 0px;
    padding: 0px;
    background: #e84244;
}
  #app {
    font-family:"微软雅黑";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow: hidden;
    /* background-color: #282828; */

  }

</style>
