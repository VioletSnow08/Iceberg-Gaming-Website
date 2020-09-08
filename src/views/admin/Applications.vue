<template>
  <div>
    <!--    <vs-list>-->
    <!--      <vs-list-header icon="supervisor_account" title="Applications"></vs-list-header>-->
    <!--      <div v-for="app in applications">-->
    <!--        <vs-list-item v-if="app.status.toLowerCase() === 'accepted'" icon="supervisor_account" :title="app.username" :subtitle="app.date"><vs-chip color="success">{{app.status}}</vs-chip></vs-list-item>-->
    <!--        <vs-list-item v-if="app.status.toLowerCase() === 'waiting'" icon="supervisor_account" :title="app.username" :subtitle="app.date"><vs-chip color="warning">{{app.status}}</vs-chip></vs-list-item>-->
    <!--        <vs-list-item v-if="app.status.toLowerCase() === 'denied'" icon="supervisor_account" :title="app.username" :subtitle="app.date"><vs-chip color="danger">{{app.status}}</vs-chip></vs-list-item>-->
    <!--      </div>-->

    <!--    </vs-list>-->
    <div class="vx-row">
      <div v-for="app in applications" v-bind:key="app.id" class="vx-col w-full lg:w-1/3 sm:w-1/2 mb-base">
        <vx-card class="p-2">
          <div class="text-center">
            <h4>{{ user(app.id).username }}</h4>
            <vs-chip v-if="app.status.toLowerCase() === 'accepted'" color="success">{{app.status}}</vs-chip>
            <vs-chip v-if="app.status.toLowerCase() === 'waiting'" color="warning">{{app.status}}</vs-chip>
            <vs-chip v-if="app.status.toLowerCase() === 'declined'" color="danger">{{app.status}}</vs-chip>
          </div>
          <vs-avatar :src="user(app.id).photoURL" class="mx-auto my-6 block" size="80px"/>
          <vs-button @click="viewApplication(app.id)" type="gradient" class="w-full mt-6" color="#7367F0" gradient-color-secondary="#CE9FFC">View Application</vs-button>
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
    viewApplication (id) {
      this.$router.push({name: 'viewApplication', params: {id}})
    }
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
