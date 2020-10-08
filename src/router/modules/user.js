export default [{
  path: '',
  component: () => import('@/layouts/main/Main.vue'),
  children: [
    {
      path: '/hub',
      name: 'hub',
      component: () => import('@/views/Hub.vue'),
      meta: {
        requiresAuth: true,
        roles: ['[ICE] Member']
      },
    },
    {
      path: '/applications',
      name: 'Applications',
      component: () => import('@/views/Applications.vue'),
      meta: {
        requiresAuth: true,
        roles: ['[ICE] Member', '[ICE] Applicant']
      },
    },

    {
      path: '/applications/view/:applicationID',
      name: 'Application',
      component: () => import('@/views/Application.vue'),
      meta: {
        requiresAuth: true,
        roles: ['[17th] Applicant', '[ICE] Member']
      },
      props: true
    },
    {
      path: '/17th/apply',
      name: '17thApply',
      component: () => import('@/views/17th/Apply.vue'),
      meta: {
        requiresAuth: true,
        roles: ['[ICE] Member']
      },
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/views/Settings.vue'),
      meta: {
        requiresAuth: true,
        roles: ['[ICE] Member']
      },
    },
    {
      path: '/iceberg/calendar',
      name: 'Calendar',
      component: () => import('@/views/Iceberg/Calendar/Calendar.vue'),
      meta: {
        requiresAuth: true,
        roles: ['[ICE] Member']
      },
    },
    {
      path: '/iceberg/calendar/view/:eventID',
      name: 'ViewEvent',
      component: () => import('@/views/Iceberg/Calendar/ViewEvent.vue'),
      meta: {
        requiresAuth: true,
        roles: ['[ICE] Member']
      },
      props: true
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/user/MyProfile'),
      meta: {
        requiresAuth: true,
        roles: ['[ICE] Member']
      },
      props: true
    },
  ]
}]
