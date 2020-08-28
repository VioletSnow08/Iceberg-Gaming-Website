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
import user from "./modules/user";
import authentication from "./modules/authentication"
import application from "./modules/application";

Vue.use(Vuex)

export default new Vuex.Store({
  getters,
  mutations,
  state,
  actions,
  modules: {
    user,
    authentication,
    application,

  },
  strict: process.env.NODE_ENV !== 'production'
})
