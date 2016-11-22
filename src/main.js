// Import JQuery, VuJS Node modules for state management
import $ from 'jquery'
window.$ = $
import Vue from 'vue'
import store from './vuex/store'
import App from './App'
import configRouter from './routes'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueCharts from 'vue-charts'

import introjs from 'intro.js'


// Load technology icon path
const iconPath = 'http://208.capecodcommission.org/Images/AltIcons/'

// Start Vue state management services
Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(VueCharts)

// Currency filter: Add '$' to ints, fixed to 2 decimal places
Vue.filter('currency', { read: function (val) {
  return '$'+ val.toFixed(2)
}})

const router = new VueRouter({
  history: true,
  saveScrollPosition: true,
  root:  '/fim',
  suppressTransitionError: true
})

configRouter(router)

// Start router
router.start({
  store,
  components: { App }
}, '#app')

window.router = router
window.iconPath = iconPath
