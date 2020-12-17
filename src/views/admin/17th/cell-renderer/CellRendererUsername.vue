<template>
  <div>
    <div @click="isOriginalPopupOpen=true" class="flex items-center">
      <vs-avatar :src="params.data.photoURL" class="flex-shrink-0 mr-2" size="30px"/>
      <p class="text-inherit hover:text-primary">{{ params.value }}</p>
    </div>
    <vs-popup title="Edit User" :active.sync="isOriginalPopupOpen">
      <vs-alert :active="alertPopup" color="success">Roles Updated!</vs-alert>
      <br v-if="alertPopup">
      <p>All Edits are logged for security purposes.</p>
      <p style="font-weight: bold">Roles that you cannot change are not grayed out. If you accidentally click one, they will not be updated, but they are not grayed out.</p>
      <br>
      <div v-for="role in displayedRoles">
        <vs-checkbox style="padding-bottom: 10px;" v-model="role.doesUserHaveIt">{{ role.role }}</vs-checkbox>
      </div>
      <vs-button @click="alertPopup=true; toggle17thRoles([displayedRoles, params.data.id])">Save Roles</vs-button>
    </vs-popup>
  </div>

</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {doesUserContainRoles} from "../../../../../utils";

export default {
  // The params are automatically passed in by AG Grid.. They include the columns of that specific row such as photoURL, username, id, etc.
  // params.value is the param value for the specific column. In this case, it is the same as the username.
  name: 'CellRendererUsername',
  computed: {
    url() {
      return '/apps/user/user-view/268'
    },
    ...mapGetters(["currentUser"]),

  },
  mounted() {
    this.displayedRoles.forEach(role => {
      if (this.params.data.roles.includes(role.role)) {
        this.displayedRoles.find(r => r === role).doesUserHaveIt = true;
      }
    })
  },
  methods: {
    ...mapActions(["toggle17thRoles"]),
  },
  data() {
    return {
      isOriginalPopupOpen: false,
      isKickPopupOpen: false,
      isBanPopupOpen: false,
      isChangePasswordPopupOpen: false,
      alertPopup: false,
      displayedRoles: [
        {
          role: "[17th] Member",
          doesUserHaveIt: false
        },
        {
          role: "[17th] Ranger",
          doesUserHaveIt: false
        },
        {
          role: "[17th] 32nd LSG",
          doesUserHaveIt: false
        },
        {
          role: "[17th] Ranger NCO",
          doesUserHaveIt: false
        },
        {
          role: "[17th] 32nd LSG NCO",
          doesUserHaveIt: false
        },
        {
          role: "[17th] NCO",
          doesUserHaveIt: false
        },
        {
          role: "[17th] 1st Platoon HQ",
          doesUserHaveIt: false
        },
        {
          role: "[17th] 32nd LSG HQ",
          doesUserHaveIt: false
        },
        {
          role: "[17th] Alpha Company HQ",
          doesUserHaveIt: false
        },
        {
          role: "[17th] Captain",
          doesUserHaveIt: false
        }
      ]
    }
  },
}
</script>
