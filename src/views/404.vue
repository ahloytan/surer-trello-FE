<template>
  <div id="notfound">
    <img src="../assets/images/404.svg" alt="">
  </div>
</template>
<style lang="scss">
@import '@/assets/scss/_variables.scss';
#notfound img {
    width: 100%;
    @include breakpoint(tablet) {
        width: 50%;
    }
}
</style>