<template>
  <!-- https://www.youtube.com/watch?v=qMFytZ-JI9g&t=1s -->
    <b-button @click="logout()" id="signUpBTN">Log Out</b-button>
</template>
<script>
import User from '@/api/services/User.js'

	export default {
		name: 'GLoginBtn',
		data() {
      return {
      }
    },
		methods : {
      logout(){
        let that = this;
        this.$gapi.isSignedIn()
        .then(function(){
          that.$gapi.signOut();
        })
        User.logOut();
        this.$cookies.remove("user");
        this.$root.$emit('status');
        this.$router.push({ path: '/'});
        //console.log('You have logged out');
        //console.log(this.$cookies.keys());
      }
		},
	}
</script>
<style>

</style>
