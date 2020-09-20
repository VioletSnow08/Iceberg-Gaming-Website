<template>
  <div>

    <div v-if="currentApplication">
      <div>
        <h2 class="text-center">Now Viewing Your Application</h2>
        <p class="text-center">Current Status: {{ currentApplication.status }}</p>
      </div>
      <br>
      <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
          <span>SteamURL</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <vs-input class="w-full" disabled :placeholder="currentApplication.steamURL"/>
        </div>
      </div>
      <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
          <span>Timezone</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <vs-input class="w-full" disabled :placeholder="currentApplication.timezone"/>
        </div>
      </div>
      <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
          <span>Age</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <vs-input class="w-full" disabled :placeholder="currentApplication.age"/>
        </div>
      </div>
      <br>
      <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
          <span>How many hours have you played Arma 3 for?</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <vs-input class="w-full" disabled :placeholder="currentApplication.arma3Hours"/>
        </div>
      </div>
      <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
          <span>What Hobbies do you like to participate in outside of gaming?</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <vs-input class="w-full" disabled :placeholder="currentApplication.hobbies"/>
        </div>
      </div>
      <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
          <span>What attracts you to the Arma 3 milsim playstyle?</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <vs-input class="w-full" disabled :placeholder="currentApplication.attractmilsim"/>
        </div>
      </div>
      <div class="vx-col md:w-1/2 w-full md:mt-8">
        <div class="demo-alignment">
          <span>What playstyle(s) interest you?</span>
          <div class="flex">
            <vs-checkbox disabled v-model="currentApplication.interestedRoles.includes('Ranger')">Ranger</vs-checkbox>
            <vs-checkbox disabled v-model="currentApplication.interestedRoles.includes('Medic')">Medic</vs-checkbox>
            <vs-checkbox disabled v-model="currentApplication.interestedRoles.includes('Sapper')">Sapper</vs-checkbox>
            <vs-checkbox disabled v-model="currentApplication.interestedRoles.includes('Pilot')">Pilot</vs-checkbox>
            <vs-checkbox disabled v-model="currentApplication.interestedRoles.includes('Tank_Crew')">Tank Crew
            </vs-checkbox>
            <vs-checkbox disabled v-model="currentApplication.interestedRoles.includes('IDF')">IDF Support</vs-checkbox>
          </div>
        </div>
      </div>
      <br>
      <h3>Comment</h3>
      <p>{{ currentApplication.comment }}</p>
      <br>
    </div>

    <div v-else>
      <vs-alert color="danger">Error: You have not applied yet!</vs-alert>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'MyApplication',
  computed: {
    ...mapGetters(['currentApplication'])
  },
  data() {
    return {
      confirmPopup: false,
    }
  },
  async created () {
    await Promise.all([
      this.$store.dispatch('setCurrentApplication'),
    ])
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
