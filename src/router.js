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
import firebase from "firebase";

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  routes: [

    {
    // =============================================================================
    // MAIN LAYOUT ROUTES
    // =============================================================================
      path: '',
      component: () => import('./layouts/main/Main.vue'),
      children: [
        // =============================================================================
        // Theme Routes
        // =============================================================================
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('./views/Dashboard.vue'),
          meta: {
            requiresAuth: true,
            roles: ["user", "admin"]
          }
        },
        {
          path: '/apply',
          name: 'apply',
          component: () => import('./views/Apply.vue'),
          meta: {
            requiresAuth: true,
            roles: ["user"]
          }
        },
        {
          path: '/application',
          name: 'application',
          component: () => import('./views/Application.vue'),
          meta: {
            requiresAuth: true,
            roles: ["user", "member", "admin"]
          }
        },

      ]
    },
    // =============================================================================
    // FULL PAGE LAYOUTS
    // =============================================================================
    {
      path: '',
      component: () => import('@/layouts/full-page/FullPage.vue'),
      children: [
        // =============================================================================
        // PAGES
        // =============================================================================
        {
          path: '/pages/login',
          name: 'page-login',
          component: () => import('@/views/pages/Login.vue'),
          meta: {
            requiresGuest: true
          }
        },
        {
          path: '/pages/error-404',
          name: 'page-error-404',
          component: () => import('@/views/pages/Error404.vue')
        },
        {
          path: '/pages/register',
          name: 'register',
          component: () => import('@/views/pages/Register.vue'),
          meta: {
            requiresGuest: true
          }
        },
        {
          path: '/',
          name: 'home',
          component: () => import('@/views/Home.vue')
        },
      ]
    },
    // Redirect to 404 page, if no match found
    {
      path: '*',
      redirect: '/pages/error-404'
    }
  ]
})
router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!firebase.auth().currentUser) {
      next({
        path: '/pages/error-404',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      await firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid).get().then(doc => {
          if(to.meta.roles.includes(doc.data().role)) { // Checks if the array of roles and the user's actual/current role match up
            next(); // If so, then continue
          } else {
            next({
              path: '/pages/error-404',
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

        path: '/pages/error-404',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next();
    }
  } else {
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

export default router
