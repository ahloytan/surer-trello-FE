<template>
    <div id="login">
      <Toast ref="toast"></Toast>
      <Loader :isLoading="isLoading"></Loader>
      <section>
        <div class="container animate-bottom">
          <div class="columns pt-6">
            <BgImage dir="task.jpg"></BgImage>
            <div class="column has-text-left">
              <b-message type="is-danger" v-if="isRedirect">Your session has ended. Please log in again!</b-message>
              <form v-on:submit.prevent="onSubmit">
                <LogOrRegi dir="/Register" descOne="New member?" descTwo="Register here!"></LogOrRegi>
                <emailAndPW ref="pw" :emailErr="emailErr" :pwErr="pwErr"></emailAndPW>
                <b-button native-type="submit" :class="'is-fullwidth my-6'" type="is-success">Login</b-button>
              </form>
              <div>Or Log in with</div>
              <GLoginBtn></GLoginBtn>
            </div>
          </div>
        </div>
      </section>
    </div>
</template>

<script>
// @ is an alias to /src
import GLoginBtn from '@/components/GLoginBtn.vue'
import EmailAndPW from '@/components/subcomp/EmailAndPW.vue'
import BgImage from '@/components/subcomp/BgImage.vue'
import LogOrRegi from '@/components/subcomp/LogOrRegi.vue'
import User from '@/api/services/User'
import {eleVal, tog} from '@/middleware/auth.js'
import Loader from '@/components/Loader.vue'
import Toast from '@/components/Toast.vue'


export default {
  name: "Login",
  components: {
    GLoginBtn,
    EmailAndPW,
    BgImage,
    LogOrRegi,
    Loader,
    Toast
  },
    data() {
        return {
          pwErr: false,
          emailErr: false,
          isLoading: false,
          isRedirect: false,
        }
    },
    methods: {
       async onSubmit(){
        let email = document.getElementsByName('email')[0].value;
        let pw = document.getElementsByName('pw')[0].value;

        email = email.toLowerCase();
        this.emailErr = tog(email.length < 1);
        this.pwErr = tog(pw.length < 8);

        //Validation
        if (!email.length < 1 && pw.length >= 8){
          try {
            this.isLoading = true
            const user = await User.logIn(email, pw);
            let fullName = eleVal(user[1].first_name) + ' ' + eleVal(user[1].last_name);
            //https://stackoverflow.com/questions/55316490/vue-best-practice-for-calling-a-method-in-a-child-component
            this.$refs.toast.result(true, {data: {error:"Login successful! Taking you to Dashboard"}});
            this.$cookies.set("user", {loggedUser: fullName, userEmail: email}, -1);
            //https://stackoverflow.com/questions/61126570/vue-router-push-undefined
            setTimeout(() =>{
              this.$router.push({ path: '/dashboard' })
              this.$root.$emit('status');
              console.log(this.$cookies.keys());
            }, 1500);

          } catch (error) {
            this.isLoading = false
            this.$refs.toast.result(null, error.response);
            this.$refs.pw.clearPassword();
          }
        } else{
          console.log("fail, one or more fields are invalid");
        } //end of if-else
      }
    },
    mounted(){
      const isRedirect = this.$route.query.redirect
      if (isRedirect) {
        this.$cookies.remove("user");
        this.$root.$emit('status', false);
        this.isRedirect = true
      }
    }
}
</script>
<style>
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Add animation to "page content" */
.animate-bottom {
  position: relative;
  animation-duration: 1s;
  animation-name: animatebottom;
  -webkit-animation-duration: 1s;
  -webkit-animation-name: animatebottom;
}

@-webkit-keyframes animatebottom {
  from { bottom:-100px; opacity:0 }
  to { bottom:0px; opacity:1 }
}

@keyframes animatebottom {
  from{ bottom:-100px; opacity:0 }
  to{ bottom:0; opacity:1 }
}
</style>
