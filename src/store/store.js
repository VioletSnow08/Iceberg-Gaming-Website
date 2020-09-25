/*=========================================================================================
  File Name: store.js
  Description: Vuex store
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

// Importing Modules...
import user from './modules/user'
import application from './modules/application'
import serverStatus from './modules/serverStatus'
import loa from "./modules/settings";
import userManagement from "@/store/modules/userManagement";
import calendar from "@/store/modules/calendar"

Vue.use(Vuex)

export default new Vuex.Store({
  getters,
  mutations,
  state,
  actions,
  modules: {
    user,
    application,
    serverStatus,
    loa,
    calendar,

  },
  strict: process.env.NODE_ENV !== 'production'
})
