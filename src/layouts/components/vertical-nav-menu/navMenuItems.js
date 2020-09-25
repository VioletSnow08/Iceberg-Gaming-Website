/*=========================================================================================
  File Name: sidebarItems.js
  Description: Sidebar Items list. Add / Remove menu items from here.
  Strucutre:
          url     => router path
          name    => name to display in sidebar
          slug    => router path name
          icon    => Feather Icon component/icon name
          tag     => text to display on badge
          tagColor  => class to apply on badge element
          i18n    => Internationalization
          submenu   => submenu of current item (current item will become dropdown )
                NOTE: Submenu don't have any icon(you can add icon if u want to display)
          isDisabled  => disable sidebar item/group
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


export default [
  // {
  //   url: "/apps/email",
  //   name: "Email",
  //   slug: "email",
  //   icon: "MailIcon",
  //   i18n: "Email",
  // },
  {
    url: '/user/hub',
    name: 'The Hub',
    icon: 'HomeIcon',
    i18n: 'The Hub',
    roles: ['[ICE] Member']
  },
  {
    header: 'Iceberg Gaming',
    icon: 'PackageIcon',
    i18n: 'Apps',
    roles: ['[ICE] Member'],
    items: [
      {
        url: '/apps/email',
        name: 'Email',
        slug: 'email',
        icon: 'MailIcon',
        i18n: 'Email',
        roles: ['[ICE] Member'],
      },
      {
        url: null,
        name: 'eCommerce',
        icon: 'ShoppingCartIcon',
        i18n: 'eCommerce',
        roles: ['[ICE] Member'],
        submenu: [
          {
            url: '/apps/eCommerce/shop',
            name: 'Shop',
            slug: 'ecommerce-shop',
            i18n: 'Shop',
            roles: ['[ICE] ADMIN'],
          }
        ]
      }
  ]}
]

