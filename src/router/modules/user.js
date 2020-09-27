export default [{
  path: '',
  component: () => import('@/layouts/main/Main.vue'),
  children: [
    {
      path: '/user/hub',
      name: 'hub',
      component: () => import('@/views/user/Hub.vue'),
      meta: {
        requiresAuth: true,
        roles: ['[ICE] Member']
      },
    },
    {
      path: '/user/applications',
      name: 'Applications',
      component: () => import('@/views/user/Applications.vue'),
      meta: {
        requiresAuth: true,
        roles: ['[ICE] Member', '[ICE] Applicant']
      },
    },

    {
      path: '/user/applications/view/:applicationID',
      name: 'Application',
      component: () => import('@/views/user/Application.vue'),
      meta: {
        requiresAuth: true,
        roles: ['[17th] Applicant', '[ICE] Member']
      },
      props: true
    },
    {
      path: '/user/17th/apply',
      name: '17thApply',
      component: () => import('@/views/user/17th/Apply.vue'),
      meta: {
        requiresAuth: true,
        roles: ['[ICE] Member']
      },
    },
    {
      path: '/user/settings',
      name: 'Settings',
      component: () => import('@/views/user/Settings.vue'),
      meta: {
        requiresAuth: true,
        roles: ['[ICE] Member']
      },
    },
    {
      path: '/user/iceberg/calendar',
      name: 'Calendar',
      component: () => import('@/views/user/Iceberg/Calendar.vue'),
      meta: {
        requiresAuth: true,
        roles: ['[ICE] Member']
      },
    },
    {
      path: '/user/profile',
      name: 'MyProfile',
      component: () => import('@/views/user/MyProfile'),
      meta: {
        requiresAuth: true,
        roles: ['[ICE] Member']
      },
    },
  ]
}]
