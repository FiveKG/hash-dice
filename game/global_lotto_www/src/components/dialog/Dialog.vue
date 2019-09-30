<template>
  <v-ons-modal :visible="show" class="my_modal">
    <!-- <v-ons-dialog
      modifier="width_pwd"
      cancelable
      style="background-color: rgba(0, 0, 0, .5);"
      :visible.sync="show">
      
    </v-ons-dialog> -->
    <div class="dialog-container">
      <div class="alert-dialog-title verify_title">{{$t('common.verify_pwd')}}</div>
      <div class="ipt">
        <input type="password" class="text-input" maxlength="16" :value="iptValue" @input="$emit('listenInput', $event.target.value)">
      </div>
      <!-- v-if="$store.state.wallet.fingerprintAuth && showFingerprint" -->
      <div class="fingerprint" @click="fingerprintState = !fingerprintState" v-if="showFingerprint">
        <label class="checkbox">
          <input type="checkbox" class="checkbox__input" v-model="fingerprintState">
          <div class="checkbox__checkmark"></div>
        </label>
        <span>开启指纹支付</span>
        <span class="always" @click="clickAlways">
          <span>永久开启 <img src="@/assets/img/arrow-forward.png" alt=""></span>
        </span>
      </div>
      <div class="btn_layout">
        <div class="cancel">
          <span @click="cancel">{{$t('common.cancel')}}</span>
        </div>
        <div class="confirm">
          <span @click="confirm">{{$t('common.confirm')}}</span>
        </div>
      </div>
    </div>
  </v-ons-modal>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    iptValue: {
      type: String
    },
    showFingerprint: {
      type: Boolean,
      default: true
    }
  },
  model: {
    prop: 'iptValue',
    event: 'listenInput'
  },
  data() {
    return {
      password: '',
      fingerprintState: false,
    }
  },
  methods: {
    clickAlways() {
      this.$router.push({name: 'FingerprintWarn'})
    },
    confirm() {
      this.$emit('confirm',this.fingerprintState)
    },
    cancel() {
      this.$emit('cancel')
    }
  },
  directives: {
    focus: {
      inserted: (el) => {
        el.focus()
      }
    }
  }
}
</script>

<style scoped>
/* .my_modal {
  background-color: rgba(0, 0, 0, .3);
} */
.dialog-container {
    height: auto;
    min-height: auto;
    min-width: 600px;
    display: inline-block;
    margin: auto auto;
    text-align: left;
    border-radius: 15px;
}
.title {
  font-weight: bold;
  font-size: 30px;
  margin: 30px 0;
}
.alert-dialog-content {
  padding: 10px 20px;
}
.input {
  background-color: #fff;
  display: block;
  width: 100%;
  border: 1PX solid rgb(226, 226, 226);
  border-radius: 10px;
  padding: 10px;
  height: 60px;
  font-size: 30px;
  caret-color: #027be3;
}
.action {
  padding: 20px 0;
}
.action button {
  font-size: 30px;
  margin-top: 10px;
}
.confirm {
  color: rgb(255, 53, 53);
}

.verify_title {
  font-weight: bold;
  font-size: 30px;
  margin: 28px 58px;
  padding-bottom: 20px;
  border-bottom: 1PX solid #dfdfdf;
}
.ipt {
  background-color: #ececec;
  margin: 0 58px;
  padding: 0 18px;
}
.ipt input {
  height: 74px;
  font-size: 28px;
}
.fingerprint {
  margin: 0 58px;
  padding-top: 30px;
  color: #222;
  position: relative;
}
.always {
  position: absolute;
  right: 0;
}
.always span {
  display: flex;
  align-items: center;
  color: #707070;
}
.always img {
  height: 30px;
}
.btn_layout {
  height: 68px;
  margin: 36px 58px;
  display: flex;
  font-size: 28px;
}
.btn_layout .cancel {
  flex: 1;
  text-align: left;
}
.btn_layout .cancel span{
  width: 166px;
  display: inline-block;
  text-align: center;
  color: #fff;
  padding: 15px 0;
  border-radius: 15px;
  background-color: #ec565a;
}
.btn_layout .confirm {
  flex: 1;
  text-align: right;
}
.btn_layout .confirm span{
  width: 166px;
  display: inline-block;
  text-align: center;
  color: #fff;
  border-radius: 15px;
  padding: 15px 0;
  background-color: #5789e3;
}
.fingerprint span {
  margin-left: 20px;
  font-size: 24px;
}
.checkbox__checkmark:before {
  width: 35px;
  height: 35px;
  top: 0;
  border: none;
  background: center/contain no-repeat url('~@/assets/img/checkmark.png');
}
.checkbox__checkmark:after {
  width: 15px;
  height: 10px;
  top: 8px;
  left: 8px;
  border: none;
}
:checked + .checkbox__checkmark:before {
  background: center/contain no-repeat url('~@/assets/img/checkmark_selected.png');
}
</style>
