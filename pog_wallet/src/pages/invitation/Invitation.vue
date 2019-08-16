<template>
  <div style="height:100%;">
    <index v-if="hasEos"></index>
    <import v-else></import>
  </div>
</template>

<script>
import Index from './Index'
import Import from './Import'

export default {
  components: {
    Index,
    Import
  },
  data() {
    return {
      hasEos: false
    }
  },
  created() {
    for (const item of this.$store.state.wallet.localFile.wallets) {
      if (item.chain === 'eos') {
        this.hasEos = true
      }
    }
  },
}
</script>

<style scoped>
</style>
