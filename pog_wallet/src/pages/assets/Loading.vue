<template>
    <div class="layout">
      <span>
        <svg class="progress-circular progress-circular--indeterminate">
          <circle class="progress-circular__background"/>
          <circle class="progress-circular__primary progress-circular--indeterminate__primary"/>
          <circle class="progress-circular__secondary progress-circular--indeterminate__secondary"/>
        </svg>
      </span>
    </div>
</template>

<style scoped>


.layout {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
</style>
