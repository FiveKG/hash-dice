<template>
  <vpage>
    <slot>
      <div class="page_header">
        <img class="ion_back" src="@/assets/img/back.png" @click="back"> 
        <span>{{$t('assets.transfer')}}</span>
      </div>
      <div class="card" @click="clickAction('straight')">
        <img src="@/assets/img/transfer_gold.png">
        <span>{{$t('assets.transfer_straight')}}</span>
        <div class="next">
          <img src="@/assets/img/transfer_arrow.png">
        </div>
      </div>
      <div class="card" @click="clickAction('contact')">
        <img src="@/assets/img/transfer_contact.png">
        <span>{{$t('assets.transfer_contact')}}</span>
        <div class="next">
          <img src="@/assets/img/transfer_arrow.png">
        </div>
      </div>
      <div class="card" @click="clickAction('scanner')">
        <img src="@/assets/img/transfer_scan.png">
        <span>{{$t('assets.transfer_scan')}}</span>
        <div class="next">
          <img src="@/assets/img/transfer_arrow.png">
        </div>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import MyHeader from '@/components/MyHeader'
export default {
  components: {
    vpage: MyPage,
    vheader: MyHeader
  },
  methods: {
    clickAction(type) {
      switch (type) {
        case 'straight':
          if (this.$route.query.chain === 'eos') {
            this.$router.push({
              name: 'TransferStraight'
            })
          } else if(this.$route.query.chain === 'pog') {
            this.$router.push({
              name: 'PogTransferStraight'
            })
          }else {
            this.$router.push({
              name: 'EthTransferStraight'
            })
          }
          break;
        case 'contact':
          this.$router.push({
            name: 'Contacts'
          })
          break;
        case 'scanner':
          this.$router.push({
            name: 'Scanner'
          })
          break;
      
        default:
          break;
      }
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
.card {
  margin: 33px 34px 0 34px;
  padding: 92px 67px;
  border-radius: 15px;
  display: flex;
  align-items: center;
}
.card img {
  width: 70px;
  height: 70px;
}
.card span {
  margin-left: 50px;
  font-size: 28px;
}
.next {
  flex: 1;
  text-align: right;
}
.next img {
  width: 22px;
  height: 40px;
}

.layout {
  padding: 15px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}
.action_card {
  box-shadow: 1px 1px 10px #e6e6e6;
  background-color: white;
  border-radius: 4px;
  margin: 0 .5rem;
  padding: .8rem 0;
  text-align: center;
}
.action_img {
  width: 30px;
  height: 30px;
  display: inline-flex;
  vertical-align: middle;
}
.action_text {
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  line-height: 1;
  font-size: 14px;
  box-sizing: inherit;
  margin-top: 15px;
}
.history {
  display: flex;
  flex-direction: column;
  height: auto;
  min-height: 0;
  max-height: 100%;
  flex: 10000 1 0%;
  margin-top: 15px;
  background-color: white;
  border-radius: 4px;
  padding: 15px;
}
.empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
