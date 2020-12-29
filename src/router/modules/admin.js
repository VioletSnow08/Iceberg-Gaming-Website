export default [
  {
    path: '',
    component: () => import('@/layouts/main/Main.vue'),
    children: [
      // APPLICATIONS
      {
        path: '/admin/applications/view/:userID/:applicationID',
        name: 'AdminApplication',
        component: () => import('@/views/admin/iceberg/Application/Application.vue'),
        meta: {
          requiresAuth: true,
          roles: ["[ICE] Recruiter"]
        },
        props: true
      },
      {
        path: '/admin/applications',
        name: 'AdminApplications',
        component: () => import('@/views/admin/iceberg/Application/Applications.vue'),
        meta: {
          requiresAuth: true,
          roles: ['[ICE] Recruiter']
        },
      },
      // USER MANAGEMENT
      {
        path: '/admin/17th/users',
        name: 'Admin17thUsers',
        component: () => import('@/views/admin/17th/User-Management/Users.vue'),
        meta: {
          requiresAuth: true,
          roles: ['[17th] NCO', '[17th] Alpha Company HQ', "[17th] Officer"]
        },
      },
      {
        path: '/admin/iceberg/users',
        name: 'AdminIcebergUsers',
        component: () => import('@/views/admin/iceberg/User-Management/Users.vue'),
        meta: {
          requiresAuth: true,
          roles: ['[ICE] Recruiter', '[17th] Alpha Company HQ', "[17th] Officer", "[CGS] Owner"]
        },
      },
      {
        path: '/admin/cgs/users',
        name: 'AdminCGSUsers',
        component: () => import('@/views/admin/cgs/User-Management/Users.vue'),
        meta: {
          requiresAuth: true,
          roles: ["[CGS] Owner", "[CGS] Officer"]
        },
      },
      // CHANNELS
      {
        path: '/admin/channels',
        name: 'Channels',
        component: () => import('@/views/admin/iceberg/Channel/ChannelManagement.vue'),
        meta: {
          requiresAuth: true,
          roles: ['[17th] Alpha Company HQ', '[17th] Officer', "[CGS] Owner", "[CGS] Officer"]
        },
      },
      // DEVELOPERS
      {
        path: '/developer/roles',
        name: 'RolesPage',
        component: () => import('@/views/developer/RolesPage'),
        meta: {
          requiresAuth: true,
          roles: []
        },
      },
      {
        path: '/developer/lookup',
        name: 'UserLookup',
        component: () => import('@/views/developer/UserLookup/UserLookup'),
        meta: {
          requiresAuth: true,
          roles: []
        },
      },
      // MISC.
      {
        path: '/admin/iceberg/disciplinary-action',
        name: 'ViewDisciplinaryActionForms',
        component: () => import('@/views/admin/iceberg/Disciplinary-Action/ViewDisciplinaryActions.vue'),
        meta: {
          requiresAuth: true,
          roles: ['[17th] Alpha Company HQ', '[CGS] Owner']
        },
      },
      {
        path: '/admin/iceberg/disciplinary-action/view/:formID',
        name: 'ViewDisciplinaryActionForm',
        component: () => import('@/views/admin/iceberg/Disciplinary-Action/ViewDisciplinaryAction.vue'),
        params: true,
        meta: {
          requiresAuth: true,
          roles: []
        },
      },
    ]
  }
]
