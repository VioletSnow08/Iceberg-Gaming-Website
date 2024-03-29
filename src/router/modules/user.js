export default [{
  path: '',
  component: () => import('@/layouts/main/Main.vue'),
  children: [
    {
      path: '/hub',
      name: 'hub',
      component: () => import('@/views/user/Hub.vue'),
      meta: {
        requiresAuth: true,
        roles: ['[ICE] Member']
      },
    },
    {
      path: '/applications',
      name: 'Applications',
      component: () => import('@/views/user/Applications.vue'),
      meta: {
        requiresAuth: true,
        roles: ['[ICE] Member', '[ICE] Applicant']
      },
    },

    {
      path: '/applications/view/:applicationID',
      name: 'Application',
      component: () => import('@/views/user/Application.vue'),
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
        roles: ['[ICE] Applicant', '[ICE] Member']
      },
    },
    {
      path: '/iceberg/apply',
      name: 'IcebergApply',
      component: () => import('@/views/Iceberg/Apply.vue'),
      meta: {
        requiresAuth: true,
        roles: ['[ICE] Applicant']
      },
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/views/user/Settings.vue'),
      meta: {
        requiresAuth: true,
        roles: ['[ICE] Member']
      },
    },
    {
      path: '/iceberg/calendar',
      name: 'Calendar',
      component: () => import('@/views/Channel/Calendar/Calendar.vue'),
      meta: {
        requiresAuth: true,
        roles: ['[ICE] Member']
      },
    },
    {
      path: '/iceberg/calendar/view/:eventID',
      name: 'ViewEvent',
      component: () => import('@/views/Channel/Calendar/ViewEvent.vue'),
      meta: {
        requiresAuth: true,
        roles: ['[ICE] Member']
      },
      props: true
    },
    {
      path: '/profile/:userID',
      name: 'Profile',
      component: () => import('@/views/user/Profile'),
      meta: {
        requiresAuth: true,
        roles: ['[ICE] Member']
      },
      props: true
    },
    {
      path: '/channel/:channelID/:param1/:param2/:param3',
      name: "ViewChannel",
      component: () => import('@/views/Channel/ViewChannel'),
      meta: {
        requiresAuth: true,
        roles: ["CHANNEL_VAR"]
      },
      props: true
    }
  ]
}]
