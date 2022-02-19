import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css';
import './assets/scss/app.scss'
import VueCookies from 'vue-cookies'
//Icons not appearing solved
// https://stackoverflow.com/questions/52484377/font-awesome-icons-in-buefy
import { library } from '@fortawesome/fontawesome-svg-core';
// internal icons
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import VueGoogleApi from 'vue-google-api'

import AOS from 'aos'
import 'aos/dist/aos.css'

const gCal = {
  apiKey: process.env.VUE_APP_MY_GCAL_API_KEY,
  clientId: process.env.VUE_APP_MY_CLIENT_ID,
  discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
  scope: 'https://www.googleapis.com/auth/calendar.events',
}

Vue.use(VueCookies)
library.add(fas);
Vue.component('vue-fontawesome', FontAwesomeIcon);
Vue.use(VueGoogleApi, gCal)

Vue.use(Buefy, {
  defaultIconComponent: "vue-fontawesome",
  defaultIconPack: "fas",
  customIconPacks: {
    fas: {
      sizes: {
        default: "lg",
        "is-small": "1x",
        "is-medium": "2x",
        "is-large": "3x"
      },
      iconPrefix: ""
    }
  }
});

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
  mounted() {
    AOS.init()
  },
}).$mount('#app')
