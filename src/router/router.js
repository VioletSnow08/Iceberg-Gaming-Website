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
import {logger, commonMessages} from "@/utils.js"

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
      redirect: '/pages/error-404'
    }
  ]
})

// Navigation Guards - They work by providing the *lowest* role/rank that can access it, then by listing any other roles.

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {

    if (!firebase.auth().currentUser) { // If the user is not signed in
      await logView(to.path, from.path, "notice", commonMessages.restrictedPage)
      next({
        path: '/pages/perms',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get().then(async doc => { // Else check to see if they have the proper roles.
        if (to.meta.roles.some(role => doc.data().roles.includes(role))) {
          await logView(to.path, from.path, "info", commonMessages.accessPage)
          next();
        } else {
          await logView(to.path, from.path, "notice", commonMessages.restrictedPage)
          next({
            path: '/pages/perms',
            query: {
              redirect: to.fullPath
            }
          })
        }
      })
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (firebase.auth().currentUser) {
      await logView(to.path, from.path, "notice", commonMessages.restrictedPage)
      next({
        path: '/pages/perms',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      await logView(to.path, from.path, "info", commonMessages.accessPage)
      next()
    }
  } else {
    if (firebase.auth().currentUser) {
      await logView(to.path, from.path, "info", commonMessages.accessPage)
    } else {
      await logView(to.path, from.path, "info", commonMessages.accessPage)
    }
    next()
  }
})


router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})
async function logView(to, from, level, message, notes) {
  let id;
  if (firebase.auth().currentUser) id = firebase.auth().currentUser.uid;
  logger.log({
    level,
    message,
    to,
    from,
    isLoggedIn: id ? true : false,
    id: id,
    notes,
  })
}

export default router
