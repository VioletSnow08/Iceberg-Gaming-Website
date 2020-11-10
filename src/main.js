/*=========================================================================================
  File Name: main.js
  Description: main vue(js) file
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import Axios from "axios";

const {firebaseConfig} = require("../credentials");
const axios = require("axios");
const logger = require("../utils.js").logger;
import "setimmediate";
import Vue from 'vue'
import App from './App.vue'
import { VueHammer } from 'vue2-hammer'
import firebase from 'firebase'
import 'firebase/firestore'
import Vuesax from 'vuesax'
import 'material-icons/iconfont/material-icons.css' //Material Icons
import 'vuesax/dist/vuesax.css' // Vuesax
import './filters/filters.js'
import '../themeConfig.js'
import './globalComponents.js'
import './assets/scss/main.scss'
import '@/assets/css/main.css'
import router from './router/router.js'
import store from './store/store'
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
require('./assets/css/iconfont.css')
firebase.initializeApp(firebaseConfig)
firebase.analytics()



Vue.use(Vuesax)
Vue.use(VueHammer)
Vue.prototype.$logger = logger;
Vue.prototype.$http = axios;
Vue.config.productionTip = false
Vue.use(Vuesax)
Vue.use(VueHammer)

const token = localStorage.getItem('token')
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = token
}

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

