<!-- =========================================================================================
  File Name: VerticalNavMenu.vue
  Description: Vertical NavMenu Component
  Component Name: VerticalNavMenu
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div class="parentx">

    <vs-sidebar
      class="v-nav-menu items-no-padding"
      v-model="isVerticalNavMenuActive"
      ref="verticalNavMenu"
      default-index="-1"
      :click-not-close="clickNotClose"
      :reduce-not-rebound="reduceNotRebound"
      :parent="parent"
      :hiddenBackground="clickNotClose"
      :reduce="reduce"
      v-hammer:swipe="onMenuSwipe">

      <div @mouseenter="mouseEnter" @mouseleave="mouseLeave">

        <!-- Header -->
        <div class="header-sidebar flex items-end justify-between" slot="header">

          <!-- Logo -->
          <router-link tag="div" class="vx-logo cursor-pointer flex items-center" to="/">
            <!--            <logo class="w-10 mr-4 fill-current text-primary"/>-->
            <span class="vx-logo-text text-primary" v-show="isMouseEnter || !reduce" v-if="title">{{ title }}</span>
          </router-link>
          <!-- /Logo -->

          <!-- Menu Buttons -->
          <div>
            <!-- Close Button -->
            <template v-if="showCloseButton">
              <feather-icon icon="XIcon" class="m-0 cursor-pointer"
                            @click="$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', false)"/>
            </template>
            <template v-else-if="!showCloseButton && !verticalNavMenuItemsMin">
              <feather-icon
                id="btnVNavMenuMinToggler"
                class="mr-0 cursor-pointer"
                :icon="reduce ? 'CircleIcon' : 'DiscIcon'"
                svg-classes="stroke-current text-primary"
                @click="toggleReduce(!reduce)"/>
            </template>
          </div>
        </div>
        <!-- Header -->
        <!-- Header Shadow -->
        <div class="shadow-bottom" v-show="showShadowBottom"/>

        <!-- Menu Items -->
        <component v-if="currentUser" :is="scrollbarTag" ref="verticalNavMenuPs"
                   class="scroll-area-v-nav-menu pt-2" :settings="settings"
                   @ps-scroll-y="psSectionScroll" @scroll="psSectionScroll" :key="$vs.rtl">


          <span v-if="!verticalNavMenuItemsMin" class="navigation-header truncate">Iceberg Gaming</span>

          <v-nav-menu-item v-if="currentUser.roles.includes('[ICE] Member')" to="/hub" icon="HomeIcon">
            <span v-show="!verticalNavMenuItemsMin" class="truncate">The Hub</span>
          </v-nav-menu-item>
          <v-nav-menu-item v-if="currentUser.roles.includes('[ICE] Recruiter')" to="/admin/applications"
                           icon="FileIcon">
            <span v-show="!verticalNavMenuItemsMin" class="truncate">Applications</span>
          </v-nav-menu-item>
          <v-nav-menu-item v-if="currentUser.roles.includes('[ICE] Member')" to="/iceberg/calendar"
                           icon="CalendarIcon">
            <span v-show="!verticalNavMenuItemsMin" class="truncate">Calendar</span>
          </v-nav-menu-item>

          <v-nav-menu-item icon="MessageSquareIcon" href="https://discord.gg/p3DYJGE"><span
            v-show="!verticalNavMenuItemsMin" class="truncate">Join our Discord!</span></v-nav-menu-item>


          <span v-if="!verticalNavMenuItemsMin" class="navigation-header truncate">17th Brigade Combat Team</span>

          <v-nav-menu-item v-if="currentUser.roles.includes('[ICE] Member') && !currentUser.roles.includes('[17th] Member')" to="/17th/apply"
                           icon="FilePlusIcon">
            <span v-show="!verticalNavMenuItemsMin" class="truncate">Application - 17th BCT</span>
          </v-nav-menu-item>
          <v-nav-menu-item
            v-if="currentUser.roles.some(role => ['[ICE] Owner', '[17th] NCO', '[17th] Alpha Company HQ', '[17th] 1st Platoon HQ', '[17th] 32nd LSG HQ'].includes(role))"
            to="/admin/17th/users" icon="SettingsIcon">
            <span v-show="!verticalNavMenuItemsMin" class="truncate">User Management</span>
          </v-nav-menu-item>



        </component>
        <!-- /Menu Items -->
      </div>
    </vs-sidebar>

    <!-- Swipe Gesture -->
    <div
      v-if="!isVerticalNavMenuActive"
      class="v-nav-menu-swipe-area"
      v-hammer:swipe="onSwipeAreaSwipe"/>
    <!-- /Swipe Gesture -->
  </div>
</template>


<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import VNavMenuGroup from './VerticalNavMenuGroup.vue'
import VNavMenuItem from './VerticalNavMenuItem.vue'

import Logo from '../Logo.vue'
import {mapGetters} from 'vuex'

export default {
  name: 'v-nav-menu',
  components: {
    VNavMenuGroup,
    VNavMenuItem,
    VuePerfectScrollbar,
    Logo
  },
  props: {
    logo: {type: String},
    openGroupHover: {type: Boolean, default: false},
    parent: {type: String},
    reduceNotRebound: {type: Boolean, default: true},
    navMenuItems: {type: Array, required: true},
    title: {type: String}
  },
  data: () => ({
    clickNotClose: false, // disable close navMenu on outside click
    isMouseEnter: false,
    reduce: false, // determines if navMenu is reduce - component property
    showCloseButton: false, // show close button in smaller devices
    settings: {      // perfectScrollbar settings
      maxScrollbarLength: 60,
      wheelSpeed: 1,
      swipeEasing: true
    },
    showShadowBottom: false,
    submenus: [      {
      url: '/dashboard/analytics',
      name: 'Analytics',
      slug: 'dashboard-analytics',
      i18n: 'Analytics'
    },]
  }),
  computed: {
    isGroupActive() {
      return (item) => {
        const path = this.$route.fullPath
        const routeParent = this.$route.meta ? this.$route.meta.parent : undefined
        let open = false

        const func = (item) => {
          if (item.submenu) {
            item.submenu.forEach((item) => {
              if (item.url && (path === item.url || routeParent === item.slug)) {
                open = true
              } else if (item.submenu) {
                func(item)
              }
            })
          }
        }
        func(item)
        return open
      }
    },
    ...mapGetters(['currentUser']),
    menuItemsUpdated() {
      const clone = this.navMenuItems.slice()

      for (const [index, item] of this.navMenuItems.entries()) {
        if (item.header && item.items.length && (index || 1)) {
          const i = clone.findIndex(ix => ix.header === item.header)
          for (const [subIndex, subItem] of item.items.entries()) {
            clone.splice(i + 1 + subIndex, 0, subItem)
          }
        }
      }

      return clone
    },
    isVerticalNavMenuActive: {
      get() {
        return this.$store.state.isVerticalNavMenuActive
      },
      set(val) {
        this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', val)
      }
    },
    layoutType() {
      return this.$store.state.mainLayoutType
    },
    reduceButton: {
      get() {
        return this.$store.state.reduceButton
      },
      set(val) {
        this.$store.commit('TOGGLE_REDUCE_BUTTON', val)
      }
    },
    isVerticalNavMenuReduced() {
      return Boolean(this.reduce && this.reduceButton)
    },
    verticalNavMenuItemsMin() {
      return this.$store.state.verticalNavMenuItemsMin
    },
    scrollbarTag() {
      return this.$store.getters.scrollbarTag
    },
    windowWidth() {
      return this.$store.state.windowWidth
    }
  },
  watch: {
    '$route'() {
      if (this.isVerticalNavMenuActive && this.showCloseButton) this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', false)
    },
    reduce(val) {
      const verticalNavMenuWidth = val ? 'reduced' : this.$store.state.windowWidth < 1200 ? 'no-nav-menu' : 'default'
      this.$store.dispatch('updateVerticalNavMenuWidth', verticalNavMenuWidth)

      setTimeout(function () {
        window.dispatchEvent(new Event('resize'))
      }, 100)
    },
    layoutType() {
      this.setVerticalNavMenuWidth()
    },
    reduceButton() {
      this.setVerticalNavMenuWidth()
    },
    windowWidth() {
      this.setVerticalNavMenuWidth()
    }
  },
  methods: {
    onMenuSwipe(event) {
      if (event.direction === 4 && this.$vs.rtl) {

        // Swipe Right
        if (this.isVerticalNavMenuActive && this.showCloseButton) this.isVerticalNavMenuActive = false

      } else if (event.direction === 2 && !this.$vs.rtl) {

        // Swipe Left
        if (this.isVerticalNavMenuActive && this.showCloseButton) this.isVerticalNavMenuActive = false
      }
    },
    onSwipeAreaSwipe(event) {

      if (event.direction === 4 && !this.$vs.rtl) {

        // Swipe Right
        if (!this.isVerticalNavMenuActive && this.showCloseButton) this.isVerticalNavMenuActive = true
      } else if (event.direction === 2 && this.$vs.rtl) {

        // Swipe Left
        if (!this.isVerticalNavMenuActive && this.showCloseButton) this.isVerticalNavMenuActive = true
      }
    },
    psSectionScroll() {
      const scroll_el = this.$refs.verticalNavMenuPs.$el || this.$refs.verticalNavMenuPs
      this.showShadowBottom = scroll_el.scrollTop > 0
    },
    mouseEnter() {
      if (this.reduce) this.$store.commit('UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN', false)
      this.isMouseEnter = true
    },
    mouseLeave() {
      if (this.reduce) this.$store.commit('UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN', true)
      this.isMouseEnter = false
    },
    setVerticalNavMenuWidth() {

      if (this.windowWidth > 1200) {
        if (this.layoutType === 'vertical') {

          // Set reduce
          this.reduce = !!this.reduceButton

          // Open NavMenu
          this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', true)

          // Set Menu Items Only Icon Mode
          const verticalNavMenuItemsMin = !!(this.reduceButton && !this.isMouseEnter)
          this.$store.commit('UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN', verticalNavMenuItemsMin)

          // Menu Action buttons
          this.clickNotClose = true
          this.showCloseButton = false

          const verticalNavMenuWidth = this.isVerticalNavMenuReduced ? 'reduced' : 'default'
          this.$store.dispatch('updateVerticalNavMenuWidth', verticalNavMenuWidth)

          return
        }
      }

      // Close NavMenu
      this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', false)

      // Reduce button
      if (this.reduceButton) this.reduce = false

      // Menu Action buttons
      this.showCloseButton = true
      this.clickNotClose = false

      // Update NavMenu Width
      this.$store.dispatch('updateVerticalNavMenuWidth', 'no-nav-menu')

      // Remove Only Icon in Menu
      this.$store.commit('UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN', false)


      // if(this.layoutType === 'vertical' || (this.layoutType === 'horizontal' && this.windowWidth < 1200))
      // if (this.windowWidth < 1200) {

      //   // Close NavMenu
      //   this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', false)

      //   // Reduce button
      //   if (this.reduceButton) this.reduce = false

      //   // Menu Action buttons
      //   this.showCloseButton = true
      //   this.clickNotClose   = false

      //   // Update NavMenu Width
      //   this.$store.dispatch('updateVerticalNavMenuWidth', 'no-nav-menu')

      //   // Remove Only Icon in Menu
      //   this.$store.commit('UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN', false)

      // } else {

      //   // Set reduce
      //   this.reduce = this.reduceButton ? true : false

      //   // Open NavMenu
      //   this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', true)

      //   // Set Menu Items Only Icon Mode
      //   const verticalNavMenuItemsMin = (this.reduceButton && !this.isMouseEnter) ? true : false
      //   this.$store.commit('UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN', verticalNavMenuItemsMin)

      //   // Menu Action buttons
      //   this.clickNotClose   = true
      //   this.showCloseButton = false

      //   const verticalNavMenuWidth   = this.isVerticalNavMenuReduced ? "reduced" : "default"
      //   this.$store.dispatch('updateVerticalNavMenuWidth', verticalNavMenuWidth)
      // }
    },
    toggleReduce(val) {
      this.reduceButton = val
      this.setVerticalNavMenuWidth()
    }
  },
  mounted() {
    this.setVerticalNavMenuWidth()
  }
}

</script>


<style lang="scss">
@import "@/assets/scss/vuexy/components/verticalNavMenu.scss"
</style>
