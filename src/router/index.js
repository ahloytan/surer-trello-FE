import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
      requiresAuth: true,
      title: 'About',
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: {
      isAuth: true,
      title: 'Login',
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "Register" */ '../views/Register.vue'),
    meta: {
      title: 'Register',
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import(/* webpackChunkName: "Dashboard" */ '../views/Dashboard.vue'),
    meta: {
      requiresAuth: true,
      title: 'Dashboard',
    },
  },
  {
    path: '/forbidden',
    name: 'Forbidden',
    component: () => import(/* webpackChunkName: "403" */ '../views/403.vue'),
    meta: {
      title: 'Forbidden',
    },
  },
  {
    //https://stackoverflow.com/questions/63526486/vue-router-catch-all-wildcard-not-working
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "404" */ '../views/404.vue'),
    meta: {
      title: 'NotFound',
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, _from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (window.$cookies.isKey("user")){
      next();
    } else {
      next({
        // name: 'Login'
        path: '/login',
        // query: { redirect: 'login' },
      });
    }
  } else if (to.matched.some(record => record.meta.isAuth)) {
    if (window.$cookies.isKey("user")){
      next({path: '/dashboard'});
    } else {
      next()
    }
  } else {
    next();
  }
});

//https://stackoverflow.com/questions/53282040/change-meta-title-and-description-using-vue-js
router.afterEach((to) => {
  Vue.nextTick( () => {
    document.title = to.meta.title ? 'Taskucci - ' + to.meta.title : 'Taskucci';
  });
})

export default router
