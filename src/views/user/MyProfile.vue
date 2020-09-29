<template>
<div>
  <div class="text-center">
    <img :src="currentUser.photoURL" :alt="currentUser.username" width=150 height=150>
    <h1>
      <span id="username">{{currentUser.username}}</span> - 
      <span v-if="currentUser.roles.includes('[17th] Member')">17th Brigade </span>
      <span v-else>Iceberg Member</span>
      <span v-if="currentUser.roles.includes('[17th] Member')">[{{currentUser.bct_rank}}]</span>
    </h1>
    <h2 id="status">{{currentUser.status}}</h2>
    <vs-row vs-justify="center">
      <vs-col vs-w="4" class="info-card">
        <vx-card>
            <h3 class="card-title">{{currentUser.username}}'s Contact Info</h3>
            <vx-list :list="[
              `Email: ${currentUser.email}`,
              `Discord: ${currentUser.discord_id}`
            ]"/>
        </vx-card>
      </vs-col>
      <vs-col v-if="currentUser.roles.includes('[17th] Member')" vs-w="4" class="info-card">
          <vx-card>
            <h3 class="card-title">17th Brigade Unit Card</h3>
            <span v-if="currentUser.onLOA">
              <h3 style="color: red">On Leave of Absence</h3>
            </span>
            <vx-tooltip text="In the future this will dictate 7th Rangers or 32nd. Ranger will be green, 32nd will be yellow">
                <h3 style="color: green">[HoverOverMe]</h3>
              </vx-tooltip>
            <p>
              <span v-if="currentUser.roles.includes('[ICE] Recruiter')" class="brigade-position">Recruiter</span>
              <span v-if="currentUser.roles.includes('[17th] NCO') && currentUser.roles.includes('[ICE] Recruiter')" class="brigade-position"> | NCO</span>
              <span v-else-if="currentUser.roles.includes('[17th] NCO')" class="brigade-position">NCO</span>
            </p>
            <vx-list :list="[
              `Rank: ${currentUser.bct_rank}`,
              `Points: ${currentUser.bct_points}`,
              `Events Attended: ${currentUser.bct_events_attended}`
            ]"/>
          </vx-card>
      </vs-col>
    </vs-row>
  </div>
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
  .brigade-position{
    font-weight: bold;
  }
  
  .card-title{
    padding: 5px;
  }

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
