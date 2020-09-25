export default [
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
]
