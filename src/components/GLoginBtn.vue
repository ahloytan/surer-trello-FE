<template>
  <div class="GLoginBtnHolder">
    <b-button @click="login()" :class="'is-fullwidth'" type="is-danger">Google</b-button>
  </div>

</template>
<script>
import User from '@/api/services/User'


	export default {
		name: 'GLoginBtn',
		data() {
      return {
      }
    },
		methods : {
       login(){

        try{
           this.$gapi.signIn()
          .then(async user => {
            let fullName = user.firstname + ' ' + user.lastname;
            this.$cookies.set("user", {loggedUser: fullName, userEmail: user.email}, -1);
            await User.logIn(user.email, [user.firstname, user.lastname]);
            this.$root.$emit('status');
            console.log("googleUser",user);
            console.log(user.email, user.firstname, user.lastname);
            console.log(this.$cookies.keys());
            //https://stackoverflow.com/questions/45856929/redirect-to-requested-page-after-login-using-vue-router
            this.$router.push({ path: '/dashboard'});
          })
          .catch(err => {
            console.log(err.response)
            console.error('Not signed in: %s', err.error)
          })
        } catch (error){
          console.log(error);
        }
      } // end of login
		},
    mounted(){
    } //end of mounted
	}
</script>
<style lang="scss">

</style>
