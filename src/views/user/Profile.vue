<template>
<div>
  <div class="text-center">
    <img :src="user($route.params.userID).photoURL" :alt="user($route.params.userID).username" width=150 height=150>
    <h1>
      <span id="username">{{user($route.params.userID).username}}</span> - 
      <span v-if="user($route.params.userID).roles.includes('[17th] Member')">17th Brigade </span>
      <span v-else>Iceberg Member</span>
      <span v-if="user($route.params.userID).roles.includes('[17th] Member')">[{{user($route.params.userID).bct_rank}}]</span>
    </h1>
    <h2 id="status">{{user($route.params.userID).status}}</h2>
    <vs-row vs-justify="center">
      <vs-col vs-w="4" class="info-card">
        <vx-card>
            <h3 class="card-title">{{user($route.params.userID).username}}'s Contact Info</h3>
            <h3 v-if="user($route.params.userID).onLOA" style="color: red">On Leave of Absence</h3>
            <vx-list :list="[
              `Email: ${user($route.params.userID).email}`,
              `Discord: ${user($route.params.userID).discord_id}`
            ]"/>
        </vx-card>
      </vs-col>
      <vs-col v-if="user($route.params.userID).roles.includes('[17th] Member')" vs-w="4" class="info-card">
          <vx-card>
            <h3 class="card-title">17th Brigade Unit Card</h3>
            <h3 v-if="user($route.params.userID).roles.includes('[17th] 7th Ranger')" style="color: green">7th Ranger</h3>
            <h3 v-else-if="user($route.params.userID).roles.includes('[17th] 32nd LSG')" style="color: yellow">32nd LSG</h3>
            <h3 v-else>Unassigned</h3>
            <p>
              <span v-if="user($route.params.userID).roles.includes('[ICE] Recruiter')" class="brigade-position">Recruiter</span>
              <span v-if="user($route.params.userID).roles.includes('[17th] NCO') && user($route.params.userID).roles.includes('[ICE] Recruiter')" class="brigade-position"> | NCO</span>
              <span v-else-if="user($route.params.userID).roles.includes('[17th] NCO')" class="brigade-position">NCO</span>
            </p>
            <vx-list :list="[
              `Rank: ${user($route.params.userID).bct_rank}`,
              `Points: ${user($route.params.userID).bct_points}`,
              `Events Attended: ${user($route.params.userID).bct_events_attended}`
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
  name: 'Profile',
  computed: {
    ...mapGetters(["user"])
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
