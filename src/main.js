/*=========================================================================================
  File Name: main.js
  Description: main vue(js) file
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

const {firebaseConfig} = require("./credentials");
const axios = require("axios");
const logger = require("./utils.js").logger;
import "setimmediate";

import Vue from 'vue'
import App from './App.vue'

import firebase from 'firebase'
import 'firebase/firestore'

firebase.initializeApp(firebaseConfig)
firebase.analytics()
import Vuesax from 'vuesax'
import 'material-icons/iconfont/material-icons.css' //Material Icons
import 'vuesax/dist/vuesax.css' // Vuesax
Vue.use(Vuesax)

import './filters/filters.js'
import '../themeConfig.js'
import './globalComponents.js'
import './assets/scss/main.scss'
import '@/assets/css/main.css'
import router from './router/router.js'
import store from './store/store'

axios.get("http://localhost:3000")
// Vuejs - Vue wrapper for hammerjs
import { VueHammer } from 'vue2-hammer'
Vue.use(VueHammer)

// PrismJS
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'

Vue.prototype.$logger = logger;
Vue.use(Vuesax)
Vue.use(VueHammer)

// Feather font icon
require('./assets/css/iconfont.css')

Vue.config.productionTip = false

let app;
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})

