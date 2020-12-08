<template>
  <div>
    <div v-if="!applications || !users">
      <h1>{{ this.$vs.loading({type: "radius", text: "Loading Applications..."}) }}</h1>
    </div>

    <div v-else>
      {{ this.$vs.loading.close() }}
      <h1 class="text-center">Applications</h1>
      <h2 class="text-center">Accept, deny, and process applications here</h2>
      <div>
        <div v-for="app in applications" v-bind:key="app.id" class="vx-col w-full lg:w-1/4 sm:w-1/2 mb-base">
          <vx-card :title="user(app.userID).username" :subtitle="'Division: ' + applicationDivisionDisplay(app.division)" class="p-2">
            <div class="text-center">
              <vs-chip v-if="app.status.toLowerCase() === 'accepted'" color="success">{{ app.status }}</vs-chip>
              <vs-chip v-else-if="app.status.toLowerCase() === 'waiting'" color="warning">{{ app.status }}</vs-chip>
              <vs-chip v-else-if="app.status.toLowerCase() === 'processing'" color="warning">{{ app.status }}</vs-chip>
              <vs-chip v-else-if="app.status.toLowerCase() === 'denied'" color="danger">{{ app.status }}</vs-chip>
            </div>
            <!--          <vs-avatar :src="user(app.user_id).photoURL" class="mx-auto my-6 block" size="80px"/>-->
            <vs-button v-if="app.division === '17th'" @click="viewApplication(app.userID, app.id)" type="gradient"
                       class="w-full mt-6" color="#FF0099" gradient-color-secondary="#493240">View Application
            </vs-button>
            <vs-button v-if="app.division === 'Iceberg'" @click="viewApplication(app.userID, app.id)"
                       type="gradient" class="w-full mt-6" color="#a8c0ff" gradient-color-secondary="#3f2b96">View
              Application
            </vs-button>
            <vs-button v-if="app.division === 'CGS'" @click="viewApplication(app.userID, app.id)" type="gradient"
                       class="w-full mt-6" color="#c31432" gradient-color-secondary="#240b36">View Application
            </vs-button>
          </vx-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import {applicationDivisionDisplay} from "../../../utils";

export default {
  name: 'Applications',
  methods: {
    viewApplication(userID, applicationID) {
      this.$router.push({name: 'AdminApplication', params: {userID, applicationID}})
    },
    applicationDivisionDisplay
  },
  computed: {
    ...mapGetters(['applications', 'currentUser', 'user', 'users']),
  },
  async created() {
    await Promise.all([
      this.$store.dispatch('fetchApplications'),
      this.$store.dispatch('fetchUsers')
    ])
  }
}
</script>

<style scoped>

</style>
