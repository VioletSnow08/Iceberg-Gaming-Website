<template>
<div>
  <div class="text-center">
    <img :src="currentUser.photoURL" :alt="currentUser.username" width=150 height=150></img>
    <h1>
      <span id="username">{{currentUser.username}}</span> - 
      <span v-if="currentUser.roles.includes('[17th] Member')">17th Brigade </span>
      <span v-else>Iceberg Member</span>
      <span v-if="currentUser.roles.includes('[17th] Member')">[{{currentUser.bct_rank}}]</span>
    </h1>
    <h2 id="status">{{currentUser.status}}</h2>
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
  #username{
    font-weight: bold;
  }

  #status{
    font-style: italic;
  }
</style>
