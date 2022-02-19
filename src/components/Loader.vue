<template>
  <b-loading :is-full-page="isFullPage" v-model="isLoading" :can-cancel="false"></b-loading>
</template>

<script>
    export default {
        props: ["isLoading"],
        data() {
            return {
                isFullPage: true
            }
        }
    }
</script>
