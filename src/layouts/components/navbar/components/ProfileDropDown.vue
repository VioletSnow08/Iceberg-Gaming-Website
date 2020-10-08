<template>
  <div class="the-navbar__user-meta flex items-center" v-if="currentUser">

    <div class="text-right leading-tight hidden sm:block">
      <p class="font-semibold">{{ currentUser.username }}</p>
      <small>{{ currentUser.status }}</small>
    </div>

    <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">

      <div class="con-img ml-3">
        <img key="onlineImg" :src="currentUser.photoURL" alt="user-img" width="40" height="40" class="rounded-full shadow-md cursor-pointer block" />
      </div>

      <vs-dropdown-menu class="vx-navbar-dropdown">
        <ul style="min-width: 9rem">

          <li @click="$router.push('/profile')" class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white">
            <feather-icon icon="UserIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">My Profile</span>
          </li>

          <li @click="$router.push('/applications')" class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white">
            <feather-icon icon="MessageSquareIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">View Applications</span>
          </li>


          <vs-divider class="m-1" />
          <li v-if="currentUser.roles.includes('[ICE] Member')" @click="$router.push('/settings')" class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white">
            <feather-icon icon="SettingsIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Settings</span>
          </li>
          <li
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
            @click="logoutUser">
            <feather-icon icon="LogOutIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Logout</span>
          </li>
        </ul>
      </vs-dropdown-menu>
    </vs-dropdown>
    <li
      class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
      @click="logoutUser">
      <feather-icon icon="LogOutIcon" svgClasses="w-4 h-4" />
      <span class="ml-2">Logout</span>
    </li>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
  methods: {
    ...mapActions(['logoutUser'])
  },
  computed: {
    ...mapGetters(['currentUser'])
  }
}
</script>
