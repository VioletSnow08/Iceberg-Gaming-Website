<template>
  <div>
    <span v-if="!verticalNavMenuItemsMin" class="navigation-header truncate">Iceberg Gaming</span>

    <v-nav-menu-item v-if="currentUser.roles.includes('[ICE] Member') || currentUser.roles.includes('[ICE] Applicant')" to="/hub" icon="HomeIcon">
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
    <v-nav-menu-item v-if="!currentUser.roles.includes('[ICE] Member')" to="/iceberg/apply"
                     icon="FilePlusIcon">
      <span v-show="!verticalNavMenuItemsMin" class="truncate">Application</span>
    </v-nav-menu-item>

    <v-nav-menu-item icon="MessageSquareIcon" href="https://discord.gg/p3DYJGE"><span
      v-show="!verticalNavMenuItemsMin" class="truncate">Join our Discord!</span></v-nav-menu-item>









    <span v-if="!verticalNavMenuItemsMin" class="navigation-header truncate">17th Brigade Combat Team</span>

    <v-nav-menu-item v-if="!currentUser.roles.includes('[17th] Member')" to="/17th/apply"
                     icon="FilePlusIcon">
      <span v-show="!verticalNavMenuItemsMin" class="truncate">Application</span>
    </v-nav-menu-item>
    <v-nav-menu-item
      v-if="currentUser.roles.some(role => ['[ICE] Owner', '[17th] NCO', '[17th] Alpha Company HQ', '[17th] 1st Platoon HQ', '[17th] 32nd LSG HQ', '[ICE] Webmaster'].includes(role))"
      to="/admin/17th/users" icon="SettingsIcon">
      <span v-show="!verticalNavMenuItemsMin" class="truncate">User Management</span>
    </v-nav-menu-item>



    <span v-if="!verticalNavMenuItemsMin && currentUser.roles.includes('[ICE] Webmaster')" class="navigation-header truncate">Developers</span>

    <v-nav-menu-item v-if="currentUser.roles.includes('[ICE] Webmaster')" to="/developer/roles"
                     icon="FilePlusIcon">
      <span v-show="!verticalNavMenuItemsMin" class="truncate">Roles</span>
    </v-nav-menu-item>

  </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import VNavMenuGroup from './VerticalNavMenuGroup.vue'
import VNavMenuItem from './VerticalNavMenuItem.vue'
import {mapGetters} from "vuex";

export default {
  name: "NavigationBarItemsCustom",
  components: {
    VuePerfectScrollbar,
    VNavMenuGroup,
    VNavMenuItem
  },
  props: ['verticalNavMenuItemsMin'],
  computed: {
    ...mapGetters(['currentUser']),
  }
}
</script>

<style scoped>

</style>
