<template>
  <v-ons-page>
    <div class="background my_bg"></div>
    <div class="content page_content">
      <!-- <div class="header">
        <div class="header_content">
          <v-ons-icon class="arrow_back" icon="fa-chevron-left" @click="back"></v-ons-icon>
          <span>扫一扫</span>
        </div>
      </div> -->
      <div class="page_header">
        <img class="ion_back" src="@/assets/img/back.png" @click="back"> 
        <span>扫一扫</span>
      </div>
      <div class="qrcode-scan-div">
        <div class="line"></div>
      </div>
    </div>
  </v-ons-page>
</template>

<script>
export default {
  created() {
    const onDone = (err, status) => {
      if (err) {
        console.error(err)
      }
      if (status.authorized) {
        QRScanner.scan((err, text) => {
          if (err) {
            alert('启动扫描出错：' + JSON.stringify(err))
          } else {
            // alert(text)
            try {
              const json = JSON.parse(text)
              const action = json.action
              console.log(action)
              if (action) {
                switch (action) {
                  case 'create_account':
                    this.$router.replace({
                      name: 'ActivePay',
                      query: {
                        content: text
                      }
                    })
                    break;
                  case 'receive':
                    this.$router.replace({
                      name: 'TransferStraight',
                      query: {
                        content: text
                      }
                    })
                    break;
                  case 'ethreceive':
                    this.$router.replace({
                      name: 'EthTransferStraight',
                      query: {
                        content: text
                      }
                    })
                    break;
                  case 'pogreceive':
                  this.$router.replace({
                    name: 'PogTransferStraight',
                    query: {
                      content: text
                    }
                  })
                  break;
                  case 'login':
                    this.$router.replace({
                      name: 'SimpleLogin',
                      query: {
                        content: text
                      }
                    })
                    break;
                
                  default:
                  this.$toast('无效的二维码')
                  this.$router.go(-1)
                    break;
                }
              }
            } catch (error) {
              console.log(error)
              this.$toast('无效的二维码')
              this.$router.go(-1)
            }
          }
        })
        QRScanner.show()
      }
    }
    if (typeof (QRScanner) != 'undefined') {
      QRScanner.prepare(onDone);
    } else {
      console.log('插件加载失败');
    }
  },
  destroyed () {
    QRScanner.destroy((status) => {})
  },
  methods: {
    back() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.my_bg {
  background:transparent;
}
.header {
  background-color: #0885f1;
  color: #fff;
  padding: 15px;
  height: 49px;
  box-sizing: border-box;
}
.header_content {
  position: relative;
  line-height: 1.2;
  vertical-align: middle;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
}
.arrow_back {
  position: absolute;
  left: 0;
  top: 0;
  height: 20px;
}

.page_content {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.qrcode-scan-div{
  flex: 1;
  border: solid rgba(0, 0, 0, 0.5);
  border-top-width: calc(50vh - 20vh);
  border-bottom-width: calc(50vh - 20vh);
  border-left-width: calc(50vw - 30vw);
  border-right-width: calc(50vw - 30vw);
  display: flex;
  align-items: center;
}
.line {
  width: 100%;
  height: 1px;
  background-color: red;
  animation:heart .8s ease infinite;
}
@keyframes heart {
  0% {background-color:red;}
  100%{background-color:transparent;}
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
</style>
