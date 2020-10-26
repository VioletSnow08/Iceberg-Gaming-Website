/*=========================================================================================
  File Name: main.js
  Description: main vue(js) file
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/
const { createLogger, format, transports } = require('winston');
const firebaseConfig = require("./credentials.js").firebaseConfig;
import "setimmediate";
import Vue from 'vue'
import App from './App.vue'
import firebase from 'firebase'
import 'firebase/firestore'
import axios from './axios.js'
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
import { VueHammer } from 'vue2-hammer'
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
require('./assets/css/iconfont.css')
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics()


const httpTransportOptions = {
  host: 'http-intake.logs.datadoghq.com',
  path: "/v1/input/b6b4c63a6b8eec338b8617ae9495e173?ddsource=nodejs&service=Iceberg Gaming Website-DEVOPS",
  ssl: true
};
const logger = createLogger({
  level: 'info',
  exitOnError: false,
  format: format.json(),
  transports: [
    new transports.Http(httpTransportOptions),
  ],
});


Vue.prototype.$logger = logger;

logger.log({
  message: "Failed Login",
  level: "error",
  userID: "1"

})
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

