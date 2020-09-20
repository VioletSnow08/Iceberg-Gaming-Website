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

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return {x: 0, y: 0}
  },
  routes: [
    // Administrative Pages
    {
      path: '',
      component: () => import('./layouts/main/Main.vue'),
      children: [
        {
          path: '/admin/applications/view/:userID/:applicationID',
          name: 'viewApplication',
          component: () => import('./views/admin/Application.vue'),
          meta: {
            requiresAuth: true,
            roles: ['Recruiter', 'Alpha Company HQ', 'Owner']
          },
          props: true
        },
        {
          path: '/admin/applications',
          name: 'applications',
          component: () => import('./views/admin/Applications.vue'),
          meta: {
            requiresAuth: true,
            roles: ['Recruiter', 'Alpha Company HQ', 'Owner']
          },
        },
        {
          path: '/admin/users',
          name: 'users',
          component: () => import('./views/admin/Users.vue'),
          meta: {
            requiresAuth: true,
            roles: ['Recruiter', 'Alpha Company HQ', 'Owner']
          },
        }
      ]
    },
    // User Pages
    {
      path: '',
      component: () => import('./layouts/main/Main.vue'),
      children: [
        {
          path: '/user/hub',
          name: 'hub',
          component: () => import('./views/user/Hub.vue'),
          meta: {
            requiresAuth: true,
            roles: ['isIceberg']
          },
        },

        {
          path: '/user/application',
          name: 'myApplication',
          component: () => import('./views/user/MyApplication.vue'),
          meta: {
            requiresAuth: true,
            roles: ['isApplicant', 'isIceberg']
          },
        },
        {
          path: '/user/apply17th',
          name: 'apply17th',
          component: () => import('./views/user/Apply17th.vue'),
          meta: {
            requiresAuth: true,
            roles: ['isApplicant']
          },
        },
        {
          path: '/user/settings',
          name: 'settings',
          component: () => import('./views/user/Settings.vue'),
          meta: {
            requiresAuth: true,
            roles: ['isIceberg']
          },
        },
      ]
    },
    // Full Content Pages
    {
      path: '',
      component: () => import('@/layouts/full-page/FullPage.vue'),
      children: [
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
          path: '/pages/perms',
          name: 'perms',
          component: () => import('@/views/pages/perms.vue')
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
          component: () => import('@/views/pages/Home.vue')
        },

      ]
    },


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
    } else if (to.meta.roles.includes("isIceberg")) { // If they are logged in, require authentication, and is NOT requiring applicant.
      await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get().then(async doc => {
        if (doc.data().isIceberg) {
          next()
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
    } else if (to.meta.roles.includes('isApplicant')) { // If they are logged in, require authentication, and IS requiring applicant.
      await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get().then(async doc => {
        if (doc.data().isApplicant) {
          next()
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
    } else if (to.meta.roles.includes("is17th")) { // If they are logged in, require authentication, is NOT requiring applicant, and is requiring the 17th member role.
      await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get().then(async doc => {
        if (doc.data().is17th) {
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
