<template>
  <vpage>
    <slot>
      <div class="page_header">
        <img class="ion_back" src="@/assets/img/back.png" @click="back"> 
        <span>{{$t('me.announcement')}}</span>
      </div>
      <div style="width: 100%;height: 15px;"></div>
      <div style="width: 100%;height: 1rem;vertical-align: top;">
        <div class="display_ib" style="width: 20%;height: 1rem;vertical-align: top;"><p class="font_size_four" style="text-align: center;line-height: 1rem;">标题：</p></div>
        <div class="display_ib" style="width: 80%;height: 1rem;vertical-align: top;"><input v-model="title" name="" class="tl-price-input" type="text" maxlength="16" placeholder="请输入标题"></div>
      </div>
      <div style="width: 100%;height: 20px;"></div>
      <div style="width: 100%;height: 10rem;vertical-align: top;">
        <div class="display_ib" style="width: 20%;height: 1rem;vertical-align: top;"><p class="font_size_four" style="text-align: center;line-height: 1rem;">内容：</p></div>
        <div class="display_ib" style="width: 80%;height: 10rem;vertical-align: top;"><textarea v-model="details" name="" class="tl-price-input" type="text" maxlength="16" placeholder="请输入内容" style="height: 100%;"></textarea></div>
      </div>
      <div style="width: 100%;height: .8rem;"></div>
      <div class="ant-btn " @click="clickItem">发布</div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import api from '@/servers/invitation'


export default {
  components: {
    vpage: MyPage
  },
  data() {
    return {
      title:'',
      details:'',
    }
  },
  methods: {
    clickItem() {
      api.systemAnnouncement({creator:this.$store.state.wallet.assets.account,title:this.title,description:this.details}).then(res => {
        if (res.code === 1) {
          console.log(res);
        }
      })
    },
    back() {
      this.$router.go(-1)
    }
  },
  created(){
      console.log(this.$store.state.wallet.assets.account)
  }
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

.tl-price-input{
    width: 80%;
    height: 80%;
    font-size: .4rem; 
    border: 1px solid #ccc;
    padding: 7px 0;
    background: #F4F4F7;
    border-radius: 10px;
    padding-left:5px;
    font-family: Arial;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s
}
.tl-price-input:focus{
    border-color: #66afe9;
    outline: 0;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)
}
.ant-btn {
    width: 1.5rem;
    height: .8rem;
    border-radius: 10px;
    background: #66afe9;
    color: #fff;
    text-align: center;
    line-height: .8rem;
    font-size: .4rem;
    position: relative;
    left: 70.5%;
}



.display_ib{
  display: inline-block;
}
.font_size_four{
  font-size: .4rem;
}
</style>
