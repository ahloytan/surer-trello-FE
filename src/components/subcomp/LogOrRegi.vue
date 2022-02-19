<template>
  <div class="has-text-right mb-4">
    {{descOne}} <router-link :to=dir><a class="is-underlined" href="#">{{descTwo}}</a></router-link>
  </div>
</template>
<script>


	export default {
		name: 'LogOrRegi',
    props: ['dir','descOne','descTwo'],
		components: {
		},
		data() {
      return {
      }
    },
	}
</script>
