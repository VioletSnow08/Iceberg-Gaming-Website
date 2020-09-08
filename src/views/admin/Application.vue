<template>
  <div>
    <div v-if="viewApplication($route.params.id).status.toLowerCase() === 'processing'">
      <h3 class="text-center">Now Viewing: {{user($route.params.id).username}}'s Application</h3>
      <p class="text-center">Current Status: {{viewApplication($route.params.id).status}}</p>
      <vs-button @click="changeApplicationStatus(['Accepted', $route.params.id])" class="appButton" color="success" type="filled">Accept</vs-button>
      <vs-button @click="changeApplicationStatus(['Declined', $route.params.id])" class="appButton" color="danger" type="filled">Decline</vs-button>
      <vs-button @click="changeApplicationStatus(['Processing', $route.params.id])" class="appButton" color="warning" type="filled">Process</vs-button>
    </div>
    <div v-else>
      <h3 class="text-center">Now Viewing: {{user($route.params.id).username}}'s Application</h3>
      <p class="text-center">Current Status: {{viewApplication($route.params.id).status}}</p>
      <vs-button class="appButton" disabled color="success" type="filled">Accept</vs-button>
      <vs-button class="appButton" disabled color="danger" type="filled">Decline</vs-button>
      <vs-button class="appButton" disabled color="warning" type="filled">Process</vs-button>
    </div>
    <br>
    <div class="vx-row mb-6">
      <div class="vx-col sm:w-1/3 w-full">
        <span>SteamURL</span>
      </div>
      <div class="vx-col sm:w-2/3 w-full">
        <vs-input class="w-full" disabled :placeholder="viewApplication($route.params.id).steamURL"/>
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col sm:w-1/3 w-full">
        <span>Timezone</span>
      </div>
      <div class="vx-col sm:w-2/3 w-full">
        <vs-input class="w-full" disabled :placeholder="viewApplication($route.params.id).timezone"/>
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col sm:w-1/3 w-full">
        <span>Age</span>
      </div>
      <div class="vx-col sm:w-2/3 w-full">
        <vs-input class="w-full" disabled :placeholder="viewApplication($route.params.id).age"/>
      </div>
    </div>
    <br>
    <div class="vx-row mb-6">
      <div class="vx-col sm:w-1/3 w-full">
        <span>How long have you played Arma 3 for?</span>
      </div>
      <div class="vx-col sm:w-2/3 w-full">
        <vs-input class="w-full" disabled :placeholder="viewApplication($route.params.id).arma3Hours"/>
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col sm:w-1/3 w-full">
        <span>What Hobbies do you like to participate in outside of gaming?</span>
      </div>
      <div class="vx-col sm:w-2/3 w-full">
        <vs-input class="w-full" disabled :placeholder="viewApplication($route.params.id).hobbies"/>
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col sm:w-1/3 w-full">
        <span>What attracts you to the Arma 3 milsim playstyle?</span>
      </div>
      <div class="vx-col sm:w-2/3 w-full">
        <vs-input class="w-full" disabled :placeholder="viewApplication($route.params.id).attractmilsim"/>
      </div>
    </div>
    <div class="vx-col md:w-1/2 w-full md:mt-8">
      <div class="demo-alignment">
        <span>What playstyle(s) interest you?</span>
        <div class="flex">
          <vs-checkbox disabled v-model="viewApplication($route.params.id).interestedRoles.includes('Ranger')">Ranger</vs-checkbox>
          <vs-checkbox disabled v-model="viewApplication($route.params.id).interestedRoles.includes('Medic')">Medic</vs-checkbox>
          <vs-checkbox disabled v-model="viewApplication($route.params.id).interestedRoles.includes('Sapper')">Sapper</vs-checkbox>
          <vs-checkbox disabled v-model="viewApplication($route.params.id).interestedRoles.includes('Pilot')">Pilot</vs-checkbox>
          <vs-checkbox disabled v-model="viewApplication($route.params.id).interestedRoles.includes('Tank_Crew')">Tank Crew</vs-checkbox>
          <vs-checkbox disabled v-model="viewApplication($route.params.id).interestedRoles.includes('IDF')">IDF Support</vs-checkbox>
        </div>
      </div>
    </div>
    <br>

  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'Applications',
  methods: {
    ...mapActions(["changeApplicationStatus"])
  },
  computed: {
    ...mapGetters(['viewApplication', 'user'])
  },
async created () {
  await Promise.all([
    this.$store.dispatch('setApplications'),
    this.$store.dispatch('setUsers')
  ])
},
  data() {
    return {
      confirmPopup: false,
    }
  }
}
</script>

<style scoped>
.answer {
  color: #10163A;
}
.appButton {
  margin-right: 20px;
}
</style>
