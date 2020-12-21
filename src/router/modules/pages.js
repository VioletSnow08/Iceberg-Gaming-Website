export default [
  {
    path: '',
    component: () => import('@/layouts/full-page/FullPage.vue'),
    children: [
      {
        path: '/misc/login',
        name: 'page-login',
        component: () => import('@/views/misc/Login.vue'),
        meta: {
          requiresGuest: true
        }
      },
      {
        path: '/misc/error-404',
        name: 'page-error-404',
        component: () => import('@/views/misc/Error404.vue')
      },
      {
        path: '/misc/perms',
        name: 'perms',
        component: () => import('@/views/misc/perms.vue')
      },
      {
        path: '/misc/register',
        name: 'register',
        component: () => import('@/views/misc/Register.vue'),
        meta: {
          requiresGuest: true
        }
      },
      {
        path: '/',
        name: 'home',
        component: () => import('@/views/misc/Home.vue')
      },
    ]
  },
]
