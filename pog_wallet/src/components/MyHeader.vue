<template>
  <div class="header" :style="{background: background, color: color}">
    <div> 
      <img v-if="white" class="ion_back" src="@/assets/img/back_fff.png" @click="back"> 
      <img v-else class="ion_back" src="@/assets/img/back.png" @click="back"> 
    </div>
    <img v-if="icon" :src="icon" class="ion_scanner">
    <div class="select_title">{{title}}</div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    },
    background: {
      type: String
    },
    color: {
      type: String
    },
    icon: {
      type: String
    },
    white: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    }
  },
}
</script>

<style scoped>
.page_header {
  position: relative;
  line-height: 1.2;
  vertical-align: middle;
  font-size: 1rem;
  text-align: center;
}
.arrow_back {
  position: absolute;
  left: 0;
  top: 0;
  height: 20px;
}

.header {
  padding: 55px;
  border-bottom: 1px solid rgb(202, 202, 202);
  position: relative;
}
.select_title {
  margin-top: 70px;
  font-size: 34px;
}
.ion_back {
  width: 42px;
  height: 32px;
}
.ion_scanner {
  width: 50px;
  height: 50px;
  position: absolute;
  right: 55px;
  top: 55px;
}
</style>