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
      await attemptAtAuth(to.path, from.path)
      next({
        path: '/pages/perms',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get().then(async doc => { // Else check to see if they have the proper roles.
        if (to.meta.roles.some(role => doc.data().roles.includes(role))) {
          next();
        } else {
          await attemptAtAuth(to.path, from.path)
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
      next({
        path: '/pages/perms',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  } else {
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

async function attemptAtAuth(to, from) {
  let ip;
  await fetch('https://api.ipify.org?format=json')
    .then(async x => x.json())
    .then(async ({ip}) => {
      await firebase.firestore().collection("logs").doc().set({
        ip,
        to,
        from,
      }).catch(error => {
        if (error) throw error;
      })
    });
}

export default router
