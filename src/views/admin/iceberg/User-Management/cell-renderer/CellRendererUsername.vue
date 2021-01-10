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
        <vs-checkbox style="padding-bottom: 10px;" :disabled="role.isDisabled" v-model="role.doesUserHaveIt">
          {{ role.role }}
        </vs-checkbox>
      </div>

      <div class="vs-row">
        <vs-button style="margin-right: 5px" @click="alertPopup=true; toggleRoles([displayedRoles, params.data.id])">
          Save Roles
        </vs-button>
        <vs-button color="warning" @click="isRemoveUserPopupOpen=true">Remove User</vs-button>
      </div>

      <vs-popup title="Are you sure you want to remove this user?" :active.sync="isRemoveUserPopupOpen">
        <vs-alert :active="removeUserAlert" color="success">User Removed!</vs-alert>
        <br v-if="removeUserAlert">
        <vs-button :disabled="isRemoveButtonDisabled('Iceberg')" color="danger"
                   @click="removeUserAlert=true; removeUser([params.data.id, 'Iceberg'])">Remove User from Iceberg
          Gaming
        </vs-button>
        <vs-button :disabled="isRemoveButtonDisabled('17th')" color="danger"
                   @click="removeUserAlert=true; removeUser([params.data.id, '17th'])">Remove User from 17th Brigade
          Combat Team
        </vs-button>
        <vs-button :disabled="isRemoveButtonDisabled('CGS')" color="danger"
                   @click="removeUserAlert=true; removeUser([params.data.id, 'CGS'])">Remove User from Chryse Guard
          Security
        </vs-button>
      </vs-popup>


    </vs-popup>
  </div>

</template>

<script>
import {mapActions, mapGetters} from "vuex";
import utils, {doesUserContainRoles} from "../../../../../../utils";
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
    this.displayedRoles = await this.getEditableRoles([this.params.data.id])
    this.removableDivisions = await this.getRemovableDivisions([this.params.data.id])
  },
  methods: {
    ...mapActions(["toggleRoles", "removeUser", "getEditableRoles", "getRemovableDivisions"]),
    isRemoveButtonDisabled(div) {
      if (this.removableDivisions) {
        let object = this.removableDivisions.find(obj => obj.division.toLowerCase() === div.toLowerCase());
        return !object.removable
      }
    }
  },
  data() {
    return {
      isOriginalPopupOpen: false,
      removeUserAlert: false,
      isChangePasswordPopupOpen: false,
      alertPopup: false,
      displayedRoles: null,
      isRemoveUserPopupOpen: false,
      removableDivisions: null
    }
  }
}
</script>
