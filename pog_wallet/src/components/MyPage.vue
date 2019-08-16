<template>
  <v-ons-page>
    <div class="background my_bg"></div>
    <div class="content">
      <slot></slot>
    </div>
  </v-ons-page>
</template>

<style scoped>
.my_bg {
  background-color: #f6f6f6;
}
</style>
