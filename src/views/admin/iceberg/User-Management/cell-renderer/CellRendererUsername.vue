<template>
  <div>

    <div @click="isOriginalPopupOpen=true" class="flex items-center">
      <vs-avatar :src="params.data.photoURL" class="flex-shrink-0 mr-2" size="30px"/>
      <p class="text-inherit hover:text-primary">{{ params.value }}</p>
    </div>


    <vs-popup title="Edit User" :active.sync="isOriginalPopupOpen">
      <vs-alert :active="alertPopup" color="success">Removed User!</vs-alert>
      <br v-if="alertPopup">
      <p>All Edits are logged for security purposes.</p>


      <div class="vs-row">
        <vs-button color="warning" @click="isRemoveUserPopupOpen=true">Remove User</vs-button>
      </div>

      <vs-popup title="Are you sure you want to remove this user?" :active.sync="isRemoveUserPopupOpen">
        <vs-alert :active="removeUserAlert" color="success">User Removed!</vs-alert>
        <br v-if="removeUserAlert">
        <vs-button color="danger" @click="removeUserAlert=true; removeIcebergUser(params.data.id)">Remove User</vs-button>
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
  methods: {
    ...mapActions(["removeIcebergUser"]),
  },
  data() {
    return {
      isOriginalPopupOpen: false,
      removeUserAlert: false,
      isChangePasswordPopupOpen: false,
      alertPopup: false,
      isRemoveUserPopupOpen: false
    }
  }
}
</script>
