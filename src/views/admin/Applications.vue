<template>
  <div>
    <div v-if="!applications">
      <h1>{{ this.$vs.loading({type: "radius", text: "Loading Applications..."}) }}</h1>
    </div>

    <div v-else class="vx-row">
      {{this.$vs.loading.close()}}

      <div v-for="app in applications" v-bind:key="app.id" class="vx-col w-full lg:w-1/4 sm:w-1/2 mb-base">
        <vx-card :title="user(app.user_id).username" class="p-2">
          <div class="text-center">
            <vs-chip v-if="app.status.toLowerCase() === 'accepted'" color="success">{{app.status}}</vs-chip>
            <vs-chip v-else-if="app.status.toLowerCase() === 'waiting'" color="warning">{{app.status}}</vs-chip>
            <vs-chip v-else-if="app.status.toLowerCase() === 'processing'" color="warning">{{app.status}}</vs-chip>
            <vs-chip v-else-if="app.status.toLowerCase() === 'denied'" color="danger">{{app.status}}</vs-chip>
          </div>
<!--          <vs-avatar :src="user(app.user_id).photoURL" class="mx-auto my-6 block" size="80px"/>-->
          <vs-button @click="viewApplication(app.user_id, app.id)" type="gradient" class="w-full mt-6" color="#373B44" gradient-color-secondary="#4286f4">View Application</vs-button>
        </vx-card>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'Applications',
  methods: {
    viewApplication (userID, applicationID) {
      this.$router.push({name: 'viewApplication', params: {userID, applicationID}})
    },
  },
  computed: {
    ...mapGetters(['applications', 'currentUser', 'user'])
  },
  async created () {
    await Promise.all([
      this.$store.dispatch('setApplications'),
      this.$store.dispatch('setUsers')
    ])
  }
}
</script>

<style scoped>

</style>
