/*=========================================================================================
  File Name: router.js
  Description: Routes for vue-router. Lazy loading is enabled.
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

// Importing Router Modules
import User from "./modules/user";
import Admin from "./modules/admin";
import Pages from "./modules/pages";
import store from "../store/store";

const utils = require("../../utils");

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return {x: 0, y: 0}
  },
  routes: [
    ...User,
    ...Admin,
    ...Pages,
    {
      path: '*',
      redirect: '/misc/error-404'
    }
  ]
})

// Navigation Guards - They work by providing the *lowest* role/rank that can access it, then by listing any other roles.

router.beforeEach(async (to, from, next) => {
  await store.dispatch('fetchCurrentUser');
  await store.dispatch('fetchLOAs');
  const currentUser = store.getters.currentUser;
  const NAVIGATIONAL_OVERRIDES = ["[ICE] Owner", "[ICE] Admin", "[ICE] Webmaster"];
  if (to.matched.some(record => record.meta.requiresAuth)) { // If the page requires authentication
    if (!currentUser) { // If the user is not signed in
      await logView(to.path, from.path, "notice", utils.commonMessages.restrictedPage)
      next({
        path: '/misc/perms',
        query: {
          redirect: to.fullPath
        }
      })
    } else { // If they are logged in
      if (utils.doesUserContainRoles(currentUser.roles, to.meta.roles) || utils.doesUserContainRoles(currentUser.roles, NAVIGATIONAL_OVERRIDES)) { // Since the route is not for channels, check if they have valid roles (or if they have the OVERRIDABLE ROLES)
        await logView(to.path, from.path, "info", utils.commonMessages.accessPage, null, currentUser.id);
        next();
      } else {
        await logView(to.path, from.path, "notice", utils.commonMessages.restrictedPage, null, currentUser.id);
        next({
          path: '/misc/perms',
          query: {
            redirect: to.fullPath
          }
        })
      }
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) { // If the page requires guest
    if (currentUser) {
      await logView(to.path, from.path, "notice", utils.commonMessages.restrictedPage, null, currentUser.id)
    } else {
      await logView(to.path, from.path, "info", utils.commonMessages.accessPage);
      next();
    }
  } else { // If the page is open to anybody
    await logView(to.path, from.path, "info", utils.commonMessages.accessPage, null, currentUser ? currentUser.id : null);
    next();
  }
})


router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

async function logView(to, from, level, message, notes, id) {
  utils.logger.log({
    level,
    message,
    to,
    from,
    isLoggedIn: !!id,
    id: id,
    notes,
  })
}

export default router
