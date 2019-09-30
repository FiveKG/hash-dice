<template>
  <transition name="fade">
    <div class="my_toast" v-show="show">
      <span>{{msg}}</span>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      msg: ''
    }
  },
}
</script>

<style scoped>
.my_toast {
  position: fixed;
  bottom: 8%;
  width: 100%;
  text-align: center;
  font-size: 3.4vw;
  z-index: 999999;
}
.my_toast span {
  padding: 2vw 3vw;
  color: rgb(31, 31, 31);
  background-color: rgb(209, 209, 209);
  border-radius: 4vw;
  max-width: 65vw;
  display: inline-block;
  text-align: left;
  line-height: 1.2;
}
.fade-enter-active,
.fade-leave-active {
  transition: 0.4s ease-out;
}
.fade-enter {
  opacity: 0;
  /* transform: scale(1.2); */
}
.fade-leave-to {
  opacity: 0;
  /* transform: scale(0.8); */
}
</style>
