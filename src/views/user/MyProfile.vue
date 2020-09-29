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
    <vs-row vs-justify="center">
      <vs-col vs-w="4" class="info-card">
        <vx-card :title="`${currentUser.username}'s Info`">
            <vx-list :list="[`Email: ${currentUser.email}`,`Discord: ${currentUser.discord_id}`]" />
        </vx-card>
      </vs-col>
      <vs-col vs-w="4" class="info-card">
        <span v-if="currentUser.roles.includes('[17th] Member')">
          <vx-card title="17th Brigade Dossier Card">
            Test
          </vx-card>
        </span>
      </vs-col>
    </vs-row>
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
  .info-card{
    margin-top: 20px;
    padding: 20px;
  }
  
  #username{
    font-weight: bold;
  }

  #status{
    font-style: italic;
  }
</style>
