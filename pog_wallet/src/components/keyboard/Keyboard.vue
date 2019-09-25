<template>
  <transition name="slide">
      <div class="keyboard" v-show="show">
          <div class="list_row">
            <div class="key"  style="width:100%;" @touchstart="typing('hide',$event)" @touchend="inputEnd($event)">
              <img src="./icon-keyboard.svg" alt="">
            </div>
          </div>
          <div class="list_row">
            <div class="key" @touchstart="typing('1',$event)" @touchend="inputEnd($event)">1</div>
            <div class="key" @touchstart="typing('2',$event)" @touchend="inputEnd($event)">2</div>
            <div class="key" @touchstart="typing('3',$event)" @touchend="inputEnd($event)">3</div>
          </div>
          <div class="list_row">
            <div class="key" @touchstart="typing('4',$event)" @touchend="inputEnd($event)">4</div>
            <div class="key" @touchstart="typing('5',$event)" @touchend="inputEnd($event)">5</div>
            <div class="key" @touchstart="typing('6',$event)" @touchend="inputEnd($event)">6</div>
          </div>
          <div class="list_row">
            <div class="key" @touchstart="typing('7',$event)" @touchend="inputEnd($event)">7</div>
            <div class="key" @touchstart="typing('8',$event)" @touchend="inputEnd($event)">8</div>
            <div class="key" @touchstart="typing('9',$event)" @touchend="inputEnd($event)">9</div>
          </div>
          <div class="list_row">
            <div class="key" @touchstart="typing('W',$event)" @touchend="inputEnd($event)">W</div>
            <div class="key" @touchstart="typing('0',$event)" @touchend="inputEnd($event)">0</div>
            <div class="key" @touchstart="typing('del',$event)" @touchend="inputEnd($event)">
              <i class="iconfont icon-keyboard-delete del"></i>
            </div>
          </div>
      </div> 
    </transition>
</template>

<script>
import './fonts/iconfont.css'

export default {
  props: ['show'],
  methods: {
    typing (val,e) {
      this.$emit('typing', val);
      this.highlight(e.currentTarget);
    },
    inputEnd (e) {
      this.unhighlight(e.currentTarget);
    },
    highlight (e) {
      e.style.backgroundColor = '#c3c7cf'
    },
    unhighlight (e) {
      setTimeout(()=>{
        e.style.backgroundColor = '#fff'
      },100)
    }
  },
}
</script>

<style scoped>
@keyframes slideInDown {
  from {
    transform: translate3d(0, 0, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, 100%, 0);
    display: none;
  }
}
@keyframes slideInUp {
  from {
    transform: translate3d(0, 100%, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}
.slide-enter-active {
  animation-name: slideInUp;
}
.slide-leave-active {
  animation-name: slideInDown;
}
.keyboard {
  height: 500px;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 10000;
  font-size: 50px;
  background-color: #fff;
  animation-duration: .2s;
	animation-fill-mode: both;
}
.list_row {
  display: flex;
  height: 20%;
}
.key {
  flex: 1;
  border-right: 1PX solid #d6d6d6;
  border-top: 1PX solid #d6d6d6;
  display: flex;
  justify-content: center;
  align-items: center;
}
.key img {
  height: 60px;
}
.key:nth-child(3n) {
  border-right: none;
}
.del {
  font-size: 50px;
}
</style>
