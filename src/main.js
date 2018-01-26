// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import VueResource from 'vue-resource'

import { routes } from './router/routes'

Vue.use(VueResource)
Vue.use(VueRouter)

// Use Routers on Vue application
const router = new VueRouter({
  routes,
  mode: 'history'
})
router.afterEach((route) => { if(route.meta.title) document.title = route.meta.title })


new Vue({
  el: '#musico',
  router: router,
  components: { App },
  template: '<App/>'
})
