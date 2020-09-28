<template>
<div>
  <div class="text-left">
    <h1><strong>{{currentUser.username}}</strong> - 
      <span v-if="currentUser.roles.includes('[17th] Member')">17th Brigade</span>
      <span v-else>Iceberg Member</span>    
    </h1>
  </div>
  <p>{{currentUser}}</p>
</div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'MyProfile',
  computed: {
    ...mapGetters(["currentUser"]) // Reference the currentUser object to see what you can use.
  }
}
</script>

<style scoped>

</style>
