<template>
  <div class="is-inline-block mr-2">
    <b-sidebar
      position="fixed"
      v-model="open"
      :right="right"
      :fullheight="fullheight"
      :fullwidth="fullwidth"
      :can-cancel="canCancel"
      id="sideBar"
    >
        <div class="p-3">
          <b-menu>
            <b-menu-list label="Signed in as">
              <span class="has-text-weight-bold has-text-centered has-text-link-dark is-size-6">{{loggedUser}}</span>
            </b-menu-list>
            <b-menu-list label="Menu">
              <b-menu-item @click="resetHighlight('projects')" icon="project-diagram" label="Team Projects"></b-menu-item>
              <b-menu-item @click="resetHighlight('dashboard')" icon="tachometer-alt" label="My Dashboard"></b-menu-item>
            </b-menu-list>
            <b-menu-list label="Actions">
                <LogoutBtn></LogoutBtn>
            </b-menu-list>
          </b-menu>
        </div>
      </b-sidebar>
  </div>
</template>

<script>
import LogoutBtn from '@/components/LogoutBtn.vue'

export default {
	name: 'SideBar',
  components: {
    LogoutBtn
  },
  data() {
    return {
      open: true,
      right: false,
      fullwidth: false,
      fullheight: true,
      loggedUser: null,
      canCancel: []
    }
  },
  methods :{
    resetHighlight(e){
      const iconTexts = document.getElementsByClassName('icon-text');
      iconTexts.forEach(ele => {
        ele.classList.remove("is-active","is-expanded");
      });

      this.$route.path !== "/" + e ? this.$router.push({ path: "/" + e}) : "";
      this.openNav();
    },
    openNav() {
      //https://stackoverflow.com/questions/48620689/how-to-push-elements-off-screen-using-html-and-css
      //Sidebar push in push out effect
      document.getElementsByClassName('sidebar-content')[0].classList.toggle('visible');
      document.getElementById('hamburger').classList.toggle('is-active')
    },
  },
  mounted() {
    this.loggedUser = this.$cookies.get("user").loggedUser;
    //console.log(this.$cookies.get("user").loggedUser);

    //https://stackoverflow.com/questions/52468088/vue-router-call-function-after-route-has-loaded
    //Wait until router loaded then highlight the correct item in the sidebar
    this.$router.onReady(() => {
      let thePage = ["Projects", "Dashboard"];
      let pos = thePage.indexOf(this.$route.name) == -1 ? 1 : thePage.indexOf(this.$route.name);
      document.getElementsByClassName('icon-text')[pos].classList.add("is-active","is-expanded");
    })
  } //end of mounted
};
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';
a.is-active{
  color: $white !important;
	background-color: $green3 !important;
}

.menu-list a {
	color: $green2;
}

.sidebar-content{
  position: relative;
  min-width: 200px;
  padding-top: 78px;
  margin-left: -200px;
  box-sizing: border-box;
  transition: margin 0.4s;
  background-color: $green1 !important;

  @include breakpoint(desktop){
    margin-left: 0px;
  }
}

.visible {
  margin-left: 0;
}

</style>
