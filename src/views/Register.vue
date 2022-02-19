<template>
    <div id="register">
      <Toast :toastMsg="toastMsg" ref="toast"></Toast>
      <Loader :isLoading="isLoading"></Loader>
      <section>
        <div class="container">
          <div class="columns pt-6">
            <BgImage dir="task.jpg"></BgImage>
            <div class="column has-text-left">
              <form v-on:submit.prevent="onSubmit">
                <LogOrRegi dir="/Login" descOne="Have an account?" descTwo="Login here!"></LogOrRegi>
                <b-field label="First Name" :type="{'is-danger': fNameErr}" :message="[{'Please enter a first name': fNameErr}]">
                    <!-- https://stackoverflow.com/questions/19508183/how-to-force-input-to-only-allow-alpha-letters -->
                    <b-input onkeypress="return /[a-z]/i.test(event.key)" name="fname" type="text" value="" placeholder="Please Enter Your First Name"></b-input>
                </b-field>

                <b-field label="Last Name" :type="{'is-danger': lNameErr}" :message="[{'Please enter a last name': lNameErr}]">
                    <b-input onkeypress="return /[a-z]/i.test(event.key)" name="lname" type="text" value="" placeholder="Please Enter Your Last Name"></b-input>
                </b-field>

                <emailAndPW :emailErr="emailErr" :pwErr="pwErr"></emailAndPW>

                <b-field label="Re-enter Password" :type="{'is-danger': pwcErr}" :message="[{ 'Password doesn\'t match, please re-enter': pwcErr}]">
                    <b-input name="cpw" type="password" maxlength="64" placeholder="Please Enter Your Password Again" password-reveal></b-input>
                </b-field>
                <!-- https://github.com/buefy/buefy/issues/1546 -->
                <b-button native-type="submit" :class="'is-fullwidth my-6'" type="is-success">Create Account</b-button>
              </form>

              <div>Or Sign in with</div>
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
    name: "Register",
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
          fNameErr: false,
          lNameErr: false,
          emailErr: false,
          pwErr: false,
          pwcErr: false,
          toastMsg: "Login successful! Taking you to Dashboard~",
          isLoading: false,
        }
    },
    methods :{
      //https://stackoverflow.com/questions/3073176/javascript-regex-only-english-letters-allowed
      vName: function(ele) {
         var regex = /^[a-zA-Z ]+$/;
         // console.log(regex.test(ele));
         ele = ele.trim();
         return regex.test(ele);
      },
      onSubmit: async function(){
        var fname = document.getElementsByName('fname')[0].value;
        var lname = document.getElementsByName('lname')[0].value;
        var email = document.getElementsByName('email')[0].value;
        var pw = document.getElementsByName('pw')[0].value;
        var cpw = document.getElementsByName('cpw')[0].value;

        fname = eleVal(fname);
        lname = eleVal(lname);
        email = email.toLowerCase();

        //https://stackoverflow.com/questions/36176073/what-is-vue-way-to-access-to-data-from-methods
        this.fNameErr = tog(fname.length < 1);
        this.lNameErr = tog(lname.length < 1);
        this.emailErr = tog(email.length < 1);
        this.pwErr = tog(pw.length < 8);
        this.pwcErr = tog(pw !== cpw);

        //https://stackoverflow.com/questions/40707738/vuejs-accessing-a-method-from-another-method/40708474
        //Validation
        if (this.vName(fname) && this.vName(lname) && pw.length >= 8 && pw == cpw){
          this.isLoading = true

          try {
            await User.register(email, pw, fname, lname);
            let fullName = fname + ' ' + lname;
            this.$cookies.set("user", {loggedUser: fullName, userEmail: email}, -1);
            this.$refs.toast.result(true, { data: { error:  this.toastMsg}});
            setTimeout(() =>{
              this.$router.push({ path: '/dashboard'});
              this.$root.$emit('status', true);
            }, 1500);

          } catch (error) {
            this.isLoading = false
            this.$refs.toast.result(null, error.response);
          }
        } else{
          console.log("Fail, one or more fields are invalid");
        } //end of if-else
      }
    }
}
</script>
<style lang="scss">
</style>
