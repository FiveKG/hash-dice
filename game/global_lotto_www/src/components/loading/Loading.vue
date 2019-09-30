<template>
    <div class="loading">
      <svg class="progress-circular progress-circular--indeterminate">
        <circle class="progress-circular__background"/>
        <circle class="progress-circular__primary progress-circular--indeterminate__primary progress_color"/>
        <circle class="progress-circular__secondary progress-circular--indeterminate__secondary"/>
      </svg>
    </div>
  <!-- <v-ons-modal :visible="show" class="my_modal" modifier="loading_modal">
  </v-ons-modal> -->
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.my_modal {
  background-color: rgba(0, 0, 0, .3);
}
.loading {
  padding: 50px;
  background-color: rgba(0, 0, 0, .7);
  display: inline-block;
  border-radius: 10px;
}
.progress_color {
  stroke: #0076ff;
}
.progress-circular__primary {
  stroke-width: 10%;
}
.progress-circular--indeterminate {
  width: 60px;
  height: 60px;
}
</style>
