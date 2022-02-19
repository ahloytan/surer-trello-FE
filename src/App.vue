<template>
  <div id="app">
    <div id="nav">
      <div class="columns is-vcentered is-mobile">
          <SideBar v-if="logged" :loggedUser="loggedUser" ></SideBar>
          <div class="column is-three-quarters-desktop has-text-left">
            <router-link v-if="!logged" to="/"><img src="./assets/logo.png" class="image" alt=""/></router-link>
            <img v-if="logged" src="./assets/logo.png" class="image" alt=""/>
          </div>
          <div class="column is-two-desktop is-three-quarters-mobile has-text-right is-flex is-justify-content-end">
            <router-link v-if="!logged" to="/Login"><b-button :id="'loginBTN'" class="mr-2">Login</b-button></router-link>
            <router-link v-if="!logged" to="/Register"><b-button id="signUpBTN">Sign Up</b-button></router-link>
            <router-link v-if="!logged" to="/project/:slug"></router-link>
            <!-- https://stackoverflow.com/questions/47515308/how-can-i-use-multiple-condition-in-v-if-in-vuejs -->
            <LogoutBtn v-if="logged" class="is-hidden-touch"></LogoutBtn>
            <div v-if="logged" id="hbgHolder">
              <div class="hamburger is-hidden-desktop" id="hamburger" @click="openNav()">
                <span class="line"></span>
                <span class="line"></span>
                <span class="line"></span>
              </div>
            </div>
          </div>
      </div>
    </div>
    <router-view/>
  </div>
</template>
<script>
  import LogoutBtn from '@/components/LogoutBtn.vue'
  import SideBar from '@/components/SideBar.vue';

  export default {
    name: "App",
    components: {
      LogoutBtn,
      SideBar
    },
    data(){
      return {
        logged: false,
        loggedUser: null
      }
    }, //end of data
    methods: {
      openNav() {
        //https://stackoverflow.com/questions/48620689/how-to-push-elements-off-screen-using-html-and-css
        document.getElementsByClassName('sidebar-content')[0].classList.toggle('visible');
        document.getElementById('hamburger').classList.toggle('is-active')
      },
      userCookie(){
        this.logged = this.$cookies.isKey("user") ? true : false;
      }
    }, //end of methods
    mounted (){
      let that = this;
      //https://stackoverflow.com/questions/38616167/communication-between-sibling-components-in-vue-js-2-0
      //https://stackoverflow.com/questions/56233887/what-does-this-root-means-in-a-component
      that.$root.$on('status', function() {
        that.userCookie();
      });
    }, //end of mounted

    created(){
      this.userCookie();
    } //end of created
  }
</script>
<style lang="scss">
 @import '@/assets/scss/_variables.scss';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#about,#home,#login,#myTasks,#register,#dashboard{
  padding: 0 15px;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

#nav {
  //https://stackoverflow.com/questions/43707076/how-does-the-position-sticky-property-work
  top: 0;
  z-index: 40;
  padding: 15px;
  position: sticky;
  background-color: $green0;
}

#loginBTN{
  color: $green2;
  background-color: $green1;
}

#signUpBTN{
  color: $white;
  background-color: $green3;
}

#hamburger{
  position: relative;
  -webkit-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}

#hbgHolder{
  padding-right:15px;
}

#hamburger.is-active{
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
}

#hamburger:before{
  content: "";
  position: absolute;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 40px;
  height: 40px;
  border: 5px solid transparent;
  top: calc(50% - 20px);
  left: calc(50% - 20px);
  border-radius: 100%;
  -webkit-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}

#hamburger.is-active:before{
  border: 3px solid #000;
}

#hamburger.is-active .line{
  width: 25px;
}

#hamburger.is-active .line:nth-child(2){
  opacity: 0;
}

#hamburger.is-active .line:nth-child(1){
  -webkit-transform: translateY(10px);
  -ms-transform: translateY(10px);
  -o-transform: translateY(10px);
  transform: translateY(10px);
}

#hamburger.is-active .line:nth-child(3){
  -webkit-transform: translateY(-10px) rotate(90deg);
  -ms-transform: translateY(-10px) rotate(90deg);
  -o-transform: translateY(-10px) rotate(90deg);
  transform: translateY(-10px) rotate(90deg);
}

.hamburger .line{
  width: 30px;
  height: 4px;
  background-color: #000;
  display: block;
  margin: 6px auto;
  -webkit-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}

.hamburger:hover{
  cursor: pointer;
}

</style>
