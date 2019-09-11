<template>
  <div class="pub-header">
    <div class="logo"><img src="@/assets/img/u14.png" alt="" @click="Back()"></div>
    <div class="title">{{HeaderTitlle}}</div>
    <div class="action">
      <div class="more"><img src="@/assets/img/更多.png" alt=""></div>
      <div class="exit"><img src="@/assets/img/u102.png" alt=""></div>
    </div>
  </div>
</template>

<script>
export default {
  components: {

  },
  props: [
    'HeaderTitlle',
  ],
  data() {
    return {
      
    }
  },
  methods: {
    // 返回上一页
    Back(){
      this.$router.go(-1);
    }
  },
  created(){
    
  }
}
</script>


<style scoped>
  .pub-header{
    height: 1.6rem;width: 100%;position: fixed;background-color: rgb(27, 27, 27);display: flex;z-index: 9999;
  }
  .pub-header .logo{
    height: 100%;width: 20%;display: flex;
  }
  .pub-header .logo img{
    height: 1.2rem;width: auto;margin: auto;
  }
  .pub-header .title{
    height: 100%;width: 40%;padding-left: 10px;line-height: 1.6rem;color:white;font-size: 0.5rem;
  }
  .pub-header .action{
    height: 60%;width: 36%;display: flex;margin: auto 2%;border-radius: 10px;border: 0.02rem solid #6e6767;
  }
  .pub-header .action .more{
    height: 100%;width: 50%;display: flex;border-right: 0.02rem solid #6e6767;
  }
  .pub-header .action .more img{
    height: 100%;width: auto;margin: auto;
  }
  .pub-header .action .exit{
    height: 100%;width: 50%;display: flex;
  }
  .pub-header .action .exit img{
    height: 80%;width: auto;margin: auto;
  }
</style>

