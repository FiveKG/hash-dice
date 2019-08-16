<template>
  <v-ons-row class="row_item">
    <div>{{label}}</div>
    <div style="flex: 1;margin-left: 20px;">
      <input v-if="isPassword" 
        class="text-input my_input" 
        :type="showPwd ? 'text':'password'" 
        maxlength="16" 
        :value="iptValue"
        @input="$emit('listenInput', $event.target.value)">

      <input v-else 
        type="text" 
        class="text-input my_input" 
        maxlength="12"
        :value="iptValue"
        @input="$emit('listenInput', $event.target.value)">
    </div>
    <div v-if="showEye">
      <img src="@/assets/img/eye_open.png" style="height: 18px;" @click="clickEye('close')" v-if="showPwd">
      <img src="@/assets/img/eye_close.png" style="height: 18px;" @click="clickEye('open')" v-else>
    </div>
    <span v-if="isHint" class="optional">{{$t('assets.optional')}}</span>
  </v-ons-row>
</template>

<script>
export default {
  props: {
    label: {
      type: String
    },
    iptValue: {
      type: String
    },
    isHint: {
      type: Boolean
    },
    isPassword: {
      type: Boolean
    },
    showPwd: {
      type: Boolean
    },
    showEye: {
      type: Boolean
    }
  },
  model: {
    prop: 'iptValue',
    event: 'listenInput'
  },
  methods: {
    clickEye(type) {
      this.$emit('clickEye', type)
    }
  }
}
</script>

<style scoped>
input {
  caret-color: #027be3;
}
.row_item {
  padding: 20px 0;
  font-size: 16px;
  font-weight: 420;
  border-bottom: 1px solid #e8e8e8;
  align-items: center;
  position: relative;
}
.my_input {
  width: 100%;
  height: auto;
  font-size: 14px;
  vertical-align: middle;
}
.optional {
  position: absolute;
  left: 0;
  bottom: 5px;
  font-size: 12px;
  color: grey;
}
</style>
