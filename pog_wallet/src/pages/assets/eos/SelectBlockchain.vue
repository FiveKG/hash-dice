<template>
  <v-ons-page>
    <vpage>
      <slot>
        <vheader :title="$t('assets.select_system')"/>
        <div class="layout">
          <div class="eth card_item" @click="clickPog">
            <div class="card_pog">
              <div>
                <div> <img class="card_icon_pog" src="@/assets/img/system_pog.png" > </div>
                <!-- <div class="card_text">POG</div> -->
              </div>
            </div>
            <div class="text_center">{{$t('assets.pog_chain')}}</div>
          </div>
          <div class="eth card_item" @click="clickEos">
            <div class="card_eos">
              <div>
                <div> <img class="card_icon_eos" src="@/assets/img/system_eos.png" > </div>
                <!-- <div class="card_text">EOS</div> -->
              </div>
            </div>
            <div class="text_center">{{$t('assets.eos_chain')}}</div>
          </div>
          <div class="eth card_item" @click="clickEth">
            <div class="card_eth">
              <div>
                <div> <img class="card_icon_eth" src="@/assets/img/system_eth.png" > </div>
                <!-- <div class="card_text">ETH</div> -->
              </div>
            </div>
            <div class="text_center">{{$t('assets.eth_chain')}}</div>
          </div>
        </div>
      </slot>
    </vpage>
  </v-ons-page>
</template>

<script>
import MyHeader from '@/components/MyHeader'
import MyPage from '@/components/MyPage'

export default {
  components: {
    vpage: MyPage,
    vheader: MyHeader
  },
  methods: {
    clickEos() {
      if (this.$route.query.type) {
        this.$store.commit('wallet/setWalletChain','EOS')
        this.$router.go(-1)
      } else {
        this.$router.push({
          name: 'AddWallet'
        })
      }
    },
    clickEth() {
      if (this.$route.query.type) {
        this.$store.commit('wallet/setWalletChain','ETH')
        this.$router.go(-1)
      } else {
        this.$router.push({
          name: 'EthAddWallet'
        })
      }
      // this.$toast('此功能暂未开放')
    },
    clickPog() {
      if (this.$route.query.type) {
        this.$store.commit('wallet/setWalletChain','POG')
        this.$router.go(-1)
      } else {
        this.$router.push({
          name: 'PogAddWallet'
        })
      }
    }
  },
}
</script>

<style scoped>

.text_center {
  text-align: center;
  margin-top: 22px;
  font-size: 26px;
  font-weight: 450;
}
.header {
  padding: 55px;
  border-bottom: 1px solid rgb(202, 202, 202);
}
.ion_back {
  width: 42px;
  height: 32px;
}
.select_title {
  margin-top: 70px;
  font-size: 34px;
}
.layout {
  margin: 32px 22px;
  display: flex;
}
.card_eos {
  /* width: 220px; */
  height: 220px;
  background-color: #3c3c3c;
  border-radius: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card_pog {
  /* width: 220px; */
  height: 220px;
  background-color: rgb(6,64,123);
  border-radius: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card_eth {
  /* width: 220px; */
  height: 220px;
  background-color: #808a87;
  border-radius: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card_item {
  flex: 1;
  margin: 0 10px;
}
.card_icon_pog {
  /* width: 60px; */
  height: 215px;
}
.card_icon_eos {
  /* width: 60px; */
  height: 135px;
}
.card_icon_eth {
  /* width: 60px; */
  height: 135px;
}
.card_text {
  color: #fff;
  font-size: 26px;
  font-weight: bold;
  margin-top: 15px;
}
.eth {
  /* margin: 0 23px; */
}
</style>
