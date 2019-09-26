<template>
    <vpage >
     <slot>
       <div style=" background-color: rgb(243,243,243);height:100%;">
        <div style="width:100%;height:25%;"></div>
       <div style="" class="box"><p class="p_white">Free</p><p class="p_white">OTC</p></div>
       <p style=" font-weight: 400;font-size: .63rem;color: #5E5E5E;text-align: center;margin-top: 5px;">Free.OTC</p>
        <div style="position: absolute;text-align: center;bottom:10%;width:100%;">
          <p class="p_content" >提示</p>
          <p class="p_content" style="width:80%;margin:12px auto 0 auto;text-align: left;">您好，【Free . OTC】目前不支持来自下列国家或地区的用户：中国内地、朝鲜、美国（包括所有美国领士）</p>
        </div>
       
         
       </div>

      
     </slot>
    </vpage>
    
</template>

<script>
import MyPage from '@/components/MyPage'

export default {
  components: {
    vpage: MyPage,
   },
  data() {
    return {
      log:true,
   
    }
  },
  methods: {
       back() {
          this.$router.go(-1)
       },
  },
  created(){
    // console.log('this',this);
   
  }
}
</script>

<style scoped>
.box{
  background: rgb(43,198,220);
  margin: 0 auto;
  width: 3rem;
  height:3rem;
  border-radius: 6px;
}
.p_content{
  font-weight: 400;
  font-style: normal;
  font-size: .45rem;
  color: #5E5E5E;
}
.p_white{
    font-family: 'Poiret One Bold', 'Poiret One Regular', 'Poiret One';
    font-weight: 700;
    font-style: normal;
    font-size: 1.2rem;
    color: #FFFFFF;
    text-align: center;
}
p{
  font-family: '微軟正黑體 Regular', '微軟正黑體';
}   


</style>