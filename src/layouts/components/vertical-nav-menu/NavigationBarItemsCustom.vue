<template>
  <div>

<!--    ICEBERG GAMING      -->


    <span v-if="!verticalNavMenuItemsMin" class="navigation-header truncate">Iceberg Gaming</span>

    <v-nav-menu-item v-if="currentUser.roles.includes('[ICE] Member') || currentUser.roles.includes('[ICE] Applicant')" to="/hub" icon="HomeIcon">
      <span v-show="!verticalNavMenuItemsMin" class="truncate">The Hub</span>
    </v-nav-menu-item>
    <v-nav-menu-item
      v-if="currentUser.roles.some(role => ['[ICE] Owner', '[ICE] Admin', '[ICE] Webmaster'].includes(role))"
      to="/admin/iceberg/users" icon="SettingsIcon">
      <span v-show="!verticalNavMenuItemsMin" class="truncate">User Management</span>
    </v-nav-menu-item>
    <v-nav-menu-item v-if="currentUser.roles.some(role => ['[ICE] Recruiter', '[ICE] Owner', '[ICE] Admin', '[ICE] Webmaster'].includes(role))" to="/admin/applications"
                     icon="FileIcon">
      <span v-show="!verticalNavMenuItemsMin" class="truncate">Applications</span>
    </v-nav-menu-item>
    <v-nav-menu-item v-if="currentUser.roles.some(role =>['[ICE] Owner', '[ICE] Admin', '[17th] Alpha Company HQ', '[17th] Officer', '[ICE] Webmaster'].includes(role))" to="/admin/channels"
                     icon="HashIcon">
      <span v-show="!verticalNavMenuItemsMin" class="truncate">Channel Management</span>
    </v-nav-menu-item>
    <v-nav-menu-item v-if="!currentUser.roles.includes('[ICE] Member')" to="/iceberg/apply"
                     icon="FilePlusIcon">
      <span v-show="!verticalNavMenuItemsMin" class="truncate">Application</span>
    </v-nav-menu-item>
    <v-nav-menu-item v-if="currentUser.roles.includes('[ICE] Member')" to="/iceberg/disciplinary-action"
                     icon="AlertTriangleIcon">
      <span v-show="!verticalNavMenuItemsMin" class="truncate">Disciplinary Action</span>
    </v-nav-menu-item>
    <v-nav-menu-item v-if="currentUser.roles.some(role =>['[ICE] Admin', '[ICE] Owner', '[ICE] Webmaster'].includes(role))" to="/admin/iceberg/disciplinary-action"
                     icon="ArchiveIcon">
      <span v-show="!verticalNavMenuItemsMin" class="truncate">View Disciplinary Action Forms</span>
    </v-nav-menu-item>

      <v-nav-menu-item v-if="channels && currentUser.roles.includes('[ICE] Member') && channel.division.toLowerCase() === 'iceberg'" v-for="channel in channels" :to="'/channels/' + channel.id" :icon="getChannelIcon(channel.type)">
        <span v-show="!verticalNavMenuItemsMin" class="truncate">{{channel.name}}</span>
      </v-nav-menu-item>

    <v-nav-menu-item icon="MessageSquareIcon" href="https://discord.gg/p3DYJGE" target="_blank"><span
      v-show="!verticalNavMenuItemsMin" class="truncate">Join our Discord!</span></v-nav-menu-item>


<!--    17th BCT      -->


    <span v-if="!verticalNavMenuItemsMin" class="navigation-header truncate">17th Brigade Combat Team</span>

    <v-nav-menu-item v-if="!currentUser.roles.includes('[17th] Member')" to="/17th/apply"
                     icon="FilePlusIcon">
      <span v-show="!verticalNavMenuItemsMin" class="truncate">Application</span>
    </v-nav-menu-item>
    <v-nav-menu-item
      v-if="currentUser.roles.some(role => ['[ICE] Owner', '[ICE] Admin', '[17th] NCO', '[17th] Alpha Company HQ', '[17th] 1st Platoon HQ', '[17th] 32nd LSG HQ', '[ICE] Webmaster'].includes(role))"
      to="/admin/17th/users" icon="SettingsIcon">
      <span v-show="!verticalNavMenuItemsMin" class="truncate">User Management</span>
    </v-nav-menu-item>

    <v-nav-menu-item v-if="channels && currentUser.roles.includes('[17th] Member') && channel.division.toLowerCase() === '17th'" v-for="channel in channels" :to="'/channels/' + channel.id" :icon="getChannelIcon(channel.type)">
      <span v-show="!verticalNavMenuItemsMin" class="truncate">{{channel.name}}</span>
    </v-nav-menu-item>

<!--        CGS       -->

    <span v-if="!verticalNavMenuItemsMin" class="navigation-header truncate">Chryse Guard Security</span>

    <v-nav-menu-item v-if="!currentUser.roles.includes('[CGS] Member')" to="/cgs/apply"
                     icon="FilePlusIcon">
      <span v-show="!verticalNavMenuItemsMin" class="truncate">Application</span>
    </v-nav-menu-item>

    <v-nav-menu-item v-if="channels && currentUser.roles.includes('[CGS] Member') && channel.division.toLowerCase() === 'cgs'" v-for="channel in channels" :to="'/channels/' + channel.id" :icon="getChannelIcon(channel.type)">
      <span v-show="!verticalNavMenuItemsMin" class="truncate">{{channel.name}}</span>
    </v-nav-menu-item>





    <span v-if="!verticalNavMenuItemsMin && currentUser.roles.includes('[ICE] Webmaster')" class="navigation-header truncate">Developers</span>

    <v-nav-menu-item v-if="currentUser.roles.includes('[ICE] Webmaster')" to="/developer/roles"
                     icon="FilePlusIcon">
      <span v-show="!verticalNavMenuItemsMin" class="truncate">Roles</span>
    </v-nav-menu-item>
    <v-nav-menu-item v-if="currentUser.roles.includes('[ICE] Webmaster')" to="/developer/lookup"
                     icon="BookIcon">
      <span v-show="!verticalNavMenuItemsMin" class="truncate">User Lookup</span>
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
    VNavMenuItem,
  },
  props: ['verticalNavMenuItemsMin'],
  computed: {
    ...mapGetters(['currentUser', 'channels', 'channel']),
  },
  methods: {
    getChannelIcon(type) {
      type = type.toLowerCase();
      if (type === "calendar") {
        return "CalendarIcon";
      } else if (type === "forum") {
        return "BoldIcon";
      } else if(type === "documents") {
        return "FileTextIcon";
      }
    },
  },
  async created() {
    await Promise.all([
      this.$store.dispatch('fetchChannels'),
      this.$store.dispatch('fetchUsers')
    ])
  }
}
</script>

<style scoped>

</style>
