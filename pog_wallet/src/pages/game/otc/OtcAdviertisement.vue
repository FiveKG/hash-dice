<template>
    <vpage >
     <slot>
      

      <div style="width: 100%;height: 60px;"></div>
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