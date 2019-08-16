<template>
  <vpage>
    <slot>
      <div class="layout">
        <div style="flex:1;">
          <div class="page_header">
            <img class="ion_back" src="@/assets/img/back.png" @click="back"> 
            <span>{{$t('me.contact')}}</span>
          </div>
          <div class="page_content">
            <div class="item" v-for="item in contacts" @click="clickItem(item)">
              <div class="name">{{item.account}} <span class="memo" v-if="item.memo">( {{item.memo}} )</span> </div>
              <span class="chain">{{item.chain}} </span>
              <img src="@/assets/img/transfer_arrow.png" alt="">
            </div>
          </div>
        </div>
        <div class="btn">
          <span @click="clickCreate">{{$t('me.add_contact')}}</span>
        </div>
      </div>
    </slot>
  </vpage>
</template>

<script>
import MyPage from '@/components/MyPage'
import { it } from 'ethers/wordlists';

export default {
  components: {
    vpage: MyPage
  },
  data() {
    return {
      contacts: []
    }
  },
  created() {
    this.contacts = this.$store.state.wallet.localFile.contacts
  },
  methods: {
    clickItem(item) {
      console.log(item)
      if (item.chain == 'ETH'){
        this.$router.push({
          name: 'EthTransferStraight',
          query: {
            to: item.account
          }
        })
      } else if (item.chain == 'POG'){
        this.$router.push({
          name: 'PogTransferStraight',
          query: {
            to: item.account
          }
        })
      }else {
        this.$router.push({
          name: 'TransferStraight',
          query: {
            to: item.account
          }
        })
      }
    },
    clickCreate() {
      this.$router.push({
        name: 'CreateContact'
      })
    },
    back() {
      this.$router.go(-1)
    }
  },
}
</script>

<style scoped>
.layout {
  height: 100%;
  display: flex;
  flex-direction: column;
}
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
}
.item {
  padding: 50px 56px;
  background-color: #fff;
  border-bottom: 1PX solid #ececec;
  display: flex;
  align-items: center;
}
.item img {
  width: 16px;
  height: 28px;
}
.item .chain {
  margin-right: 112px;
  font-size: 24px;
  color: #5789e4;
  border: 1PX solid #5789e4;
  border-radius: 10px;
  padding: 5px 10px;
}
.name {
  font-size: 30px;
  flex: 1;
}
.memo {
  color: grey;
}
.system {
  /* margin-top: 15px; */
  flex: 1;
}
.system span{
  font-size: 24px;
  color: #5789e4;
  border: 1PX solid #5789e4;
  border-radius: 10px;
  padding: 5px 10px;
}
.btn {
  text-align: center;
  min-height: 80px;
  margin-bottom: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn span {
  padding: 20px 40px;
  font-size: 30px;
  border-radius: 60px;
  background-color: #ec565a;
  color: #fff;
}
</style>
