<template>
  <div>
    <div @click="isOriginalPopupOpen=true" class="flex items-center">
      <vs-avatar :src="params.data.photoURL" class="flex-shrink-0 mr-2" size="30px"/>
      <p class="text-inherit hover:text-primary">{{ params.value }}</p>
    </div>
    <vs-popup title="Edit User" :active.sync="isOriginalPopupOpen">
      <p>All Edits are logged for security purposes.</p>
      <br>
      <div v-for="role in displayedRoles">
        {{setUserHasRole(role.role, params.data.roles)}}
        <vs-checkbox style="padding-bottom: 10px;" v-model="role.doesUserHaveIt">{{ role.role }}</vs-checkbox>
      </div>
    </vs-popup>
  </div>

</template>

<script>
export default {
  // The params are automatically passed in by AG Grid.. They include the columns of that specific row such as photoURL, username, id, etc.
  // params.value is the param value for the specific column. In this case, it is the same as the username.
  name: 'CellRendererUsername',
  computed: {
    url() {
      return '/apps/user/user-view/268'
    }
  },
  methods: {
    setUserHasRole(role, roles) {
      if(roles.includes(role)) {
        this.displayedRoles.find(r => r.role === role).doesUserHaveIt = true;
      }
    }
  },
  data() {
    return {
      isOriginalPopupOpen: false,
      isKickPopupOpen: false,
      isBanPopupOpen: false,
      isChangePasswordPopupOpen: false,
      displayedRoles: [
        {
          role: "[17th] Member",
          doesUserHaveIt: false
        },
        {
          role: "[ICE] Member",
          doesUserHaveIt: false
        }
      ]
    }
  },
}
</script>
