<template>
    <div>
      <div class="text-center">
        <h1>My Applications</h1>
        <h2>Check out the status for all of your applications!</h2>
      </div>

      <div v-if="!applications">
        <h1>{{ this.$vs.loading({type: "radius", text: "Loading Applications..."}) }}</h1>
      </div>
      <div v-else clas="vx-row">
        {{ this.$vs.loading.close() }}
        <div v-if="applicationsFromUser(currentUser.id)">
          <div v-for="app in applicationsFromUser(currentUser.id)" v-bind:key="app.id" class="vx-col w-full lg:w-1/4 sm:w-1/2 mb-base">
            <vx-card :title="app.division ? '17th Brigade Combat Team' : app.division" class="p-2">
              <div class="text-center">
                <vs-chip v-if="app.status.toLowerCase() === 'accepted'" color="success">{{app.status}}</vs-chip>
                <vs-chip v-else-if="app.status.toLowerCase() === 'waiting'" color="warning">{{app.status}}</vs-chip>
                <vs-chip v-else-if="app.status.toLowerCase() === 'processing'" color="warning">{{app.status}}</vs-chip>
                <vs-chip v-else-if="app.status.toLowerCase() === 'denied'" color="danger">{{app.status}}</vs-chip>
              </div>
              <vs-button v-if="app.division === '17th'" @click="viewApplication(app.id)" type="gradient" class="w-full mt-6" color="#FF0099" gradient-color-secondary="#493240">View Application</vs-button>
              <vs-button v-else-if="app.division === 'Iceberg'" @click="viewApplication(app.id)" type="gradient" class="w-full mt-6" color="#005AA7" gradient-color-secondary="#FFFDE4">View Application</vs-button>
            </vx-card>
          </div>
        </div>
        <div v-else>
          <h1>No applications</h1>
        </div>
      </div>
    </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "Applications",
  computed: {
    ...mapGetters(['currentUser', 'applicationsFromUser', 'applications'])
  },
  methods: {
    viewApplication(applicationID) {
      this.$router.push({name: "Application", params: {applicationID}})
    }
  },
  async created() {
    await Promise.all([
      this.$store.dispatch('setApplications')
    ])
  }
}
</script>

<style scoped>

</style>
