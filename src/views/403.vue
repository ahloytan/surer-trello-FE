<template>
  <div id="unauthorized">
    <img src="../assets/images/403.svg" alt="">
  </div>
</template>
<style lang="scss">
@import '@/assets/scss/_variables.scss';
#unauthorized img {
  width: 100%;
  @include breakpoint(tablet) {
      width: 50%;
  }
}
</style>