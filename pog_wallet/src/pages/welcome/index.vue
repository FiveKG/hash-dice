<template>
    <div class="welcome">
        <div v-if="index < 3" @click="passHandle" class="pass_btn">跳过</div>
        <transition-group name='scenes'>
            <div class="scenes_wrapper" v-if="index === 1" key="1">
                <div class="scenes_1_text scenes_text"></div>
                <div class="scenes_1"></div>
                <div class="scenes_1_man"></div>
            </div>
            <div class="scenes_wrapper" v-if="index === 2" key="2">
                <div class="scenes_2_text scenes_text"></div>
                <div class="scenes_2"></div>
            </div>
            <div class="scenes_wrapper" v-if="index === 3" key="3">
                <div class="scenes_3_text scenes_text"></div>
                <div class="scenes_3"></div>
                <div class="scenes_3_grey"></div>
                <div class="scenes_3_blue"></div>
                <div @click="passHandle" class="enter_btn">
                    立即体验
                </div>
            </div>
        </transition-group>
        <div v-if="index < 3" class="dot_wrapper">
            <div @click="dotToggle(1)" :class="{'active': index === 1}" class="dot"></div>
            <div @click="dotToggle(2)" :class="{'active': index === 2}" class="dot"></div>
            <div @click="dotToggle(3)" :class="{'active': index === 3}" class="dot"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'welcome',
    data () {
        return {
            index: 0,
            timer: '',
            isSliding: false
        }
    },
    mounted() {
        this.timer = setInterval(() => {
            if (!this.isSliding) {
                this.index++
            }
            if (this.index >= 3) {
                console.log('this.timer',this.timer)
                clearInterval(this.timer)
                this.timer = null
            }
        }, 2500)
    },
    beforeDestroy() {
        console.log('欢迎页已注销')
        clearInterval(this.timer)
        this.timer = null
    },
    methods: {
        dotToggle (id) {
            // this.index = id
        },
        passHandle() {
            this.$router.push({name:'index'})
        }
    },
}
</script>

<style scoped>
.welcome {
    width: 100vw;
    height: 100vh;
    position: relative;
}
.scenes_wrapper {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}
.pass_btn {
    z-index: 999999999;
    font-size: .4rem;
    color: aliceblue;
    background: rgba(20, 20, 20, .2);
    line-height: 2.5em;
    border-radius: 1.5em;
    padding: 0 1.3em;
    position: absolute;
    right: 1rem;
    top: 1.8rem;
}
.dot_wrapper {
    position: absolute;
    bottom: 2rem;
    left: 0;
    display: flex;
    justify-content: center;
    width: 100%;
}
.dot {
    width: .4rem;
    height: .4rem;
    border-radius: .25rem;
    margin: 0 .2rem;
    background: rgba(20, 20, 20, .2);
    transition: all .8s;
}
.dot.active {
    width: .8rem;
    background: rgb(92, 86, 232);
}
.enter_btn {
    position: absolute;
    z-index: 999999999;
    bottom: 1.6rem;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(to right,rgba(92, 86, 232, .8), rgb(92, 86, 232) );
    font-size: .6rem;
    color: #fff;
    line-height: 2.4em;
    border-radius: .5rem;
    padding: 0 1.7rem;
    white-space: nowrap;
}
.scenes_1{
    background: url('../../assets/welcome/1-bg.png');
    /* animation: scenes_1 3s ease-in-out infinite alternate; */
}
.scenes_1_text{
    background: url('../../assets/welcome/1-text.png');
}
.scenes_1_man{
    background: url('../../assets/welcome/1-man.png');
    animation: scenes_1_man 1s ease-in-out infinite alternate;
}
.scenes_2{
    background: url('../../assets/welcome/2.png');
}
.scenes_2_text{
    background: url('../../assets/welcome/2-text.png');
}
.scenes_3{
    background: url('../../assets/welcome/3-man.png');
}
.scenes_3_text{
    background: url('../../assets/welcome/2-text.png');
}
.scenes_3_grey {
    background: url('../../assets/welcome/3-grey.png');
    animation: scenes_1_man 1s ease-in-out infinite alternate;
}
.scenes_3_blue {
    background: url('../../assets/welcome/3-blue.png');
    animation: scenes_1_man 2s ease-in-out .5s infinite alternate;
}
.scenes_1, .scenes_2, .scenes_3, .scenes_1_man, .scenes_text,.scenes_3_grey,.scenes_3_blue {
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: center 20%;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}
.scenes_text{
    background-position: center 100%;
}
.scenes-enter-active, .scenes-leave-active {
    transition: all 1s;
}
.scenes-enter{
    transform: translateX(100%);
    opacity: 0;
}
.scenes-leave-to{
    transform: translateX(-100%);
}
@media ( min-width: 767px) {
    .scenes_1, .scenes_2, .scenes_3, .scenes_1_man, .scenes_text,.scenes_3_grey,.scenes_3_blue {
        background-size: auto 50%;
    }
}
/* 
@keyframes scenes_1 {
    from{
        transform:perspective(6rem) translate3d(0, 0, 0);
    }
    to{
        transform:perspective(6rem) translate3d(0, 0, -2rem);
    }
} */

@keyframes scenes_1 {
    from{
        transform:rotateZ(-2deg) translateY(-.2rem);
    }
    to{
        transform:rotateZ(2deg) translateY(.3rem);
    }
}

@keyframes scenes_1_man {
    from{
        transform: translateY(0);
    }
    to{
        transform: translateY(-.5rem);
    }
}
</style>