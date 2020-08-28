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

// Vuesax Component Framework
import Vuesax from 'vuesax'
import 'material-icons/iconfont/material-icons.css' //Material Icons
import 'vuesax/dist/vuesax.css' // Vuesax
Vue.use(Vuesax)


// axios
import axios from './axios.js'
Vue.prototype.$http = axios

// Filters
import './filters/filters.js'


// Theme Configurations
import '../themeConfig.js'


// Globally Registered Components
import './globalComponents.js'


// Styles: SCSS
import './assets/scss/main.scss'


// Tailwind
import '@/assets/css/main.css'


// Vue Router
import router from './router'


// Vuex Store
import store from './store/store'


// Vuejs - Vue wrapper for hammerjs
import { VueHammer } from 'vue2-hammer'
Vue.use(VueHammer)


// PrismJS
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'


// Feather font icon
require('./assets/css/iconfont.css')

import firebase from "firebase";
import "firebase/firestore";

// INITIALIZING FIREBASE

var firebaseConfig = {
  apiKey: "AIzaSyA8e8TdgtWnNYl86HV3joSTOy-19h3Y3TQ",
  authDomain: "seventeenth-bct.firebaseapp.com",
  databaseURL: "https://seventeenth-bct.firebaseio.com",
  projectId: "seventeenth-bct",
  storageBucket: "seventeenth-bct.appspot.com",
  messagingSenderId: "682700854607",
  appId: "1:682700854607:web:ca34e54af9128afb82e13a",
  measurementId: "G-XS6SPLLTV2"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();



// Vue select css
// Note: In latest version you have to add it separately
// import 'vue-select/dist/vue-select.css';


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

