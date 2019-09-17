<template>
    <div class="checkin">
        <div class="checkin-title">
            <span class="text">
                签到
            </span>
            <span class="right">
              规则>
            </span>
        </div>
        <div class="checkin-steps">
            <div @click="userCheckin" v-for="(item, index) in list" :key="index" class="checkin-step_box" :class="{'active':item.is_check}">
                <div class="top">{{index + 1}}</div>
                <div class="mid">{{item.income}}</div>
                <div class="bot">TBG</div>
            </div>
        </div>
        <div class="checkin-link" @click="jumpSignDetails">
            签到奖励明细 >
        </div>
    </div>
</template>

<script>
import api from '@/servers/invitation'

export default {
    props: {

    },
    data () {
        return {
            list: [
                '1','2','3','4','5','6','7',
            ],
            disableClick: false
        }
    },
    created() {
        console.log('this.$store.state.wallet.assets',this.$store.state.wallet.assets)
        this.initCheckinState()
    },
     methods: {
        jumpSignDetails() {        //跳转签到奖励明细
          this.$router.push({
          name: 'SignDetails',
        })
       },
       userCheckin () {
            if(this.disableClick) return
            this.disableClick = true
            api.UseCheckin({
                account_name: this.$store.state.wallet.assets.account
            }).then(async res => {
                if ( res.code === 1 ) {
                    await this.initCheckinState()
                } else if ( res.code === 1019 ) {
                    this.$ons.notification.alert('您今天已经签到了哦！')
                } else {
                    this.$ons.notification.alert('签到失败')
                }
                this.disableClick = false
            }).catch(() => {
                this.disableClick = false
            })
       },
       initCheckinState () {
            api.CheckIn({
                account_name: this.$store.state.wallet.assets.account
            }).then(res => {
                console.log('res.data.detail',res)
                if (res.data.detail.length>0){
                    this.list = res.data.detail
                }
            })
       }
    }
}
</script>

<style scoped>
    .checkin {
        background: #fff;
        text-align: center;
    }
    .checkin-title {
        text-align: center;
        font-size: .5rem;
        position: relative;
        height: 1.3rem;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 0.35rem;
    }
    .checkin-title>.text{
        color: #FF9900;
    }
    .checkin-title>.right{
        font-size:0.35rem;
        position: absolute;
        right: .3rem;
        top: 50%;
        transform: translateY(-50%);
    }
    .checkin-steps{
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
        /* background: #fff; */
        padding: .4rem 0;
        position: relative;
        color: #BCBCBC;
    }
    .checkin-steps>.active{
        color: #FF9900;
    }
    .checkin-steps>.active>.top, .checkin-steps>.active>.top::after{
        background: #FF9900;
        color: #fff;
    }
    .checkin-step_box{
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: .4rem;
        width: 13%;
        position: relative;
        z-index: 1;
    }
    .checkin-step_box>.top{
        width: 1rem;
        height: 1rem;
        line-height: 1rem;
        color: rgb(143, 143, 143);
        font-size: .4rem;
        border-radius: 50%;
        background: #fff;
        text-align: center;
        flex-shrink: 1;
        margin-bottom: .2rem;
        box-shadow: 0px 1px 10px rgba(201, 201, 201, 0.349019607843137);
    }
    .checkin-step_box>.top::after{
        position: absolute;
        content: '';
        width: 100%;
        height: .09rem;
        background: rgb(238, 238, 238);
        top: .5rem;
        left: 50%;
        z-index: -1;
    }
    .checkin-step_box:nth-last-child(1)>.top::after{
        display: none;
    }
    .checkin-step_box>.mid{

    }
    .checkin-step_box>.bot{

    }
    .checkin-link{
        display: inline-block;
        line-height: 2.2em;
        font-size: .35rem;
        padding: 0 .5rem;
        border-radius: 1em;
        background: #FF9900;
        color: #fff;
        margin: .3rem 0 .5rem 0;
    }
</style>