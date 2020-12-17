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
      <div v-if="!displayedRoles" style="color: red; font-weight: bold">Fetching Roles!</div>
      <br>
      <div v-for="role in displayedRoles">
        <vs-checkbox style="padding-bottom: 10px;" :disabled="role.isDisabled" v-model="role.doesUserHaveIt">{{ role.role }}</vs-checkbox>
      </div>
      <vs-button @click="alertPopup=true; toggle17thRoles([displayedRoles, params.data.id])">Save Roles</vs-button>
    </vs-popup>
  </div>

</template>

<script>
import {mapActions, mapGetters} from "vuex";
import utils, {doesUserContainRoles} from "../../../../../utils";
import axios from "axios";

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
  async mounted() {
    axios.post(`${utils.base_url}/user-management/17th/get-roles`, {
      userID: this.params.data.id,
      accessToken: await this.currentUser.accessToken
    }).then(response => {
      this.displayedRoles = response.data;
    }).catch(error => {
      if(error) {
        utils.alertGeneral();
      }
    })
  },
  methods: {
    ...mapActions(["toggle17thRoles", "getEditableRoles"]),
  },
  data() {
    return {
      isOriginalPopupOpen: false,
      isKickPopupOpen: false,
      isBanPopupOpen: false,
      isChangePasswordPopupOpen: false,
      alertPopup: false,
      displayedRoles: null
    }
  }
}
</script>
