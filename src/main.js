/*=========================================================================================
  File Name: main.js
  Description: main vue(js) file
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import App from './App.vue'
import firebase from 'firebase'
import 'firebase/firestore'
import axios from './axios.js'
import Vuesax from 'vuesax'
const firebaseConfig = require("./firebaseConfig.js");
import 'material-icons/iconfont/material-icons.css' //Material Icons
import 'vuesax/dist/vuesax.css' // Vuesax
import './filters/filters.js'
import '../themeConfig.js'
import './globalComponents.js'
import './assets/scss/main.scss'
import '@/assets/css/main.css'
import router from './router/router.js'
import store from './store/store'
import { VueHammer } from 'vue2-hammer'
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
const tracer = require('dd-trace').init();
require('./assets/css/iconfont.css')


// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics()


Vue.use(Vuesax)
Vue.prototype.$http = axios
Vue.use(VueHammer)

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

