<template>
  <div class="column">
    <!-- https://stackoverflow.com/questions/40491506/vue-js-dynamic-images-not-working -->
    <img :src="require('@/assets/' + dir)" class="image pic m-auto" alt="">
  </div>
</template>
<script>


	export default {
		name: 'BgImage',
    props: ['dir'],
		components: {
		},
		data() {
      return {
      }
    },
		methods : {
		},
    mounted(){

    } //end of mounted
	}
</script>
