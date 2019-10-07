<template>
  <vpage>
    <slot>
      <div class="page_header">
        <img class="ion_back" src="@/assets/img/back.png" @click="back"> 
        <span>{{$t('me.announcement')}}</span>
      </div>
      <div>
        <div><span>标题</span></div>
        <div><textarea class="input" v-model="title"></textarea></div>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'

export default {
  components: {
    vpage: MyPage
  },
  data() {
    return {
      title:'',
      details:''
    }
  },
  methods: {
    clickItem(type) {
      
    },
    back() {
      this.$router.go(-1)
    }
  },
}
</script>

<style scoped>
.page_header {
  padding: 30px 55px;
  text-align: center;
  position: relative;
  font-size: 34px;
  background-color: #fff;
}
.ion_back {
  width: 42px;
  height: 32px;
  position: absolute;
  left: 55px;
  top: 50%;
  transform: translate(0, -50%);
}
.page_content {
  margin-top: 22px;
  background-color: #fff;
}
.input{ 
  height: .6rem;
  width: 3rem;
  font-size: .5rem; 
}
</style>
