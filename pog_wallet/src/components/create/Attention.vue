<template>
  <div class="attention">
    <div class="item">
      <!-- <span>• </span> -->
      <span style="flex: 1;margin-left: 5px;">({{$t('assets.password_attention1')}})</span>
    </div>
    <div class="item">
      <!-- <span>• </span> -->
      <span style="flex: 1;margin-left: 5px;">({{$t('assets.password_attention2')}})</span>
    </div>
  </div>
</template>

<script>
export default {
  
}
</script>

<style scoped>
.attention {
  /* background-color: rgb(241, 240, 240); */
  color: #b8b8b8;
  padding: 24px 56px;
  font-size: 24px;
  line-height: 1.5;
  border-bottom: 1PX solid #e0e0e0;
}
.item {
  display: flex;
  align-items: center;
  margin-top: 5px;
  font-weight: 440;
}
</style>
