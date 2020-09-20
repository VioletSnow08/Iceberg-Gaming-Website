<template>
  <div>
    <div v-if="applications">
      <div id="header">
        <span>{{ this.$vs.loading.close() }}</span>
        <vs-button @click="$router.push('/admin/applications')" color="primary">Back</vs-button>
        <h2 class="text-center">Now Viewing: {{ user($route.params.userID).username }}'s Application</h2>
        <p class="text-center">Current Status:
          {{ application($route.params.userID, $route.params.applicationID).status }}</p>
        <p class="text-center">Division: {{ application($route.params.userID, $route.params.applicationID).division }}</p>
        <div
          v-if="application($route.params.userID, $route.params.applicationID).status.toLowerCase() === 'waiting' || application($route.params.userID, $route.params.applicationID).status.toLowerCase() === 'processing'">
          <vs-button @click="changeApplicationStatus(['Accepted', $route.params.userID, $route.params.applicationID])"
                     class="appButton" color="success" type="filled">Accept
          </vs-button>
          <vs-button @click="changeApplicationStatus(['Denied', $route.params.userID, $route.params.applicationID])"
                     class="appButton" color="danger" type="filled">Decline
          </vs-button>
          <vs-button @click="changeApplicationStatus(['Processing', $route.params.userID, $route.params.applicationID])"
                     class="appButton" color="warning" type="filled">Process
          </vs-button>
        </div> <!-- If it is accepted or denied -->
        <div v-else>

          <vs-button class="appButton" disabled color="success" type="filled">Accept</vs-button>
          <vs-button class="appButton" disabled color="danger" type="filled">Deny</vs-button>
          <vs-button class="appButton" disabled color="warning" type="filled">Process</vs-button>
        </div>
      </div>
      <!--      ----------------------------------------------------------------------------------------------------------------->
      <!--      ----------------------------------------------------------------------------------------------------------------->
      <!--      ----------------------------------------------------------------------------------------------------------------->
      <div v-if="application($route.params.userID, $route.params.applicationID).division == '17th'">
        <br>
        <div class="vx-row mb-6">
          <div class="vx-col sm:w-1/3 w-full">
            <span>SteamURL</span>
          </div>
          <div class="vx-col sm:w-2/3 w-full">
            <vs-input class="w-full" disabled
                      :placeholder="application($route.params.userID, $route.params.applicationID).steamURL"/>
          </div>
        </div>
        <div class="vx-row mb-6">
          <div class="vx-col sm:w-1/3 w-full">
            <span>Timezone</span>
          </div>
          <div class="vx-col sm:w-2/3 w-full">
            <vs-input class="w-full" disabled
                      :placeholder="application($route.params.userID, $route.params.applicationID).timezone"/>
          </div>
        </div>
        <div class="vx-row mb-6">
          <div class="vx-col sm:w-1/3 w-full">
            <span>Age</span>
          </div>
          <div class="vx-col sm:w-2/3 w-full">
            <vs-input class="w-full" disabled
                      :placeholder="application($route.params.userID, $route.params.applicationID).age"/>
          </div>
        </div>
        <br>
        <div class="vx-row mb-6">
          <div class="vx-col sm:w-1/3 w-full">
            <span>How many hours have you played Arma 3 for?</span>
          </div>
          <div class="vx-col sm:w-2/3 w-full">
            <vs-input class="w-full" disabled
                      :placeholder="application($route.params.userID, $route.params.applicationID).arma3Hours"/>
          </div>
        </div>
        <div class="vx-row mb-6">
          <div class="vx-col sm:w-1/3 w-full">
            <span>What Hobbies do you like to participate in outside of gaming?</span>
          </div>
          <div class="vx-col sm:w-2/3 w-full">
            <vs-input class="w-full" disabled
                      :placeholder="application($route.params.userID, $route.params.applicationID).hobbies"/>
          </div>
        </div>
        <div class="vx-row mb-6">
          <div class="vx-col sm:w-1/3 w-full">
            <span>What attracts you to the Arma 3 milsim playstyle?</span>
          </div>
          <div class="vx-col sm:w-2/3 w-full">
            <vs-input class="w-full" disabled
                      :placeholder="application($route.params.userID, $route.params.applicationID).attractmilsim"/>
          </div>
        </div>
        <div class="vx-col md:w-1/2 w-full md:mt-8">
          <div class="demo-alignment">
            <span>What playstyle(s) interest you?</span>
            <div class="flex">
              <vs-checkbox disabled
                           v-model="application($route.params.userID, $route.params.applicationID).interestedRoles.includes('Ranger')">
                Ranger
              </vs-checkbox>
              <vs-checkbox disabled
                           v-model="application($route.params.userID, $route.params.applicationID).interestedRoles.includes('Medic')">
                Medic
              </vs-checkbox>
              <vs-checkbox disabled
                           v-model="application($route.params.userID, $route.params.applicationID).interestedRoles.includes('Sapper')">
                Sapper
              </vs-checkbox>
              <vs-checkbox disabled
                           v-model="application($route.params.userID, $route.params.applicationID).interestedRoles.includes('Pilot')">
                Pilot
              </vs-checkbox>
              <vs-checkbox disabled
                           v-model="application($route.params.userID, $route.params.applicationID).interestedRoles.includes('Tank_Crew')">
                Tank Crew
              </vs-checkbox>
              <vs-checkbox disabled
                           v-model="application($route.params.userID, $route.params.applicationID).interestedRoles.includes('IDF')">
                IDF Support
              </vs-checkbox>
            </div>
          </div>
        </div>
      </div>
      <!--      If it is an Iceberg Application-->
      <div v-else>

      </div>
    </div>
    <div v-else>
      <h1>{{ this.$vs.loading({type: "radius", text: "Loading Application..."}) }}</h1>
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
    ...mapGetters(['application', 'user', 'applications'])
  },
  async created() {
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
